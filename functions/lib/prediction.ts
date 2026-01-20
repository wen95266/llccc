
import { LotteryType, PredictionData, DbRecord } from '../types';

interface NumberStat {
  num: number;
  zodiac: string;
  wave: string;
  totalScore: number;
}

interface StrategyResult {
  name: string;
  score: number; // 0-1, 准确率
  weight: number; // 动态权重
}

/**
 * 🌌 Nebula Self-Correcting Engine v11.1 (Deep Nebula)
 * 
 * 核心特性：
 * 1. 全面确定性算法整合：偏移、遗漏、生肖链、镜像、模数、黄金分割。
 * 2. 深度自动回测：窗口扩大至 30 期，过滤短期噪音。
 * 3. 动态权重分配：基于回测结果自动调整策略影响力。
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

  static NUM_TO_ZODIAC: Record<number, string> = {};
  static NUM_TO_WAVE: Record<number, string> = {};

  static initializeMaps() {
    if (Object.keys(this.NUM_TO_ZODIAC).length > 0) return;
    for (const [z, nums] of Object.entries(this.ZODIACS_MAP)) {
      nums.forEach(n => this.NUM_TO_ZODIAC[n] = z);
    }
    for (const [w, nums] of Object.entries(this.WAVES_MAP)) {
      // @ts-ignore
      nums.forEach(n => this.NUM_TO_WAVE[n] = w);
    }
  }

  /**
   * 生成预测主入口
   */
  static generate(history: DbRecord[], type: LotteryType): PredictionData {
    this.initializeMaps();
    
    // 数据量检查：需要至少 80 条数据才能支持 30 期回测 (30期窗口 + 50期算法依赖)
    if (!history || history.length < 80) return this.generateFallback(history);

    // 1. 运行深度回测系统 (Backtesting Kernel)
    // ------------------------------------------------
    const backtestWindow = 30;
    const strategies = this.runBacktest(history, backtestWindow);
    
    // 获取当前表现最好的策略名称
    const bestStrategy = strategies.sort((a, b) => b.weight - a.weight)[0];
    const analysisText = `${bestStrategy.name} (30期回测准确率: ${(bestStrategy.score * 100).toFixed(0)}%)`;

    // 2. 综合打分 (Composite Scoring)
    // ------------------------------------------------
    const stats = this.calculateCompositeScores(history, strategies);

    // 3. 选码逻辑
    // ------------------------------------------------
    const sortedStats = Object.values(stats).sort((a, b) => b.totalScore - a.totalScore);
    
    // 选 18 码
    const final18 = sortedStats.slice(0, 18);
    const resultNumbers = final18.map(s => s.num).sort((a, b) => a - b).map(n => n < 10 ? `0${n}` : `${n}`);

    // 选 6 肖 (基于高分号码聚合)
    const zMap: Record<string, number> = {};
    final18.forEach(s => zMap[s.zodiac] = (zMap[s.zodiac] || 0) + s.totalScore);
    const recZodiacs = Object.keys(zMap).sort((a, b) => zMap[b] - zMap[a]).slice(0, 6);

    // 选波色
    const wMap: Record<string, number> = { red: 0, blue: 0, green: 0 };
    final18.forEach(s => wMap[s.wave] = (wMap[s.wave] || 0) + s.totalScore);
    const recWaves = Object.keys(wMap).sort((a, b) => wMap[b as any] - wMap[a as any]);

    // 选头数
    const hMap: Record<number, number> = {};
    final18.forEach(s => {
        const h = Math.floor(s.num / 10);
        hMap[h] = (hMap[h] || 0) + 1;
    });
    const recHeads = Object.keys(hMap).sort((a, b) => hMap[parseInt(b)] - hMap[parseInt(a)]).slice(0, 3).map(String);

    // 选尾数 (使用独立的增强版尾数趋势算法)
    const tailScores = this.strategyTailTrend(history);
    const recTails = Object.keys(tailScores).map(Number).sort((a, b) => tailScores[b] - tailScores[a]).slice(0, 5).map(String);

    return {
      zodiacs: recZodiacs,
      numbers: resultNumbers,
      wave: { main: recWaves[0], defense: recWaves[1] },
      heads: recHeads,
      tails: recTails,
      strategy_analysis: analysisText
    };
  }

  /**
   * 自动回测内核
   * 模拟过去 N 期的预测过程，统计各策略的命中率
   */
  static runBacktest(history: DbRecord[], windowSize: number): StrategyResult[] {
    const strategyDefinitions = [
      { name: '偏移轨迹 (Offset)', func: this.strategyOffset.bind(this) },
      { name: '遗漏回补 (Omission)', func: this.strategyOmission.bind(this) },
      { name: '生肖转移 (Link)', func: this.strategyZodiacLink.bind(this) },
      { name: '历史镜像 (Mirror)', func: this.strategyHistoryMirror.bind(this) },
      { name: '时空模数 (Modulo)', func: this.strategyModulo.bind(this) },
      { name: '黄金分割 (Golden)', func: this.strategyGoldenSection.bind(this) }
    ];

    const results = strategyDefinitions.map(s => ({ name: s.name, hits: 0 }));

    // 回测循环
    for (let i = 0; i < windowSize; i++) {
      const targetRecord = history[i];
      const trainingData = history.slice(i + 1);
      
      if (trainingData.length < 50) break; // 训练数据不足，停止

      const targetNum = this.parseNumbers(targetRecord.open_code).pop();
      if (!targetNum) continue;

      strategyDefinitions.forEach((strat, idx) => {
        const scores = strat.func(trainingData);
        // 取该策略推荐的前 12 码进行验证
        const topPicked = Object.keys(scores)
          .map(Number)
          .sort((a, b) => scores[b] - scores[a])
          .slice(0, 12);
        
        if (topPicked.includes(targetNum)) {
          results[idx].hits++;
        }
      });
    }

    // 计算权重
    return results.map(r => {
      const accuracy = r.hits / windowSize;
      // 动态权重公式：基础权重 1.0 + 准确率 * 6.0
      // 准确率越高的策略，其生成的号码在最终池中的得分倍率越高
      return {
        name: r.name,
        score: accuracy,
        weight: 1.0 + (accuracy * 6.0) 
      };
    });
  }

  static calculateCompositeScores(history: DbRecord[], strategies: StrategyResult[]): Record<number, NumberStat> {
    const stats: Record<number, NumberStat> = {};
    for (let i = 1; i <= 49; i++) {
      stats[i] = {
        num: i,
        zodiac: this.NUM_TO_ZODIAC[i],
        wave: this.NUM_TO_WAVE[i],
        totalScore: 0
      };
    }

    const funcMap: Record<string, Function> = {
      '偏移轨迹 (Offset)': this.strategyOffset.bind(this),
      '遗漏回补 (Omission)': this.strategyOmission.bind(this),
      '生肖转移 (Link)': this.strategyZodiacLink.bind(this),
      '历史镜像 (Mirror)': this.strategyHistoryMirror.bind(this),
      '时空模数 (Modulo)': this.strategyModulo.bind(this),
      '黄金分割 (Golden)': this.strategyGoldenSection.bind(this)
    };

    strategies.forEach(strat => {
      const logicFunc = funcMap[strat.name];
      if (logicFunc) {
        const scores = logicFunc(history);
        for (let n = 1; n <= 49; n++) {
          if (scores[n]) {
            stats[n].totalScore += scores[n] * strat.weight;
          }
        }
      }
    });
    
    // 微小扰动防止绝对死锁，不影响大局
    for (let n = 1; n <= 49; n++) stats[n].totalScore += (n * 0.0001); 

    return stats;
  }

  // ==========================================
  // 核心确定性算法库 (Deterministic Strategies)
  // ==========================================

  // 1. 偏移轨迹算法
  static strategyOffset(history: DbRecord[]): Record<number, number> {
    const scores: Record<number, number> = {};
    const lastNum = this.parseNumbers(history[0].open_code).pop() || 1;
    const offsetCounts: Record<number, number> = {};
    
    // 统计过去 50 期
    for (let i = 0; i < Math.min(history.length - 1, 50); i++) {
      const curr = this.parseNumbers(history[i].open_code).pop();
      const prev = this.parseNumbers(history[i + 1].open_code).pop();
      if (curr && prev) {
        const diff = (curr - prev + 49) % 49;
        offsetCounts[diff] = (offsetCounts[diff] || 0) + 1;
      }
    }
    Object.entries(offsetCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .forEach(([diffStr, count]) => {
        const diff = parseInt(diffStr);
        const nextNum = (lastNum + diff - 1) % 49 + 1;
        scores[nextNum] = count * 3;
      });
    return scores;
  }

  // 2. 遗漏回补算法
  static strategyOmission(history: DbRecord[]): Record<number, number> {
    const scores: Record<number, number> = {};
    const omission: Record<number, number> = {};
    for (let i = 1; i <= 49; i++) omission[i] = 0;

    for (let n = 1; n <= 49; n++) {
      for (const rec of history) {
        const nums = this.parseNumbers(rec.open_code);
        if (nums.includes(n)) break; 
        omission[n]++;
      }
    }
    for (let n = 1; n <= 49; n++) {
      const om = omission[n];
      if (om > 35) scores[n] = 10; // 极冷防爆
      else if (om <= 3) scores[n] = 8; // 极热惯性
      else if (Math.abs(om - 9) <= 1) scores[n] = 6; // 周期9
      else if (Math.abs(om - 19) <= 1) scores[n] = 6; // 周期19
    }
    return scores;
  }

  // 3. 生肖转移矩阵
  static strategyZodiacLink(history: DbRecord[]): Record<number, number> {
    const scores: Record<number, number> = {};
    const lastNum = this.parseNumbers(history[0].open_code).pop() || 1;
    const lastZodiac = this.NUM_TO_ZODIAC[lastNum];
    const nextZodiacFreq: Record<string, number> = {};

    for (let i = 1; i < Math.min(history.length, 80); i++) {
      const prevNum = this.parseNumbers(history[i].open_code).pop() || 1;
      const prevZodiac = this.NUM_TO_ZODIAC[prevNum];
      if (prevZodiac === lastZodiac) {
        const targetNum = this.parseNumbers(history[i - 1].open_code).pop() || 1;
        const targetZodiac = this.NUM_TO_ZODIAC[targetNum];
        nextZodiacFreq[targetZodiac] = (nextZodiacFreq[targetZodiac] || 0) + 1;
      }
    }
    for (let n = 1; n <= 49; n++) {
      const z = this.NUM_TO_ZODIAC[n];
      if (nextZodiacFreq[z]) scores[n] = nextZodiacFreq[z] * 2;
    }
    return scores;
  }

  // 4. 历史镜像算法
  static strategyHistoryMirror(history: DbRecord[]): Record<number, number> {
    const scores: Record<number, number> = {};
    const lastNum = this.parseNumbers(history[0].open_code).pop() || 1;
    const lastWave = this.NUM_TO_WAVE[lastNum];
    const nextNumCounts: Record<number, number> = {};

    for (let i = 1; i < Math.min(history.length, 60); i++) {
      const prevNum = this.parseNumbers(history[i].open_code).pop() || 1;
      const prevWave = this.NUM_TO_WAVE[prevNum];
      if (prevWave === lastWave) {
        const nextNum = this.parseNumbers(history[i - 1].open_code).pop();
        if (nextNum) nextNumCounts[nextNum] = (nextNumCounts[nextNum] || 0) + 1;
      }
    }
    for (let n = 1; n <= 49; n++) {
      if (nextNumCounts[n]) scores[n] = nextNumCounts[n] * 4;
    }
    return scores;
  }

  // 5. 时空模数
  static strategyModulo(history: DbRecord[]): Record<number, number> {
    const scores: Record<number, number> = {};
    const lastNum = this.parseNumbers(history[0].open_code).pop() || 1;
    const mod3 = lastNum % 3;
    const mod3NextFreq: Record<number, number> = { 0:0, 1:0, 2:0 };
    
    for (let i = 0; i < Math.min(history.length, 50); i++) {
      const curr = this.parseNumbers(history[i].open_code).pop();
      const prev = this.parseNumbers(history[i+1].open_code).pop();
      if (curr && prev && prev % 3 === mod3) {
        mod3NextFreq[curr % 3]++;
      }
    }
    const bestMod = Object.keys(mod3NextFreq).sort((a,b) => mod3NextFreq[Number(b)] - mod3NextFreq[Number(a)])[0];
    for (let n = 1; n <= 49; n++) {
      if (n % 3 === Number(bestMod)) scores[n] = 5;
    }
    return scores;
  }

  // 6. 黄金分割算法 (New)
  static strategyGoldenSection(history: DbRecord[]): Record<number, number> {
    const scores: Record<number, number> = {};
    const lastNums = this.parseNumbers(history[0].open_code);
    const lastSpecial = lastNums[lastNums.length-1] || 25;
    const lastSum = lastNums.reduce((a,b)=>a+b, 0);

    // 映射1: 总和的 0.618
    const gold1 = Math.round(lastSum * 0.618) % 49 || 49;
    scores[gold1] = (scores[gold1] || 0) + 8;

    // 映射2: 特码的 1.618
    const gold2 = Math.round(lastSpecial * 1.618) % 49 || 49;
    scores[gold2] = (scores[gold2] || 0) + 8;
    
    // 映射3: 特码的 0.618
    const gold3 = Math.round(lastSpecial * 0.618) || 1;
    scores[gold3] = (scores[gold3] || 0) + 8;

    return scores;
  }

  // 尾数趋势 (独立算法，用于生成 Tails) - 参考最近 15 期
  static strategyTailTrend(history: DbRecord[]): Record<number, number> {
    const scores: Record<number, number> = {};
    for (let i = 0; i < Math.min(history.length, 15); i++) {
      const nums = this.parseNumbers(history[i].open_code);
      const weight = 15 - i; 
      nums.forEach(n => {
        const t = n % 10;
        scores[t] = (scores[t] || 0) + weight;
      });
    }
    return scores;
  }

  // 降级方案 (数据不足时使用简单的热度分析)
  private static generateFallback(history: DbRecord[]): PredictionData {
    const freq: Record<number, number> = {};
    history.forEach(rec => {
        this.parseNumbers(rec.open_code).forEach(n => freq[n] = (freq[n]||0)+1);
    });
    const hotNums = Object.keys(freq).map(Number).sort((a,b)=>freq[b]-freq[a]).slice(0, 18);
    const resultNums = hotNums.sort((a,b)=>a-b).map(n => n < 10 ? `0${n}` : `${n}`);
    return {
        zodiacs: ['鼠','牛','虎','兔','龙','蛇'],
        numbers: resultNums,
        wave: {main:'red', defense:'blue'},
        heads: ['0','1','2'],
        tails: ['1','2','3','4','5'],
        strategy_analysis: "基础降级 (数据<80条，未启动Nebula引擎)"
    };
  }

  private static parseNumbers(code: string): number[] {
    if (!code) return [];
    return code.split(',').map(n => parseInt(n)).filter(n => !isNaN(n));
  }
}
