
// File: functions/lib/prediction.ts
import { LotteryType, PredictionData } from '../types';

interface DbRecord {
  open_code: string;
  wave: string;
  zodiac: string;
}

interface NumberStat {
  num: number;
  freq: number;          // 总频率
  recentFreq: number;    // 近50期频率
  omission: number;      // 当前遗漏
  avgOmission: number;   // 平均遗漏
  markovScore: number;   // 马尔可夫转移得分
  finalScore: number;    // 最终加权得分
}

/**
 * 核心预测引擎 (增强版 v2)
 * 引入马尔可夫链 (Markov Chain) 转移矩阵分析，结合全历史趋势与遗漏值
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
    
    // 1. 数据准备
    // 确保按时间正序排列 (Oldest -> Newest) 用于构建矩阵
    const chronological = [...history].reverse();
    const totalRecords = chronological.length;

    // 初始化统计容器
    const stats: NumberStat[] = Array.from({ length: 49 }, (_, i) => ({
      num: i + 1,
      freq: 0,
      recentFreq: 0,
      omission: 0,
      avgOmission: 0,
      markovScore: 0,
      finalScore: 0
    }));

    // 初始化转移矩阵 50x50 (下标1-49可用)
    // matrix[A][B] 表示：当出现号码A时，下一期出现号码B的次数
    const matrix = Array.from({ length: 50 }, () => new Array(50).fill(0));

    // 2. 遍历历史 (构建矩阵与基础统计)
    for (let i = 0; i < totalRecords; i++) {
      const nums = this.parseNumbers(chronological[i].open_code);
      
      // A. 基础频率统计
      nums.forEach(n => {
        if (n >= 1 && n <= 49) {
          stats[n-1].freq++;
          // 近50期热度
          if (i >= totalRecords - 50) {
            stats[n-1].recentFreq++;
          }
        }
      });

      // B. 构建转移矩阵 (关联性分析)
      if (i < totalRecords - 1) {
        const nextNums = this.parseNumbers(chronological[i+1].open_code);
        nums.forEach(prevNum => {
          if (prevNum >= 1 && prevNum <= 49) {
            nextNums.forEach(nextNum => {
              if (nextNum >= 1 && nextNum <= 49) {
                matrix[prevNum][nextNum]++;
              }
            });
          }
        });
      }
    }

    // 3. 计算遗漏值 (从最新往回找)
    // 使用 history (Newest -> Oldest)
    for (let n = 1; n <= 49; n++) {
      let found = false;
      for (let i = 0; i < history.length; i++) {
        const nums = this.parseNumbers(history[i].open_code);
        if (nums.includes(n)) {
          stats[n-1].omission = i;
          found = true;
          break;
        }
      }
      if (!found) stats[n-1].omission = history.length;
      
      // 平均遗漏估算 (总期数 / (出现次数+1))
      stats[n-1].avgOmission = totalRecords / (stats[n-1].freq + 1);
    }

    // 4. 综合评分 (Scoring)
    const lastRecordNums = this.parseNumbers(history[0].open_code);

    stats.forEach(stat => {
      // A. 马尔可夫关联得分 (Markov Score)
      // 计算上期开出的所有号码，在历史上“携带”出当前号码 stat.num 的总频次
      let mScore = 0;
      lastRecordNums.forEach(prevNum => {
        if (prevNum >= 1 && prevNum <= 49) {
          mScore += matrix[prevNum][stat.num];
        }
      });
      // 归一化处理：简单的除以 (上期号码数 * 平均关联度) 或直接用权重
      stat.markovScore = mScore;

      // B. 权重计算
      // 1. 关联性 (Markov): 权重最高，代表历史规律
      // 2. 近期热度 (Recent): 代表趋势
      // 3. 遗漏回补 (Omission): 捕捉反转，如果当前遗漏 > 2倍平均遗漏，给予加分
      
      const wMarkov = stat.markovScore * 1.0; 
      const wRecent = stat.recentFreq * 5.0; // 50期内出现1次得5分，出现5次得25分
      
      let wOmission = 0;
      // 如果遗漏值接近平均值的2倍或以上，视为“极冷待补”
      if (stat.omission > stat.avgOmission * 2.5) {
        wOmission = 15;
      } else if (stat.omission > stat.avgOmission * 1.5) {
        wOmission = 8;
      }
      
      // 最终得分
      stat.finalScore = wMarkov + wRecent + wOmission;
    });

    // 5. 排序与筛选 (Top 18)
    const sortedStats = [...stats].sort((a, b) => b.finalScore - a.finalScore);
    const top18Stats = sortedStats.slice(0, 18);
    const top18Numbers = top18Stats.map(s => s.num < 10 ? `0${s.num}` : `${s.num}`).sort((a, b) => parseInt(a) - parseInt(b));

    // 6. 属性反推 (由选出的号码决定生肖/波色/头尾)
    // 使用加权分聚合，而不是数量聚合，更准确
    const zodiacScores: Record<string, number> = {};
    const waveScores: Record<string, number> = { red: 0, blue: 0, green: 0 };
    const headScores: Record<string, number> = {};
    const tailScores: Record<string, number> = {};

    // 统计所有49个号码的得分分布
    stats.forEach(stat => {
      const z = this.NUM_TO_ZODIAC[stat.num];
      const w = this.getNumWave(stat.num);
      const h = Math.floor(stat.num / 10).toString();
      const t = (stat.num % 10).toString();
      
      // 仅累加得分较高的前25个号码的属性，减少噪音
      if (stat.finalScore > sortedStats[24].finalScore) {
         if (z) zodiacScores[z] = (zodiacScores[z] || 0) + stat.finalScore;
         waveScores[w] = (waveScores[w] || 0) + stat.finalScore;
         headScores[h] = (headScores[h] || 0) + stat.finalScore;
         tailScores[t] = (tailScores[t] || 0) + stat.finalScore;
      }
    });

    const sortProps = (obj: Record<string, number>) => Object.entries(obj).sort((a, b) => b[1] - a[1]).map(e => e[0]);

    return {
      zodiacs: sortProps(zodiacScores).slice(0, 6),
      numbers: top18Numbers,
      wave: {
        main: sortProps(waveScores)[0],
        defense: sortProps(waveScores)[1]
      },
      heads: sortProps(headScores).slice(0, 2),
      tails: sortProps(tailScores).slice(0, 5)
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
