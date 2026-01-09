
// File: functions/lib/prediction.ts
import { LotteryType, PredictionData } from '../types';

interface DbRecord {
  open_code: string;
  wave: string;
  zodiac: string;
}

interface NumberStat {
  num: number;
  // 1. 技术面: MACD 趋势分
  macdScore: number;
  // 2. 关联面: 马尔可夫转移分
  markovScore: number;
  // 3. 概率面: 遗漏偏离度分
  omissionScore: number;
  // 4. 属性面: 属性共振加成
  resonanceScore: number;
  // 最终得分
  finalScore: number;
  
  // 辅助
  zodiac: string;
  wave: string;
  tail: number;
  head: number;
}

/**
 * 核心预测引擎 (旗舰版 v4.0 - DCTA)
 * Deep Composite Trend Analysis
 * 引入 MACD 技术指标、标准差遗漏分析与属性共振逻辑
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
    
    // 取最近 150 期作为样本，MACD 需要一定的历史长度来稳定
    const analysisHistory = history.slice(0, 150);
    const chronological = [...analysisHistory].reverse(); // Old -> New
    const totalRecords = chronological.length;

    // 初始化号码状态
    const stats: NumberStat[] = Array.from({ length: 49 }, (_, i) => {
      const num = i + 1;
      return {
        num,
        macdScore: 0,
        markovScore: 0,
        omissionScore: 0,
        resonanceScore: 0,
        finalScore: 0,
        zodiac: this.NUM_TO_ZODIAC[num],
        wave: this.getNumWave(num),
        tail: num % 10,
        head: Math.floor(num / 10)
      };
    });

    // ==========================================
    // 模块 1: MACD 趋势分析 (Technical Analysis)
    // ==========================================
    // 计算每个号码的 MACD(12, 26, 9)
    // 将号码出现视为 1，未出现视为 0，构建时间序列
    stats.forEach(s => {
      let ema12 = 0;
      let ema26 = 0;
      let dea = 0; // Signal line (EMA9 of MACD)
      
      // 预热：假设初始概率为 1/49
      const initialProb = 1/49;
      ema12 = initialProb;
      ema26 = initialProb;

      const k12 = 2 / (12 + 1);
      const k26 = 2 / (26 + 1);
      const k9 = 2 / (9 + 1);

      chronological.forEach(rec => {
        const nums = this.parseNumbers(rec.open_code);
        const val = nums.includes(s.num) ? 1 : 0;
        
        // 更新 EMA
        ema12 = val * k12 + ema12 * (1 - k12);
        ema26 = val * k26 + ema26 * (1 - k26);
        
        const dif = ema12 - ema26;
        dea = dif * k9 + dea * (1 - k9);
      });

      const dif = ema12 - ema26;
      const macd = (dif - dea) * 2; // MACD 柱状图

      // 评分逻辑：
      // 1. MACD > 0 表示处于多头趋势 (活跃期)
      // 2. DIF > DEA 表示正在走强
      // 放大系数 1000 以匹配其他分数段
      s.macdScore = (macd * 2000) + (dif * 1000);
      
      // 修正：如果长期不出的死号，MACD会很低，这里不干预，交给遗漏分析处理
    });


    // ==========================================
    // 模块 2: 马尔可夫链 (Markov Chain)
    // ==========================================
    const matrix = Array.from({ length: 50 }, () => new Array(50).fill(0));
    // 构建 1阶 转移矩阵
    for (let i = 0; i < totalRecords - 1; i++) {
      const cur = this.parseNumbers(chronological[i].open_code);
      const next = this.parseNumbers(chronological[i+1].open_code);
      cur.forEach(c => {
        next.forEach(n => matrix[c][n]++);
      });
    }
    // 投影
    const lastDraw = this.parseNumbers(history[0].open_code);
    stats.forEach(s => {
      let score = 0;
      lastDraw.forEach(prev => {
        if (prev >= 1 && prev <= 49) {
          // 加上转移频率
          score += matrix[prev][s.num];
        }
      });
      s.markovScore = score * 3; // 权重系数
    });


    // ==========================================
    // 模块 3: 标准差遗漏分析 (Smart Omission)
    // ==========================================
    // 记录每个号码的所有遗漏间隔
    const omissionGaps: Record<number, number[]> = {};
    const lastAppearIdx: Record<number, number> = {};

    chronological.forEach((rec, idx) => {
      const nums = this.parseNumbers(rec.open_code);
      nums.forEach(n => {
        const last = lastAppearIdx[n] === undefined ? -1 : lastAppearIdx[n];
        const gap = idx - last - 1;
        if (!omissionGaps[n]) omissionGaps[n] = [];
        omissionGaps[n].push(gap);
        lastAppearIdx[n] = idx;
      });
    });

    stats.forEach(s => {
      const gaps = omissionGaps[s.num] || [];
      const currentOmission = (totalRecords - 1) - (lastAppearIdx[s.num] === undefined ? -1 : lastAppearIdx[s.num]);
      
      if (gaps.length < 2) {
        s.omissionScore = 0; // 数据不足
        return;
      }

      // 计算平均遗漏和标准差
      const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      const variance = gaps.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / gaps.length;
      const stdDev = Math.sqrt(variance);

      // 评分逻辑：
      // 1. 回补点: 当前遗漏在 (平均值) 附近，概率最大
      // 2. 极限点: 当前遗漏在 (平均值 + 2倍标准差) 附近，博冷号反弹
      
      const zScore = (currentOmission - avg) / (stdDev || 1);

      if (Math.abs(zScore) < 0.5) {
        // 处于平均遗漏周期，大概率出
        s.omissionScore = 20; 
      } else if (zScore > 2.0 && zScore < 3.0) {
        // 极寒反弹区 (Cold Rebound)
        s.omissionScore = 35;
      } else if (currentOmission === 0) {
        // 重号惯性
        s.omissionScore = 15;
      } else {
        s.omissionScore = 5;
      }
    });

    // ==========================================
    // 阶段汇总 1: 计算基础得分 (Pre-Resonance)
    // ==========================================
    const W_MACD = 0.4;
    const W_MARKOV = 0.3;
    const W_OMISSION = 0.3;

    stats.forEach(s => {
      s.finalScore = (s.macdScore * W_MACD) + (s.markovScore * W_MARKOV) + (s.omissionScore * W_OMISSION);
    });

    // ==========================================
    // 模块 4: 属性共振 (Attribute Resonance)
    // ==========================================
    // 统计当前得分下的属性盘口
    const zScores: Record<string, number> = {};
    const wScores: Record<string, number> = {};
    const tScores: Record<number, number> = {};

    stats.forEach(s => {
      // 只有正分才贡献热度
      if (s.finalScore > 0) {
        zScores[s.zodiac] = (zScores[s.zodiac] || 0) + s.finalScore;
        wScores[s.wave] = (wScores[s.wave] || 0) + s.finalScore;
        tScores[s.tail] = (tScores[s.tail] || 0) + s.finalScore;
      }
    });

    // 找出最强的 3个生肖，1个波色，3个尾数
    const sortedZ = Object.entries(zScores).sort((a, b) => b[1] - a[1]).map(e => e[0]);
    const sortedW = Object.entries(wScores).sort((a, b) => b[1] - a[1]).map(e => e[0]);
    const sortedT = Object.entries(tScores).sort((a, b) => b[1] - a[1]).map(e => parseInt(e[0]));

    const strongZodiacs = new Set(sortedZ.slice(0, 3));
    const strongWave = sortedW[0];
    const strongTails = new Set(sortedT.slice(0, 3));

    // 共振增强：如果号码属于强势属性，给予二次加权
    stats.forEach(s => {
      let boost = 1.0;
      if (strongZodiacs.has(s.zodiac)) boost += 0.15; // +15%
      if (s.wave === strongWave) boost += 0.15;       // +15%
      if (strongTails.has(s.tail)) boost += 0.10;     // +10%
      
      // 更新最终得分
      s.finalScore *= boost;
      s.resonanceScore = boost;
    });

    // ==========================================
    // 最终产出
    // ==========================================
    const sortedStats = [...stats].sort((a, b) => b.finalScore - a.finalScore);
    
    // 1. 选取 Top 18
    const top18 = sortedStats.slice(0, 18).map(s => s.num < 10 ? `0${s.num}` : `${s.num}`).sort((a, b) => parseInt(a) - parseInt(b));

    // 2. 属性反推 (严格基于加权后的 Top 20)
    // 这样能保证展示的“推荐生肖”和“推荐号码”高度重合
    const top20Stats = sortedStats.slice(0, 20);
    const finalZ: Record<string, number> = {};
    const finalW: Record<string, number> = {};
    const finalH: Record<string, number> = {};
    const finalT: Record<string, number> = {};

    top20Stats.forEach(s => {
      finalZ[s.zodiac] = (finalZ[s.zodiac] || 0) + s.finalScore;
      finalW[s.wave] = (finalW[s.wave] || 0) + s.finalScore;
      finalH[s.head] = (finalH[s.head] || 0) + s.finalScore;
      finalT[s.tail] = (finalT[s.tail] || 0) + s.finalScore;
    });

    const sortK = (obj: Record<string, number>) => Object.entries(obj).sort((a, b) => b[1] - a[1]).map(e => e[0]);

    return {
      zodiacs: sortK(finalZ).slice(0, 6),
      numbers: top18,
      wave: {
        main: sortK(finalW)[0] || 'red',
        defense: sortK(finalW)[1] || 'blue'
      },
      heads: sortK(finalH).slice(0, 2),
      tails: sortK(finalT).slice(0, 5)
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
