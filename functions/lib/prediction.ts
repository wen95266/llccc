
import { LotteryType, PredictionData, DbRecord } from '../types';

interface NumberStat {
  num: number;
  zodiac: string;
  wave: string;
  wuxing: string;
  tail: number;
  
  // v8.0 八大维度评分
  scoreHistoryMirror: number;  // 历史镜像分 (权重 Max)
  scoreSpecialTraj: number;    // 特码轨迹分 (权重 High)
  scorePattern: number;        // 形态几何分 (邻/重/跳)
  scoreTail: number;           // 尾数力场分
  scoreZodiac: number;         // 生肖三合分
  scoreWuXing: number;         // 五行平衡分
  scoreWave: number;           // 波色惯性分
  scoreGold: number;           // 黄金密钥分
  scoreOmission: number;       // 遗漏回补分
  
  totalScore: number;
}

/**
 * 🔮 Quantum Matrix Prediction Engine v8.0 "Cosmic Resonance" (宇宙共振版)
 * 核心理念：万物皆有引力。当 8 种不同的算法模型同时指向同一个号码时，该号码的出现具有“必然性”。
 */
export class PredictionEngine {

  // --- 基础数据映射 (2025 Snake Year) ---
  static ZODIACS_MAP: Record<string, number[]> = {
    '蛇': [1, 13, 25, 37, 49], '马': [12, 24, 36, 48], '羊': [11, 23, 35, 47],
    '猴': [10, 22, 34, 46], '鸡': [9, 21, 33, 45], '狗': [8, 20, 32, 44],
    '猪': [7, 19, 31, 43], '鼠': [6, 18, 30, 42], '牛': [5, 17, 29, 41],
    '虎': [4, 16, 28, 40], '兔': [3, 15, 27, 39], '龙': [2, 14, 26, 38],
  };

  // 三合局 (生肖强关联)
  static SAN_HE_MAP: Record<string, string[]> = {
    '鼠': ['龙', '猴'], '龙': ['鼠', '猴'], '猴': ['鼠', '龙'],
    '牛': ['蛇', '鸡'], '蛇': ['牛', '鸡'], '鸡': ['牛', '蛇'],
    '虎': ['马', '狗'], '马': ['虎', '狗'], '狗': ['虎', '马'],
    '兔': ['猪', '羊'], '猪': ['兔', '羊'], '羊': ['兔', '猪']
  };
  
  // 五行 (平衡算法核心)
  static WU_XING_MAP: Record<string, number[]> = {
    '金': [1, 2, 9, 10, 23, 24, 31, 32, 37, 38],
    '木': [3, 4, 11, 12, 19, 20, 33, 34, 41, 42, 49],
    '水': [5, 6, 13, 14, 21, 22, 35, 36, 43, 44],
    '火': [7, 8, 15, 16, 29, 30, 39, 40, 47, 48],
    '土': [17, 18, 25, 26, 27, 28, 45, 46]
  };

  static WAVES_MAP = {
    'red': [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46],
    'blue': [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48],
    'green': [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]
  };

  static NUM_TO_ZODIAC: Record<number, string> = {};
  static NUM_TO_WUXING: Record<number, string> = {};

  static initializeMaps() {
    if (Object.keys(this.NUM_TO_ZODIAC).length > 0) return;
    for (const [z, nums] of Object.entries(this.ZODIACS_MAP)) {
      nums.forEach(n => this.NUM_TO_ZODIAC[n] = z);
    }
    for (const [w, nums] of Object.entries(this.WU_XING_MAP)) {
      nums.forEach(n => this.NUM_TO_WUXING[n] = w);
    }
  }

  static generate(history: DbRecord[], type: LotteryType): PredictionData {
    this.initializeMaps();
    
    // 兜底：无数据时随机
    if (!history || history.length < 20) return this.generateRandom();

    // 0. 数据预处理
    const fullHistory = history; // 全量数据
    const recent20 = history.slice(0, 20); // 近期趋势
    const recent10 = history.slice(0, 10);
    const lastDrawNums = this.parseNumbers(history[0].open_code);
    const lastSpecial = lastDrawNums[lastDrawNums.length - 1]; // 上期特码
    const lastDrawSum = lastDrawNums.reduce((a, b) => a + b, 0);

    // 初始化 49 个号码的状态池
    const stats: NumberStat[] = Array.from({ length: 49 }, (_, i) => {
      const num = i + 1;
      return {
        num,
        zodiac: this.NUM_TO_ZODIAC[num],
        wave: this.getNumWave(num),
        wuxing: this.NUM_TO_WUXING[num],
        tail: num % 10,
        
        scoreHistoryMirror: 0,
        scoreSpecialTraj: 0,
        scorePattern: 0,
        scoreTail: 0,
        scoreZodiac: 0,
        scoreWuXing: 0,
        scoreWave: 0,
        scoreGold: 0,
        scoreOmission: 0,
        totalScore: 0
      };
    });

    // ==========================================
    // 算法 1: 历史镜像 (Historical Mirroring)
    // ==========================================
    // 寻找历史中与"上期开奖"相似度极高的期数，统计其"下一期"开什么
    const mirrorCounts: Record<number, number> = {};
    for (let i = 1; i < fullHistory.length - 1; i++) {
        const histNums = this.parseNumbers(fullHistory[i].open_code);
        // 计算交集：如果有3个以上号码相同，视为"镜像局"
        const common = histNums.filter(n => lastDrawNums.includes(n));
        if (common.length >= 3) {
            // 取下一期 (i-1)
            const nextNums = this.parseNumbers(fullHistory[i-1].open_code);
            nextNums.forEach(n => {
                // 相似度越高，权重越大
                mirrorCounts[n] = (mirrorCounts[n] || 0) + (common.length * 2); 
            });
        }
    }
    stats.forEach(s => s.scoreHistoryMirror = (mirrorCounts[s.num] || 0) * 0.8);

    // ==========================================
    // 算法 2: 特码轨迹 (Special Code Trajectory)
    // ==========================================
    // 历史上当特码是 X 时，下期通常出什么？
    const trajCounts: Record<number, number> = {};
    for (let i = 1; i < fullHistory.length - 1; i++) {
        const histNums = this.parseNumbers(fullHistory[i].open_code);
        const histSpecial = histNums[histNums.length - 1];
        
        if (histSpecial === lastSpecial) {
             const nextNums = this.parseNumbers(fullHistory[i-1].open_code);
             nextNums.forEach(n => trajCounts[n] = (trajCounts[n] || 0) + 5);
        }
    }
    stats.forEach(s => s.scoreSpecialTraj = trajCounts[s.num] || 0);

    // ==========================================
    // 算法 3: 尾数力场 (Tail Force Field)
    // ==========================================
    const tailTrend: Record<number, number> = {};
    recent10.forEach(rec => {
        this.parseNumbers(rec.open_code).forEach(n => {
            const t = n % 10;
            tailTrend[t] = (tailTrend[t] || 0) + 1;
        });
    });
    // 排序尾数热度
    const sortedTails = Object.keys(tailTrend).map(Number).sort((a, b) => (tailTrend[b]||0) - (tailTrend[a]||0));
    const hotTails = sortedTails.slice(0, 3);
    const coldTail = sortedTails[sortedTails.length - 1];
    
    stats.forEach(s => {
        if (hotTails.includes(s.tail)) s.scoreTail = 15;
        if (s.tail === coldTail) s.scoreTail = -5; // 杀最冷尾
    });

    // ==========================================
    // 算法 4: 生肖三合 (Zodiac Trinity)
    // ==========================================
    const zodiacFreq: Record<string, number> = {};
    recent20.forEach(rec => {
        this.parseNumbers(rec.open_code).forEach(n => {
            const z = this.NUM_TO_ZODIAC[n];
            zodiacFreq[z] = (zodiacFreq[z] || 0) + 1;
        });
    });
    const kingZodiac = Object.keys(zodiacFreq).sort((a, b) => zodiacFreq[b] - zodiacFreq[a])[0];
    const allies = this.SAN_HE_MAP[kingZodiac] || [];
    
    stats.forEach(s => {
        if (s.zodiac === kingZodiac) s.scoreZodiac += 8;
        if (allies.includes(s.zodiac)) s.scoreZodiac += 12; // 盟友加分通常更高，因为"旺气"扩散
    });

    // ==========================================
    // 算法 5: 五行平衡 (Wu Xing Balance)
    // ==========================================
    // 检查近5期五行，谁缺失补谁
    const wxCounts: Record<string, number> = { '金':0, '木':0, '水':0, '火':0, '土':0 };
    history.slice(0, 5).forEach(rec => {
        this.parseNumbers(rec.open_code).forEach(n => {
            const wx = this.NUM_TO_WUXING[n];
            if (wx) wxCounts[wx]++;
        });
    });
    // 找出最弱五行
    const weakWX = Object.keys(wxCounts).sort((a, b) => wxCounts[a] - wxCounts[b])[0];
    stats.forEach(s => {
        if (s.wuxing === weakWX) s.scoreWuXing = 18; // 强力回补
    });

    // ==========================================
    // 算法 6: 形态几何 (Geometry Patterns)
    // ==========================================
    stats.forEach(s => {
        // 重号 (Repeat)
        if (lastDrawNums.includes(s.num)) s.scorePattern += 8;
        // 邻号 (Neighbor)
        if (lastDrawNums.includes(s.num - 1) || lastDrawNums.includes(s.num + 1)) s.scorePattern += 12;
        // 隔期回补 (Jump) - 检查上上期
        if (history[1]) {
            const prevDraw = this.parseNumbers(history[1].open_code);
            if (prevDraw.includes(s.num) && !lastDrawNums.includes(s.num)) {
                s.scorePattern += 10;
            }
        }
    });

    // ==========================================
    // 算法 7: 波色惯性 (Wave Momentum)
    // ==========================================
    // 统计近10期波色，如果某种波色连续走强(Momentum)，继续追；如果极弱，尝试反弹
    const waveFreq: Record<string, number> = { red: 0, blue: 0, green: 0 };
    recent10.forEach(rec => {
        this.parseNumbers(rec.open_code).forEach(n => {
            waveFreq[this.getNumWave(n)]++;
        });
    });
    const bestWave = Object.keys(waveFreq).sort((a, b) => waveFreq[b as any] - waveFreq[a as any])[0];
    stats.forEach(s => {
        if (s.wave === bestWave) s.scoreWave = 10; // 顺势而为
    });

    // ==========================================
    // 算法 8: 黄金密钥 (Golden Key) & 遗漏回补
    // ==========================================
    const gold1 = Math.round(lastDrawSum * 0.618) % 49 || 49;
    const gold2 = (lastDrawSum + 7) % 49 || 49;
    stats.forEach(s => {
        if (s.num === gold1 || s.num === gold2) s.scoreGold = 25;
        
        // 简单遗漏计算
        let gap = 0;
        for (const rec of fullHistory) {
            if (this.parseNumbers(rec.open_code).includes(s.num)) break;
            gap++;
        }
        if (gap >= 8 && gap <= 12) s.scoreOmission = 15; // 黄金回补期
    });

    // ==========================================
    // 最终汇总 (Cosmic Resonance)
    // ==========================================
    stats.forEach(s => {
        s.totalScore = 
            s.scoreHistoryMirror * 1.5 +  // 历史镜像权重最大
            s.scoreSpecialTraj * 1.2 +    // 特码轨迹次之
            s.scorePattern * 1.0 +
            s.scoreTail * 1.0 +
            s.scoreZodiac * 1.0 +
            s.scoreWuXing * 1.0 +
            s.scoreWave * 0.8 + 
            s.scoreGold * 0.8 + 
            s.scoreOmission * 0.8;
            
        // 极微小的混沌因子，打破完美平局
        s.totalScore += Math.random() * 0.2;
    });

    // 排序
    stats.sort((a, b) => b.totalScore - a.totalScore);

    // 选码策略：全能王
    // 选取前 18 个分数最高的号码，这些号码是在所有算法维度下表现最好的
    const final18 = stats.slice(0, 18);
    const resultNumbers = final18.map(s => s.num).sort((a, b) => a - b).map(n => n < 10 ? `0${n}` : `${n}`);

    // 计算推荐肖 (基于前18码的总分权重)
    const zMap: Record<string, number> = {};
    final18.forEach(s => zMap[s.zodiac] = (zMap[s.zodiac] || 0) + s.totalScore);
    const recZodiacs = Object.keys(zMap).sort((a, b) => zMap[b] - zMap[a]).slice(0, 6);

    // 计算推荐波 (基于前18码的数量)
    const wMap: Record<string, number> = { red: 0, blue: 0, green: 0 };
    final18.forEach(s => wMap[s.wave]++);
    const recWaves = Object.keys(wMap).sort((a, b) => wMap[b as any] - wMap[a as any]);

    // 计算推荐头尾
    const hSet = new Set(final18.map(s => Math.floor(s.num / 10)));
    const recTails = Object.keys(tailTrend)
        .sort((a, b) => tailTrend[parseInt(b)] - tailTrend[parseInt(a)])
        .slice(0, 5)
        .map(String);

    return {
        zodiacs: recZodiacs,
        numbers: resultNumbers,
        wave: { main: recWaves[0], defense: recWaves[1] },
        heads: Array.from(hSet).sort().slice(0, 2).map(String),
        tails: recTails
    };
  }

  // --- 辅助方法 ---

  private static generateRandom(): PredictionData {
    const nums: string[] = [];
    while(nums.length < 18) {
      const r = Math.floor(Math.random() * 49) + 1;
      const s = r < 10 ? `0${r}` : `${r}`;
      if(!nums.includes(s)) nums.push(s);
    }
    nums.sort((a, b) => parseInt(a) - parseInt(b));
    return {
      zodiacs: ['龙', '马', '猴', '猪', '虎', '鼠'],
      numbers: nums,
      wave: { main: 'red', defense: 'blue' },
      heads: ['0', '1'],
      tails: ['1', '5', '8', '3', '9']
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
