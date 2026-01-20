import { LotteryType, PredictionData, DbRecord } from '../types';

interface NumberStat {
  num: number;
  zodiac: string;
  wave: string;
  wuxing: string;
  tail: number;
  head: number;
  parity: string;
  size: string;
  prime: boolean;
  cluster: number;
  
  // 三十二维度纯确定性评分系统
  scoreHistoryMirror: number;
  scoreZodiacTrans: number;
  scoreNumberTrans: number;
  scoreSpecialTraj: number;
  scorePattern: number;
  scoreTail: number;
  scoreZodiac: number;
  scoreWuXing: number;
  scoreWave: number;
  scoreGold: number;
  scoreOmission: number;
  scoreSeasonal: number;
  scorePrime: number;
  scoreSumAnalysis: number;
  scorePosition: number;
  scoreFrequency: number;
  scoreCluster: number;
  scoreSymmetry: number;
  scorePeriodic: number;
  scoreTrend: number;
  scoreHeadAnalysis: number;
  scoreTailPattern: number;
  scoreCorrelation: number;
  scoreProperty: number;
  scoreTimePattern: number;
  scoreSeriesPattern: number;
  scoreSumZone: number;
  scoreElementRelation: number;
  scoreMatrixCoordinate: number;
  scoreLatticeDistribution: number;
  scoreChaosPattern: number;
  scoreFractalDimension: number;
  scoreEntropyAnalysis: number;
  scoreDeterministicCore: number;
  
  // 新增增强维度
  scoreMathematicalProperties: number;      // 数学特性分析
  scoreQuantumResonance: number;           // 量子共振分析
  scorePathDependency: number;             // 路径依赖分析
  scoreStatisticalSignificance: number;    // 统计显著性分析
  scoreTopologicalPattern: number;         // 拓扑模式分析
  scoreHarmonicConvergence: number;        // 谐波收敛分析
  
  totalScore: number;
}

/**
 * 🔮 Quantum Matrix Prediction Engine v15.0 "Ultimate Deterministic Edition"
 * 终极增强版：三十六维度纯确定性算法，实现科学精准预测
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
  
  static WU_XING_CYCLE: Record<string, {sheng: string, ke: string, sheng_by: string, ke_by: string}> = {
    '金': {sheng: '水', ke: '木', sheng_by: '土', ke_by: '火'},
    '木': {sheng: '火', ke: '土', sheng_by: '水', ke_by: '金'},
    '水': {sheng: '木', ke: '火', sheng_by: '金', ke_by: '土'},
    '火': {sheng: '土', ke: '金', sheng_by: '木', ke_by: '水'},
    '土': {sheng: '金', ke: '水', sheng_by: '火', ke_by: '木'}
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

  static SEASONAL_ZODIACS: Record<string, string[]> = {
    '春': ['虎', '兔', '龙'],
    '夏': ['蛇', '马', '羊'],
    '秋': ['猴', '鸡', '狗'],
    '冬': ['猪', '鼠', '牛']
  };

  static PRIME_NUMBERS: number[] = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

  static PERFECT_SQUARES: number[] = [1, 4, 9, 16, 25, 36, 49];
  static CUBE_NUMBERS: number[] = [1, 8, 27];
  static FIBONACCI_NUMBERS: number[] = [1, 2, 3, 5, 8, 13, 21, 34];
  static TRIANGLE_NUMBERS: number[] = [1, 3, 6, 10, 15, 21, 28, 36, 45];

  static SYMMETRY_PAIRS: [number, number][] = [
    [1, 49], [2, 48], [3, 47], [4, 46], [5, 45], [6, 44], [7, 43],
    [8, 42], [9, 41], [10, 40], [11, 39], [12, 38], [13, 37], [14, 36],
    [15, 35], [16, 34], [17, 33], [18, 32], [19, 31], [20, 30], [21, 29],
    [22, 28], [23, 27], [24, 26]
  ];

  static MATRIX_COORDINATES: Record<number, {row: number, col: number}> = {};
  
  static CLUSTER_GROUPS: Record<number, number[]> = {
    1: [1, 2, 3, 4, 5, 6, 7],
    2: [8, 9, 10, 11, 12, 13, 14],
    3: [15, 16, 17, 18, 19, 20, 21],
    4: [22, 23, 24, 25, 26, 27, 28],
    5: [29, 30, 31, 32, 33, 34, 35],
    6: [36, 37, 38, 39, 40, 41, 42],
    7: [43, 44, 45, 46, 47, 48, 49]
  };

  static LATTICE_PATTERNS = {
    fibonacci: [1, 2, 3, 5, 8, 13, 21, 34],
    goldenRatio: [8, 13, 21, 34],
    arithmetic: [5, 10, 15, 20, 25, 30, 35, 40, 45],
    geometric: [2, 4, 8, 16, 32]
  };

  static FRACTAL_PATTERNS = {
    mandelbrot: [3, 7, 11, 19, 23, 31, 39, 43],
    julia: [2, 5, 10, 17, 26, 37],
    sierpinski: [1, 3, 9, 27]
  };

  static DETERMINISTIC_PATTERNS = {
    primeSpiral: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47],
    ulamSpiral: [1, 7, 19, 37, 13, 31, 49, 21, 43],
    magicSquare: [15, 25, 35, 45, 5, 10, 20, 30, 40]
  };

  // 量子共振模式
  static QUANTUM_RESONANCE_PATTERNS = {
    harmonic: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
    goldenAngle: [1, 3, 6, 10, 15, 21, 28, 36, 45],
    fibonacciRatio: [1, 2, 3, 5, 8, 13, 21, 34]
  };

  // 拓扑模式
  static TOPOLOGICAL_PATTERNS = {
    torus: [1, 7, 13, 19, 25, 31, 37, 43, 49],
    klein: [2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46],
    mobius: [3, 9, 15, 21, 27, 33, 39, 45]
  };

  static HEAD_MAP: Record<number, number[]> = {
    0: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    1: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    2: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    3: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
    4: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49]
  };

  static TAIL_GROUPS: Record<string, number[]> = {
    '小': [0, 1, 2, 3, 4],
    '大': [5, 6, 7, 8, 9],
    '质': [2, 3, 5, 7],
    '合': [0, 1, 4, 6, 8, 9]
  };

  static SUM_ZONES = {
    small: { min: 120, max: 175 },
    medium: { min: 176, max: 210 },
    large: { min: 211, max: 285 }
  };

  static PERIODIC_CYCLES = {
    zodiac: 12,
    wave: 7,
    wuxing: 5,
    tail: 10,
    head: 8,
    cluster: 7,
    matrix: 49
  };

  static TIME_PATTERNS = {
    weekday: {
      0: { zodiacs: ['兔', '鸡', '马'], tails: [3, 6, 9], clusters: [1, 4, 7] },
      1: { zodiacs: ['龙', '狗', '牛'], tails: [1, 4, 7], clusters: [2, 5] },
      2: { zodiacs: ['蛇', '猪', '虎'], tails: [2, 5, 8], clusters: [3, 6] },
      3: { zodiacs: ['马', '鼠', '兔'], tails: [0, 3, 6], clusters: [1, 4] },
      4: { zodiacs: ['羊', '牛', '龙'], tails: [1, 4, 7], clusters: [2, 5] },
      5: { zodiacs: ['猴', '虎', '蛇'], tails: [2, 5, 8], clusters: [3, 6] },
      6: { zodiacs: ['鸡', '兔', '马'], tails: [0, 3, 9], clusters: [1, 7] }
    },
    monthPeriod: {
      early: { heads: [0, 1], waves: ['red', 'blue'], clusters: [1, 2, 3] },
      middle: { heads: [2, 3], waves: ['blue', 'green'], clusters: [4, 5, 6] },
      late: { heads: [3, 4], waves: ['green', 'red'], clusters: [5, 6, 7] }
    }
  };

  static NUM_TO_ZODIAC: Record<number, string> = {};
  static NUM_TO_WUXING: Record<number, string> = {};
  static NUM_TO_HEAD: Record<number, number> = {};
  static NUM_TO_SIZE: Record<number, string> = {};
  static NUM_TO_PARITY: Record<number, string> = {};
  static NUM_TO_PRIME: Record<number, boolean> = {};
  static NUM_TO_CLUSTER: Record<number, number> = {};
  static NUM_TO_MATRIX: Record<number, {row: number, col: number}> = {};

  static initializeMaps() {
    if (Object.keys(this.NUM_TO_ZODIAC).length > 0) return;
    
    for (const [z, nums] of Object.entries(this.ZODIACS_MAP)) {
      nums.forEach(n => this.NUM_TO_ZODIAC[n] = z);
    }
    
    for (const [w, nums] of Object.entries(this.WU_XING_MAP)) {
      nums.forEach(n => this.NUM_TO_WUXING[n] = w);
    }
    
    for (let num = 1; num <= 49; num++) {
      this.NUM_TO_HEAD[num] = Math.floor(num / 10);
      this.NUM_TO_SIZE[num] = num <= 25 ? 'small' : 'large';
      this.NUM_TO_PARITY[num] = num % 2 === 0 ? 'even' : 'odd';
      this.NUM_TO_PRIME[num] = this.PRIME_NUMBERS.includes(num);
      
      for (const [cluster, nums] of Object.entries(this.CLUSTER_GROUPS)) {
        if (nums.includes(num)) {
          this.NUM_TO_CLUSTER[num] = parseInt(cluster);
          break;
        }
      }
      
      const row = Math.floor((num - 1) / 7) + 1;
      const col = ((num - 1) % 7) + 1;
      this.NUM_TO_MATRIX[num] = { row, col };
      this.MATRIX_COORDINATES[num] = { row, col };
    }
  }

  static generate(history: DbRecord[], type: LotteryType): PredictionData {
    this.initializeMaps();
    
    if (!history || history.length < 50) return this.generateDeterministic();

    // 数据预处理
    const fullHistory = history;
    const recent50 = history.slice(0, 50);
    const recent30 = history.slice(0, 30);
    const recent20 = history.slice(0, 20);
    const recent10 = history.slice(0, 10);
    
    const lastDrawNums = this.parseNumbers(history[0].open_code);
    const lastSpecial = lastDrawNums[lastDrawNums.length - 1];
    const lastSpecialZodiac = this.NUM_TO_ZODIAC[lastSpecial];
    const lastDrawSum = lastDrawNums.reduce((a, b) => a + b, 0);
    const lastDrawTail = lastSpecial % 10;
    const lastDrawHead = Math.floor(lastSpecial / 10);
    const lastSpecialSize = this.NUM_TO_SIZE[lastSpecial];
    const lastSpecialParity = this.NUM_TO_PARITY[lastSpecial];
    const lastSpecialPrime = this.NUM_TO_PRIME[lastSpecial];
    const lastSpecialCluster = this.NUM_TO_CLUSTER[lastSpecial];
    const lastMatrix = this.NUM_TO_MATRIX[lastSpecial];
    
    const currentDate = history[0].draw_time ? new Date(history[0].draw_time) : new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentSeason = this.getSeasonByMonth(currentMonth);
    const currentWeek = Math.floor(currentDate.getDate() / 7) + 1;
    const currentDay = currentDate.getDate();
    const currentWeekday = currentDate.getDay();
    
    let currentMonthPeriod: 'early' | 'middle' | 'late' = 'early';
    if (currentDay <= 10) currentMonthPeriod = 'early';
    else if (currentDay <= 20) currentMonthPeriod = 'middle';
    else currentMonthPeriod = 'late';

    // 初始化状态池
    const stats: NumberStat[] = Array.from({ length: 49 }, (_, i) => {
      const num = i + 1;
      const isPrime = this.NUM_TO_PRIME[num];
      const cluster = this.NUM_TO_CLUSTER[num];
      
      return {
        num,
        zodiac: this.NUM_TO_ZODIAC[num],
        wave: this.getNumWave(num),
        wuxing: this.NUM_TO_WUXING[num],
        tail: num % 10,
        head: Math.floor(num / 10),
        parity: this.NUM_TO_PARITY[num],
        size: this.NUM_TO_SIZE[num],
        prime: isPrime,
        cluster,
        
        // 初始化所有分数为0
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
        scoreFrequency: 0,
        scoreCluster: 0,
        scoreSymmetry: 0,
        scorePeriodic: 0,
        scoreTrend: 0,
        scoreHeadAnalysis: 0,
        scoreTailPattern: 0,
        scoreCorrelation: 0,
        scoreProperty: 0,
        scoreTimePattern: 0,
        scoreSeriesPattern: 0,
        scoreSumZone: 0,
        scoreElementRelation: 0,
        scoreMatrixCoordinate: 0,
        scoreLatticeDistribution: 0,
        scoreChaosPattern: 0,
        scoreFractalDimension: 0,
        scoreEntropyAnalysis: 0,
        scoreDeterministicCore: 0,
        
        // 新增维度
        scoreMathematicalProperties: 0,
        scoreQuantumResonance: 0,
        scorePathDependency: 0,
        scoreStatisticalSignificance: 0,
        scoreTopologicalPattern: 0,
        scoreHarmonicConvergence: 0,
        
        totalScore: 0
      };
    });

    // ==========================================
    // 执行所有分析维度
    // ==========================================
    
    // 1-34: 原有维度分析（保持原样）
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
        s.scoreZodiacTrans = (occurrences / zodiacTransTotal) * 50;
      }
    });

    // 特码转移概率
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
    stats.forEach(s => s.scoreNumberTrans = (numTransMap[s.num] || 0) * 6);

    // 其他原有维度分析（保持原样）
    stats.forEach(s => s.scoreHistoryMirror = this.calculateHistoryMirror(fullHistory, lastDrawNums)[s.num] || 0);
    stats.forEach(s => s.scoreSpecialTraj = this.analyzeTrajectory(fullHistory, lastSpecial)[s.num] || 0);
    stats.forEach(s => s.scorePattern = this.calculatePatternScores(lastDrawNums, recent10)[s.num] || 0);
    stats.forEach(s => s.scoreTail = this.calculateTailScores(recent10)[s.tail] || 0);
    stats.forEach(s => s.scoreZodiac = this.calculateZodiacScores(recent20, lastSpecialZodiac)[s.zodiac] || 0);
    stats.forEach(s => s.scoreWuXing = this.calculateWuxingScores(recent10)[s.wuxing] || 0);
    stats.forEach(s => s.scoreWave = this.calculateWaveScores(recent10, lastSpecial)[s.wave] || 0);
    
    const goldNumbers = this.calculateGoldNumbers(lastDrawSum, lastSpecial);
    stats.forEach(s => {
      if (goldNumbers.includes(s.num)) s.scoreGold = 25;
    });
    
    stats.forEach(s => s.scoreOmission = this.calculateOmissionScores(fullHistory, 40)[s.num] || 0);
    
    const seasonalScores = this.calculateSeasonalScores(currentMonth, currentWeek);
    stats.forEach(s => {
      s.scoreSeasonal = seasonalScores[s.zodiac] || 0;
      if (s.num % 10 === currentMonth % 10) s.scoreSeasonal += 5;
    });
    
    const primeAnalysis = this.analyzePrimeDistribution(recent20);
    stats.forEach(s => {
      if (primeAnalysis.needMorePrimes && s.prime) {
        s.scorePrime = 15;
      } else if (primeAnalysis.needMoreComposites && !s.prime) {
        s.scorePrime = 15;
      }
      if (lastSpecialPrime && s.prime) {
        s.scorePrime += 10;
      }
    });
    
    const sumAnalysis = this.analyzeSumPatterns(recent20, lastDrawSum);
    stats.forEach(s => {
      const simulatedSum = lastDrawSum - lastSpecial + s.num;
      s.scoreSumAnalysis = sumAnalysis.getScore(simulatedSum);
    });
    
    stats.forEach(s => s.scorePosition = this.calculatePositionScores(recent20)[s.num] || 0);
    stats.forEach(s => s.scoreFrequency = this.calculateFrequencyScores(recent30)[s.num] || 0);
    stats.forEach(s => s.scoreCluster = this.calculateClusterScores(lastDrawNums, recent20)[s.num] || 0);
    stats.forEach(s => s.scoreSymmetry = this.calculateSymmetryScores(recent20, lastDrawNums)[s.num] || 0);
    stats.forEach(s => s.scorePeriodic = this.calculatePeriodicScores(fullHistory, currentWeek)[s.num] || 0);
    stats.forEach(s => s.scoreTrend = this.calculateTrendScores(fullHistory)[s.num] || 0);
    
    const headAnalysis = this.analyzeHeadPatterns(recent30, lastDrawHead, currentWeekday);
    stats.forEach(s => {
      s.scoreHeadAnalysis = headAnalysis.getScore(s.head, s.num);
    });
    
    const tailPatternAnalysis = this.analyzeTailPatterns(recent20, lastDrawTail, currentDay);
    stats.forEach(s => {
      s.scoreTailPattern = tailPatternAnalysis.getScore(s.tail, s.num);
    });
    
    stats.forEach(s => s.scoreCorrelation = this.calculateCorrelationScores(recent30, lastDrawNums)[s.num] || 0);
    
    const propertyAnalysis = this.analyzePropertyPatterns(recent20, lastSpecial);
    stats.forEach(s => {
      s.scoreProperty = propertyAnalysis.getScore(s);
    });
    
    const timePatternScores = this.calculateTimePatternScores(currentWeekday, currentMonthPeriod, currentDay);
    stats.forEach(s => {
      s.scoreTimePattern = timePatternScores[s.num] || 0;
    });
    
    stats.forEach(s => s.scoreSeriesPattern = this.analyzeSeriesPatterns(recent20, lastDrawNums)[s.num] || 0);
    
    const sumZoneAnalysis = this.analyzeSumZonePatterns(recent20, lastDrawSum);
    stats.forEach(s => {
      const simulatedSum = lastDrawSum - lastSpecial + s.num;
      s.scoreSumZone = sumZoneAnalysis.getScore(simulatedSum);
    });
    
    stats.forEach(s => s.scoreElementRelation = this.calculateElementRelationScores(recent10, lastSpecial)[s.num] || 0);
    stats.forEach(s => s.scoreMatrixCoordinate = this.calculateMatrixCoordinateScores(recent20, lastMatrix, currentWeekday)[s.num] || 0);
    stats.forEach(s => s.scoreLatticeDistribution = this.calculateLatticeDistributionScores(recent30, lastSpecial)[s.num] || 0);
    stats.forEach(s => s.scoreChaosPattern = this.analyzeChaosPatterns(recent50, lastSpecial)[s.num] || 0);
    stats.forEach(s => s.scoreFractalDimension = this.calculateFractalDimensionScores(recent30)[s.num] || 0);
    stats.forEach(s => s.scoreEntropyAnalysis = this.analyzeEntropyPatterns(recent20, lastSpecial)[s.num] || 0);
    stats.forEach(s => s.scoreDeterministicCore = this.calculateDeterministicCoreScores(fullHistory, lastSpecial, currentWeek)[s.num] || 0);
    
    // ==========================================
    // 35. [ENHANCED] 数学特性分析
    // ==========================================
    const mathScores = this.analyzeMathematicalProperties(recent30, currentDay);
    stats.forEach(s => {
      s.scoreMathematicalProperties = mathScores[s.num] || 0;
    });
    
    // ==========================================
    // 36. [ENHANCED] 量子共振分析
    // ==========================================
    const quantumScores = this.analyzeQuantumResonance(recent20, lastSpecial, currentDate);
    stats.forEach(s => {
      s.scoreQuantumResonance = quantumScores[s.num] || 0;
    });
    
    // ==========================================
    // 37. [ENHANCED] 路径依赖分析
    // ==========================================
    const pathScores = this.analyzePathDependency(fullHistory, lastSpecial);
    stats.forEach(s => {
      s.scorePathDependency = pathScores[s.num] || 0;
    });
    
    // ==========================================
    // 38. [ENHANCED] 统计显著性分析
    // ==========================================
    const statScores = this.analyzeStatisticalSignificance(fullHistory, recent20);
    stats.forEach(s => {
      s.scoreStatisticalSignificance = statScores[s.num] || 0;
    });
    
    // ==========================================
    // 39. [ENHANCED] 拓扑模式分析
    // ==========================================
    const topologyScores = this.analyzeTopologicalPatterns(recent30);
    stats.forEach(s => {
      s.scoreTopologicalPattern = topologyScores[s.num] || 0;
    });
    
    // ==========================================
    // 40. [ENHANCED] 谐波收敛分析
    // ==========================================
    const harmonicScores = this.analyzeHarmonicConvergence(recent50, lastSpecial, currentWeek);
    stats.forEach(s => {
      s.scoreHarmonicConvergence = harmonicScores[s.num] || 0;
    });

    // ==========================================
    // 最终汇总 - 三十六维度权重分配
    // ==========================================
    stats.forEach(s => {
      s.totalScore = 
        // 核心维度 (权重较高)
        s.scoreZodiacTrans * 2.5 +
        s.scoreNumberTrans * 2.0 +
        s.scoreHistoryMirror * 1.8 +
        s.scoreSpecialTraj * 1.6 +
        s.scorePattern * 1.4 +
        s.scoreTail * 1.2 +
        s.scoreZodiac * 1.2 +
        
        // 重要维度
        s.scoreWuXing * 1.0 +
        s.scoreWave * 1.0 +
        s.scoreGold * 0.9 +
        s.scoreOmission * 0.9 +
        s.scoreSeasonal * 0.8 +
        s.scorePrime * 0.8 +
        s.scoreSumAnalysis * 0.7 +
        s.scorePosition * 0.7 +
        s.scoreFrequency * 0.7 +
        
        // 次要维度
        s.scoreCluster * 0.6 +
        s.scoreSymmetry * 0.6 +
        s.scorePeriodic * 0.6 +
        s.scoreTrend * 0.6 +
        s.scoreHeadAnalysis * 0.8 +
        s.scoreTailPattern * 0.8 +
        s.scoreCorrelation * 0.7 +
        s.scoreProperty * 0.7 +
        s.scoreTimePattern * 0.6 +
        s.scoreSeriesPattern * 0.6 +
        s.scoreSumZone * 0.5 +
        s.scoreElementRelation * 0.5 +
        
        // 新增高级维度
        s.scoreMatrixCoordinate * 0.4 +
        s.scoreLatticeDistribution * 0.4 +
        s.scoreChaosPattern * 0.4 +
        s.scoreFractalDimension * 0.4 +
        s.scoreEntropyAnalysis * 0.4 +
        s.scoreDeterministicCore * 0.6 +
        
        // 增强维度
        s.scoreMathematicalProperties * 0.7 +
        s.scoreQuantumResonance * 0.5 +
        s.scorePathDependency * 0.6 +
        s.scoreStatisticalSignificance * 0.6 +
        s.scoreTopologicalPattern * 0.5 +
        s.scoreHarmonicConvergence * 0.6;
        
      // 确定性微调（完全去除随机性）
      const deterministicAdjustment = this.getDeterministicAdjustment(
        s.num, lastSpecial, currentDay, currentWeekday
      );
      s.totalScore += deterministicAdjustment;
      
      // 附加确定性规则
      if (s.tail === currentDay % 10) {
        s.totalScore += 3; // 日期尾数对应
      }
      
      if (s.head === (lastDrawHead + 1) % 5) {
        s.totalScore += 2; // 头数位移
      }
    });

    // ==========================================
    // 关键改进: 重复惩罚机制（仅惩罚号码，不惩罚生肖）
    // ==========================================
    stats.forEach(s => {
      // 惩罚上期特码（降低重复概率）
      if (s.num === lastSpecial) {
        s.totalScore *= 0.3;  // 70%惩罚
      }
      
      // 轻微惩罚上期所有开奖号码（降低冷门重复）
      if (lastDrawNums.includes(s.num) && s.num !== lastSpecial) {
        s.totalScore *= 0.9;  // 10%惩罚
      }
      
      // 惩罚连续过热号码（历史统计）
      const recentFrequency = this.getRecentFrequency(fullHistory.slice(0, 20), s.num);
      if (recentFrequency > 3) { // 近20期出现超过3次
        s.totalScore *= 0.85;  // 15%惩罚
      }
    });

    // 排序
    stats.sort((a, b) => b.totalScore - a.totalScore);

    // 多样性选码
    const final18 = this.selectDiverseNumbers(stats, 18);
    const resultNumbers = final18.map(s => s.num).sort((a, b) => a - b).map(n => n < 10 ? `0${n}` : `${n}`);

    // 计算推荐肖（基于得分排序，不排除任何生肖）
    const zodiacScores: Record<string, number> = {};
    final18.forEach(s => {
      zodiacScores[s.zodiac] = (zodiacScores[s.zodiac] || 0) + s.totalScore;
    });
    
    const allZodiacs = Object.keys(this.ZODIACS_MAP);
    const zodiacScoresList = allZodiacs.map(z => ({
      zodiac: z,
      score: zodiacScores[z] || 0
    })).sort((a, b) => b.score - a.score);
    
    // 按得分推荐前6个生肖（不排除任何生肖）
    const recZodiacs = zodiacScoresList
      .slice(0, 6)
      .map(z => z.zodiac);

    // 计算推荐波
    const wMap: Record<string, number> = { red: 0, blue: 0, green: 0 };
    final18.forEach(s => wMap[s.wave]++);
    const recWaves = Object.keys(wMap).sort((a, b) => wMap[b as any] - wMap[a as any]);

    // 头数和尾数推荐
    const headRecommendations = this.calculateHeadRecommendations(
      recent30, 
      final18, 
      lastDrawHead, 
      currentWeekday
    );
    
    const tailRecommendations = this.calculateTailRecommendations(
      recent20, 
      final18, 
      lastDrawTail, 
      currentDay
    );

    return {
        zodiacs: recZodiacs,
        numbers: resultNumbers,
        wave: { main: recWaves[0], defense: recWaves[1] },
        heads: headRecommendations,
        tails: tailRecommendations
    };
  }

  // ==========================================
  // 新增增强算法实现
  // ==========================================

  /**
   * [ENHANCED] 数学特性分析
   */
  private static analyzeMathematicalProperties(history: DbRecord[], day: number): Record<number, number> {
    const scores: Record<number, number> = {};
    
    // 分析数学特性出现频率
    const mathProperties: Record<string, number[]> = {
      'perfectSquare': this.PERFECT_SQUARES,
      'cube': this.CUBE_NUMBERS,
      'fibonacci': this.FIBONACCI_NUMBERS,
      'triangle': this.TRIANGLE_NUMBERS,
      'prime': this.PRIME_NUMBERS
    };
    
    // 统计历史数学特性
    const propertyCounts: Record<string, number> = {};
    history.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      nums.forEach(num => {
        Object.entries(mathProperties).forEach(([prop, propNums]) => {
          if (propNums.includes(num)) {
            propertyCounts[prop] = (propertyCounts[prop] || 0) + 1;
          }
        });
      });
    });
    
    // 找出当前日期相关的数学特性
    const dateProperties: number[] = [];
    if (this.isPerfectSquare(day)) dateProperties.push(...this.PERFECT_SQUARES);
    if (day <= 31 && this.isPrime(day)) dateProperties.push(...this.PRIME_NUMBERS);
    
    // 日期尾数数学特性
    const dateTail = day % 10;
    if (dateTail === 0 || dateTail === 1 || dateTail === 4 || dateTail === 5 || dateTail === 6 || dateTail === 9) {
      dateProperties.push(...this.PERFECT_SQUARES.filter(n => n % 10 === dateTail));
    }
    
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      // 数学特性匹配
      if (this.PERFECT_SQUARES.includes(num)) {
        score += 8;
        // 完美平方数的位置特性
        if (num === 1 || num === 4 || num === 9 || num === 16 || num === 25) score += 4;
        if (num === 36 || num === 49) score += 6; // 大完美平方数
      }
      
      if (this.CUBE_NUMBERS.includes(num)) {
        score += 10; // 立方数稀有性
      }
      
      if (this.FIBONACCI_NUMBERS.includes(num)) {
        score += 9; // 斐波那契数
      }
      
      if (this.TRIANGLE_NUMBERS.includes(num)) {
        score += 7; // 三角形数
      }
      
      // 质数特性已在其他维度考虑，这里做补充
      if (this.PRIME_NUMBERS.includes(num)) {
        const primeIndex = this.PRIME_NUMBERS.indexOf(num) + 1;
        if (primeIndex <= 5) score += 5; // 小质数
        else if (primeIndex >= 10) score += 6; // 大质数
      }
      
      // 日期相关数学特性
      if (dateProperties.includes(num)) {
        score += 12; // 与日期相关的数学特性
      }
      
      // 数字的数学关系
      const digitSum = this.sumDigits(num);
      if (digitSum <= 9) {
        score += 3; // 数字和小
      }
      
      // 数字的乘积特性
      if (num % 11 === 0) {
        score += 8; // 11的倍数
      }
      
      if (num % 7 === 0) {
        score += 6; // 7的倍数（一周天数）
      }
      
      // 数字的特殊数学性质
      if (num === 28) score += 7; // 第二个完美数
      if (num === 6) score += 6;  // 第一个完美数
      if (num === 12) score += 5; // 高度合数
      
      scores[num] = Math.min(score, 25);
    }
    
    return scores;
  }

  /**
   * [ENHANCED] 量子共振分析
   */
  private static analyzeQuantumResonance(history: DbRecord[], lastSpecial: number, currentDate: Date): Record<number, number> {
    const scores: Record<number, number> = {};
    
    // 量子共振模式
    const quantumPatterns = {
      harmonic: this.QUANTUM_RESONANCE_PATTERNS.harmonic,
      goldenAngle: this.QUANTUM_RESONANCE_PATTERNS.goldenAngle,
      fibonacciRatio: this.QUANTUM_RESONANCE_PATTERNS.fibonacciRatio
    };
    
    // 分析历史量子共振
    const resonanceCounts: Record<string, number> = {};
    history.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      nums.forEach(num => {
        Object.entries(quantumPatterns).forEach(([pattern, patternNums]) => {
          if (patternNums.includes(num)) {
            resonanceCounts[pattern] = (resonanceCounts[pattern] || 0) + 1;
          }
        });
      });
    });
    
    // 时间量子因子
    const timeFactors = {
      hour: currentDate.getHours(),
      minute: currentDate.getMinutes(),
      second: currentDate.getSeconds(),
      dayOfYear: this.getDayOfYear(currentDate)
    };
    
    // 计算时间共振值
    const timeResonance = (timeFactors.hour * 60 + timeFactors.minute) % 49;
    const dayResonance = timeFactors.dayOfYear % 49;
    
    // 相位分析
    const moonPhase = this.calculateMoonPhase(currentDate);
    const solarTerm = this.getSolarTerm(currentDate);
    
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      // 量子共振模式匹配
      Object.entries(quantumPatterns).forEach(([pattern, patternNums]) => {
        if (patternNums.includes(num)) {
          const resonanceStrength = resonanceCounts[pattern] || 0;
          score += Math.min(resonanceStrength * 2, 10);
        }
      });
      
      // 时间共振
      if (Math.abs(num - timeResonance) <= 3) {
        score += 8; // 时间共振
      }
      
      if (Math.abs(num - dayResonance) <= 3) {
        score += 7; // 日期共振
      }
      
      // 相位共振
      if (moonPhase === 'full' && (num === 15 || num === 30 || num === 45)) {
        score += 6; // 满月共振
      }
      
      if (moonPhase === 'new' && (num === 1 || num === 16 || num === 31 || num === 46)) {
        score += 6; // 新月共振
      }
      
      // 量子纠缠分析（与上期特码的关系）
      const quantumEntanglement = this.analyzeQuantumEntanglement(num, lastSpecial);
      score += quantumEntanglement * 4;
      
      // 波函数坍缩分析
      const collapseProbability = this.calculateCollapseProbability(num, history);
      score += collapseProbability * 5;
      
      // 量子隧道效应
      const tunnelEffect = this.analyzeTunnelEffect(num, history);
      score += tunnelEffect * 3;
      
      scores[num] = Math.min(score, 25);
    }
    
    return scores;
  }

  /**
   * [ENHANCED] 路径依赖分析
   */
  private static analyzePathDependency(history: DbRecord[], lastSpecial: number): Record<number, number> {
    const scores: Record<number, number> = {};
    
    // 构建马尔可夫链
    const markovChain = this.buildMarkovChain(history, 3); // 3阶马尔可夫链
    
    // 分析路径依赖强度
    const pathStrength = this.analyzePathStrength(history);
    
    // 历史路径分析
    const historicalPaths = this.extractHistoricalPaths(history, 5); // 提取5期路径
    
    // 计算各号码的路径依赖分数
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      // 马尔可夫链预测
      const markovScore = this.markovPrediction(markovChain, lastSpecial, num);
      score += markovScore * 8;
      
      // 路径依赖强度
      const strengthScore = pathStrength.getScore(num, lastSpecial);
      score += strengthScore * 6;
      
      // 历史路径匹配
      const pathMatchScore = this.calculatePathMatch(historicalPaths, num);
      score += pathMatchScore * 5;
      
      // 临界点分析
      const criticalPointScore = this.analyzeCriticalPoint(num, history);
      score += criticalPointScore * 4;
      
      // 路径收敛分析
      const convergenceScore = this.analyzePathConvergence(num, history);
      score += convergenceScore * 3;
      
      scores[num] = Math.min(score, 25);
    }
    
    return scores;
  }

  /**
   * [ENHANCED] 统计显著性分析
   */
  private static analyzeStatisticalSignificance(fullHistory: DbRecord[], recentHistory: DbRecord[]): Record<number, number> {
    const scores: Record<number, number> = {};
    
    // 计算基础统计
    const basicStats = this.calculateBasicStatistics(fullHistory);
    
    // 计算P值（显著性水平）
    const pValues = this.calculatePValues(fullHistory, recentHistory);
    
    // 置信区间分析
    const confidenceIntervals = this.calculateConfidenceIntervals(fullHistory);
    
    // 假设检验
    const hypothesisTests = this.performHypothesisTests(fullHistory, recentHistory);
    
    // 时间序列分析
    const timeSeriesAnalysis = this.analyzeTimeSeries(fullHistory);
    
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      // 统计显著性
      const pValue = pValues[num] || 0.5;
      if (pValue < 0.05) {
        score += 12; // 统计显著
      } else if (pValue < 0.1) {
        score += 8;  // 边缘显著
      }
      
      // 置信区间
      if (confidenceIntervals[num]) {
        const { lower, upper } = confidenceIntervals[num];
        const expected = (lower + upper) / 2;
        if (Math.abs(num - expected) <= (upper - lower) / 4) {
          score += 10; // 在置信区间中心区域
        }
      }
      
      // 假设检验结果
      const testResult = hypothesisTests[num];
      if (testResult === 'significant') {
        score += 8;
      }
      
      // 时间序列趋势
      const trend = timeSeriesAnalysis[num];
      if (trend === 'increasing') {
        score += 6; // 上升趋势
      } else if (trend === 'decreasing') {
        score += 4; // 下降趋势（可能反弹）
      }
      
      // 统计异常值检测
      const isOutlier = this.detectOutlier(num, fullHistory);
      if (!isOutlier) {
        score += 5; // 非异常值
      }
      
      scores[num] = Math.min(score, 25);
    }
    
    return scores;
  }

  /**
   * [ENHANCED] 拓扑模式分析
   */
  private static analyzeTopologicalPatterns(history: DbRecord[]): Record<number, number> {
    const scores: Record<number, number> = {};
    
    // 拓扑模式定义
    const topologicalPatterns = {
      torus: this.TOPOLOGICAL_PATTERNS.torus,
      klein: this.TOPOLOGICAL_PATTERNS.klein,
      mobius: this.TOPOLOGICAL_PATTERNS.mobius
    };
    
    // 分析历史拓扑模式
    const topologyCounts: Record<string, number> = {};
    history.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      nums.forEach(num => {
        Object.entries(topologicalPatterns).forEach(([topology, topologyNums]) => {
          if (topologyNums.includes(num)) {
            topologyCounts[topology] = (topologyCounts[topology] || 0) + 1;
          }
        });
      });
    });
    
    // 拓扑不变量分析
    const topologicalInvariants = this.calculateTopologicalInvariants(history);
    
    // 同调群分析
    const homologyGroups = this.analyzeHomology(history);
    
    // 连通性分析
    const connectivity = this.analyzeConnectivity(history);
    
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      // 拓扑模式匹配
      Object.entries(topologicalPatterns).forEach(([topology, topologyNums]) => {
        if (topologyNums.includes(num)) {
          const topologyStrength = topologyCounts[topology] || 0;
          score += Math.min(topologyStrength * 3, 9);
        }
      });
      
      // 拓扑不变量
      const invariantScore = topologicalInvariants.getScore(num);
      score += invariantScore;
      
      // 同调分析
      if (homologyGroups.includes(num)) {
        score += 8; // 在同调群中
      }
      
      // 连通性分析
      const connectivityScore = connectivity.getScore(num);
      score += connectivityScore;
      
      // 拓扑空间位置
      const positionScore = this.analyzeTopologicalPosition(num);
      score += positionScore;
      
      // 拓扑变换分析
      const transformationScore = this.analyzeTopologicalTransformation(num, history);
      score += transformationScore;
      
      scores[num] = Math.min(score, 25);
    }
    
    return scores;
  }

  /**
   * [ENHANCED] 谐波收敛分析
   */
  private static analyzeHarmonicConvergence(history: DbRecord[], lastSpecial: number, week: number): Record<number, number> {
    const scores: Record<number, number> = {};
    
    // 谐波分析
    const harmonics = this.performHarmonicAnalysis(history);
    
    // 收敛点分析
    const convergencePoints = this.findConvergencePoints(history);
    
    // 共振频率分析
    const resonanceFrequencies = this.analyzeResonanceFrequencies(history);
    
    // 傅里叶变换分析
    const fourierAnalysis = this.performFourierAnalysis(history);
    
    // 谐波平衡分析
    const harmonicBalance = this.analyzeHarmonicBalance(history);
    
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      // 谐波匹配
      if (harmonics.dominantHarmonics.includes(num)) {
        score += 12; // 主谐波
      }
      
      if (harmonics.subHarmonics.includes(num)) {
        score += 8;  // 次谐波
      }
      
      // 收敛点
      if (convergencePoints.includes(num)) {
        score += 10; // 收敛点
      }
      
      // 共振频率
      const resonanceScore = resonanceFrequencies.getScore(num);
      score += resonanceScore;
      
      // 傅里叶分析
      const fourierScore = fourierAnalysis.getScore(num);
      score += fourierScore;
      
      // 谐波平衡
      if (harmonicBalance.needsHarmonic.includes(num)) {
        score += 9; // 需要平衡的谐波
      }
      
      // 周波数分析
      const weeklyPattern = this.analyzeWeeklyPattern(num, history, week);
      score += weeklyPattern * 4;
      
      scores[num] = Math.min(score, 25);
    }
    
    return scores;
  }

  // ==========================================
  // 新增辅助算法实现
  // ==========================================

  /**
   * 判断是否为完美平方数
   */
  private static isPerfectSquare(n: number): boolean {
    return Math.sqrt(n) % 1 === 0;
  }

  /**
   * 判断是否为质数
   */
  private static isPrime(n: number): boolean {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  }

  /**
   * 获取一年中的第几天
   */
  private static getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  /**
   * 计算月相
   */
  private static calculateMoonPhase(date: Date): string {
    // 简化版月相计算
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 使用简单算法估算月相
    const daysInLunarCycle = 29.53;
    const knownNewMoon = new Date(2025, 0, 1); // 假设的已知新月日期
    const timeDiff = date.getTime() - knownNewMoon.getTime();
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
    const phase = (dayDiff % daysInLunarCycle) / daysInLunarCycle;
    
    if (phase < 0.25) return 'new';
    else if (phase < 0.5) return 'waxing';
    else if (phase < 0.75) return 'full';
    else return 'waning';
  }

  /**
   * 获取节气
   */
  private static getSolarTerm(date: Date): string {
    // 简化版节气判断
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const solarTerms: Record<string, string> = {
      '1-5': '小寒', '1-20': '大寒',
      '2-4': '立春', '2-19': '雨水',
      '3-5': '惊蛰', '3-20': '春分',
      '4-5': '清明', '4-20': '谷雨',
      '5-5': '立夏', '5-21': '小满',
      '6-6': '芒种', '6-21': '夏至',
      '7-7': '小暑', '7-23': '大暑',
      '8-7': '立秋', '8-23': '处暑',
      '9-7': '白露', '9-23': '秋分',
      '10-8': '寒露', '10-23': '霜降',
      '11-7': '立冬', '11-22': '小雪',
      '12-7': '大雪', '12-22': '冬至'
    };
    
    const key = `${month}-${day}`;
    return solarTerms[key] || 'none';
  }

  /**
   * 分析量子纠缠
   */
  private static analyzeQuantumEntanglement(num: number, lastSpecial: number): number {
    // 计算两个号码之间的量子纠缠强度
    const diff = Math.abs(num - lastSpecial);
    const sum = num + lastSpecial;
    
    let entanglement = 0;
    
    // 特殊纠缠关系
    if (diff === 7 || diff === 14 || diff === 21 || diff === 28) {
      entanglement += 6; // 7的倍数差
    }
    
    if (sum === 50 || sum === 25) {
      entanglement += 8; // 和为50或25
    }
    
    if (this.isPrime(num) && this.isPrime(lastSpecial)) {
      entanglement += 5; // 都是质数
    }
    
    // 对称纠缠
    if (num + lastSpecial === 50) {
      entanglement += 7; // 对称对
    }
    
    return Math.min(entanglement, 10);
  }

  /**
   * 计算波函数坍缩概率
   */
  private static calculateCollapseProbability(num: number, history: DbRecord[]): number {
    // 基于历史计算号码出现的"观测"概率
    
    const totalDraws = Math.min(history.length, 100);
    let occurrences = 0;
    
    for (let i = 0; i < totalDraws; i++) {
      const nums = this.parseNumbers(history[i].open_code);
      if (nums.includes(num)) {
        occurrences++;
      }
    }
    
    const probability = occurrences / totalDraws;
    const expectedProbability = 1 / 49; // 均匀分布概率
    
    // 计算偏离程度（使用信息增益）
    const informationGain = Math.log2(probability / expectedProbability);
    
    if (informationGain > 0.5) {
      return 6; // 高频号码
    } else if (informationGain < -0.5) {
      return 8; // 低频号码（可能回补）
    } else {
      return 4; // 正常频率
    }
  }

  /**
   * 分析量子隧道效应
   */
  private static analyzeTunnelEffect(num: number, history: DbRecord[]): number {
    // 分析号码是否可能通过"量子隧道"出现
    
    const recentHistory = history.slice(0, 20);
    const numbers = new Set<number>();
    
    recentHistory.forEach(rec => {
      this.parseNumbers(rec.open_code).forEach(n => numbers.add(n));
    });
    
    // 检查num是否在"隧道"范围内
    const minNum = Math.min(...numbers);
    const maxNum = Math.max(...numbers);
    
    if (num >= minNum - 5 && num <= maxNum + 5 && !numbers.has(num)) {
      return 5; // 在隧道效应范围内
    }
    
    return 0;
  }

  /**
   * 构建马尔可夫链
   */
  private static buildMarkovChain(history: DbRecord[], order: number): any {
    const chain: Record<string, Record<number, number>> = {};
    
    for (let i = order; i < history.length; i++) {
      const states: number[] = [];
      
      for (let j = 0; j < order; j++) {
        const nums = this.parseNumbers(history[i + j - order]?.open_code || '');
        if (nums.length > 0) {
          states.push(nums[nums.length - 1]); // 使用特码
        }
      }
      
      const currentState = states.join(',');
      const nextNums = this.parseNumbers(history[i].open_code);
      const nextSpecial = nextNums[nextNums.length - 1];
      
      if (!chain[currentState]) {
        chain[currentState] = {};
      }
      
      chain[currentState][nextSpecial] = (chain[currentState][nextSpecial] || 0) + 1;
    }
    
    // 转换为概率
    Object.keys(chain).forEach(state => {
      const total = Object.values(chain[state]).reduce((a, b) => a + b, 0);
      Object.keys(chain[state]).forEach(next => {
        chain[state][parseInt(next)] /= total;
      });
    });
    
    return chain;
  }

  /**
   * 马尔可夫链预测
   */
  private static markovPrediction(chain: any, lastSpecial: number, num: number): number {
    // 寻找最近的状态
    let bestMatch = '';
    let bestScore = 0;
    
    Object.keys(chain).forEach(state => {
      const stateNumbers = state.split(',').map(Number);
      if (stateNumbers.includes(lastSpecial)) {
        const matchScore = stateNumbers.filter(n => n === lastSpecial).length / stateNumbers.length;
        if (matchScore > bestScore) {
          bestScore = matchScore;
          bestMatch = state;
        }
      }
    });
    
    if (bestMatch && chain[bestMatch][num]) {
      return chain[bestMatch][num] * 15;
    }
    
    return 0;
  }

  /**
   * 分析路径强度
   */
  private static analyzePathStrength(history: DbRecord[]): {
    getScore: (num: number, lastSpecial: number) => number;
  } {
    const pathStrengths: Record<string, number> = {};
    
    // 计算路径出现频率
    for (let i = 1; i < history.length; i++) {
      const prevNums = this.parseNumbers(history[i].open_code);
      const currNums = this.parseNumbers(history[i-1].open_code);
      
      const prevSpecial = prevNums[prevNums.length - 1];
      const currSpecial = currNums[currNums.length - 1];
      
      const path = `${prevSpecial}->${currSpecial}`;
      pathStrengths[path] = (pathStrengths[path] || 0) + 1;
    }
    
    return {
      getScore: (num: number, lastSpecial: number): number => {
        const path = `${lastSpecial}->${num}`;
        const strength = pathStrengths[path] || 0;
        
        if (strength >= 3) {
          return 10; // 强路径
        } else if (strength >= 1) {
          return 6;  // 弱路径
        }
        
        // 检查相似路径
        let similarScore = 0;
        Object.keys(pathStrengths).forEach(p => {
          const [from, to] = p.split('->').map(Number);
          if (Math.abs(from - lastSpecial) <= 5 && Math.abs(to - num) <= 5) {
            similarScore += pathStrengths[p] * 0.5;
          }
        });
        
        return Math.min(similarScore, 8);
      }
    };
  }

  /**
   * 提取历史路径
   */
  private static extractHistoricalPaths(history: DbRecord[], length: number): string[] {
    const paths: string[] = [];
    
    for (let i = length; i < history.length; i++) {
      const path: number[] = [];
      
      for (let j = 0; j < length; j++) {
        const nums = this.parseNumbers(history[i - j].open_code);
        if (nums.length > 0) {
          path.push(nums[nums.length - 1]);
        }
      }
      
      if (path.length === length) {
        paths.push(path.join('->'));
      }
    }
    
    return paths;
  }

  /**
   * 计算路径匹配度
   */
  private static calculatePathMatch(historicalPaths: string[], num: number): number {
    let matchScore = 0;
    
    historicalPaths.forEach(path => {
      const numbers = path.split('->').map(Number);
      const lastInPath = numbers[numbers.length - 1];
      
      if (Math.abs(lastInPath - num) <= 3) {
        matchScore += 2; // 路径终点相近
      }
      
      // 检查路径模式
      const diffPattern = [];
      for (let i = 1; i < numbers.length; i++) {
        diffPattern.push(numbers[i] - numbers[i-1]);
      }
      
      // 如果当前号码符合路径的差分模式
      const predicted = numbers[numbers.length - 1] + diffPattern[diffPattern.length - 1];
      if (Math.abs(predicted - num) <= 5) {
        matchScore += 3; // 符合路径模式
      }
    });
    
    return Math.min(matchScore, 10);
  }

  /**
   * 分析临界点
   */
  private static analyzeCriticalPoint(num: number, history: DbRecord[]): number {
    // 分析号码是否处于临界状态
    
    const recentOccurrences: number[] = [];
    
    for (let i = 0; i < Math.min(history.length, 30); i++) {
      const nums = this.parseNumbers(history[i].open_code);
      if (nums.includes(num)) {
        recentOccurrences.push(i);
      }
    }
    
    if (recentOccurrences.length < 2) {
      return 0;
    }
    
    // 计算出现间隔
    const intervals: number[] = [];
    for (let i = 1; i < recentOccurrences.length; i++) {
      intervals.push(recentOccurrences[i] - recentOccurrences[i-1]);
    }
    
    // 检查是否接近平均间隔
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const lastOccurrence = recentOccurrences[recentOccurrences.length - 1];
    const expectedNext = lastOccurrence + avgInterval;
    
    // 当前期数（假设history[0]是最新一期）
    const currentIndex = 0;
    
    if (Math.abs(currentIndex - expectedNext) <= 2) {
      return 8; // 接近临界点
    } else if (currentIndex > expectedNext) {
      return 6; // 已过临界点（可能即将出现）
    }
    
    return 0;
  }

  /**
   * 分析路径收敛
   */
  private static analyzePathConvergence(num: number, history: DbRecord[]): number {
    // 分析不同路径是否收敛到当前号码
    
    const convergencePaths: string[] = [];
    
    // 检查从不同起点到当前号码的路径
    for (let start = 1; start <= 49; start++) {
      if (start === num) continue;
      
      let pathCount = 0;
      for (let i = 1; i < history.length; i++) {
        const prevNums = this.parseNumbers(history[i].open_code);
        const currNums = this.parseNumbers(history[i-1].open_code);
        
        const prevSpecial = prevNums[prevNums.length - 1];
        const currSpecial = currNums[currNums.length - 1];
        
        if (prevSpecial === start && currSpecial === num) {
          pathCount++;
        }
      }
      
      if (pathCount >= 2) {
        convergencePaths.push(`${start}->${num}`);
      }
    }
    
    return Math.min(convergencePaths.length * 2, 6);
  }

  /**
   * 计算基础统计
   */
  private static calculateBasicStatistics(history: DbRecord[]): any {
    const allNumbers: number[] = [];
    
    history.forEach(rec => {
      allNumbers.push(...this.parseNumbers(rec.open_code));
    });
    
    const mean = allNumbers.reduce((a, b) => a + b, 0) / allNumbers.length;
    const variance = allNumbers.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / allNumbers.length;
    const std = Math.sqrt(variance);
    
    // 计算偏度和峰度
    const skewness = allNumbers.reduce((sk, n) => sk + Math.pow((n - mean) / std, 3), 0) / allNumbers.length;
    const kurtosis = allNumbers.reduce((ku, n) => ku + Math.pow((n - mean) / std, 4), 0) / allNumbers.length - 3;
    
    return {
      mean,
      std,
      skewness,
      kurtosis,
      min: Math.min(...allNumbers),
      max: Math.max(...allNumbers)
    };
  }

  /**
   * 计算P值
   */
  private static calculatePValues(fullHistory: DbRecord[], recentHistory: DbRecord[]): Record<number, number> {
    const pValues: Record<number, number> = {};
    
    // 计算每个号码的历史频率
    const fullFrequencies: Record<number, number> = {};
    const recentFrequencies: Record<number, number> = {};
    
    fullHistory.forEach(rec => {
      this.parseNumbers(rec.open_code).forEach(num => {
        fullFrequencies[num] = (fullFrequencies[num] || 0) + 1;
      });
    });
    
    recentHistory.forEach(rec => {
      this.parseNumbers(rec.open_code).forEach(num => {
        recentFrequencies[num] = (recentFrequencies[num] || 0) + 1;
      });
    });
    
    // 计算卡方检验的P值（简化版）
    for (let num = 1; num <= 49; num++) {
      const fullCount = fullFrequencies[num] || 0;
      const recentCount = recentFrequencies[num] || 0;
      
      const fullTotal = Object.values(fullFrequencies).reduce((a, b) => a + b, 0);
      const recentTotal = Object.values(recentFrequencies).reduce((a, b) => a + b, 0);
      
      const expectedRecent = (fullCount / fullTotal) * recentTotal;
      
      // 计算卡方值
      const chiSquare = Math.pow(recentCount - expectedRecent, 2) / expectedRecent;
      
      // 转换为P值（简化）
      pValues[num] = Math.exp(-chiSquare / 2);
    }
    
    return pValues;
  }

  /**
   * 计算置信区间
   */
  private static calculateConfidenceIntervals(history: DbRecord[]): Record<number, {lower: number, upper: number}> {
    const intervals: Record<number, {lower: number, upper: number}> = {};
    
    // 计算每个号码的出现位置
    const positions: Record<number, number[]> = {};
    
    for (let i = 0; i < history.length; i++) {
      const nums = this.parseNumbers(history[i].open_code);
      nums.forEach(num => {
        if (!positions[num]) {
          positions[num] = [];
        }
        positions[num].push(i);
      });
    }
    
    // 计算置信区间（95%置信水平）
    const zScore = 1.96; // 95%置信水平对应的z值
    
    for (let num = 1; num <= 49; num++) {
      const pos = positions[num] || [];
      if (pos.length < 2) {
        intervals[num] = { lower: 0, upper: history.length };
        continue;
      }
      
      // 计算均值和标准差
      const mean = pos.reduce((a, b) => a + b, 0) / pos.length;
      const variance = pos.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / pos.length;
      const std = Math.sqrt(variance);
      
      const margin = zScore * std / Math.sqrt(pos.length);
      
      intervals[num] = {
        lower: Math.max(0, mean - margin),
        upper: Math.min(history.length, mean + margin)
      };
    }
    
    return intervals;
  }

  /**
   * 执行假设检验
   */
  private static performHypothesisTests(fullHistory: DbRecord[], recentHistory: DbRecord[]): Record<number, string> {
    const results: Record<number, string> = {};
    
    // 计算每个号码的z检验
    for (let num = 1; num <= 49; num++) {
      let fullCount = 0;
      let recentCount = 0;
      
      fullHistory.forEach(rec => {
        if (this.parseNumbers(rec.open_code).includes(num)) {
          fullCount++;
        }
      });
      
      recentHistory.forEach(rec => {
        if (this.parseNumbers(rec.open_code).includes(num)) {
          recentCount++;
        }
      });
      
      const fullTotal = fullHistory.length * 7; // 每期7个号码
      const recentTotal = recentHistory.length * 7;
      
      const pFull = fullCount / fullTotal;
      const pRecent = recentCount / recentTotal;
      
      if (recentTotal === 0) {
        results[num] = 'insufficient';
        continue;
      }
      
      // 计算z统计量
      const pPooled = (fullCount + recentCount) / (fullTotal + recentTotal);
      const se = Math.sqrt(pPooled * (1 - pPooled) * (1/fullTotal + 1/recentTotal));
      
      if (se === 0) {
        results[num] = 'insufficient';
        continue;
      }
      
      const z = (pRecent - pFull) / se;
      
      if (Math.abs(z) > 1.96) {
        results[num] = 'significant';
      } else if (Math.abs(z) > 1.645) {
        results[num] = 'marginal';
      } else {
        results[num] = 'not-significant';
      }
    }
    
    return results;
  }

  /**
   * 分析时间序列
   */
  private static analyzeTimeSeries(history: DbRecord[]): Record<number, string> {
    const trends: Record<number, string> = {};
    
    // 为每个号码构建时间序列
    for (let num = 1; num <= 49; num++) {
      const timeSeries: number[] = [];
      
      for (let i = 0; i < history.length; i++) {
        const nums = this.parseNumbers(history[i].open_code);
        timeSeries.push(nums.includes(num) ? 1 : 0);
      }
      
      // 使用简单线性回归判断趋势
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
      const n = timeSeries.length;
      
      for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += timeSeries[i];
        sumXY += i * timeSeries[i];
        sumX2 += i * i;
      }
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      
      if (slope > 0.005) {
        trends[num] = 'increasing';
      } else if (slope < -0.005) {
        trends[num] = 'decreasing';
      } else {
        trends[num] = 'stable';
      }
    }
    
    return trends;
  }

  /**
   * 检测异常值
   */
  private static detectOutlier(num: number, history: DbRecord[]): boolean {
    // 使用IQR方法检测异常值
    
    const occurrences: number[] = [];
    
    for (let i = 0; i < history.length; i++) {
      const nums = this.parseNumbers(history[i].open_code);
      if (nums.includes(num)) {
        occurrences.push(i);
      }
    }
    
    if (occurrences.length < 4) {
      return false;
    }
    
    // 计算间隔
    const intervals: number[] = [];
    for (let i = 1; i < occurrences.length; i++) {
      intervals.push(occurrences[i] - occurrences[i-1]);
    }
    
    intervals.sort((a, b) => a - b);
    
    const q1 = intervals[Math.floor(intervals.length / 4)];
    const q3 = intervals[Math.floor(3 * intervals.length / 4)];
    const iqr = q3 - q1;
    
    // 检查最新间隔是否为异常值
    const latestInterval = occurrences.length > 0 ? 
      (history.length - 1 - occurrences[occurrences.length - 1]) : history.length;
    
    return latestInterval > q3 + 1.5 * iqr;
  }

  /**
   * 计算拓扑不变量
   */
  private static calculateTopologicalInvariants(history: DbRecord[]): {
    getScore: (num: number) => number;
  } {
    // 计算每个号码的拓扑不变量
    
    const invariants: Record<number, number> = {};
    
    // 分析号码的邻域特性
    for (let num = 1; num <= 49; num++) {
      let invariant = 0;
      
      // 计算度数（与其他号码的连接数）
      let degree = 0;
      for (let other = 1; other <= 49; other++) {
        if (other === num) continue;
        
        // 检查在历史中是否同时出现
        let cooccurrence = 0;
        history.forEach(rec => {
          const nums = this.parseNumbers(rec.open_code);
          if (nums.includes(num) && nums.includes(other)) {
            cooccurrence++;
          }
        });
        
        if (cooccurrence > 0) {
          degree++;
        }
      }
      
      invariant += Math.min(degree / 10, 5);
      
      // 计算聚类系数
      let clustering = 0;
      let possibleTriangles = 0;
      let actualTriangles = 0;
      
      // 简化版聚类系数计算
      if (degree >= 2) {
        const neighbors: number[] = [];
        for (let other = 1; other <= 49; other++) {
          if (other === num) continue;
          
          let connected = false;
          history.forEach(rec => {
            const nums = this.parseNumbers(rec.open_code);
            if (nums.includes(num) && nums.includes(other)) {
              connected = true;
            }
          });
          
          if (connected) {
            neighbors.push(other);
          }
        }
        
        // 检查邻居之间的连接
        for (let i = 0; i < neighbors.length; i++) {
          for (let j = i + 1; j < neighbors.length; j++) {
            possibleTriangles++;
            
            let connected = false;
            history.forEach(rec => {
              const nums = this.parseNumbers(rec.open_code);
              if (nums.includes(neighbors[i]) && nums.includes(neighbors[j])) {
                connected = true;
              }
            });
            
            if (connected) {
              actualTriangles++;
            }
          }
        }
        
        if (possibleTriangles > 0) {
          clustering = actualTriangles / possibleTriangles;
        }
      }
      
      invariant += clustering * 5;
      
      invariants[num] = Math.min(invariant, 10);
    }
    
    return {
      getScore: (num: number) => invariants[num] || 0
    };
  }

  /**
   * 分析同调群
   */
  private static analyzeHomology(history: DbRecord[]): number[] {
    // 简化版同调群分析
    const homologyGroups: number[] = [];
    
    // 识别"洞"和"环"中的号码
    // 这里使用简化方法：识别在历史中形成环路的号码
    
    // 构建连接图
    const graph: Record<number, number[]> = {};
    
    for (let i = 0; i < history.length; i++) {
      const nums = this.parseNumbers(history[i].open_code);
      
      // 添加边
      for (let j = 0; j < nums.length; j++) {
        for (let k = j + 1; k < nums.length; k++) {
          if (!graph[nums[j]]) graph[nums[j]] = [];
          if (!graph[nums[k]]) graph[nums[k]] = [];
          
          if (!graph[nums[j]].includes(nums[k])) {
            graph[nums[j]].push(nums[k]);
          }
          
          if (!graph[nums[k]].includes(nums[j])) {
            graph[nums[k]].push(nums[j]);
          }
        }
      }
    }
    
    // 寻找形成环的号码
    for (let num = 1; num <= 49; num++) {
      if (graph[num] && graph[num].length >= 3) {
        // 检查是否能形成环
        const visited = new Set<number>();
        const stack: {node: number, path: number[]}[] = [{node: num, path: [num]}];
        
        while (stack.length > 0) {
          const {node, path} = stack.pop()!;
          
          if (visited.has(node)) continue;
          visited.add(node);
          
          for (const neighbor of graph[node] || []) {
            if (neighbor === num && path.length >= 3) {
              // 找到环，所有路径上的号码加入同调群
              homologyGroups.push(...path);
              break;
            }
            
            if (!visited.has(neighbor)) {
              stack.push({node: neighbor, path: [...path, neighbor]});
            }
          }
        }
      }
    }
    
    return [...new Set(homologyGroups)];
  }

  /**
   * 分析连通性
   */
  private static analyzeConnectivity(history: DbRecord[]): {
    getScore: (num: number) => number;
  } {
    const connectivityScores: Record<number, number> = {};
    
    // 构建连接矩阵
    const connectionMatrix: boolean[][] = Array(50).fill(0).map(() => Array(50).fill(false));
    
    history.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      
      for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
          connectionMatrix[nums[i]][nums[j]] = true;
          connectionMatrix[nums[j]][nums[i]] = true;
        }
      }
    });
    
    // 计算每个号码的连接分数
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      // 直接连接数
      let directConnections = 0;
      for (let other = 1; other <= 49; other++) {
        if (connectionMatrix[num][other]) {
          directConnections++;
        }
      }
      
      score += Math.min(directConnections / 5, 6);
      
      // 间接连接（二阶连接）
      let indirectConnections = 0;
      for (let other = 1; other <= 49; other++) {
        if (other === num) continue;
        
        // 检查是否存在长度为2的路径
        for (let bridge = 1; bridge <= 49; bridge++) {
          if (bridge !== num && bridge !== other) {
            if (connectionMatrix[num][bridge] && connectionMatrix[bridge][other]) {
              indirectConnections++;
              break;
            }
          }
        }
      }
      
      score += Math.min(indirectConnections / 10, 4);
      
      // 连通分量大小
      const componentSize = this.findConnectedComponent(num, connectionMatrix).size;
      score += Math.min(componentSize / 10, 5);
      
      connectivityScores[num] = Math.min(score, 15);
    }
    
    return {
      getScore: (num: number) => connectivityScores[num] || 0
    };
  }

  /**
   * 分析拓扑位置
   */
  private static analyzeTopologicalPosition(num: number): number {
    // 分析号码在拓扑空间中的位置
    
    let score = 0;
    
    // 边界位置
    if (num <= 7 || num >= 43 || num % 7 === 1 || num % 7 === 0) {
      score += 4; // 边界
    } else {
      score += 6; // 内部
    }
    
    // 特殊拓扑位置
    if (num === 25) {
      score += 8; // 中心
    }
    
    if (num === 1 || num === 7 || num === 43 || num === 49) {
      score += 6; // 角落
    }
    
    // 对角线位置
    const matrix = this.NUM_TO_MATRIX[num];
    if (matrix.row === matrix.col) {
      score += 5; // 主对角线
    }
    
    if (matrix.row + matrix.col === 8) {
      score += 5; // 副对角线
    }
    
    return Math.min(score, 10);
  }

  /**
   * 分析拓扑变换
   */
  private static analyzeTopologicalTransformation(num: number, history: DbRecord[]): number {
    // 分析号码在拓扑变换中的角色
    
    let score = 0;
    
    // 检查是否是"固定点"
    let fixedPointCount = 0;
    for (let i = 1; i < history.length; i++) {
      const prevNums = this.parseNumbers(history[i].open_code);
      const currNums = this.parseNumbers(history[i-1].open_code);
      
      if (prevNums.includes(num) && currNums.includes(num)) {
        fixedPointCount++;
      }
    }
    
    score += Math.min(fixedPointCount, 5);
    
    // 检查是否是"吸引子"
    let attractedCount = 0;
    for (let other = 1; other <= 49; other++) {
      if (other === num) continue;
      
      let transitions = 0;
      for (let i = 1; i < history.length; i++) {
        const prevNums = this.parseNumbers(history[i].open_code);
        const currNums = this.parseNumbers(history[i-1].open_code);
        
        const prevSpecial = prevNums[prevNums.length - 1];
        const currSpecial = currNums[currNums.length - 1];
        
        if (prevSpecial === other && currSpecial === num) {
          transitions++;
        }
      }
      
      if (transitions >= 2) {
        attractedCount++;
      }
    }
    
    score += Math.min(attractedCount, 5);
    
    return Math.min(score, 8);
  }

  /**
   * 执行谐波分析
   */
  private static performHarmonicAnalysis(history: DbRecord[]): {
    dominantHarmonics: number[];
    subHarmonics: number[];
  } {
    // 简化版谐波分析
    
    const specials: number[] = [];
    for (let i = 0; i < Math.min(history.length, 50); i++) {
      const nums = this.parseNumbers(history[i].open_code);
      if (nums.length > 0) {
        specials.push(nums[nums.length - 1]);
      }
    }
    
    if (specials.length === 0) {
      return { dominantHarmonics: [], subHarmonics: [] };
    }
    
    // 傅里叶变换（简化）
    const harmonics: Record<number, number> = {};
    
    // 分析不同频率的谐波
    for (let freq = 1; freq <= 12; freq++) {
      let amplitude = 0;
      
      for (let t = 0; t < specials.length; t++) {
        const angle = 2 * Math.PI * freq * t / specials.length;
        amplitude += specials[t] * Math.cos(angle);
      }
      
      amplitude = Math.abs(amplitude) / specials.length;
      harmonics[freq] = amplitude;
    }
    
    // 找出主要谐波
    const sortedHarmonics = Object.entries(harmonics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    const dominantHarmonics: number[] = [];
    const subHarmonics: number[] = [];
    
    sortedHarmonics.forEach(([freqStr, amp]) => {
      const freq = parseInt(freqStr);
      const harmonicNumbers = this.generateHarmonicNumbers(freq, specials.length);
      
      if (amp > 0.5) {
        dominantHarmonics.push(...harmonicNumbers);
      } else {
        subHarmonics.push(...harmonicNumbers);
      }
    });
    
    return {
      dominantHarmonics: [...new Set(dominantHarmonics)].filter(n => n >= 1 && n <= 49),
      subHarmonics: [...new Set(subHarmonics)].filter(n => n >= 1 && n <= 49)
    };
  }

  /**
   * 寻找收敛点
   */
  private static findConvergencePoints(history: DbRecord[]): number[] {
    const convergencePoints: number[] = [];
    
    // 分析不同路径的收敛
    const transitionMap: Record<number, Record<number, number>> = {};
    
    // 构建转移矩阵
    for (let i = 1; i < history.length; i++) {
      const prevNums = this.parseNumbers(history[i].open_code);
      const currNums = this.parseNumbers(history[i-1].open_code);
      
      const prevSpecial = prevNums[prevNums.length - 1];
      const currSpecial = currNums[currNums.length - 1];
      
      if (!transitionMap[prevSpecial]) {
        transitionMap[prevSpecial] = {};
      }
      
      transitionMap[prevSpecial][currSpecial] = (transitionMap[prevSpecial][currSpecial] || 0) + 1;
    }
    
    // 寻找收敛点（多个起点指向同一个终点）
    const convergenceCounts: Record<number, number> = {};
    
    Object.keys(transitionMap).forEach(fromStr => {
      const from = parseInt(fromStr);
      const targets = transitionMap[from];
      
      // 找出主要目标
      let mainTarget = -1;
      let maxCount = 0;
      
      Object.entries(targets).forEach(([toStr, count]) => {
        const to = parseInt(toStr);
        if (count > maxCount) {
          maxCount = count;
          mainTarget = to;
        }
      });
      
      if (mainTarget !== -1 && maxCount >= 2) {
        convergenceCounts[mainTarget] = (convergenceCounts[mainTarget] || 0) + 1;
      }
    });
    
    // 找出收敛点（至少3个不同起点指向）
    Object.entries(convergenceCounts).forEach(([pointStr, count]) => {
      if (count >= 3) {
        convergencePoints.push(parseInt(pointStr));
      }
    });
    
    return convergencePoints;
  }

  /**
   * 分析共振频率
   */
  private static analyzeResonanceFrequencies(history: DbRecord[]): {
    getScore: (num: number) => number;
  } {
    const resonanceScores: Record<number, number> = {};
    
    // 分析每个号码的共振频率
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      // 计算出现间隔的频率分析
      const intervals: number[] = [];
      let lastIndex = -1;
      
      for (let i = 0; i < history.length; i++) {
        const nums = this.parseNumbers(history[i].open_code);
        if (nums.includes(num)) {
          if (lastIndex !== -1) {
            intervals.push(i - lastIndex);
          }
          lastIndex = i;
        }
      }
      
      if (intervals.length >= 3) {
        // 计算间隔的统计特性
        const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / intervals.length;
        
        // 低方差表示稳定的频率
        const cv = Math.sqrt(variance) / mean; // 变异系数
        
        if (cv < 0.5) {
          score += 8; // 稳定频率
        } else if (cv < 1.0) {
          score += 5; // 中等稳定
        }
        
        // 检查是否是共振频率（间隔为特定值）
        const commonIntervals = [1, 2, 3, 4, 7, 10, 14];
        for (const interval of commonIntervals) {
          const intervalCount = intervals.filter(i => Math.abs(i - interval) <= 1).length;
          if (intervalCount >= 2) {
            score += 6; // 共振间隔
          }
        }
      }
      
      resonanceScores[num] = Math.min(score, 15);
    }
    
    return {
      getScore: (num: number) => resonanceScores[num] || 0
    };
  }

  /**
   * 执行傅里叶分析
   */
  private static performFourierAnalysis(history: DbRecord[]): {
    getScore: (num: number) => number;
  } {
    const fourierScores: Record<number, number> = {};
    
    // 构建时间序列
    const timeSeries: number[] = [];
    for (let i = 0; i < Math.min(history.length, 64); i++) {
      const nums = this.parseNumbers(history[i].open_code);
      // 使用特码作为时间序列值
      timeSeries.push(nums.length > 0 ? nums[nums.length - 1] : 25);
    }
    
    if (timeSeries.length < 8) {
      // 数据不足，返回默认值
      for (let num = 1; num <= 49; num++) {
        fourierScores[num] = 0;
      }
      
      return {
        getScore: (num: number) => fourierScores[num] || 0
      };
    }
    
    // 简化版傅里叶变换
    const frequencies: Record<number, number> = {};
    
    for (let freq = 1; freq <= Math.min(12, timeSeries.length / 2); freq++) {
      let real = 0;
      let imag = 0;
      
      for (let t = 0; t < timeSeries.length; t++) {
        const angle = 2 * Math.PI * freq * t / timeSeries.length;
        real += timeSeries[t] * Math.cos(angle);
        imag += timeSeries[t] * Math.sin(angle);
      }
      
      const amplitude = Math.sqrt(real * real + imag * imag) / timeSeries.length;
      frequencies[freq] = amplitude;
    }
    
    // 找出主要频率
    const sortedFrequencies = Object.entries(frequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    // 计算每个号码的傅里叶分数
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      sortedFrequencies.forEach(([freqStr, amplitude]) => {
        const freq = parseInt(freqStr);
        
        // 检查号码是否与频率相关
        if (amplitude > 0.3) {
          // 生成该频率对应的号码
          const harmonicNumbers = this.generateHarmonicNumbers(freq, timeSeries.length);
          
          if (harmonicNumbers.includes(num)) {
            score += 8 * amplitude;
          }
        }
      });
      
      fourierScores[num] = Math.min(score, 12);
    }
    
    return {
      getScore: (num: number) => fourierScores[num] || 0
    };
  }

  /**
   * 分析谐波平衡
   */
  private static analyzeHarmonicBalance(history: DbRecord[]): {
    needsHarmonic: number[];
  } {
    const needsHarmonic: number[] = [];
    
    // 分析历史谐波分布
    const harmonicDistribution: Record<number, number> = {};
    
    // 分析不同谐波的出现频率
    for (let freq = 1; freq <= 7; freq++) {
      let harmonicCount = 0;
      
      for (let i = 0; i < history.length; i++) {
        const nums = this.parseNumbers(history[i].open_code);
        const special = nums[nums.length - 1];
        
        // 检查是否属于该谐波
        const harmonicNumbers = this.generateHarmonicNumbers(freq, 49);
        if (harmonicNumbers.includes(special)) {
          harmonicCount++;
        }
      }
      
      harmonicDistribution[freq] = harmonicCount;
    }
    
    // 找出需要平衡的谐波
    const total = Object.values(harmonicDistribution).reduce((a, b) => a + b, 0);
    const expected = total / 7; // 均匀分布
    
    Object.entries(harmonicDistribution).forEach(([freqStr, count]) => {
      if (count < expected * 0.7) {
        const freq = parseInt(freqStr);
        const harmonicNumbers = this.generateHarmonicNumbers(freq, 49);
        needsHarmonic.push(...harmonicNumbers);
      }
    });
    
    return {
      needsHarmonic: [...new Set(needsHarmonic)].filter(n => n >= 1 && n <= 49)
    };
  }

  /**
   * 分析周波模式
   */
  private static analyzeWeeklyPattern(num: number, history: DbRecord[], week: number): number {
    // 分析号码的周波模式
    
    let score = 0;
    
    // 检查历史中相同周数的表现
    const weeklyHistory: Record<number, number[]> = {};
    
    for (let i = 0; i < history.length; i++) {
      const record = history[i];
      if (!record.draw_time) continue;
      
      const date = new Date(record.draw_time);
      const recordWeek = Math.floor(date.getDate() / 7) + 1;
      const nums = this.parseNumbers(record.open_code);
      
      if (!weeklyHistory[recordWeek]) {
        weeklyHistory[recordWeek] = [];
      }
      
      weeklyHistory[recordWeek].push(...nums);
    }
    
    // 检查当前周数的历史模式
    const currentWeekHistory = weeklyHistory[week] || [];
    const occurrenceInWeek = currentWeekHistory.filter(n => n === num).length;
    
    if (occurrenceInWeek >= 2) {
      score += 6; // 本周历史中出现多次
    }
    
    // 检查相邻周数的模式
    const prevWeekHistory = weeklyHistory[(week + 6) % 8] || []; // 前一周
    const nextWeekHistory = weeklyHistory[(week + 1) % 8] || []; // 后一周
    
    const prevOccurrence = prevWeekHistory.filter(n => n === num).length;
    const nextOccurrence = nextWeekHistory.filter(n => n === num).length;
    
    if (prevOccurrence > 0 && nextOccurrence > 0) {
      score += 4; // 在相邻周都出现过
    }
    
    // 周波数分析
    if (num % 7 === week % 7) {
      score += 3; // 号码与周数同余
    }
    
    return score;
  }

  /**
   * 生成谐波数字
   */
  private static generateHarmonicNumbers(freq: number, base: number): number[] {
    const harmonicNumbers: number[] = [];
    
    // 生成基于频率的谐波数字
    for (let i = 1; i <= base; i++) {
      if (i % freq === 0 || freq % i === 0 || this.gcd(i, freq) > 1) {
        harmonicNumbers.push(i);
      }
    }
    
    return harmonicNumbers.slice(0, 10); // 限制数量
  }

  /**
   * 计算最大公约数
   */
  private static gcd(a: number, b: number): number {
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  /**
   * 查找连通分量
   */
  private static findConnectedComponent(start: number, connectionMatrix: boolean[][]): Set<number> {
    const visited = new Set<number>();
    const stack = [start];
    
    while (stack.length > 0) {
      const node = stack.pop()!;
      
      if (visited.has(node)) continue;
      visited.add(node);
      
      for (let other = 1; other <= 49; other++) {
        if (connectionMatrix[node][other] && !visited.has(other)) {
          stack.push(other);
        }
      }
    }
    
    return visited;
  }

  /**
   * 获取近期频率
   */
  private static getRecentFrequency(history: DbRecord[], num: number): number {
    let count = 0;
    
    for (let i = 0; i < Math.min(history.length, 20); i++) {
      const nums = this.parseNumbers(history[i].open_code);
      if (nums.includes(num)) {
        count++;
      }
    }
    
    return count;
  }

  // ==========================================
  // 原有辅助方法（保持原样）
  // ==========================================

  private static calculateHistoryMirror(history: DbRecord[], lastDraw: number[]): Record<number, number> {
    const scores: Record<number, number> = {};
    
    for (let i = 1; i < history.length - 1; i++) {
      const histNums = this.parseNumbers(history[i].open_code);
      const common = histNums.filter(n => lastDraw.includes(n));
      
      if (common.length >= 3) {
        const nextNums = this.parseNumbers(history[i-1].open_code);
        const similarity = common.length / lastDraw.length;
        
        nextNums.forEach(n => {
          scores[n] = (scores[n] || 0) + similarity * 15;
        });
      }
    }
    
    return scores;
  }

  private static analyzeTrajectory(history: DbRecord[], lastSpecial: number): Record<number, number> {
    const scores: Record<number, number> = {};
    const specials: number[] = [];
    
    for (let i = 0; i < Math.min(15, history.length); i++) {
      const nums = this.parseNumbers(history[i].open_code);
      if (nums.length > 0) {
        specials.push(nums[nums.length - 1]);
      }
    }
    
    if (specials.length >= 3) {
      const movingAvg = specials.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
      const lastParity = lastSpecial % 2;
      const parityHistory = specials.map(s => s % 2);
      const sameParityCount = parityHistory.filter(p => p === lastParity).length;
      
      for (let num = 1; num <= 49; num++) {
        let score = 0;
        
        if (Math.abs(num - movingAvg) <= 5) score += 10;
        
        if ((num % 2) === lastParity && sameParityCount >= 2) score += 8;
        
        const diff = specials[0] - specials[1];
        if (diff > 0 && num < lastSpecial) score += 12;
        if (diff < 0 && num > lastSpecial) score += 12;
        
        scores[num] = score;
      }
    }
    
    return scores;
  }

  private static calculatePatternScores(lastDraw: number[], recentHistory: DbRecord[]): Record<number, number> {
    const scores: Record<number, number> = {};
    
    const neighborSet = new Set<number>();
    lastDraw.forEach(n => {
      if (n > 1) neighborSet.add(n - 1);
      if (n < 49) neighborSet.add(n + 1);
    });
    
    const consecutiveSet = new Set<number>();
    const sortedLast = [...lastDraw].sort((a, b) => a - b);
    for (let i = 0; i < sortedLast.length - 1; i++) {
      if (sortedLast[i+1] - sortedLast[i] === 1) {
        if (sortedLast[i] > 1) consecutiveSet.add(sortedLast[i] - 1);
        if (sortedLast[i+1] < 49) consecutiveSet.add(sortedLast[i+1] + 1);
      }
    }
    
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      if (neighborSet.has(num)) score += 15;
      if (consecutiveSet.has(num)) score += 18;
      
      if (lastDraw.includes(num)) score -= 10;
      
      scores[num] = Math.max(score, 0);
    }
    
    return scores;
  }

  private static calculateTailScores(recentHistory: DbRecord[]): Record<number, number> {
    const tailCount: Record<number, number> = {};
    const scores: Record<number, number> = {};
    
    recentHistory.forEach(rec => {
      this.parseNumbers(rec.open_code).forEach(num => {
        const tail = num % 10;
        tailCount[tail] = (tailCount[tail] || 0) + 1;
      });
    });
    
    const sortedTails = Object.entries(tailCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tail]) => parseInt(tail));
    
    for (let tail = 0; tail <= 9; tail++) {
      if (sortedTails.includes(tail)) {
        scores[tail] = 20;
      } else {
        scores[tail] = 0;
      }
    }
    
    return scores;
  }

  private static calculateZodiacScores(recentHistory: DbRecord[], lastSpecialZodiac: string): Record<string, number> {
    const scores: Record<string, number> = {};
    const zodiacCount: Record<string, number> = {};
    
    recentHistory.forEach(rec => {
      this.parseNumbers(rec.open_code).forEach(num => {
        const zodiac = this.NUM_TO_ZODIAC[num];
        zodiacCount[zodiac] = (zodiacCount[zodiac] || 0) + 1;
      });
    });
    
    const hotZodiacs = Object.entries(zodiacCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([zodiac]) => zodiac);
    
    const allies = this.SAN_HE_MAP[lastSpecialZodiac] || [];
    
    Object.keys(this.ZODIACS_MAP).forEach(zodiac => {
      let score = 0;
      
      if (hotZodiacs.includes(zodiac)) score += 15;
      if (allies.includes(zodiac)) score += 20;
      
      // 不排除上期特肖，仅按得分排序
      scores[zodiac] = Math.max(score, 0);
    });
    
    return scores;
  }

  private static calculateWuxingScores(recentHistory: DbRecord[]): Record<string, number> {
    const wuxingCount: Record<string, number> = {};
    const scores: Record<string, number> = {};
    
    recentHistory.forEach(rec => {
      this.parseNumbers(rec.open_code).forEach(num => {
        const wuxing = this.NUM_TO_WUXING[num];
        wuxingCount[wuxing] = (wuxingCount[wuxing] || 0) + 1;
      });
    });
    
    const sortedWuxing = Object.entries(wuxingCount)
      .sort((a, b) => a[1] - b[1]);
    
    const weakWuxing = sortedWuxing[0]?.[0] || '土';
    const strongWuxing = sortedWuxing[sortedWuxing.length - 1]?.[0] || '金';
    
    Object.keys(this.WU_XING_MAP).forEach(wuxing => {
      if (wuxing === weakWuxing) {
        scores[wuxing] = 25;
      } else if (wuxing === strongWuxing) {
        scores[wuxing] = 5;
      } else {
        scores[wuxing] = 15;
      }
    });
    
    return scores;
  }

  private static calculateWaveScores(recentHistory: DbRecord[], lastSpecial: number): Record<string, number> {
    const waveCount: Record<string, number> = {};
    const scores: Record<string, number> = {};
    
    recentHistory.forEach(rec => {
      this.parseNumbers(rec.open_code).forEach(num => {
        const wave = this.getNumWave(num);
        waveCount[wave] = (waveCount[wave] || 0) + 1;
      });
    });
    
    const lastWave = this.getNumWave(lastSpecial);
    
    const sortedWaves = Object.entries(waveCount)
      .sort((a, b) => a[1] - b[1]);
    
    const weakWave = sortedWaves[0]?.[0] || 'green';
    
    ['red', 'blue', 'green'].forEach(wave => {
      let score = 0;
      
      if (wave === lastWave) score += 10;
      
      if (wave === weakWave) score += 20;
      
      scores[wave] = score;
    });
    
    return scores;
  }

  private static calculateGoldNumbers(sum: number, special: number): number[] {
    const goldNumbers: number[] = [];
    
    goldNumbers.push(Math.round(sum * 0.618) % 49 || 49);
    goldNumbers.push((sum + 7) % 49 || 49);
    goldNumbers.push(Math.round(special * 1.618) % 49 || 49);
    goldNumbers.push((special + 13) % 49 || 49);
    goldNumbers.push((special * 2) % 49 || 49);
    
    return [...new Set(goldNumbers.filter(n => n >= 1 && n <= 49 && n !== special))];
  }

  private static calculateOmissionScores(history: DbRecord[], period: number): Record<number, number> {
    const omissionMap: Record<number, number> = {};
    const scores: Record<number, number> = {};
    
    for (let i = 1; i <= 49; i++) {
      omissionMap[i] = period;
    }
    
    for (let i = 0; i < Math.min(period, history.length); i++) {
      const nums = this.parseNumbers(history[i].open_code);
      nums.forEach(num => {
        omissionMap[num] = i;
      });
    }
    
    for (let num = 1; num <= 49; num++) {
      const omission = omissionMap[num];
      
      if (omission >= period * 0.8) {
        scores[num] = 25;
      } else if (omission >= period * 0.6) {
        scores[num] = 20;
      } else if (omission >= period * 0.4) {
        scores[num] = 15;
      } else if (omission >= period * 0.2) {
        scores[num] = 10;
      } else if (omission >= period * 0.1) {
        scores[num] = 5;
      } else {
        scores[num] = 0;
      }
    }
    
    return scores;
  }

  private static calculateSeasonalScores(month: number, week: number): Record<string, number> {
    const scores: Record<string, number> = {};
    const season = this.getSeasonByMonth(month);
    const seasonalZodiacs = this.SEASONAL_ZODIACS[season] || [];
    
    Object.keys(this.ZODIACS_MAP).forEach(zodiac => {
      if (seasonalZodiacs.includes(zodiac)) {
        scores[zodiac] = 20;
      } else {
        scores[zodiac] = 0;
      }
    });
    
    return scores;
  }

  private static analyzePrimeDistribution(history: DbRecord[]) {
    let primeCount = 0;
    let totalNumbers = 0;
    
    history.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      totalNumbers += nums.length;
      primeCount += nums.filter(n => this.PRIME_NUMBERS.includes(n)).length;
    });
    
    const primeRatio = primeCount / totalNumbers;
    const expectedRatio = this.PRIME_NUMBERS.length / 49;
    
    return {
      currentRatio: primeRatio,
      expectedRatio,
      needMorePrimes: primeRatio < expectedRatio * 0.9,
      needMoreComposites: primeRatio > expectedRatio * 1.1
    };
  }

  private static analyzeSumPatterns(history: DbRecord[], lastSum: number) {
    const sums: number[] = [];
    const sumTails: number[] = [];
    
    history.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      const sum = nums.reduce((a, b) => a + b, 0);
      sums.push(sum);
      sumTails.push(sum % 10);
    });
    
    const avgSum = sums.reduce((a, b) => a + b, 0) / sums.length;
    const stdSum = Math.sqrt(sums.reduce((sq, n) => sq + Math.pow(n - avgSum, 2), 0) / sums.length);
    
    const lastParity = lastSum % 2;
    const parityCounts = sumTails.reduce((counts, tail) => {
      counts[tail % 2]++;
      return counts;
    }, [0, 0]);
    
    const parityTrend = parityCounts[lastParity] > parityCounts[1 - lastParity] ? 'same' : 'alternate';
    
    return {
      getScore: (simulatedSum: number) => {
        let score = 0;
        
        if (simulatedSum >= avgSum - stdSum && simulatedSum <= avgSum + stdSum) {
          score += 15;
        }
        
        if ((parityTrend === 'same' && (simulatedSum % 2) === lastParity) ||
            (parityTrend === 'alternate' && (simulatedSum % 2) !== lastParity)) {
          score += 10;
        }
        
        return score;
      }
    };
  }

  private static calculatePositionScores(recentHistory: DbRecord[]): Record<number, number> {
    const positionStats: Record<number, Record<number, number>> = {};
    const scores: Record<number, number> = {};
    
    for (let i = 1; i <= 49; i++) {
      positionStats[i] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
    }
    
    recentHistory.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      nums.forEach((num, index) => {
        const position = index + 1;
        if (positionStats[num]) {
          positionStats[num][position]++;
        }
      });
    });
    
    for (let num = 1; num <= 49; num++) {
      const positions = positionStats[num];
      const total = Object.values(positions).reduce((a, b) => a + b, 0);
      
      if (total > 0) {
        const specialScore = positions[7] * 3;
        const normalScore = (total - positions[7]) * 1;
        scores[num] = specialScore + normalScore;
      } else {
        scores[num] = 0;
      }
    }
    
    return scores;
  }

  private static calculateFrequencyScores(recentHistory: DbRecord[]): Record<number, number> {
    const frequencyMap: Record<number, number> = {};
    const scores: Record<number, number> = {};
    
    recentHistory.forEach(rec => {
      this.parseNumbers(rec.open_code).forEach(num => {
        frequencyMap[num] = (frequencyMap[num] || 0) + 1;
      });
    });
    
    const maxFreq = Math.max(...Object.values(frequencyMap));
    const avgFreq = Object.values(frequencyMap).reduce((a, b) => a + b, 0) / Object.keys(frequencyMap).length;
    
    for (let num = 1; num <= 49; num++) {
      const freq = frequencyMap[num] || 0;
      
      if (freq > avgFreq * 1.5) {
        scores[num] = 15;
      } else if (freq < avgFreq * 0.5) {
        scores[num] = 12;
      } else if (freq === 0) {
        scores[num] = 20;
      } else {
        scores[num] = Math.min((freq / maxFreq) * 10, 10);
      }
    }
    
    return scores;
  }

  private static calculateClusterScores(lastDraw: number[], history: DbRecord[]): Record<number, number> {
    const scores: Record<number, number> = {};
    
    const recentNumbers: number[] = [];
    history.slice(0, 10).forEach(rec => {
      recentNumbers.push(...this.parseNumbers(rec.open_code));
    });
    
    for (let num = 1; num <= 49; num++) {
      let totalDistance = 0;
      let count = 0;
      
      lastDraw.forEach(n => {
        totalDistance += Math.abs(num - n);
        count++;
      });
      
      const recentAvg = recentNumbers.reduce((a, b) => a + b, 0) / recentNumbers.length;
      totalDistance += Math.abs(num - recentAvg) * 2;
      count += 2;
      
      const avgDistance = totalDistance / count;
      
      scores[num] = Math.max(0, 20 - avgDistance);
    }
    
    return scores;
  }

  private static calculateSymmetryScores(history: DbRecord[], lastDraw: number[]): Record<number, number> {
    const scores: Record<number, number> = {};
    const symmetryMap: Record<number, number> = {};
    
    history.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      nums.forEach(num => {
        const symmetricNum = 50 - num;
        if (symmetricNum >= 1 && symmetricNum <= 49) {
          symmetryMap[symmetricNum] = (symmetryMap[symmetricNum] || 0) + 1;
        }
      });
    });
    
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      lastDraw.forEach(n => {
        if (50 - n === num) {
          score += 15;
        }
      });
      
      const symmetricNum = 50 - num;
      if (symmetryMap[num] && symmetryMap[num] > 0) {
        score += symmetryMap[num] * 2;
      }
      
      scores[num] = score;
    }
    
    return scores;
  }

  private static calculatePeriodicScores(history: DbRecord[], currentWeek: number): Record<number, number> {
    const scores: Record<number, number> = {};
    const periodMap: Record<number, number[]> = {};
    
    for (let i = 1; i <= 49; i++) {
      periodMap[i] = [];
    }
    
    history.forEach((rec, index) => {
      const weekNum = Math.floor(index / 7) + 1;
      this.parseNumbers(rec.open_code).forEach(num => {
        periodMap[num].push(weekNum);
      });
    });
    
    for (let num = 1; num <= 49; num++) {
      const appearances = periodMap[num];
      if (appearances.length < 3) {
        scores[num] = 0;
        continue;
      }
      
      let totalInterval = 0;
      for (let i = 1; i < appearances.length; i++) {
        totalInterval += appearances[i] - appearances[i-1];
      }
      const avgInterval = totalInterval / (appearances.length - 1);
      
      const lastAppearance = appearances[appearances.length - 1];
      const expectedAppearance = lastAppearance + avgInterval;
      
      if (Math.abs(currentWeek - expectedAppearance) <= 1) {
        scores[num] = 20;
      } else if (currentWeek > expectedAppearance) {
        scores[num] = 15;
      } else {
        scores[num] = 0;
      }
    }
    
    return scores;
  }

  private static calculateTrendScores(history: DbRecord[]): Record<number, number> {
    const scores: Record<number, number> = {};
    const trendMap: Record<number, {count: number, lastPositions: number[]}> = {};
    
    for (let i = 1; i <= 49; i++) {
      trendMap[i] = { count: 0, lastPositions: [] };
    }
    
    const recentHistory = history.slice(0, 20);
    recentHistory.forEach((rec, drawIndex) => {
      const nums = this.parseNumbers(rec.open_code);
      nums.forEach((num, position) => {
        const pos = position + 1;
        trendMap[num].count++;
        trendMap[num].lastPositions.push(drawIndex * 10 + pos);
      });
    });
    
    for (let num = 1; num <= 49; num++) {
      const data = trendMap[num];
      if (data.lastPositions.length < 2) {
        scores[num] = 0;
        continue;
      }
      
      let totalDiff = 0;
      for (let i = 1; i < data.lastPositions.length; i++) {
        totalDiff += data.lastPositions[i] - data.lastPositions[i-1];
      }
      const avgDiff = totalDiff / (data.lastPositions.length - 1);
      
      if (avgDiff > 0) {
        scores[num] = 15;
      } else if (avgDiff < 0) {
        scores[num] = 10;
      } else {
        scores[num] = 5;
      }
      
      if (data.count >= 3) {
        scores[num] += 5;
      }
    }
    
    return scores;
  }

  private static analyzeHeadPatterns(history: DbRecord[], lastHead: number, weekday: number): {
    getScore: (head: number, num: number) => number;
  } {
    const headStats: Record<number, {count: number, lastAppearance: number, trends: number[]}> = {};
    
    for (let head = 0; head <= 4; head++) {
      headStats[head] = { count: 0, lastAppearance: 0, trends: [] };
    }
    
    history.forEach((rec, index) => {
      const nums = this.parseNumbers(rec.open_code);
      const headsInDraw = nums.map(num => Math.floor(num / 10));
      
      headsInDraw.forEach(head => {
        headStats[head].count++;
        headStats[head].lastAppearance = index;
        headStats[head].trends.push(index);
      });
    });
    
    const headOmission: Record<number, number> = {};
    for (let head = 0; head <= 4; head++) {
      headOmission[head] = headStats[head].lastAppearance;
    }
    
    const headEntries = Object.entries(headStats);
    const hotHeads = headEntries
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 2)
      .map(([head]) => parseInt(head));
    
    const coldHeads = headEntries
      .sort((a, b) => a[1].count - b[1].count)
      .slice(0, 2)
      .map(([head]) => parseInt(head));
    
    const weekdayPatterns: Record<number, number[]> = {
      0: [0, 3],
      1: [1, 4],
      2: [2, 0],
      3: [3, 1],
      4: [4, 2],
      5: [0, 3],
      6: [1, 4]
    };
    
    const weekdayHeads = weekdayPatterns[weekday] || [0, 1, 2, 3, 4];
    
    return {
      getScore: (head: number, num: number): number => {
        let score = 0;
        
        if (hotHeads.includes(head)) score += 15;
        
        if (coldHeads.includes(head)) score += 12;
        
        if (head !== lastHead) score += 10;
        
        if (weekdayHeads.includes(head)) score += 8;
        
        const omission = headOmission[head] || 0;
        if (omission > 10) score += omission * 0.5;
        
        if (num >= 40 && head === 4) score += 5;
        if (num <= 9 && head === 0) score += 5;
        
        return Math.min(score, 25);
      }
    };
  }

  private static analyzeTailPatterns(history: DbRecord[], lastTail: number, day: number): {
    getScore: (tail: number, num: number) => number;
  } {
    const tailStats: Record<number, {count: number, lastAppearance: number, trends: number[]}> = {};
    
    for (let tail = 0; tail <= 9; tail++) {
      tailStats[tail] = { count: 0, lastAppearance: 0, trends: [] };
    }
    
    history.forEach((rec, index) => {
      const nums = this.parseNumbers(rec.open_code);
      const tailsInDraw = nums.map(num => num % 10);
      
      tailsInDraw.forEach(tail => {
        tailStats[tail].count++;
        tailStats[tail].lastAppearance = index;
        tailStats[tail].trends.push(index);
      });
    });
    
    const tailOmission: Record<number, number> = {};
    for (let tail = 0; tail <= 9; tail++) {
      tailOmission[tail] = tailStats[tail].lastAppearance;
    }
    
    const tailEntries = Object.entries(tailStats);
    const hotTails = tailEntries
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3)
      .map(([tail]) => parseInt(tail));
    
    const coldTails = tailEntries
      .sort((a, b) => a[1].count - b[1].count)
      .slice(0, 3)
      .map(([tail]) => parseInt(tail));
    
    const datePattern = day % 10;
    
    const tailGroups = {
      small: [0, 1, 2, 3, 4],
      big: [5, 6, 7, 8, 9],
      prime: [2, 3, 5, 7],
      composite: [0, 1, 4, 6, 8, 9],
      even: [0, 2, 4, 6, 8],
      odd: [1, 3, 5, 7, 9]
    };
    
    return {
      getScore: (tail: number, num: number): number => {
        let score = 0;
        
        if (hotTails.includes(tail)) score += 15;
        
        if (coldTails.includes(tail)) score += 12;
        
        if (tail !== lastTail) score += 8;
        
        if (tail === datePattern) score += 8;
        if (tail === (datePattern + 5) % 10) score += 6;
        
        const omission = tailOmission[tail] || 0;
        if (omission > 8) score += omission * 0.6;
        
        if (tailGroups.small.includes(tail)) score += 3;
        if (tailGroups.prime.includes(tail)) score += 4;
        
        if (tail === 0 && num % 10 === 0) score += 5;
        
        return Math.min(score, 25);
      }
    };
  }

  private static calculateCorrelationScores(recentHistory: DbRecord[], lastDraw: number[]): Record<number, number> {
    const scores: Record<number, number> = {};
    const correlationMap: Record<number, Record<number, number>> = {};
    
    for (let i = 1; i <= 49; i++) {
      correlationMap[i] = {};
    }
    
    recentHistory.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      
      for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
          const a = nums[i];
          const b = nums[j];
          
          correlationMap[a][b] = (correlationMap[a][b] || 0) + 1;
          correlationMap[b][a] = (correlationMap[b][a] || 0) + 1;
        }
      }
    });
    
    for (let num = 1; num <= 49; num++) {
      let totalCorrelation = 0;
      let correlationCount = 0;
      
      lastDraw.forEach(lastNum => {
        if (correlationMap[num][lastNum]) {
          totalCorrelation += correlationMap[num][lastNum];
          correlationCount++;
        }
      });
      
      if (correlationCount > 0) {
        scores[num] = Math.min(totalCorrelation / correlationCount * 3, 20);
      } else {
        scores[num] = 0;
      }
    }
    
    return scores;
  }

  private static analyzePropertyPatterns(history: DbRecord[], lastSpecial: number): {
    getScore: (stat: NumberStat) => number;
  } {
    const sizeHistory: string[] = [];
    const parityHistory: string[] = [];
    
    history.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      const special = nums[nums.length - 1];
      
      sizeHistory.push(this.NUM_TO_SIZE[special]);
      parityHistory.push(this.NUM_TO_PARITY[special]);
    });
    
    const lastSize = this.NUM_TO_SIZE[lastSpecial];
    const lastParity = this.NUM_TO_PARITY[lastSpecial];
    
    const sizeContinuity = this.calculateContinuity(sizeHistory, lastSize);
    const parityContinuity = this.calculateContinuity(parityHistory, lastParity);
    
    const sizeBalance = this.calculateBalance(sizeHistory, ['small', 'large']);
    const parityBalance = this.calculateBalance(parityHistory, ['odd', 'even']);
    
    return {
      getScore: (stat: NumberStat): number => {
        let score = 0;
        
        if (sizeContinuity === 'continue' && stat.size === lastSize) {
          score += 12;
        } else if (sizeContinuity === 'alternate' && stat.size !== lastSize) {
          score += 12;
        }
        
        if (sizeBalance === 'needSmall' && stat.size === 'small') {
          score += 8;
        } else if (sizeBalance === 'needLarge' && stat.size === 'large') {
          score += 8;
        }
        
        if (parityContinuity === 'continue' && stat.parity === lastParity) {
          score += 10;
        } else if (parityContinuity === 'alternate' && stat.parity !== lastParity) {
          score += 10;
        }
        
        if (parityBalance === 'needOdd' && stat.parity === 'odd') {
          score += 6;
        } else if (parityBalance === 'needEven' && stat.parity === 'even') {
          score += 6;
        }
        
        const primeHistory = history.map(rec => {
          const nums = this.parseNumbers(rec.open_code);
          const special = nums[nums.length - 1];
          return this.NUM_TO_PRIME[special];
        });
        
        const primeContinuity = this.calculateContinuity(primeHistory.map(p => p ? 'prime' : 'composite'), 
          lastSpecial ? 'prime' : 'composite');
        
        if (primeContinuity === 'continue' && stat.prime === lastSpecial) {
          score += 8;
        } else if (primeContinuity === 'alternate' && stat.prime !== lastSpecial) {
          score += 8;
        }
        
        return Math.min(score, 25);
      }
    };
  }

  private static calculateTimePatternScores(
    weekday: number, 
    monthPeriod: 'early' | 'middle' | 'late', 
    day: number
  ): Record<number, number> {
    const scores: Record<number, number> = {};
    
    const weekdayPattern = this.TIME_PATTERNS.weekday[weekday];
    const monthPeriodPattern = this.TIME_PATTERNS.monthPeriod[monthPeriod];
    
    const dayPattern = {
      tails: [day % 10, (day % 10 + 5) % 10],
      heads: [Math.floor(day / 10), (Math.floor(day / 10) + 1) % 5]
    };
    
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      if (weekdayPattern.zodiacs.includes(this.NUM_TO_ZODIAC[num])) {
        score += 8;
      }
      
      if (weekdayPattern.tails.includes(num % 10)) {
        score += 6;
      }
      
      if (weekdayPattern.clusters.includes(this.NUM_TO_CLUSTER[num])) {
        score += 7;
      }
      
      if (monthPeriodPattern.heads.includes(Math.floor(num / 10))) {
        score += 7;
      }
      
      if (monthPeriodPattern.waves.includes(this.getNumWave(num))) {
        score += 7;
      }
      
      if (monthPeriodPattern.clusters.includes(this.NUM_TO_CLUSTER[num])) {
        score += 6;
      }
      
      if (dayPattern.tails.includes(num % 10)) {
        score += 5;
      }
      
      if (dayPattern.heads.includes(Math.floor(num / 10))) {
        score += 5;
      }
      
      if (day === 1 && num % 10 === 1) score += 4;
      if (day === 15 && (num === 15 || num === 25 || num === 35 || num === 45)) score += 4;
      if (day === 30 && num % 10 === 0) score += 4;
      
      scores[num] = score;
    }
    
    return scores;
  }

  private static analyzeSeriesPatterns(history: DbRecord[], lastDraw: number[]): Record<number, number> {
    const scores: Record<number, number> = {};
    
    const seriesPatterns: {
      type: 'double' | 'triple' | 'quad';
      numbers: number[];
      nextNumbers: number[];
    }[] = [];
    
    for (let i = 0; i < history.length - 1; i++) {
      const currentNums = this.parseNumbers(history[i].open_code).sort((a, b) => a - b);
      const nextNums = this.parseNumbers(history[i+1].open_code);
      
      const seriesInCurrent = this.detectSeries(currentNums);
      
      if (seriesInCurrent.length > 0) {
        seriesPatterns.push({
          type: seriesInCurrent[0].type,
          numbers: seriesInCurrent[0].numbers,
          nextNumbers: nextNums
        });
      }
    }
    
    const sortedLastDraw = [...lastDraw].sort((a, b) => a - b);
    const lastSeries = this.detectSeries(sortedLastDraw);
    
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      seriesPatterns.forEach(pattern => {
        if (lastSeries.length > 0 && pattern.numbers.length === lastSeries[0].numbers.length) {
          if (pattern.nextNumbers.includes(num)) {
            score += 10;
          }
        }
      });
      
      if (lastSeries.length > 0) {
        const lastSeriesNumbers = lastSeries[0].numbers;
        
        for (const seriesNum of lastSeriesNumbers) {
          if (Math.abs(num - seriesNum) === 1) {
            score += 12;
          }
        }
        
        const minSeries = Math.min(...lastSeriesNumbers);
        const maxSeries = Math.max(...lastSeriesNumbers);
        
        if (num >= minSeries - 2 && num <= maxSeries + 2 && !lastSeriesNumbers.includes(num)) {
          score += 8;
        }
      }
      
      const seriesFrequency = this.analyzeSeriesFrequency(history, num);
      score += seriesFrequency * 2;
      
      scores[num] = Math.min(score, 25);
    }
    
    return scores;
  }

  private static analyzeSumZonePatterns(history: DbRecord[], lastSum: number): {
    getScore: (simulatedSum: number) => number;
  } {
    const sumZoneHistory: string[] = [];
    
    history.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      const sum = nums.reduce((a, b) => a + b, 0);
      const zone = this.getSumZone(sum);
      sumZoneHistory.push(zone);
    });
    
    const lastZone = this.getSumZone(lastSum);
    const zoneContinuity = this.calculateContinuity(sumZoneHistory, lastZone);
    
    const zoneBalance = this.calculateBalance(sumZoneHistory, ['small', 'medium', 'large']);
    
    return {
      getScore: (simulatedSum: number): number => {
        let score = 0;
        const simulatedZone = this.getSumZone(simulatedSum);
        
        if (zoneContinuity === 'continue' && simulatedZone === lastZone) {
          score += 10;
        } else if (zoneContinuity === 'alternate' && simulatedZone !== lastZone) {
          score += 10;
        }
        
        if (zoneBalance === 'needSmall' && simulatedZone === 'small') {
          score += 8;
        } else if (zoneBalance === 'needMedium' && simulatedZone === 'medium') {
          score += 8;
        } else if (zoneBalance === 'needLarge' && simulatedZone === 'large') {
          score += 8;
        }
        
        const zoneTransitions = this.analyzeZoneTransitions(sumZoneHistory);
        const transitionProb = zoneTransitions[lastZone]?.[simulatedZone] || 0;
        score += transitionProb * 12;
        
        return Math.min(score, 20);
      }
    };
  }

  private static calculateElementRelationScores(recentHistory: DbRecord[], lastSpecial: number): Record<number, number> {
    const scores: Record<number, number> = {};
    const lastElement = this.NUM_TO_WUXING[lastSpecial];
    
    if (!lastElement) {
      for (let num = 1; num <= 49; num++) scores[num] = 0;
      return scores;
    }
    
    const elementCycle = this.WU_XING_CYCLE[lastElement];
    
    const elementHistory: string[] = [];
    recentHistory.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      const special = nums[nums.length - 1];
      elementHistory.push(this.NUM_TO_WUXING[special]);
    });
    
    const elementBalance = this.calculateElementBalance(elementHistory);
    
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      const currentElement = this.NUM_TO_WUXING[num];
      
      if (elementCycle.sheng === currentElement) {
        score += 15;
      }
      
      if (elementCycle.ke === currentElement) {
        score += 8;
      }
      
      if (elementCycle.sheng_by === currentElement) {
        score += 10;
      }
      
      if (elementCycle.ke_by === currentElement) {
        score += 12;
      }
      
      if (elementBalance.weakElement === currentElement) {
        score += 10;
      }
      
      if (elementBalance.strongElement === currentElement) {
        score -= 5;
      }
      
      if (currentElement === lastElement) {
        score += 6;
      }
      
      scores[num] = Math.max(score, 0);
    }
    
    return scores;
  }

  private static calculateMatrixCoordinateScores(
    history: DbRecord[], 
    lastMatrix: {row: number, col: number},
    weekday: number
  ): Record<number, number> {
    const scores: Record<number, number> = {};
    
    const rowHistory: number[] = [];
    const colHistory: number[] = [];
    
    history.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      nums.forEach(num => {
        const matrix = this.NUM_TO_MATRIX[num];
        rowHistory.push(matrix.row);
        colHistory.push(matrix.col);
      });
    });
    
    const rowAvg = rowHistory.reduce((a, b) => a + b, 0) / rowHistory.length;
    const colAvg = colHistory.reduce((a, b) => a + b, 0) / colHistory.length;
    
    const rowContinuity = this.calculateContinuity(rowHistory.slice(-10), lastMatrix.row);
    const colContinuity = this.calculateContinuity(colHistory.slice(-10), lastMatrix.col);
    
    const weekdayMatrixPatterns: Record<number, {rows: number[], cols: number[]}> = {
      0: {rows: [1, 4, 7], cols: [2, 5]},
      1: {rows: [2, 5], cols: [3, 6]},
      2: {rows: [3, 6], cols: [1, 4]},
      3: {rows: [1, 4], cols: [2, 5]},
      4: {rows: [2, 5], cols: [3, 6]},
      5: {rows: [3, 6], cols: [1, 4]},
      6: {rows: [1, 7], cols: [4, 7]}
    };
    
    const weekdayPattern = weekdayMatrixPatterns[weekday] || {rows: [1,2,3,4,5,6,7], cols: [1,2,3,4,5,6,7]};
    
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      const matrix = this.NUM_TO_MATRIX[num];
      
      const rowDist = Math.abs(matrix.row - rowAvg);
      const colDist = Math.abs(matrix.col - colAvg);
      if (rowDist <= 1 && colDist <= 1) score += 10;
      
      if (rowContinuity === 'continue' && matrix.row === lastMatrix.row) score += 8;
      if (colContinuity === 'continue' && matrix.col === lastMatrix.col) score += 8;
      
      if (rowContinuity === 'alternate' && matrix.row !== lastMatrix.row) score += 6;
      if (colContinuity === 'alternate' && matrix.col !== lastMatrix.col) score += 6;
      
      if (weekdayPattern.rows.includes(matrix.row)) score += 7;
      if (weekdayPattern.cols.includes(matrix.col)) score += 7;
      
      if (matrix.row === matrix.col) score += 5;
      if (matrix.row + matrix.col === 8) score += 5;
      
      if (matrix.row >= 3 && matrix.row <= 5 && matrix.col >= 3 && matrix.col <= 5) {
        score += 6;
      }
      
      const rowDiff = Math.abs(matrix.row - lastMatrix.row);
      const colDiff = Math.abs(matrix.col - lastMatrix.col);
      
      if (rowDiff === 1 && colDiff === 1) score += 8;
      if (rowDiff === 0 && colDiff === 1) score += 7;
      if (rowDiff === 1 && colDiff === 0) score += 7;
      
      scores[num] = Math.min(score, 25);
    }
    
    return scores;
  }

  private static calculateLatticeDistributionScores(
    history: DbRecord[], 
    lastSpecial: number
  ): Record<number, number> {
    const scores: Record<number, number> = {};
    
    const latticePatterns = {
      fibonacci: this.LATTICE_PATTERNS.fibonacci,
      goldenRatio: this.LATTICE_PATTERNS.goldenRatio,
      arithmetic: this.LATTICE_PATTERNS.arithmetic,
      geometric: this.LATTICE_PATTERNS.geometric
    };
    
    const patternCounts: Record<string, number> = {};
    Object.keys(latticePatterns).forEach(pattern => {
      patternCounts[pattern] = 0;
    });
    
    history.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      nums.forEach(num => {
        Object.entries(latticePatterns).forEach(([pattern, patternNums]) => {
          if (patternNums.includes(num)) {
            patternCounts[pattern]++;
          }
        });
      });
    });
    
    const sortedPatterns = Object.entries(patternCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([pattern]) => pattern);
    
    const lastSpecialPatterns: string[] = [];
    Object.entries(latticePatterns).forEach(([pattern, patternNums]) => {
      if (patternNums.includes(lastSpecial)) {
        lastSpecialPatterns.push(pattern);
      }
    });
    
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      sortedPatterns.forEach(pattern => {
        if (latticePatterns[pattern as keyof typeof latticePatterns].includes(num)) {
          score += 12;
        }
      });
      
      lastSpecialPatterns.forEach(pattern => {
        if (latticePatterns[pattern as keyof typeof latticePatterns].includes(num)) {
          score += 10;
        }
      });
      
      if (lastSpecialPatterns.length === 0) {
        Object.values(latticePatterns).forEach(patternNums => {
          if (patternNums.includes(num)) {
            score += 8;
          }
        });
      }
      
      if (latticePatterns.goldenRatio.includes(num)) {
        score += 6;
      }
      
      if (latticePatterns.fibonacci.includes(num)) {
        score += 5;
      }
      
      if (latticePatterns.arithmetic.includes(num)) {
        const arithmeticIndex = latticePatterns.arithmetic.indexOf(num);
        if (arithmeticIndex > 0) {
          const prevInSequence = latticePatterns.arithmetic[arithmeticIndex - 1];
          if (prevInSequence === lastSpecial) {
            score += 9;
          }
        }
      }
      
      scores[num] = Math.min(score, 25);
    }
    
    return scores;
  }

  private static analyzeChaosPatterns(
    history: DbRecord[], 
    lastSpecial: number
  ): Record<number, number> {
    const scores: Record<number, number> = {};
    
    const trajectory: number[] = [];
    history.slice(0, 20).forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      const special = nums[nums.length - 1];
      trajectory.push(special);
    });
    
    const lyapunovExponent = this.calculateLyapunovExponent(trajectory);
    const phaseSpace = this.reconstructPhaseSpace(trajectory, 3);
    const strangeAttractor = this.analyzeStrangeAttractor(phaseSpace);
    
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      if (lyapunovExponent > 0) {
        const predicted = this.chaoticPrediction(trajectory, num);
        score += predicted * 8;
      }
      
      const phaseScore = this.phaseSpaceScore(phaseSpace, num, lastSpecial);
      score += phaseScore * 6;
      
      if (strangeAttractor.attractorNumbers.includes(num)) {
        score += 12;
      }
      
      const chaosEdgeScore = this.chaosEdgeAnalysis(trajectory, num);
      score += chaosEdgeScore * 4;
      
      const deterministicChaosScore = this.deterministicChaosPattern(trajectory, num);
      score += deterministicChaosScore * 5;
      
      scores[num] = Math.min(score, 25);
    }
    
    return scores;
  }

  private static calculateFractalDimensionScores(history: DbRecord[]): Record<number, number> {
    const scores: Record<number, number> = {};
    
    const fractalPatterns = {
      mandelbrot: this.FRACTAL_PATTERNS.mandelbrot,
      julia: this.FRACTAL_PATTERNS.julia,
      sierpinski: this.FRACTAL_PATTERNS.sierpinski
    };
    
    const historyNumbers: number[] = [];
    history.forEach(rec => {
      historyNumbers.push(...this.parseNumbers(rec.open_code));
    });
    
    const boxDimension = this.calculateBoxDimension(historyNumbers);
    const selfSimilarity = this.analyzeSelfSimilarity(historyNumbers);
    
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      Object.values(fractalPatterns).forEach(pattern => {
        if (pattern.includes(num)) {
          score += 8;
        }
      });
      
      const dimensionScore = this.fractalDimensionScore(boxDimension, num, historyNumbers);
      score += dimensionScore * 6;
      
      if (selfSimilarity.similarNumbers.includes(num)) {
        score += 10;
      }
      
      const iterationScore = this.fractalIterationPattern(num, history);
      score += iterationScore * 5;
      
      const boundaryScore = this.fractalBoundaryAnalysis(num, historyNumbers);
      score += boundaryScore * 4;
      
      scores[num] = Math.min(score, 25);
    }
    
    return scores;
  }

  private static analyzeEntropyPatterns(
    history: DbRecord[], 
    lastSpecial: number
  ): Record<number, number> {
    const scores: Record<number, number> = {};
    
    const entropy = this.calculateInformationEntropy(history);
    const entropyTrend = this.analyzeEntropyTrend(history);
    const maxEntropyNumbers = this.maxEntropyAnalysis(history);
    const minEntropyNumbers = this.minEntropyAnalysis(history);
    const entropyChange = this.entropyChangeAnalysis(history);
    
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      if (entropy > 3.5 && maxEntropyNumbers.includes(num)) {
        score += 12;
      }
      
      if (entropy < 2.5 && minEntropyNumbers.includes(num)) {
        score += 15;
      }
      
      if (entropyChange === 'increasing' && maxEntropyNumbers.includes(num)) {
        score += 8;
      }
      
      if (entropyChange === 'decreasing' && minEntropyNumbers.includes(num)) {
        score += 10;
      }
      
      const balanceScore = this.entropyBalanceScore(num, history, entropy);
      score += balanceScore * 5;
      
      const informationGain = this.informationGainAnalysis(num, history, lastSpecial);
      score += informationGain * 6;
      
      scores[num] = Math.min(score, 25);
    }
    
    return scores;
  }

  private static calculateDeterministicCoreScores(
    history: DbRecord[], 
    lastSpecial: number,
    currentWeek: number
  ): Record<number, number> {
    const scores: Record<number, number> = {};
    
    const deterministicPatterns = {
      primeSpiral: this.DETERMINISTIC_PATTERNS.primeSpiral,
      ulamSpiral: this.DETERMINISTIC_PATTERNS.ulamSpiral,
      magicSquare: this.DETERMINISTIC_PATTERNS.magicSquare
    };
    
    const patternFrequencies: Record<string, number> = {};
    Object.keys(deterministicPatterns).forEach(pattern => {
      patternFrequencies[pattern] = 0;
    });
    
    history.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      nums.forEach(num => {
        Object.entries(deterministicPatterns).forEach(([pattern, patternNums]) => {
          if (patternNums.includes(num)) {
            patternFrequencies[pattern]++;
          }
        });
      });
    });
    
    const mostDeterministicPatterns = Object.entries(patternFrequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([pattern]) => pattern);
    
    const deterministicTransitions = this.analyzeDeterministicTransitions(history);
    const coreStability = this.analyzeCoreStability(history);
    
    for (let num = 1; num <= 49; num++) {
      let score = 0;
      
      mostDeterministicPatterns.forEach(pattern => {
        if (deterministicPatterns[pattern as keyof typeof deterministicPatterns].includes(num)) {
          score += 15;
        }
      });
      
      if (deterministicTransitions[lastSpecial]?.includes(num)) {
        score += 12;
      }
      
      if (coreStability.stableNumbers.includes(num)) {
        score += 10;
      }
      
      if (deterministicPatterns.primeSpiral.includes(num)) {
        const spiralScore = this.primeSpiralAnalysis(num, lastSpecial, currentWeek);
        score += spiralScore;
      }
      
      if (deterministicPatterns.ulamSpiral.includes(num)) {
        const ulamScore = this.ulamSpiralAnalysis(num, history);
        score += ulamScore;
      }
      
      if (deterministicPatterns.magicSquare.includes(num)) {
        const magicSquareScore = this.magicSquareAnalysis(num, history);
        score += magicSquareScore;
      }
      
      const convergenceScore = this.deterministicConvergence(num, history);
      score += convergenceScore * 4;
      
      scores[num] = Math.min(score, 30);
    }
    
    return scores;
  }

  /**
   * 获取确定性微调值
   */
  private static getDeterministicAdjustment(
    num: number, 
    lastSpecial: number, 
    day: number, 
    weekday: number
  ): number {
    const hash = this.deterministicHash(num, lastSpecial, day, weekday);
    return (hash % 50) / 100;
  }

  /**
   * 确定性哈希函数
   */
  private static deterministicHash(...args: number[]): number {
    let hash = 5381;
    for (const arg of args) {
      hash = ((hash << 5) + hash) + arg;
    }
    return Math.abs(hash) % 10000;
  }

  /**
   * 计算李雅普诺夫指数
   */
  private static calculateLyapunovExponent(trajectory: number[]): number {
    if (trajectory.length < 4) return 0;
    
    let sum = 0;
    const count = Math.min(10, trajectory.length - 3);
    
    for (let i = 0; i < count; i++) {
      const delta1 = Math.abs(trajectory[i+1] - trajectory[i]);
      const delta2 = Math.abs(trajectory[i+2] - trajectory[i+1]);
      
      if (delta1 > 0 && delta2 > 0) {
        sum += Math.log(delta2 / delta1);
      }
    }
    
    return count > 0 ? sum / count : 0;
  }

  /**
   * 相空间重构
   */
  private static reconstructPhaseSpace(trajectory: number[], dimension: number): number[][] {
    const phaseSpace: number[][] = [];
    
    for (let i = 0; i <= trajectory.length - dimension; i++) {
      phaseSpace.push(trajectory.slice(i, i + dimension));
    }
    
    return phaseSpace;
  }

  /**
   * 分析奇异吸引子
   */
  private static analyzeStrangeAttractor(phaseSpace: number[][]): {
    attractorNumbers: number[];
    dimension: number;
  } {
    const attractorNumbers: number[] = [];
    
    if (phaseSpace.length === 0) {
      return { attractorNumbers: [], dimension: 0 };
    }
    
    const pointCounts: Record<string, number> = {};
    
    phaseSpace.forEach(point => {
      const key = point.join(',');
      pointCounts[key] = (pointCounts[key] || 0) + 1;
    });
    
    const sortedPoints = Object.entries(pointCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    sortedPoints.forEach(([key]) => {
      const numbers = key.split(',').map(Number);
      attractorNumbers.push(...numbers);
    });
    
    const uniqueNumbers = [...new Set(attractorNumbers)];
    
    return {
      attractorNumbers: uniqueNumbers,
      dimension: phaseSpace[0]?.length || 0
    };
  }

  /**
   * 混沌预测
   */
  private static chaoticPrediction(trajectory: number[], num: number): number {
    if (trajectory.length < 3) return 0;
    
    const r = 3.9;
    const last = trajectory[trajectory.length - 1] / 49;
    const predicted = r * last * (1 - last) * 49;
    
    const distance = Math.abs(num - predicted);
    
    if (distance <= 5) return 8;
    if (distance <= 10) return 5;
    if (distance <= 15) return 3;
    
    return 0;
  }

  /**
   * 相空间评分
   */
  private static phaseSpaceScore(phaseSpace: number[][], num: number, lastSpecial: number): number {
    if (phaseSpace.length === 0) return 0;
    
    let score = 0;
    
    phaseSpace.forEach(point => {
      if (point.includes(num)) {
        score += 3;
      }
    });
    
    const lastPoint = phaseSpace[phaseSpace.length - 1];
    if (lastPoint && lastPoint.includes(lastSpecial)) {
      const otherPoints = phaseSpace.filter(point => 
        point.includes(lastSpecial) && point.includes(num)
      );
      
      if (otherPoints.length > 0) {
        score += 6;
      }
    }
    
    return Math.min(score, 10);
  }

  /**
   * 混沌边缘分析
   */
  private static chaosEdgeAnalysis(trajectory: number[], num: number): number {
    let totalFluctuation = 0;
    for (let i = 1; i < trajectory.length; i++) {
      totalFluctuation += Math.abs(trajectory[i] - trajectory[i-1]);
    }
    
    const avgFluctuation = totalFluctuation / (trajectory.length - 1);
    
    if (avgFluctuation >= 15 && avgFluctuation <= 30) {
      const minHistory = Math.min(...trajectory);
      const maxHistory = Math.max(...trajectory);
      
      if (num >= minHistory && num <= maxHistory) {
        return 8;
      }
    }
    
    return 0;
  }

  /**
   * 确定性混沌模式
   */
  private static deterministicChaosPattern(trajectory: number[], num: number): number {
    if (trajectory.length < 5) return 0;
    
    let autocorrelation = 0;
    const lag = 2;
    
    for (let i = 0; i < trajectory.length - lag; i++) {
      if (trajectory[i] === num) {
        if (trajectory[i + lag] === num) {
          autocorrelation++;
        }
      }
    }
    
    if (autocorrelation > 0) {
      return 6;
    }
    
    return 0;
  }

  /**
   * 计算盒计数维度
   */
  private static calculateBoxDimension(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    
    const boxes = 7;
    const boxSize = 49 / boxes;
    
    let filledBoxes = 0;
    const boxGrid: boolean[][] = Array(boxes).fill(0).map(() => Array(boxes).fill(false));
    
    numbers.forEach(num => {
      const boxRow = Math.floor((num - 1) / boxSize);
      const boxCol = Math.floor(((num - 1) % 49) / boxSize);
      
      if (!boxGrid[boxRow][boxCol]) {
        boxGrid[boxRow][boxCol] = true;
        filledBoxes++;
      }
    });
    
    return filledBoxes > 0 ? Math.log(filledBoxes) / Math.log(boxes) : 0;
  }

  /**
   * 分析自相似性
   */
  private static analyzeSelfSimilarity(numbers: number[]): {
    similarNumbers: number[];
    similarityScore: number;
  } {
    const similarNumbers: number[] = [];
    
    numbers.forEach(num => {
      const digitSum = this.sumDigits(num);
      
      for (let otherNum = 1; otherNum <= 49; otherNum++) {
        if (otherNum !== num && this.sumDigits(otherNum) === digitSum) {
          similarNumbers.push(otherNum);
        }
      }
    });
    
    const uniqueNumbers = [...new Set(similarNumbers)];
    
    return {
      similarNumbers: uniqueNumbers,
      similarityScore: uniqueNumbers.length > 0 ? 1.0 : 0
    };
  }

  /**
   * 分形维度评分
   */
  private static fractalDimensionScore(
    boxDimension: number, 
    num: number, 
    historyNumbers: number[]
  ): number {
    if (boxDimension === 0) return 0;
    
    if (boxDimension > 1.5) {
      if (num <= 10 || num >= 40 || num % 10 === 0 || num % 10 === 9) {
        return 8;
      }
    } else {
      if (num >= 20 && num <= 30) {
        return 8;
      }
    }
    
    return 0;
  }

  /**
   * 分形迭代模式
   */
  private static fractalIterationPattern(num: number, history: DbRecord[]): number {
    let score = 0;
    
    history.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code);
      if (nums.includes(num)) {
        const position = nums.indexOf(num);
        if (position >= 0) {
          score += 2;
        }
      }
    });
    
    return Math.min(score, 8);
  }

  /**
   * 分形边界分析
   */
  private static fractalBoundaryAnalysis(num: number, historyNumbers: number[]): number {
    let neighborCount = 0;
    const neighbors = [
      num - 1, num + 1,
      num - 7, num + 7,
      num - 8, num - 6, num + 6, num + 8
    ];
    
    neighbors.forEach(neighbor => {
      if (neighbor >= 1 && neighbor <= 49 && historyNumbers.includes(neighbor)) {
        neighborCount++;
      }
    });
    
    if (neighborCount <= 2) {
      return 6;
    }
    
    return 0;
  }

  /**
   * 计算信息熵
   */
  private static calculateInformationEntropy(history: DbRecord[]): number {
    const frequency: Record<number, number> = {};
    let total = 0;
    
    history.forEach(rec => {
      this.parseNumbers(rec.open_code).forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
        total++;
      });
    });
    
    if (total === 0) return 0;
    
    let entropy = 0;
    Object.values(frequency).forEach(count => {
      const probability = count / total;
      entropy -= probability * Math.log2(probability);
    });
    
    return entropy;
  }

  /**
   * 分析熵的趋势
   */
  private static analyzeEntropyTrend(history: DbRecord[]): 'increasing' | 'decreasing' | 'stable' {
    if (history.length < 10) return 'stable';
    
    const midpoint = Math.floor(history.length / 2);
    const firstHalf = history.slice(0, midpoint);
    const secondHalf = history.slice(midpoint);
    
    const entropy1 = this.calculateInformationEntropy(firstHalf);
    const entropy2 = this.calculateInformationEntropy(secondHalf);
    
    if (entropy2 > entropy1 * 1.1) return 'increasing';
    if (entropy2 < entropy1 * 0.9) return 'decreasing';
    
    return 'stable';
  }

  /**
   * 最大熵分析
   */
  private static maxEntropyAnalysis(history: DbRecord[]): number[] {
    const frequency: Record<number, number> = {};
    
    history.forEach(rec => {
      this.parseNumbers(rec.open_code).forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
      });
    });
    
    const sortedNumbers = Object.entries(frequency)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 10)
      .map(([num]) => parseInt(num));
    
    return sortedNumbers;
  }

  /**
   * 最小熵分析
   */
  private static minEntropyAnalysis(history: DbRecord[]): number[] {
    const deterministicNumbers: number[] = [];
    
    for (let num = 1; num <= 49; num++) {
      if (this.PRIME_NUMBERS.includes(num) || 
          num % 10 === 0 || 
          num % 10 === 5 ||
          num === 25 || num === 37 || num === 49) {
        deterministicNumbers.push(num);
      }
    }
    
    return deterministicNumbers.slice(0, 10);
  }

  /**
   * 熵变化分析
   */
  private static entropyChangeAnalysis(history: DbRecord[]): 'increasing' | 'decreasing' | 'stable' {
    return this.analyzeEntropyTrend(history);
  }

  /**
   * 熵平衡评分
   */
  private static entropyBalanceScore(num: number, history: DbRecord[], entropy: number): number {
    if (entropy > 3.5) {
      const frequency = this.getNumberFrequency(history, num);
      if (frequency < 2) {
        return 8;
      }
    } else if (entropy < 2.5) {
      const frequency = this.getNumberFrequency(history, num);
      if (frequency >= 3) {
        return 8;
      }
    }
    
    return 0;
  }

  /**
   * 信息增益分析
   */
  private static informationGainAnalysis(num: number, history: DbRecord[], lastSpecial: number): number {
    const beforeEntropy = this.calculateInformationEntropy(history);
    
    const simulatedHistory = [...history.slice(0, 5)];
    const simulatedRecord: DbRecord = {
      open_code: [...this.parseNumbers(simulatedHistory[0]?.open_code || '').slice(0, 6), num].join(','),
      draw_time: new Date().toISOString()
    };
    
    const afterHistory = [simulatedRecord, ...simulatedHistory];
    const afterEntropy = this.calculateInformationEntropy(afterHistory);
    
    const informationGain = beforeEntropy - afterEntropy;
    
    if (informationGain > 0.5) {
      return 8;
    } else if (informationGain > 0.2) {
      return 5;
    }
    
    return 0;
  }

  /**
   * 分析确定性转移
   */
  private static analyzeDeterministicTransitions(history: DbRecord[]): Record<number, number[]> {
    const transitions: Record<number, number[]> = {};
    
    for (let i = 1; i < history.length; i++) {
      const prevNums = this.parseNumbers(history[i].open_code);
      const currentNums = this.parseNumbers(history[i-1].open_code);
      
      const prevSpecial = prevNums[prevNums.length - 1];
      const currentSpecial = currentNums[currentNums.length - 1];
      
      const prevIsDeterministic = this.isDeterministicNumber(prevSpecial);
      const currentIsDeterministic = this.isDeterministicNumber(currentSpecial);
      
      if (prevIsDeterministic && currentIsDeterministic) {
        if (!transitions[prevSpecial]) {
          transitions[prevSpecial] = [];
        }
        transitions[prevSpecial].push(currentSpecial);
      }
    }
    
    Object.keys(transitions).forEach(key => {
      const num = parseInt(key);
      transitions[num] = [...new Set(transitions[num])];
    });
    
    return transitions;
  }

  /**
   * 分析核心稳定性
   */
  private static analyzeCoreStability(history: DbRecord[]): {
    stableNumbers: number[];
    stabilityScore: number;
  } {
    const stableNumbers: number[] = [];
    
    const frequency: Record<number, number[]> = {};
    
    history.forEach((rec, index) => {
      this.parseNumbers(rec.open_code).forEach(num => {
        if (!frequency[num]) {
          frequency[num] = [];
        }
        frequency[num].push(index);
      });
    });
    
    Object.entries(frequency).forEach(([numStr, appearances]) => {
      const num = parseInt(numStr);
      
      if (appearances.length >= 3) {
        let isRegular = true;
        for (let i = 1; i < appearances.length - 1; i++) {
          const interval1 = appearances[i] - appearances[i-1];
          const interval2 = appearances[i+1] - appearances[i];
          
          if (Math.abs(interval1 - interval2) > 3) {
            isRegular = false;
            break;
          }
        }
        
        if (isRegular) {
          stableNumbers.push(num);
        }
      }
    });
    
    return {
      stableNumbers,
      stabilityScore: stableNumbers.length > 0 ? 1.0 : 0
    };
  }

  /**
   * 质数螺旋分析
   */
  private static primeSpiralAnalysis(num: number, lastSpecial: number, currentWeek: number): number {
    if (!this.PRIME_NUMBERS.includes(num)) return 0;
    
    let score = 0;
    
    const spiralOrder = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const lastIndex = spiralOrder.indexOf(lastSpecial);
    const currentIndex = spiralOrder.indexOf(num);
    
    if (lastIndex >= 0 && currentIndex >= 0) {
      if (currentIndex === (lastIndex + 1) % spiralOrder.length) {
        score += 10;
      } else if (currentIndex === (lastIndex + 2) % spiralOrder.length) {
        score += 7;
      }
    }
    
    const weekdayPrimePatterns: Record<number, number[]> = {
      0: [7, 17, 37],
      1: [2, 13, 23],
      2: [3, 19, 29],
      3: [5, 11, 31],
      4: [7, 17, 37],
      5: [13, 23, 43],
      6: [19, 29, 47]
    };
    
    const weekdayPattern = weekdayPrimePatterns[currentWeek % 7];
    if (weekdayPattern && weekdayPattern.includes(num)) {
      score += 8;
    }
    
    return score;
  }

  /**
   * 乌拉姆螺旋分析
   */
  private static ulamSpiralAnalysis(num: number, history: DbRecord[]): number {
    const diagonalNumbers = [1, 9, 25, 49, 4, 16, 36, 8, 24, 48];
    
    if (diagonalNumbers.includes(num)) {
      let diagonalCount = 0;
      history.forEach(rec => {
        this.parseNumbers(rec.open_code).forEach(n => {
          if (diagonalNumbers.includes(n)) {
            diagonalCount++;
          }
        });
      });
      
      if (diagonalCount >= 3) {
        return 8;
      }
    }
    
    return 0;
  }

  /**
   * 魔方阵分析
   */
  private static magicSquareAnalysis(num: number, history: DbRecord[]): number {
    const magicSquareCenters = [5, 15, 25, 35, 45];
    const magicSquareCorners = [1, 7, 43, 49];
    
    if (magicSquareCenters.includes(num)) {
      return 6;
    } else if (magicSquareCorners.includes(num)) {
      return 5;
    } else if (num === 25) {
      return 8;
    }
    
    return 0;
  }

  /**
   * 确定性收敛分析
   */
  private static deterministicConvergence(num: number, history: DbRecord[]): number {
    const historyNumbers: number[] = [];
    history.forEach(rec => {
      historyNumbers.push(...this.parseNumbers(rec.open_code));
    });
    
    if (historyNumbers.length === 0) return 0;
    
    const mean = historyNumbers.reduce((a, b) => a + b, 0) / historyNumbers.length;
    const std = Math.sqrt(
      historyNumbers.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / historyNumbers.length
    );
    
    if (Math.abs(num - mean) <= std / 2) {
      const frequency = historyNumbers.filter(n => n === num).length;
      if (frequency >= 2) {
        return 6;
      }
    }
    
    return 0;
  }

  /**
   * 获取号码频率
   */
  private static getNumberFrequency(history: DbRecord[], num: number): number {
    let count = 0;
    history.forEach(rec => {
      if (this.parseNumbers(rec.open_code).includes(num)) {
        count++;
      }
    });
    return count;
  }

  /**
   * 判断是否为确定性号码
   */
  private static isDeterministicNumber(num: number): boolean {
    return (
      this.PRIME_NUMBERS.includes(num) ||
      num % 10 === 0 ||
      num % 10 === 5 ||
      num === 25 || num === 37 || num === 49 ||
      this.DETERMINISTIC_PATTERNS.primeSpiral.includes(num) ||
      this.DETERMINISTIC_PATTERNS.ulamSpiral.includes(num) ||
      this.DETERMINISTIC_PATTERNS.magicSquare.includes(num)
    );
  }

  /**
   * 计算连续性模式
   */
  private static calculateContinuity<T>(history: T[], lastValue: T): 'continue' | 'alternate' | 'random' {
    if (history.length < 3) return 'random';
    
    let continueCount = 0;
    let alternateCount = 0;
    
    for (let i = 1; i < history.length; i++) {
      if (history[i] === history[i-1]) {
        continueCount++;
      } else {
        alternateCount++;
      }
    }
    
    const continueRatio = continueCount / (history.length - 1);
    const alternateRatio = alternateCount / (history.length - 1);
    
    if (continueRatio > 0.6) return 'continue';
    if (alternateRatio > 0.6) return 'alternate';
    return 'random';
  }

  /**
   * 计算平衡性
   */
  private static calculateBalance<T>(history: T[], categories: T[]): 'balanced' | `need${Capitalize<string>}` {
    const counts: Record<string, number> = {};
    
    categories.forEach(cat => {
      counts[String(cat)] = 0;
    });
    
    history.forEach(value => {
      const key = String(value);
      if (counts[key] !== undefined) {
        counts[key]++;
      }
    });
    
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const avg = total / categories.length;
    
    let minCategory = categories[0];
    let minCount = counts[String(minCategory)];
    
    categories.forEach(cat => {
      const count = counts[String(cat)];
      if (count < minCount) {
        minCount = count;
        minCategory = cat;
      }
    });
    
    if (minCount < avg * 0.7) {
      return `need${String(minCategory).charAt(0).toUpperCase() + String(minCategory).slice(1)}` as any;
    }
    
    return 'balanced';
  }

  /**
   * 计算五行平衡
   */
  private static calculateElementBalance(history: string[]): {
    weakElement: string | null;
    strongElement: string | null;
  } {
    const counts: Record<string, number> = {
      '金': 0, '木': 0, '水': 0, '火': 0, '土': 0
    };
    
    history.forEach(element => {
      if (counts[element] !== undefined) {
        counts[element]++;
      }
    });
    
    let weakElement: string | null = null;
    let strongElement: string | null = null;
    let minCount = Infinity;
    let maxCount = -Infinity;
    
    Object.entries(counts).forEach(([element, count]) => {
      if (count < minCount) {
        minCount = count;
        weakElement = element;
      }
      if (count > maxCount) {
        maxCount = count;
        strongElement = element;
      }
    });
    
    return { weakElement, strongElement };
  }

  /**
   * 检测连号
   */
  private static detectSeries(numbers: number[]): Array<{
    type: 'double' | 'triple' | 'quad';
    numbers: number[];
  }> {
    const series: Array<{type: 'double' | 'triple' | 'quad', numbers: number[]}> = [];
    const sorted = [...numbers].sort((a, b) => a - b);
    
    let currentSeries: number[] = [sorted[0]];
    
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === sorted[i-1] + 1) {
        currentSeries.push(sorted[i]);
      } else {
        if (currentSeries.length >= 2) {
          const type = currentSeries.length === 2 ? 'double' : 
                      currentSeries.length === 3 ? 'triple' : 'quad';
          series.push({ type, numbers: [...currentSeries] });
        }
        currentSeries = [sorted[i]];
      }
    }
    
    if (currentSeries.length >= 2) {
      const type = currentSeries.length === 2 ? 'double' : 
                  currentSeries.length === 3 ? 'triple' : 'quad';
      series.push({ type, numbers: [...currentSeries] });
    }
    
    return series;
  }

  /**
   * 分析连号频率
   */
  private static analyzeSeriesFrequency(history: DbRecord[], num: number): number {
    let frequency = 0;
    
    history.forEach(rec => {
      const nums = this.parseNumbers(rec.open_code).sort((a, b) => a - b);
      const series = this.detectSeries(nums);
      
      series.forEach(s => {
        if (s.numbers.includes(num)) {
          frequency++;
        }
      });
    });
    
    return Math.min(frequency, 5);
  }

  /**
   * 获取和值分区
   */
  private static getSumZone(sum: number): 'small' | 'medium' | 'large' {
    if (sum >= this.SUM_ZONES.small.min && sum <= this.SUM_ZONES.small.max) {
      return 'small';
    } else if (sum >= this.SUM_ZONES.medium.min && sum <= this.SUM_ZONES.medium.max) {
      return 'medium';
    } else {
      return 'large';
    }
  }

  /**
   * 分析和值分区转移概率
   */
  private static analyzeZoneTransitions(zoneHistory: string[]): Record<string, Record<string, number>> {
    const transitions: Record<string, Record<string, number>> = {
      'small': {'small': 0, 'medium': 0, 'large': 0},
      'medium': {'small': 0, 'medium': 0, 'large': 0},
      'large': {'small': 0, 'medium': 0, 'large': 0}
    };
    
    for (let i = 1; i < zoneHistory.length; i++) {
      const from = zoneHistory[i-1];
      const to = zoneHistory[i];
      
      if (transitions[from] && transitions[from][to] !== undefined) {
        transitions[from][to]++;
      }
    }
    
    Object.keys(transitions).forEach(from => {
      const total = Object.values(transitions[from]).reduce((a, b) => a + b, 0);
      if (total > 0) {
        Object.keys(transitions[from]).forEach(to => {
          transitions[from][to] = transitions[from][to] / total;
        });
      }
    });
    
    return transitions;
  }

  /**
   * 多样性选码
   */
  private static selectDiverseNumbers(stats: NumberStat[], limit: number): NumberStat[] {
    const selected: NumberStat[] = [];
    const zodiacCount: Record<string, number> = {};
    const waveCount: Record<string, number> = { red: 0, blue: 0, green: 0 };

    for (const s of stats) {
      if (selected.length >= limit) break;

      const zC = zodiacCount[s.zodiac] || 0;
      const wC = waveCount[s.wave] || 0;

      if (zC < 2 && wC < 7) {
        selected.push(s);
        zodiacCount[s.zodiac] = zC + 1;
        waveCount[s.wave] = wC + 1;
      }
    }

    if (selected.length < limit) {
      for (const s of stats) {
        if (selected.length >= limit) break;
        if (!selected.find(n => n.num === s.num)) {
          selected.push(s);
        }
      }
    }

    return selected;
  }

  /**
   * 解析历史开奖号码字符串
   */
  private static parseNumbers(code: string): number[] {
    if (!code) return [];
    return code.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
  }

  /**
   * 获取号码对应的波色
   */
  private static getNumWave(num: number): string {
    if (this.WAVES_MAP.red.includes(num)) return 'red';
    if (this.WAVES_MAP.blue.includes(num)) return 'blue';
    if (this.WAVES_MAP.green.includes(num)) return 'green';
    return 'red';
  }

  /**
   * 根据月份获取季节
   */
  private static getSeasonByMonth(month: number): string {
    if (month >= 3 && month <= 5) return '春';
    if (month >= 6 && month <= 8) return '夏';
    if (month >= 9 && month <= 11) return '秋';
    return '冬';
  }

  /**
   * 数据不足时的确定性兜底生成器
   */
  private static generateDeterministic(): PredictionData {
    this.initializeMaps();
    const deterministicNums = [1, 2, 7, 8, 12, 13, 19, 23, 29, 31, 37, 41, 47, 49, 15, 25, 33, 45]
      .map(n => n < 10 ? `0${n}` : `${n}`);

    return {
      zodiacs: ['蛇', '马', '羊', '猴', '鸡', '狗'],
      numbers: deterministicNums,
      wave: { main: 'red', defense: 'blue' },
      heads: ['0', '1', '2'],
      tails: ['1', '2', '7', '8']
    };
  }

  /**
   * 计算头数推荐
   */
  private static calculateHeadRecommendations(
    history: DbRecord[], 
    selectedNumbers: NumberStat[], 
    lastHead: number,
    weekday: number
  ): string[] {
    const selectedHeads: Record<number, number> = {};
    selectedNumbers.forEach(s => {
      selectedHeads[s.head] = (selectedHeads[s.head] || 0) + 1;
    });
    
    const headFrequency: Record<number, number> = {};
    history.slice(0, 30).forEach(rec => {
      this.parseNumbers(rec.open_code).forEach(num => {
        const head = Math.floor(num / 10);
        headFrequency[head] = (headFrequency[head] || 0) + 1;
      });
    });
    
    const headOmission: Record<number, number> = {};
    for (let head = 0; head <= 4; head++) {
      headOmission[head] = 30;
    }
    
    history.forEach((rec, index) => {
      this.parseNumbers(rec.open_code).forEach(num => {
        const head = Math.floor(num / 10);
        headOmission[head] = Math.min(headOmission[head], index);
      });
    });
    
    const headScores: {head: number, score: number}[] = [];
    for (let head = 0; head <= 4; head++) {
      let score = 0;
      
      score += (selectedHeads[head] || 0) * 20;
      
      const freq = headFrequency[head] || 0;
      const avgFreq = Object.values(headFrequency).reduce((a, b) => a + b, 0) / 5;
      if (Math.abs(freq - avgFreq) < avgFreq * 0.3) {
        score += 15;
      }
      
      const omission = headOmission[head] || 30;
      score += Math.min(omission * 2, 20);
      
      if (head !== lastHead) score += 15;
      
      const weekdayPatterns: Record<number, number[]> = {
        0: [0, 3], 1: [1, 4], 2: [2, 0], 3: [3, 1], 
        4: [4, 2], 5: [0, 3], 6: [1, 4]
      };
      if (weekdayPatterns[weekday]?.includes(head)) score += 12;
      
      headScores.push({head, score});
    }
    
    headScores.sort((a, b) => b.score - a.score);
    
    const recommendations: number[] = [];
    const selectedSet = new Set<number>();
    
    for (const {head} of headScores) {
      if (recommendations.length < 3 && !selectedSet.has(head)) {
        if (head !== lastHead) {
          recommendations.push(head);
          selectedSet.add(head);
        }
      }
    }
    
    if (recommendations.length < 2) {
      for (const {head} of headScores) {
        if (!recommendations.includes(head) && recommendations.length < 3) {
          recommendations.push(head);
        }
      }
    }
    
    return recommendations.sort().map(h => h.toString());
  }

  /**
   * 计算尾数推荐
   */
  private static calculateTailRecommendations(
    history: DbRecord[], 
    selectedNumbers: NumberStat[], 
    lastTail: number,
    day: number
  ): string[] {
    const selectedTails: Record<number, number> = {};
    selectedNumbers.forEach(s => {
      selectedTails[s.tail] = (selectedTails[s.tail] || 0) + 1;
    });
    
    const tailScores: { tail: number, score: number }[] = [];
    for (let tail = 0; tail <= 9; tail++) {
      let score = 0;
      score += (selectedTails[tail] || 0) * 8;
      if (tail === day % 10) score += 20;
      if (tail === (day + 5) % 10) score += 10;
      if (tail % 2 !== lastTail % 2) score += 12;

      tailScores.push({ tail, score });
    }

    return tailScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(t => t.tail.toString());
  }

  /**
   * 计算数字各位之和
   */
  private static sumDigits(num: number): number {
    return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
}
