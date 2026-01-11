import { LotteryType, PredictionData, DbRecord } from '../types';

interface NumberStat {
  num: number;
  zodiac: string;
  wave: string;
  wuxing: string;
  tail: number;
  
  // v10.0 十二大维度评分
  scoreHistoryMirror: number;  // 历史镜像 (整体盘面相似度)
  scoreZodiacTrans: number;    // 生肖转移概率 (上期开A，下期大概率开B)
  scoreNumberTrans: number;    // 特码转移概率 (上期特码X，下期大概率特码Y)
  scoreSpecialTraj: number;    // 特码轨迹 (基于历史特码走势)
  scorePattern: number;        // 形态几何 (邻号、重号、连号)
  scoreTail: number;           // 尾数力场
  scoreZodiac: number;         // 三合局势
  scoreWuXing: number;         // 五行平衡
  scoreWave: number;           // 波色惯性
  scoreGold: number;           // 黄金密钥
  scoreOmission: number;       // 遗漏回补
  scoreSeasonal: number;       // 季节规律
  scorePrime: number;          // 质数分布
  scoreSumAnalysis: number;    // 和值分析
  scorePosition: number;       // 位置分析
  
  totalScore: number;
}

/**
 * 🔮 Quantum Matrix Prediction Engine v10.0 "Galaxy Statistician Complete Edition" (银河统计师完全版)
 * 核心升级：整合十二大确定性算法，基于历史数据进行科学预测
 */
export class PredictionEngine {

  // --- 基础数据映射 (2025 Snake Year) ---
  static ZODIACS_MAP: Record<string, number[]> = {
    '蛇': [1, 13, 25, 37, 49], '马': [12, 24, 36, 48], '羊': [11, 23, 35, 47],
    '猴': [10, 22, 34, 46], '鸡': [9, 21, 33, 45], '狗': [8, 20, 32, 44],
    '猪': [7, 19, 31, 43], '鼠': [6, 18, 30, 42], '牛': [5, 17, 29, 41],
    '虎': [4, 16, 28, 40], '兔': [3, 15, 27, 39], '龙': [2, 14, 26, 38],
  };

  static SAN_HE_MAP: Record<string, string[]> = {
    '鼠': ['龙', '猴'], '龙': ['鼠', '猴'], '猴': ['鼠', '龙'],
    '牛': ['蛇', '鸡'], '蛇': ['牛', '鸡'], '鸡': ['牛', '蛇'],
    '虎': ['马', '狗'], '马': ['虎', '狗'], '狗': ['虎', '马'],
    '兔': ['猪', '羊'], '猪': ['兔', '羊'], '羊': ['兔', '猪']
  };
  
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

  // 季节映射 (1-4月:春, 5-8月:夏, 9-11月:秋, 12月:冬)
  static SEASONAL_ZODIACS: Record<string, string[]> = {
    '春': ['虎', '兔', '龙'],    // 春季生肖
    '夏': ['蛇', '马', '羊'],    // 夏季生肖
    '秋': ['猴', '鸡', '狗'],    // 秋季生肖
    '冬': ['猪', '鼠', '牛']     // 冬季生肖
  };

  // 质数号码 (1-49中的质数)
  static PRIME_NUMBERS: number[] = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

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
    
    if (!history || history.length < 30) return this.generateRandom();

    // 0. 数据预处理
    const fullHistory = history;
    const recent30 = history.slice(0, 30);
    const recent20 = history.slice(0, 20);
    const recent10 = history.slice(0, 10);
    const lastDrawNums = this.parseNumbers(history[0].open_code);
    const lastSpecial = lastDrawNums[lastDrawNums.length - 1]; // 上期特码
    const lastSpecialZodiac = this.NUM_TO_ZODIAC[lastSpecial]; // 上期特肖
    const lastDrawSum = lastDrawNums.reduce((a, b) => a + b, 0);
    
    // 获取当前月份，用于季节分析
    const currentDate = history[0].draw_time ? new Date(history[0].draw_time) : new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentSeason = this.getSeasonByMonth(currentMonth);

    // 初始化状态池
    const stats: NumberStat[] = Array.from({ length: 49 }, (_, i) => {
      const num = i + 1;
      return {
        num,
        zodiac: this.NUM_TO_ZODIAC[num],
        wave: this.getNumWave(num),
        wuxing: this.NUM_TO_WUXING[num],
        tail: num % 10,
        
        scoreHistoryMirror: 0,
        scoreZodiacTrans: 0,
        scoreNumberTrans: 0,
        scoreSpecialTraj: 0,
        scorePattern: 0,
        scoreTail: 0,
        scoreZodiac: 0,
        scoreWuXing: 0,
        scoreWave: 0,
        scoreGold: 0,
        scoreOmission: 0,
        scoreSeasonal: 0,
        scorePrime: 0,
        scoreSumAnalysis: 0,
        scorePosition: 0,
        totalScore: 0
      };
    });

    // ==========================================
    // 算法 1: [NEW] 生肖转移概率 (Zodiac Transition)
    // ==========================================
    const zodiacTransMap: Record<string, number> = {};
    let zodiacTransTotal = 0;

    for (let i = 1; i < fullHistory.length - 1; i++) {
      const histNums = this.parseNumbers(fullHistory[i].open_code);
      const histSpecial = histNums[histNums.length - 1];
      const histZodiac = this.NUM_TO_ZODIAC[histSpecial];

      if (histZodiac === lastSpecialZodiac) {
        const nextNums = this.parseNumbers(fullHistory[i-1].open_code);
        const nextSpecial = nextNums[nextNums.length - 1];
        const nextZodiac = this.NUM_TO_ZODIAC[nextSpecial];
        
        zodiacTransMap[nextZodiac] = (zodiacTransMap[nextZodiac] || 0) + 1;
        zodiacTransTotal++;
      }
    }
    
    stats.forEach(s => {
      const occurrences = zodiacTransMap[s.zodiac] || 0;
      if (zodiacTransTotal > 0) {
        s.scoreZodiacTrans = (occurrences / zodiacTransTotal) * 40;
      }
    });

    // ==========================================
    // 算法 2: [NEW] 特码转移概率 (Number Transition)
    // ==========================================
    const numTransMap: Record<number, number> = {};
    for (let i = 1; i < fullHistory.length - 1; i++) {
      const histNums = this.parseNumbers(fullHistory[i].open_code);
      const histSpecial = histNums[histNums.length - 1];
      
      if (histSpecial === lastSpecial) {
        const nextNums = this.parseNumbers(fullHistory[i-1].open_code);
        const nextSpecial = nextNums[nextNums.length - 1];
        numTransMap[nextSpecial] = (numTransMap[nextSpecial] || 0) + 1;
      }
    }
    stats.forEach(s => s.scoreNumberTrans = (numTransMap[s.num] || 0) * 5);

    // ==========================================
    // 算法 3: 历史镜像 (Historical Mirroring)
    // ==========================================
    const mirrorCounts: Record<number, number> = {};
    for (let i = 1; i < fullHistory.length - 1; i++) {
      const histNums = this.parseNumbers(fullHistory[i].open_code);
      const common = histNums.filter(n => lastDrawNums.includes(n));
      if (common.length >= 3) {
        const nextNums = this.parseNumbers(fullHistory[i-1].open_code);
        nextNums.forEach(n => {
          mirrorCounts[n] = (mirrorCounts[n] || 0) + common.length; 
        });
      }
    }
    stats.forEach(s => s.scoreHistoryMirror = (mirrorCounts[s.num] || 0) * 0.5);

    // ==========================================
    // 算法 4: [NEW] 特码轨迹分析 (Special Number Trajectory)
    // ==========================================
    const specialTrajectory = this.analyzeSpecialTrajectory(fullHistory);
    stats.forEach(s => {
      // 根据特码历史走势评分
      const isAscending = specialTrajectory.isAscending;
      const isDescending = specialTrajectory.isDescending;
      const avgSpecial = specialTrajectory.average;
      
      if (isAscending && s.num > lastSpecial) s.scoreSpecialTraj += 12;
      if (isDescending && s.num < lastSpecial) s.scoreSpecialTraj += 12;
      if (Math.abs(s.num - avgSpecial) <= 5) s.scoreSpecialTraj += 8;
      
      // 特码奇偶连续性
      const lastParity = lastSpecial % 2;
      if (lastParity === 0 && s.num % 2 === 0) s.scoreSpecialTraj += 5;
      if (lastParity === 1 && s.num % 2 === 1) s.scoreSpecialTraj += 5;
    });

    // ==========================================
    // 算法 5: 形态几何 & 尾数力场
    // ==========================================
    const tailTrend: Record<number, number> = {};
    recent10.forEach(rec => {
      this.parseNumbers(rec.open_code).forEach(n => {
        tailTrend[n % 10] = (tailTrend[n % 10] || 0) + 1;
      });
    });
    const sortedTails = Object.keys(tailTrend).map(Number).sort((a, b) => (tailTrend[b]||0) - (tailTrend[a]||0));
    const hotTails = sortedTails.slice(0, 3);
    
    stats.forEach(s => {
      // 尾数热号
      if (hotTails.includes(s.tail)) s.scoreTail = 12;
      
      // 形态分析
      if (lastDrawNums.includes(s.num)) s.scorePattern += 5; // 重号
      if (lastDrawNums.includes(s.num - 1) || lastDrawNums.includes(s.num + 1)) s.scorePattern += 8; // 邻号
      
      // 连号模式
      for (let i = 0; i < lastDrawNums.length - 1; i++) {
        if (Math.abs(lastDrawNums[i] - lastDrawNums[i+1]) === 1) {
          if (s.num === lastDrawNums[i] + 2 || s.num === lastDrawNums[i+1] - 2) {
            s.scorePattern += 10; // 连号延伸
          }
        }
      }
    });

    // ==========================================
    // 算法 6: 五行平衡 & 生肖三合
    // ==========================================
    const wxCounts: Record<string, number> = { '金':0, '木':0, '水':0, '火':0, '土':0 };
    history.slice(0, 5).forEach(rec => {
      this.parseNumbers(rec.open_code).forEach(n => {
        const wx = this.NUM_TO_WUXING[n];
        if (wx) wxCounts[wx]++;
      });
    });
    const weakWX = Object.keys(wxCounts).sort((a, b) => wxCounts[a] - wxCounts[b])[0];
    
    const zodiacFreq: Record<string, number> = {};
    recent20.forEach(rec => {
      this.parseNumbers(rec.open_code).forEach(n => {
        zodiacFreq[this.NUM_TO_ZODIAC[n]] = (zodiacFreq[this.NUM_TO_ZODIAC[n]] || 0) + 1;
      });
    });
    const kingZodiac = Object.keys(zodiacFreq).sort((a, b) => zodiacFreq[b] - zodiacFreq[a])[0];
    const allies = this.SAN_HE_MAP[kingZodiac] || [];

    stats.forEach(s => {
      if (s.wuxing === weakWX) s.scoreWuXing = 15; // 补弱
      if (allies.includes(s.zodiac)) s.scoreZodiac += 10; // 三合
      if (s.zodiac === kingZodiac) s.scoreZodiac += 5; // 旺门
    });

    // ==========================================
    // 算法 7: 波色惯性
    // ==========================================
    const waveCounts: Record<string, number> = { red: 0, blue: 0, green: 0 };
    recent10.forEach(rec => {
      this.parseNumbers(rec.open_code).forEach(n => {
        const wave = this.getNumWave(n);
        waveCounts[wave]++;
      });
    });
    
    const lastWave = this.getNumWave(lastSpecial);
    const weakWave = Object.keys(waveCounts).sort((a, b) => waveCounts[a] - waveCounts[b])[0];
    
    stats.forEach(s => {
      if (s.wave === lastWave) s.scoreWave += 8; // 同波色惯性
      if (s.wave === weakWave) s.scoreWave += 12; // 补弱波色
    });

    // ==========================================
    // 算法 8: 黄金密钥
    // ==========================================
    const gold1 = Math.round(lastDrawSum * 0.618) % 49 || 49;
    const gold2 = (lastDrawSum + 7) % 49 || 49;
    const gold3 = (lastSpecial * 1.618) % 49 || 49;
    const gold4 = Math.abs(lastSpecial - 13) % 49 || 49;
    
    stats.forEach(s => {
      if (s.num === gold1 || s.num === gold2 || s.num === gold3 || s.num === gold4) s.scoreGold = 20;
    });

    // ==========================================
    // 算法 9: [NEW] 遗漏回补分析
    // ==========================================
    const omissionScores = this.calculateOmissionScores(fullHistory, 30);
    stats.forEach(s => {
      s.scoreOmission = omissionScores[s.num] || 0;
    });

    // ==========================================
    // 算法 10: [NEW] 季节规律分析
    // ==========================================
    const seasonalZodiacs = this.SEASONAL_ZODIACS[currentSeason] || [];
    stats.forEach(s => {
      if (seasonalZodiacs.includes(s.zodiac)) s.scoreSeasonal = 15;
      
      // 月份数字关联 (例如：5月对应号码5、15、25、35、45)
      if (s.num % 10 === currentMonth % 10 || Math.floor(s.num / 10) === currentMonth) {
        s.scoreSeasonal += 5;
      }
    });

    // ==========================================
    // 算法 11: [NEW] 质数分布分析
    // ==========================================
    const primeHistory = this.analyzePrimeDistribution(recent20);
    const expectedPrimeCount = primeHistory.expected;
    const currentPrimeCount = primeHistory.current;
    
    stats.forEach(s => {
      const isPrime = this.PRIME_NUMBERS.includes(s.num);
      
      if (currentPrimeCount < expectedPrimeCount && isPrime) {
        s.scorePrime = 12; // 质数数量不足，需要补质数
      } else if (currentPrimeCount > expectedPrimeCount && !isPrime) {
        s.scorePrime = 12; // 质数过多，需要补合数
      }
      
      // 质数连续性
      if (this.PRIME_NUMBERS.includes(lastSpecial) && isPrime) {
        s.scorePrime += 8; // 上期质数，本期可能连续
      }
    });

    // ==========================================
    // 算法 12: [NEW] 和值分析
    // ==========================================
    const sumAnalysis = this.analyzeSumPatterns(recent20);
    stats.forEach(s => {
      // 模拟加入这个号码后的和值
      const simulatedSum = lastDrawSum - lastSpecial + s.num;
      
      if (simulatedSum >= sumAnalysis.minRange && simulatedSum <= sumAnalysis.maxRange) {
        s.scoreSumAnalysis = 10;
      }
      
      // 和值奇偶性
      const lastSumParity = lastDrawSum % 2;
      const simulatedParity = simulatedSum % 2;
      if (sumAnalysis.parityTrend === 'same' && lastSumParity === simulatedParity) {
        s.scoreSumAnalysis += 5;
      } else if (sumAnalysis.parityTrend === 'alternate' && lastSumParity !== simulatedParity) {
        s.scoreSumAnalysis += 5;
      }
    });

    // ==========================================
    // 算法 13: [NEW] 位置分析
    // ==========================================
    const positionAnalysis = this.analyzeNumberPositions(recent20);
    stats.forEach(s => {
      // 号码在不同位置的出现概率
      const posScores = positionAnalysis[s.num] || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
      const totalPosScore = Object.values(posScores).reduce((a, b) => a + b, 0);
      s.scorePosition = totalPosScore * 2;
      
      // 特别关注特码位置
      s.scorePosition += (posScores[7] || 0) * 3;
    });

    // ==========================================
    // 最终汇总 - 十二大维度权重分配
    // ==========================================
    stats.forEach(s => {
      s.totalScore = 
        s.scoreZodiacTrans * 2.0 +     // 生肖转移概率 (核心算法)
        s.scoreNumberTrans * 1.5 +     // 特码转移概率
        s.scoreHistoryMirror * 1.2 +   // 历史镜像
        s.scoreSpecialTraj * 1.0 +     // 特码轨迹
        s.scorePattern * 0.9 +         // 形态几何
        s.scoreTail * 0.8 +           // 尾数力场
        s.scoreZodiac * 0.8 +         // 三合局势
        s.scoreWuXing * 0.8 +         // 五行平衡
        s.scoreWave * 0.7 +           // 波色惯性
        s.scoreGold * 0.6 +           // 黄金密钥
        s.scoreOmission * 0.6 +       // 遗漏回补
        s.scoreSeasonal * 0.5 +       // 季节规律
        s.scorePrime * 0.5 +          // 质数分布
        s.scoreSumAnalysis * 0.4 +    // 和值分析
        s.scorePosition * 0.4;        // 位置分析
        
      // 极微扰动（保持随机性但极小影响）
      s.totalScore += Math.random() * 0.1;
    });

    // 排序
    stats.sort((a, b) => b.totalScore - a.totalScore);

    // 选码 - 确保多样性
    const final18 = this.selectDiverseNumbers(stats, 18);
    const resultNumbers = final18.map(s => s.num).sort((a, b) => a - b).map(n => n < 10 ? `0${n}` : `${n}`);

    // 计算推荐肖 (基于前18码的总分权重)
    const zMap: Record<string, number> = {};
    final18.forEach(s => zMap[s.zodiac] = (zMap[s.zodiac] || 0) + s.totalScore);
    const recZodiacs = Object.keys(zMap).sort((a, b) => zMap[b] - zMap[a]).slice(0, 6);

    // 计算推荐波
    const wMap: Record<string, number> = { red: 0, blue: 0, green: 0 };
    final18.forEach(s => wMap[s.wave]++);
    const recWaves = Object.keys(wMap).sort((a, b) => wMap[b as any] - wMap[a as any]);

    // 计算推荐头尾
    const hSet = new Set(final18.map(s => Math.floor(s.num / 10)));
    const recTails = Array.from(new Set(final18.map(s => s.tail)))
      .sort()
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

  // --- 新增确定性算法辅助方法 ---

  /**
   * 特码轨迹分析
   */
  private static analyzeSpecialTrajectory(history: DbRecord[]) {
    const specials: number[] = [];
    
    for (let i = 0; i < Math.min(20, history.length); i++) {
      const nums = this.parseNumbers(history[i].open_code);
      if (nums.length > 0) {
        specials.push(nums[nums.length - 1]); // 特码
      }
    }
    
    // 分析趋势
    let ascendingCount = 0;
    let descendingCount = 0;
    let total = 0;
    
    for (let i = 1; i < specials.length; i++) {
      if (specials[i] > specials[i-1]) ascendingCount++;
      if (specials[i] < specials[i-1]) descendingCount++;
      total += specials[i];
    }
    
    const average = total / (specials.length - 1);
    
    return {
      isAscending: ascendingCount > descendingCount * 1.5,
      isDescending: descendingCount > ascendingCount * 1.5,
      average,
      recent: specials.slice(0, 5)
    };
  }

  /**
   * 遗漏值计算
   */
  private static calculateOmissionScores(history: DbRecord[], period: number): Record<number, number> {
    const omissionMap: Record<number, number> = {};
    const lastAppearance: Record<number, number> = {};
    
    // 初始化
    for (let i = 1; i <= 49; i++) {
      omissionMap[i] = period; // 默认最大遗漏
      lastAppearance[i] = -1;
    }
    
    // 计算遗漏
    for (let i = 0; i < Math.min(period, history.length); i++) {
      const nums = this.parseNumbers(history[i].open_code);
      nums.forEach(num => {
        omissionMap[num] = i - (lastAppearance[num] === -1 ? period : lastAppearance[num]);
        lastAppearance[num] = i;
      });
    }
    
    // 转换为分数 (遗漏越大，分数越高，但非线性)
    const scores: Record<number, number> = {};
    for (let i = 1; i <= 49; i++) {
      const omission = omissionMap[i];
      // 指数型增长，但有限制
      if (omission > period * 0.7) {
        scores[i] = 20; // 极大遗漏
      } else if (omission > period * 0.5) {
        scores[i] = 15;
      } else if (omission > period * 0.3) {
        scores[i] = 10;
      } else if (omission > period * 0.1) {
        scores[i] = 5;
      } else {
        scores[i] = 0;
      }
    }
    
    return scores;
  }

  /**
   * 质数分布分析
   */
  private static analyzePrimeDistribution(history: DbRecord[]) {
    let primeCount = 0;
    let totalNumbers = 0;
    
    history.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      totalNumbers += nums.length;
      primeCount += nums.filter(n => this.PRIME_NUMBERS.includes(n)).length;
    });
    
    const primeRatio = primeCount / totalNumbers;
    const expectedRatio = this.PRIME_NUMBERS.length / 49; // 15/49 ≈ 0.306
    
    return {
      current: primeCount,
      ratio: primeRatio,
      expected: Math.round(expectedRatio * 7 * history.length), // 每期7个号码的期望质数数量
      isPrimeRich: primeRatio > expectedRatio * 1.2,
      isPrimePoor: primeRatio < expectedRatio * 0.8
    };
  }

  /**
   * 和值模式分析
   */
  private static analyzeSumPatterns(history: DbRecord[]) {
    const sums: number[] = [];
    const sumParities: number[] = [];
    
    history.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      const sum = nums.reduce((a, b) => a + b, 0);
      sums.push(sum);
      sumParities.push(sum % 2);
    });
    
    // 计算和值范围
    const minSum = Math.min(...sums);
    const maxSum = Math.max(...sums);
    const avgSum = sums.reduce((a, b) => a + b, 0) / sums.length;
    
    // 分析奇偶趋势
    let sameParityCount = 0;
    for (let i = 1; i < sumParities.length; i++) {
      if (sumParities[i] === sumParities[i-1]) sameParityCount++;
    }
    
    const parityTrend = sameParityCount > sumParities.length * 0.6 ? 'same' : 
                      sameParityCount < sumParities.length * 0.4 ? 'alternate' : 'random';
    
    return {
      minRange: Math.max(80, avgSum - 20),
      maxRange: Math.min(200, avgSum + 20),
      average: avgSum,
      parityTrend
    };
  }

  /**
   * 号码位置分析
   */
  private static analyzeNumberPositions(history: DbRecord[]): Record<number, Record<number, number>> {
    const positionStats: Record<number, Record<number, number>> = {};
    
    // 初始化
    for (let i = 1; i <= 49; i++) {
      positionStats[i] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
    }
    
    // 统计每个号码在不同位置的出现次数
    history.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      nums.forEach((num, index) => {
        const position = index + 1; // 位置1-7
        if (positionStats[num]) {
          positionStats[num][position]++;
        }
      });
    });
    
    return positionStats;
  }

  /**
   * 多样性选择算法
   */
  private static selectDiverseNumbers(stats: NumberStat[], count: number): NumberStat[] {
    const selected: NumberStat[] = [];
    const zodiacCount: Record<string, number> = {};
    const waveCount: Record<string, number> = {};
    const tailCount: Record<number, number> = {};
    
    // 先选前几个高分
    const sortedStats = [...stats];
    
    for (const stat of sortedStats) {
      if (selected.length >= count) break;
      
      // 检查多样性限制
      const zodiacLimit = 3; // 每个生肖最多选3个
      const waveLimit = 7;   // 每个波色最多选7个
      const tailLimit = 3;   // 每个尾数最多选3个
      
      const currentZodiacCount = zodiacCount[stat.zodiac] || 0;
      const currentWaveCount = waveCount[stat.wave] || 0;
      const currentTailCount = tailCount[stat.tail] || 0;
      
      if (currentZodiacCount < zodiacLimit && 
          currentWaveCount < waveLimit && 
          currentTailCount < tailLimit) {
        
        selected.push(stat);
        zodiacCount[stat.zodiac] = currentZodiacCount + 1;
        waveCount[stat.wave] = currentWaveCount + 1;
        tailCount[stat.tail] = currentTailCount + 1;
      }
    }
    
    // 如果数量不足，放宽限制
    if (selected.length < count) {
      const remaining = sortedStats.filter(s => !selected.includes(s));
      selected.push(...remaining.slice(0, count - selected.length));
    }
    
    return selected;
  }

  /**
   * 根据月份获取季节
   */
  private static getSeasonByMonth(month: number): string {
    if (month >= 1 && month <= 4) return '春';
    if (month >= 5 && month <= 8) return '夏';
    if (month >= 9 && month <= 11) return '秋';
    return '冬';
  }

  // --- 基础辅助方法 (保持不变) ---

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
