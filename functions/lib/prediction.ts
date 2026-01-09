// File: functions/lib/prediction.ts
import { LotteryType, PredictionData } from '../types';

interface DbRecord {
  open_code: string;
  wave: string;
  zodiac: string;
}

/**
 * 核心预测引擎
 */
export class PredictionEngine {

  static ZODIACS_MAP: Record<string, number[]> = {
    '蛇': [1, 13, 25, 37, 49], '马': [12, 24, 36, 48], '羊': [11, 23, 35, 47],
    '猴': [10, 22, 34, 46], '鸡': [9, 21, 33, 45], '狗': [8, 20, 32, 44],
    '猪': [7, 19, 31, 43], '鼠': [6, 18, 30, 42], '牛': [5, 17, 29, 41],
    '虎': [4, 16, 28, 40], '兔': [3, 15, 27, 39], '龙': [2, 14, 26, 38],
  };

  static WAVES_MAP = {
    'red': [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46],
    'blue': [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48],
    'green': [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]
  };

  static generate(history: DbRecord[], type: LotteryType): PredictionData {
    const stats = this.analyzeHistory(history);

    // 推荐六肖 (4热 + 2冷)
    const hotZodiacs = stats.zodiacs.slice(0, 4).map(x => x.key);
    const coldZodiacs = stats.zodiacs.reverse().slice(0, 2).map(x => x.key);
    const recommendedZodiacs = [...new Set([...hotZodiacs, ...coldZodiacs])];

    // 推荐波色
    const sortedWaves = stats.waves;
    const mainWave = sortedWaves[0]?.key || 'red';
    const defenseWave = sortedWaves[1]?.key || 'blue';

    // 推荐头尾
    const recommendedHeads = stats.heads.slice(0, 2).map(x => x.key);
    const recommendedTails = stats.tails.slice(0, 5).map(x => x.key);

    // 生成18码
    const recommendedNumbers = this.generate18Numbers(recommendedZodiacs, [mainWave, defenseWave], recommendedTails);

    return {
      zodiacs: recommendedZodiacs,
      numbers: recommendedNumbers,
      wave: { main: mainWave, defense: defenseWave },
      heads: recommendedHeads,
      tails: recommendedTails
    };
  }

  private static analyzeHistory(history: DbRecord[]) {
    const counts = {
      zodiacs: {} as Record<string, number>,
      waves: {} as Record<string, number>,
      heads: {} as Record<string, number>,
      tails: {} as Record<string, number>
    };

    history.forEach(rec => {
      const nums = rec.open_code.split(',');
      const specialCode = nums[nums.length - 1];
      const numVal = parseInt(specialCode);
      
      const zodiacs = rec.zodiac.split(',');
      const specialZodiac = zodiacs[zodiacs.length - 1];
      if (specialZodiac) counts.zodiacs[specialZodiac] = (counts.zodiacs[specialZodiac] || 0) + 1;

      const waves = rec.wave.split(',');
      const specialWave = waves[waves.length - 1];
      if (specialWave) counts.waves[specialWave] = (counts.waves[specialWave] || 0) + 1;

      const head = Math.floor(numVal / 10).toString();
      counts.heads[head] = (counts.heads[head] || 0) + 1;

      const tail = (numVal % 10).toString();
      counts.tails[tail] = (counts.tails[tail] || 0) + 1;
    });

    const sortObj = (obj: Record<string, number>) => Object.entries(obj).sort(([, a], [, b]) => b - a).map(([key, count]) => ({ key, count }));

    return {
      zodiacs: sortObj(counts.zodiacs),
      waves: sortObj(counts.waves),
      heads: sortObj(counts.heads),
      tails: sortObj(counts.tails)
    };
  }

  private static generate18Numbers(zodiacs: string[], waves: string[], tails: string[]): string[] {
    const pool = new Set<number>();
    zodiacs.forEach(z => {
      const nums = this.ZODIACS_MAP[z] || [];
      nums.forEach(n => pool.add(n));
    });

    const candidates = Array.from(pool);
    const scoredCandidates = candidates.map(num => {
      let score = 0;
      const w = this.getNumWave(num);
      if (waves[0] === w) score += 3;
      else if (waves[1] === w) score += 1;
      
      const t = (num % 10).toString();
      if (tails.includes(t)) score += 2;

      return { num, score };
    });

    scoredCandidates.sort((a, b) => b.score - a.score);
    let result = scoredCandidates.slice(0, 18).map(c => c.num);

    while (result.length < 18) {
      const r = Math.floor(Math.random() * 49) + 1;
      if (!result.includes(r)) result.push(r);
    }

    return result.sort((a, b) => a - b).map(n => n < 10 ? `0${n}` : `${n}`);
  }

  private static getNumWave(n: number): string {
    if (this.WAVES_MAP.red.includes(n)) return 'red';
    if (this.WAVES_MAP.blue.includes(n)) return 'blue';
    return 'green';
  }
}