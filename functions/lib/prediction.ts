
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
 * 🌌 Nebula Self-Correcting Engine v13.0 (Quantum Core)
 * 
 * 核心特性：
 * 1. 12大确定性算法矩阵：包含传统的规律映射和高阶统计学模型。
 * 2. 纯数学模型引入：马尔可夫链、泊松分布、线性回归趋势。
 * 3. 零随机性：所有降级和兜底逻辑均基于热度统计。
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

  static ELEMENTS_MAP: Record<string, number[]> = {
    '金': [1, 2, 15, 16, 23, 24, 31, 32, 45, 46],
    '木': [5, 6, 13, 14, 21, 22, 35, 36, 43, 44],
    '水': [9, 10, 17, 18, 25, 26, 33, 34, 41, 42, 49],
    '火': [3, 4, 11, 12, 19, 20, 27, 28, 47, 48],
    '土': [7, 8, 29, 30, 37, 38, 39, 40]
  };

  static NUM_TO_ZODIAC: Record<number, string> = {};
  static NUM_TO_WAVE: Record<number, string> = {};
  static NUM_TO_ELEMENT: Record<number, string> = {};

  static initializeMaps() {
    if (Object.keys(this.NUM_TO_ZODIAC).length > 0) return;
    for (const [z, nums] of Object.entries(this.ZODIACS_MAP)) {
      nums.forEach(n => this.NUM_TO_ZODIAC[n] = z);
    }
    for (const [w, nums] of Object.entries(this.WAVES_MAP)) {
      // @ts-ignore
      nums.forEach(n => this.NUM_TO_WAVE[n] = w);
    }
    for (const [e, nums] of Object.entries(this.ELEMENTS_MAP)) {
      nums.forEach(n => this.NUM_TO_ELEMENT[n] = e);
    }
  }

  /**
   * 生成预测主入口
   */
  static generate(history: DbRecord[], type: LotteryType): PredictionData {
    this.initializeMaps();
    
    // 数据量检查
    if (!history || history.length < 80) return this.generateFallback(history);

    // 1. 运行深度回测系统 (Backtesting Kernel)
    // ------------------------------------------------
    const backtestWindow = 30;
    const strategies = this.runBacktest(history, backtestWindow);
    
    // 获取当前表现最好的策略名称
    const bestStrategy = strategies.sort((a, b) => b.weight - a.weight)[0];
    const analysisText = `${bestStrategy.name} (30期准确率: ${(bestStrategy.score * 100).toFixed(0)}%)`;

    // 2. 综合打分 (Composite Scoring)
    // ------------------------------------------------
    const stats = this.calculateCompositeScores(history, strategies);

    // 3. 选码逻辑
    // ------------------------------------------------
    const sortedStats = Object.values(stats).sort((a, b) => b.totalScore - a.totalScore);
    
    // 选 18 码
    const final18 = sortedStats.slice(0, 18);
    const resultNumbers = final18.map(s => s.num).sort((a, b) => a - b).map(n => n < 10 ? `0${n}` : `${n}`);

    // 选 6 肖
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
   */
  static runBacktest(history: DbRecord[], windowSize: number): StrategyResult[] {
    const strategyDefinitions = [
      // 基础规律类
      { name: '偏移轨迹 (Offset)', func: this.strategyOffset.bind(this) },
      { name: '遗漏回补 (Omission)', func: this.strategyOmission.bind(this) },
      { name: '生肖转移 (Link)', func: this.strategyZodiacLink.bind(this) },
      { name: '历史镜像 (Mirror)', func: this.strategyHistoryMirror.bind(this) },
      { name: '时空模数 (Modulo)', func: this.strategyModulo.bind(this) },
      // 数学/几何类
      { name: '黄金分割 (Golden)', func: this.strategyGoldenSection.bind(this) },
      { name: '合数走势 (DigitSum)', func: this.strategyDigitSum.bind(this) },
      // 规则映射类
      { name: '五行相生 (Element)', func: this.strategyFiveElements.bind(this) },
      { name: '三合六合 (Harmony)', func: this.strategyZodiacHarmony.bind(this) },
      // 统计学类 (New)
      { name: '马尔可夫链 (Markov)', func: this.strategyMarkovChain.bind(this) },
      { name: '泊松分布 (Poisson)', func: this.strategyPoisson.bind(this) },
      { name: '回归趋势 (Regression)', func: this.strategyRegression.bind(this) }
    ];

    const results = strategyDefinitions.map(s => ({ name: s.name, hits: 0 }));

    // 回测循环
    for (let i = 0; i < windowSize; i++) {
      const targetRecord = history[i];
      const trainingData = history.slice(i + 1);
      
      if (trainingData.length < 50) break; // 训练数据不足

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
      '黄金分割 (Golden)': this.strategyGoldenSection.bind(this),
      '五行相生 (Element)': this.strategyFiveElements.bind(this),
      '三合六合 (Harmony)': this.strategyZodiacHarmony.bind(this),
      '合数走势 (DigitSum)': this.strategyDigitSum.bind(this),
      '马尔可夫链 (Markov)': this.strategyMarkovChain.bind(this),
      '泊松分布 (Poisson)': this.strategyPoisson.bind(this),
      '回归趋势 (Regression)': this.strategyRegression.bind(this)
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
    
    // 确定性微扰动 (非随机)，防止死锁
    for (let n = 1; n <= 49; n++) stats[n].totalScore += (n * 0.0001); 

    return stats;
  }

  // ==========================================
  // 核心确定性算法库 (Deterministic Strategies)
  // ==========================================

  // 10. 马尔可夫链 (Markov Chain) [New]
  // 基于条件概率：当特码为 X 时，历史上紧接着出现 Y 的概率
  static strategyMarkovChain(history: DbRecord[]): Record<number, number> {
      const scores: Record<number, number> = {};
      const lastNum = this.parseNumbers(history[0].open_code).pop() || 1;
      const transitionCounts: Record<number, number> = {};

      // 统计转移矩阵
      for (let i = 1; i < history.length; i++) {
          const prevNum = this.parseNumbers(history[i].open_code).pop();
          if (prevNum === lastNum) {
              const nextNum = this.parseNumbers(history[i - 1].open_code).pop();
              if (nextNum) {
                  transitionCounts[nextNum] = (transitionCounts[nextNum] || 0) + 1;
              }
          }
      }
      Object.entries(transitionCounts).forEach(([num, count]) => {
          scores[parseInt(num)] = count * 5; 
      });
      return scores;
  }

  // 11. 泊松分布 (Poisson Distribution) [New]
  // 基于平均出现频率计算下期出现的概率
  static strategyPoisson(history: DbRecord[]): Record<number, number> {
      const scores: Record<number, number> = {};
      const freq: Record<number, number> = {};
      const n = Math.min(history.length, 50);
      
      for(let i=0; i<n; i++) {
          const num = this.parseNumbers(history[i].open_code).pop();
          if(num) freq[num] = (freq[num] || 0) + 1;
      }

      // Poisson formula: P(k=1; lambda) = lambda^1 * e^-lambda / 1!
      // lambda = 平均每期出现的次数 (这里简化为 50 期内的频率/50)
      for(let num=1; num<=49; num++) {
          const k = (freq[num] || 0);
          const lambda = k / n * 7; // *7 归一化到特码周期
          // 我们寻找最接近 lambda=1 (即下期期望出现1次) 的号码，或者简单地寻找热度
          // 这里使用 lambda * e^-lambda 作为权重
          const prob = lambda * Math.exp(-lambda);
          scores[num] = prob * 100;
      }
      return scores;
  }

  // 12. 线性回归趋势 (Linear Regression Gap) [New]
  // 分析每个号码的遗漏值变化趋势，如果遗漏值在缩小，说明越来越热
  static strategyRegression(history: DbRecord[]): Record<number, number> {
      const scores: Record<number, number> = {};
      
      for(let num=1; num<=49; num++) {
          // 获取该号码最近 3 次出现的间隔 (Gap)
          const gaps: number[] = [];
          let lastIndex = -1;
          for(let i=0; i<Math.min(history.length, 100); i++) {
              const nums = this.parseNumbers(history[i].open_code);
              if (nums.includes(num)) {
                  if (lastIndex !== -1) {
                      gaps.push(i - lastIndex);
                  }
                  lastIndex = i;
                  if (gaps.length >= 3) break;
              }
          }
          
          if (gaps.length >= 2) {
              // 简单趋势：如果间隔在变小 (gap[0] < gap[1])，加分
              if (gaps[0] < gaps[1]) {
                  scores[num] = 5;
                  if (gaps.length >=3 && gaps[1] < gaps[2]) {
                      scores[num] += 3; // 连续缩短
                  }
              }
          }
      }
      return scores;
  }

  // --- 原有算法保留 ---

  static strategyOffset(history: DbRecord[]): Record<number, number> {
    const scores: Record<number, number> = {};
    const lastNum = this.parseNumbers(history[0].open_code).pop() || 1;
    const offsetCounts: Record<number, number> = {};
    for (let i = 0; i < Math.min(history.length - 1, 50); i++) {
      const curr = this.parseNumbers(history[i].open_code).pop();
      const prev = this.parseNumbers(history[i + 1].open_code).pop();
      if (curr && prev) {
        const diff = (curr - prev + 49) % 49;
        offsetCounts[diff] = (offsetCounts[diff] || 0) + 1;
      }
    }
    Object.entries(offsetCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).forEach(([diffStr, count]) => {
        const nextNum = (lastNum + parseInt(diffStr) - 1) % 49 + 1;
        scores[nextNum] = count * 3;
    });
    return scores;
  }

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
      if (om > 35) scores[n] = 10;
      else if (om <= 3) scores[n] = 8;
      else if (Math.abs(om - 9) <= 1) scores[n] = 6;
      else if (Math.abs(om - 19) <= 1) scores[n] = 6;
    }
    return scores;
  }

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

  static strategyGoldenSection(history: DbRecord[]): Record<number, number> {
    const scores: Record<number, number> = {};
    const lastNums = this.parseNumbers(history[0].open_code);
    const lastSpecial = lastNums[lastNums.length-1] || 25;
    const lastSum = lastNums.reduce((a,b)=>a+b, 0);
    const gold1 = Math.round(lastSum * 0.618) % 49 || 49;
    scores[gold1] = (scores[gold1] || 0) + 8;
    const gold2 = Math.round(lastSpecial * 1.618) % 49 || 49;
    scores[gold2] = (scores[gold2] || 0) + 8;
    const gold3 = Math.round(lastSpecial * 0.618) || 1;
    scores[gold3] = (scores[gold3] || 0) + 8;
    return scores;
  }

  static strategyFiveElements(history: DbRecord[]): Record<number, number> {
    const generationMap: Record<string, string> = {'木':'火', '火':'土', '土':'金', '金':'水', '水':'木'};
    const scores: Record<number, number> = {};
    const lastNum = this.parseNumbers(history[0].open_code).pop() || 1;
    const lastElement = this.NUM_TO_ELEMENT[lastNum];
    if (lastElement && generationMap[lastElement]) {
        const targetElement = generationMap[lastElement];
        const targetNums = this.ELEMENTS_MAP[targetElement];
        targetNums.forEach(n => scores[n] = 8);
    }
    return scores;
  }

  static strategyZodiacHarmony(history: DbRecord[]): Record<number, number> {
      const scores: Record<number, number> = {};
      const lastNum = this.parseNumbers(history[0].open_code).pop() || 1;
      const lastZodiac = this.NUM_TO_ZODIAC[lastNum];
      const triads: Record<string, string[]> = {
          '鼠':['龙','猴'], '龙':['鼠','猴'], '猴':['鼠','龙'],
          '牛':['蛇','鸡'], '蛇':['牛','鸡'], '鸡':['牛','蛇'],
          '虎':['马','狗'], '马':['虎','狗'], '狗':['虎','马'],
          '兔':['羊','猪'], '羊':['兔','猪'], '猪':['兔','羊']
      };
      const six: Record<string, string> = {
          '鼠':'牛', '牛':'鼠', '虎':'猪', '猪':'虎',
          '兔':'狗', '狗':'兔', '龙':'鸡', '鸡':'龙',
          '蛇':'猴', '猴':'蛇', '马':'羊', '羊':'马'
      };
      const targets = new Set<string>();
      if(triads[lastZodiac]) triads[lastZodiac].forEach(z => targets.add(z));
      if(six[lastZodiac]) targets.add(six[lastZodiac]);
      targets.forEach(z => {
          this.ZODIACS_MAP[z].forEach(n => scores[n] = 6);
      });
      return scores;
  }

  static strategyDigitSum(history: DbRecord[]): Record<number, number> {
      const scores: Record<number, number> = {};
      const lastNum = this.parseNumbers(history[0].open_code).pop() || 1;
      const getDigitSum = (n: number) => Math.floor(n/10) + n%10;
      const lastSum = getDigitSum(lastNum);
      const nextSumFreq: Record<number, number> = {};
      for(let i=1; i<Math.min(history.length, 60); i++) {
          const prev = this.parseNumbers(history[i].open_code).pop() || 1;
          const prevSum = getDigitSum(prev);
          if (prevSum === lastSum) {
              const curr = this.parseNumbers(history[i-1].open_code).pop() || 1;
              const currSum = getDigitSum(curr);
              nextSumFreq[currSum] = (nextSumFreq[currSum] || 0) + 1;
          }
      }
      const topSums = Object.entries(nextSumFreq).sort((a,b)=>b[1]-a[1]).slice(0, 3).map(x=>parseInt(x[0]));
      for(let n=1; n<=49; n++) {
          if (topSums.includes(getDigitSum(n))) scores[n] = 5;
      }
      return scores;
  }

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

  // 纯热度统计兜底 (去除了 Math.random)
  private static generateFallback(history: DbRecord[]): PredictionData {
    const freq: Record<number, number> = {};
    history.forEach(rec => {
        this.parseNumbers(rec.open_code).forEach(n => freq[n] = (freq[n]||0)+1);
    });
    // 纯按热度排序
    const hotNums = Object.keys(freq).map(Number).sort((a,b)=>freq[b]-freq[a]).slice(0, 18);
    const resultNums = hotNums.sort((a,b)=>a-b).map(n => n < 10 ? `0${n}` : `${n}`);
    return {
        zodiacs: ['鼠','牛','虎','兔','龙','蛇'], // 固定默认
        numbers: resultNums,
        wave: {main:'red', defense:'blue'},
        heads: ['0','1','2'],
        tails: ['1','2','3','4','5'],
        strategy_analysis: "基础热度兜底 (数据不足，无随机)"
    };
  }

  private static parseNumbers(code: string): number[] {
    if (!code) return [];
    return code.split(',').map(n => parseInt(n)).filter(n => !isNaN(n));
  }
}
