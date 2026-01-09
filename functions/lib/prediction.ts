
// File: functions/lib/prediction.ts
import { LotteryType, PredictionData } from '../types';

interface DbRecord {
  open_code: string;
  wave: string;
  zodiac: string;
}

interface NumberStat {
  num: number;
  // 因子1: 时间衰减频率得分
  decayScore: number; 
  // 因子2: 马尔可夫转移得分
  markovScore: number;
  // 因子3: 属性热度加成 (生肖+波色+尾数)
  attributeScore: number;
  // 因子4: 遗漏回补得分
  omissionScore: number;
  // 最终总分
  finalScore: number;
  
  // 辅助信息
  zodiac: string;
  wave: string;
  tail: number;
}

/**
 * 核心预测引擎 (专业版 v3.0)
 * 采用多因子复合指数模型 (MFCI)
 * 核心逻辑：先预测大势(属性)，再锁定个股(号码)
 */
export class PredictionEngine {

  static ZODIACS_MAP: Record<string, number[]> = {
    '蛇': [1, 13, 25, 37, 49], '马': [12, 24, 36, 48], '羊': [11, 23, 35, 47],
    '猴': [10, 22, 34, 46], '鸡': [9, 21, 33, 45], '狗': [8, 20, 32, 44],
    '猪': [7, 19, 31, 43], '鼠': [6, 18, 30, 42], '牛': [5, 17, 29, 41],
    '虎': [4, 16, 28, 40], '兔': [3, 15, 27, 39], '龙': [2, 14, 26, 38],
  };

  static NUM_TO_ZODIAC: Record<number, string> = {};

  static WAVES_MAP = {
    'red': [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46],
    'blue': [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48],
    'green': [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]
  };

  static initializeMaps() {
    if (Object.keys(this.NUM_TO_ZODIAC).length > 0) return;
    for (const [zodiac, nums] of Object.entries(this.ZODIACS_MAP)) {
      nums.forEach(n => this.NUM_TO_ZODIAC[n] = zodiac);
    }
  }

  static generate(history: DbRecord[], type: LotteryType): PredictionData {
    this.initializeMaps();
    
    // 1. 数据预处理
    // 截取最近 100 期进行高密度分析，过远的数据噪音太大
    const recentHistory = history.slice(0, 100);
    const chronological = [...recentHistory].reverse(); // Old -> New
    const totalRecords = chronological.length;

    // 初始化 1-49 号码的基础结构
    const stats: NumberStat[] = Array.from({ length: 49 }, (_, i) => {
      const num = i + 1;
      return {
        num,
        decayScore: 0,
        markovScore: 0,
        attributeScore: 0,
        omissionScore: 0,
        finalScore: 0,
        zodiac: this.NUM_TO_ZODIAC[num],
        wave: this.getNumWave(num),
        tail: num % 10
      };
    });

    // ----------------------------------------------------
    // 算法模块 A: 属性热度分析 (Attribute Heat Analysis)
    // ----------------------------------------------------
    const zodiacHeat: Record<string, number> = {};
    const waveHeat: Record<string, number> = { red: 0, blue: 0, green: 0 };
    const tailHeat: Record<number, number> = {};

    // 遍历历史，计算属性热度
    // 越近期的期数，属性得分越高 (加权: 最近1期=10分, 2期=9分...)
    recentHistory.forEach((rec, idx) => {
      const nums = this.parseNumbers(rec.open_code);
      const weight = Math.max(1, 20 - idx); // 线性衰减权重

      nums.forEach(n => {
        if (n < 1 || n > 49) return;
        const z = this.NUM_TO_ZODIAC[n];
        const w = this.getNumWave(n);
        const t = n % 10;

        if (z) zodiacHeat[z] = (zodiacHeat[z] || 0) + weight;
        waveHeat[w] = (waveHeat[w] || 0) + weight;
        tailHeat[t] = (tailHeat[t] || 0) + weight;
      });
    });

    // 将属性热度 回注 给每个号码 (Attribute Injection)
    stats.forEach(s => {
      // 归一化因子
      const zScore = (zodiacHeat[s.zodiac] || 0) / 10;
      const wScore = (waveHeat[s.wave] || 0) / 10;
      const tScore = (tailHeat[s.tail] || 0) / 5;
      s.attributeScore = zScore + wScore + tScore;
    });


    // ----------------------------------------------------
    // 算法模块 B: 时间衰减频率 (Exponential Decay)
    // ----------------------------------------------------
    // 公式: Score += 1 / (Gap + 1)
    // 刚出的号码得分 1.0，隔1期出的得分 0.5...
    const appearIndices: Record<number, number[]> = {};
    
    chronological.forEach((rec, idx) => {
      const nums = this.parseNumbers(rec.open_code);
      nums.forEach(n => {
        if (!appearIndices[n]) appearIndices[n] = [];
        appearIndices[n].push(idx); // 记录出现的索引 (0 start)
      });
    });

    stats.forEach(s => {
      const indices = appearIndices[s.num] || [];
      let score = 0;
      indices.forEach(idx => {
        const gap = (totalRecords - 1) - idx; // 距离现在的期数
        // 指数衰减: e^(-0.1 * gap)
        score += Math.exp(-0.1 * gap) * 100;
      });
      s.decayScore = score;
    });


    // ----------------------------------------------------
    // 算法模块 C: 增强型马尔可夫 (Markov Matrix)
    // ----------------------------------------------------
    const matrix = Array.from({ length: 50 }, () => new Array(50).fill(0));
    // 构建转移矩阵
    for (let i = 0; i < totalRecords - 1; i++) {
      const currentNums = this.parseNumbers(chronological[i].open_code);
      const nextNums = this.parseNumbers(chronological[i+1].open_code);
      currentNums.forEach(c => {
        nextNums.forEach(n => matrix[c][n]++);
      });
    }
    // 计算上一期号码对当前的投影
    const lastNums = this.parseNumbers(history[0].open_code);
    stats.forEach(s => {
      let mScore = 0;
      lastNums.forEach(prev => {
        if (prev >= 1 && prev <= 49) {
          mScore += matrix[prev][s.num];
        }
      });
      s.markovScore = mScore * 5; // 放大权重
    });


    // ----------------------------------------------------
    // 算法模块 D: 黄金遗漏点 (Golden Omission)
    // ----------------------------------------------------
    // 寻找那些遗漏值接近 平均遗漏值 的号码 (回补概率大)
    // 或者遗漏值达到极值的号码 (极限反转)
    stats.forEach(s => {
      const indices = appearIndices[s.num];
      const currentOmission = indices && indices.length > 0 
        ? (totalRecords - 1) - indices[indices.length - 1] 
        : totalRecords;
      
      const freq = indices ? indices.length : 0;
      const avgOmission = totalRecords / (freq + 1);

      // 逻辑：当前遗漏 在 平均遗漏的 1.5倍 到 2.5倍 之间，容易回补
      if (currentOmission > avgOmission * 1.5 && currentOmission < avgOmission * 3.0) {
        s.omissionScore = 50; 
      }
      // 逻辑：如果刚出过 (重号)，给一定分数
      if (currentOmission === 0) {
        s.omissionScore = 30;
      }
    });


    // ----------------------------------------------------
    // 汇总: 综合加权计算
    // ----------------------------------------------------
    // 权重配置 (总和不需要等于1，相对大小即可)
    const W_ATTRIBUTE = 0.4; // 属性趋势最重要 (符合大数定律)
    const W_DECAY = 0.3;     // 近期热号
    const W_MARKOV = 0.2;    // 号码关联
    const W_OMISSION = 0.1;  // 遗漏博反弹

    stats.forEach(s => {
      s.finalScore = 
        (s.attributeScore * W_ATTRIBUTE) +
        (s.decayScore * W_DECAY) +
        (s.markovScore * W_MARKOV) +
        (s.omissionScore * W_OMISSION);
    });

    // ----------------------------------------------------
    // 结果生成
    // ----------------------------------------------------
    // 1. 选码 (Top 18)
    const sortedStats = [...stats].sort((a, b) => b.finalScore - a.finalScore);
    const top18 = sortedStats.slice(0, 18).map(s => s.num < 10 ? `0${s.num}` : `${s.num}`).sort((a, b) => parseInt(a) - parseInt(b));

    // 2. 选属性 (基于 Top 25 号码的总分聚合)
    // 为什么用 Top 25 而不是 Top 18？扩大一点样本范围能让属性预测更稳，防止 Top18 恰好漏掉某种属性的边缘号码
    const top25Stats = sortedStats.slice(0, 25);
    
    const zScores: Record<string, number> = {};
    const wScores: Record<string, number> = {};
    const tScores: Record<string, number> = {};
    const hScores: Record<string, number> = {};

    top25Stats.forEach(s => {
      const score = s.finalScore;
      zScores[s.zodiac] = (zScores[s.zodiac] || 0) + score;
      wScores[s.wave] = (wScores[s.wave] || 0) + score;
      tScores[s.tail] = (tScores[s.tail] || 0) + score;
      
      const head = Math.floor(s.num / 10).toString();
      hScores[head] = (hScores[head] || 0) + score;
    });

    const sortObj = (obj: Record<string, number>) => Object.entries(obj).sort((a, b) => b[1] - a[1]).map(e => e[0]);

    return {
      zodiacs: sortObj(zScores).slice(0, 6),
      numbers: top18,
      wave: {
        main: sortObj(wScores)[0] || 'red',
        defense: sortObj(wScores)[1] || 'blue'
      },
      heads: sortObj(hScores).slice(0, 2),
      tails: sortObj(tScores).slice(0, 5)
    };
  }

  private static parseNumbers(code: string): number[] {
    if (!code) return [];
    return code.split(',').map(n => parseInt(n)).filter(n => !isNaN(n));
  }

  private static getNumWave(n: number): string {
    if (this.WAVES_MAP.red.includes(n)) return 'red';
    if (this.WAVES_MAP.blue.includes(n)) return 'blue';
    return 'green';
  }
}
