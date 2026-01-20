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
  
  // 三十二维度评分系统
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
  
  totalScore: number;
}

interface AlgorithmWeight {
  name: string;
  key: keyof NumberStat;
  weight: number;
  accuracy: number;
  recentAccuracy: number[];
  adjustments: number;
  lastAdjustment: number;
}

interface BacktestResult {
  date: string;
  predictedNumbers: number[];
  actualNumbers: number[];
  correctCount: number;
  algorithmContributions: Record<string, number>;
  specialNumberAccuracy: boolean;
  specialNumber: number;
  predictedSpecialRank: number;
}

/**
 * 🔮 Quantum Matrix Prediction Engine v15.0 "Auto-Optimizing Edition"
 * 新增功能：自动回测 + 权重动态优化 + 智能算法识别
 */
export class PredictionEngine {
  
  // 算法权重管理器
  private static algorithmWeights: AlgorithmWeight[] = [
    { name: '生肖转移概率', key: 'scoreZodiacTrans', weight: 2.5, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '特码转移概率', key: 'scoreNumberTrans', weight: 2.0, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '历史镜像', key: 'scoreHistoryMirror', weight: 1.5, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '特码轨迹', key: 'scoreSpecialTraj', weight: 1.3, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '形态几何', key: 'scorePattern', weight: 1.2, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '尾数力场', key: 'scoreTail', weight: 1.0, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '三合局势', key: 'scoreZodiac', weight: 1.0, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '五行平衡', key: 'scoreWuXing', weight: 0.9, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '波色惯性', key: 'scoreWave', weight: 0.9, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '黄金密钥', key: 'scoreGold', weight: 0.8, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '遗漏回补', key: 'scoreOmission', weight: 0.8, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '季节规律', key: 'scoreSeasonal', weight: 0.7, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '质数分布', key: 'scorePrime', weight: 0.7, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '和值分析', key: 'scoreSumAnalysis', weight: 0.6, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '位置分析', key: 'scorePosition', weight: 0.6, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '频率分析', key: 'scoreFrequency', weight: 0.6, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '聚类分析', key: 'scoreCluster', weight: 0.5, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '对称分析', key: 'scoreSymmetry', weight: 0.5, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '周期分析', key: 'scorePeriodic', weight: 0.5, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '趋势分析', key: 'scoreTrend', weight: 0.5, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '头数分析', key: 'scoreHeadAnalysis', weight: 0.8, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '尾数模式', key: 'scoreTailPattern', weight: 0.8, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '关联性分析', key: 'scoreCorrelation', weight: 0.7, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '属性分析', key: 'scoreProperty', weight: 0.7, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '时间模式', key: 'scoreTimePattern', weight: 0.6, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '连号模式', key: 'scoreSeriesPattern', weight: 0.6, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '和值分区', key: 'scoreSumZone', weight: 0.5, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '五行相生相克', key: 'scoreElementRelation', weight: 0.5, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '矩阵坐标分析', key: 'scoreMatrixCoordinate', weight: 0.4, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '晶格分布分析', key: 'scoreLatticeDistribution', weight: 0.4, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '混沌模式分析', key: 'scoreChaosPattern', weight: 0.4, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '分形维度分析', key: 'scoreFractalDimension', weight: 0.4, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '信息熵分析', key: 'scoreEntropyAnalysis', weight: 0.4, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
    { name: '确定性核心分析', key: 'scoreDeterministicCore', weight: 0.6, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 }
  ];

  // 回测历史记录
  private static backtestHistory: BacktestResult[] = [];
  private static optimizationCycle: number = 0;
  private static lastOptimizationDate: string = '';
  private static bestWeights: Record<string, number> = {};
  private static accuracyHistory: number[] = [];
  private static specialAccuracyHistory: number[] = [];

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
  
  // 五行相生相克关系
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

  // 季节映射
  static SEASONAL_ZODIACS: Record<string, string[]> = {
    '春': ['虎', '兔', '龙'],
    '夏': ['蛇', '马', '羊'],
    '秋': ['猴', '鸡', '狗'],
    '冬': ['猪', '鼠', '牛']
  };

  // 质数号码
  static PRIME_NUMBERS: number[] = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

  // 对称号码对
  static SYMMETRY_PAIRS: [number, number][] = [
    [1, 49], [2, 48], [3, 47], [4, 46], [5, 45], [6, 44], [7, 43],
    [8, 42], [9, 41], [10, 40], [11, 39], [12, 38], [13, 37], [14, 36],
    [15, 35], [16, 34], [17, 33], [18, 32], [19, 31], [20, 30], [21, 29],
    [22, 28], [23, 27], [24, 26]
  ];

  // 矩阵坐标映射 (7x7矩阵)
  static MATRIX_COORDINATES: Record<number, {row: number, col: number}> = {};
  
  // 聚类分组 (1-7组)
  static CLUSTER_GROUPS: Record<number, number[]> = {
    1: [1, 2, 3, 4, 5, 6, 7],
    2: [8, 9, 10, 11, 12, 13, 14],
    3: [15, 16, 17, 18, 19, 20, 21],
    4: [22, 23, 24, 25, 26, 27, 28],
    5: [29, 30, 31, 32, 33, 34, 35],
    6: [36, 37, 38, 39, 40, 41, 42],
    7: [43, 44, 45, 46, 47, 48, 49]
  };

  // 晶格分布模式
  static LATTICE_PATTERNS = {
    fibonacci: [1, 2, 3, 5, 8, 13, 21, 34],
    goldenRatio: [8, 13, 21, 34],
    arithmetic: [5, 10, 15, 20, 25, 30, 35, 40, 45],
    geometric: [2, 4, 8, 16, 32]
  };

  // 分形模式
  static FRACTAL_PATTERNS = {
    mandelbrot: [3, 7, 11, 19, 23, 31, 39, 43],
    julia: [2, 5, 10, 17, 26, 37],
    sierpinski: [1, 3, 9, 27]
  };

  // 确定性核心模式
  static DETERMINISTIC_PATTERNS = {
    primeSpiral: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47],
    ulamSpiral: [1, 7, 19, 37, 13, 31, 49, 21, 43],
    magicSquare: [15, 25, 35, 45, 5, 10, 20, 30, 40]
  };

  // 头数映射 (0-4)
  static HEAD_MAP: Record<number, number[]> = {
    0: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    1: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    2: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    3: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
    4: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49]
  };

  // 尾数分组
  static TAIL_GROUPS: Record<string, number[]> = {
    '小': [0, 1, 2, 3, 4],
    '大': [5, 6, 7, 8, 9],
    '质': [2, 3, 5, 7],
    '合': [0, 1, 4, 6, 8, 9]
  };

  // 和值分区
  static SUM_ZONES = {
    small: { min: 120, max: 175 },
    medium: { min: 176, max: 210 },
    large: { min: 211, max: 285 }
  };

  // 周期分析参数
  static PERIODIC_CYCLES = {
    zodiac: 12,
    wave: 7,
    wuxing: 5,
    tail: 10,
    head: 8,
    cluster: 7,
    matrix: 49
  };

  // 时间模式映射
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
    
    // 生肖映射
    for (const [z, nums] of Object.entries(this.ZODIACS_MAP)) {
      nums.forEach(n => this.NUM_TO_ZODIAC[n] = z);
    }
    
    // 五行映射
    for (const [w, nums] of Object.entries(this.WU_XING_MAP)) {
      nums.forEach(n => this.NUM_TO_WUXING[n] = w);
    }
    
    // 其他属性映射
    for (let num = 1; num <= 49; num++) {
      this.NUM_TO_HEAD[num] = Math.floor(num / 10);
      this.NUM_TO_SIZE[num] = num <= 25 ? 'small' : 'large';
      this.NUM_TO_PARITY[num] = num % 2 === 0 ? 'even' : 'odd';
      this.NUM_TO_PRIME[num] = this.PRIME_NUMBERS.includes(num);
      
      // 聚类分组
      for (const [cluster, nums] of Object.entries(this.CLUSTER_GROUPS)) {
        if (nums.includes(num)) {
          this.NUM_TO_CLUSTER[num] = parseInt(cluster);
          break;
        }
      }
      
      // 矩阵坐标
      const row = Math.floor((num - 1) / 7) + 1;
      const col = ((num - 1) % 7) + 1;
      this.NUM_TO_MATRIX[num] = { row, col };
      this.MATRIX_COORDINATES[num] = { row, col };
    }
  }

  /**
   * 自动回测函数 - 评估算法准确率
   */
  static autoBacktest(history: DbRecord[], testPeriods: number = 30): {
    accuracy: number;
    specialAccuracy: number;
    algorithmPerformance: Record<string, number>;
    recommendations: string[];
  } {
    this.initializeMaps();
    
    if (history.length < testPeriods + 50) {
      return {
        accuracy: 0,
        specialAccuracy: 0,
        algorithmPerformance: {},
        recommendations: ['需要更多历史数据']
      };
    }

    const results: BacktestResult[] = [];
    const algorithmContributions: Record<string, { hits: number, total: number }> = {};
    
    // 初始化算法贡献统计
    this.algorithmWeights.forEach(weight => {
      algorithmContributions[weight.name] = { hits: 0, total: 0 };
    });

    // 进行回测
    for (let i = 0; i < testPeriods; i++) {
      const testIndex = i;
      const trainingData = history.slice(testIndex + 1);
      const actualRecord = history[testIndex];
      
      try {
        // 使用训练数据生成预测
        const prediction = this.generateForBacktest(trainingData, 'mark-six');
        const predictedNumbers = prediction.numbers.map(n => parseInt(n));
        const actualNumbers = this.parseNumbers(actualRecord.open_code);
        const actualSpecial = actualNumbers[actualNumbers.length - 1];
        
        // 计算正确数量
        const correctCount = predictedNumbers.filter(n => actualNumbers.includes(n)).length;
        
        // 计算特码准确度
        const predictedStats = this.calculateStatsForBacktest(trainingData, actualRecord.draw_time || '');
        const predictedSpecialRank = predictedStats.findIndex(s => s.num === actualSpecial) + 1;
        const specialNumberAccuracy = predictedSpecialRank <= 18; // 是否在前18个推荐中
        
        // 记录算法贡献
        const contributions = this.analyzeAlgorithmContributions(predictedStats, actualNumbers);
        Object.keys(contributions).forEach(algoName => {
          if (algorithmContributions[algoName]) {
            algorithmContributions[algoName].hits += contributions[algoName];
            algorithmContributions[algoName].total += 1;
          }
        });
        
        results.push({
          date: actualRecord.draw_time || '',
          predictedNumbers,
          actualNumbers,
          correctCount,
          algorithmContributions: contributions,
          specialNumberAccuracy,
          specialNumber: actualSpecial,
          predictedSpecialRank
        });
        
      } catch (error) {
        console.warn(`回测第${i + 1}期失败:`, error);
      }
    }

    // 计算整体准确率
    const avgCorrect = results.reduce((sum, r) => sum + r.correctCount, 0) / results.length;
    const avgAccuracy = avgCorrect / 18; // 18个推荐号码
    const specialAccuracy = results.filter(r => r.specialNumberAccuracy).length / results.length;
    
    // 计算算法表现
    const algorithmPerformance: Record<string, number> = {};
    Object.keys(algorithmContributions).forEach(algoName => {
      const stats = algorithmContributions[algoName];
      if (stats.total > 0) {
        algorithmPerformance[algoName] = stats.hits / stats.total;
      }
    });
    
    // 分析并生成优化建议
    const recommendations = this.generateOptimizationRecommendations(results, algorithmPerformance);
    
    // 存储回测结果
    this.backtestHistory = [...results, ...this.backtestHistory].slice(0, 100);
    this.accuracyHistory.push(avgAccuracy);
    this.specialAccuracyHistory.push(specialAccuracy);
    
    // 如果准确率下降，自动调整权重
    if (this.accuracyHistory.length >= 5) {
      const recentAvg = this.accuracyHistory.slice(-5).reduce((a, b) => a + b, 0) / 5;
      const previousAvg = this.accuracyHistory.slice(-10, -5).reduce((a, b) => a + b, 0) / 5 || recentAvg;
      
      if (recentAvg < previousAvg * 0.9) {
        console.log(`准确率下降 (${previousAvg.toFixed(3)} -> ${recentAvg.toFixed(3)}), 触发自动权重调整`);
        this.autoAdjustWeights(results, algorithmPerformance);
      }
    }
    
    return {
      accuracy: avgAccuracy,
      specialAccuracy,
      algorithmPerformance,
      recommendations
    };
  }

  /**
   * 自动调整算法权重
   */
  private static autoAdjustWeights(results: BacktestResult[], algorithmPerformance: Record<string, number>) {
    const now = Date.now();
    
    // 避免频繁调整 (至少间隔24小时)
    if (now - this.algorithmWeights[0].lastAdjustment < 24 * 60 * 60 * 1000) {
      return;
    }
    
    console.log('开始自动权重调整...');
    
    // 计算每个算法的准确率趋势
    this.algorithmWeights.forEach(weight => {
      const performance = algorithmPerformance[weight.name] || 0;
      const recentAccuracies = weight.recentAccuracy;
      
      // 记录最近准确率
      recentAccuracies.push(performance);
      if (recentAccuracies.length > 10) {
        recentAccuracies.shift();
      }
      
      // 计算趋势
      if (recentAccuracies.length >= 3) {
        const recentAvg = recentAccuracies.slice(-3).reduce((a, b) => a + b, 0) / 3;
        const previousAvg = recentAccuracies.slice(-6, -3).reduce((a, b) => a + b, 0) / 3 || recentAvg;
        
        // 调整权重
        let adjustment = 0;
        if (recentAvg > previousAvg * 1.2) {
          // 表现显著提升，增加权重
          adjustment = weight.weight * 0.15;
          console.log(`算法 ${weight.name} 表现提升 (+${(recentAvg - previousAvg).toFixed(3)})，权重增加: ${weight.weight.toFixed(2)} -> ${(weight.weight + adjustment).toFixed(2)}`);
        } else if (recentAvg < previousAvg * 0.8) {
          // 表现显著下降，减少权重
          adjustment = -weight.weight * 0.1;
          console.log(`算法 ${weight.name} 表现下降 (${(recentAvg - previousAvg).toFixed(3)})，权重减少: ${weight.weight.toFixed(2)} -> ${(weight.weight + adjustment).toFixed(2)}`);
        }
        
        // 应用调整，确保权重在合理范围内
        weight.weight = Math.max(0.1, Math.min(5, weight.weight + adjustment));
        weight.adjustments++;
        weight.lastAdjustment = now;
      }
      
      // 更新准确率
      weight.accuracy = performance;
    });
    
    // 规范化权重，确保总和不变
    this.normalizeWeights();
    
    // 记录最佳权重
    this.recordBestWeights();
    
    this.optimizationCycle++;
    this.lastOptimizationDate = new Date().toISOString();
    
    console.log(`权重调整完成 (第${this.optimizationCycle}次调整)`);
  }

  /**
   * 规范化权重，保持总和相对稳定
   */
  private static normalizeWeights() {
    const totalWeight = this.algorithmWeights.reduce((sum, w) => sum + w.weight, 0);
    const targetTotal = 22.6; // 原始权重总和
    
    if (totalWeight > 0) {
      const scale = targetTotal / totalWeight;
      this.algorithmWeights.forEach(w => {
        w.weight = w.weight * scale;
      });
    }
  }

  /**
   * 记录最佳权重组合
   */
  private static recordBestWeights() {
    const currentAccuracy = this.accuracyHistory[this.accuracyHistory.length - 1] || 0;
    const currentSpecialAccuracy = this.specialAccuracyHistory[this.specialAccuracyHistory.length - 1] || 0;
    
    const currentWeights = this.algorithmWeights.reduce((acc, w) => {
      acc[w.name] = w.weight;
      return acc;
    }, {} as Record<string, number>);
    
    // 如果没有最佳权重记录，或者当前准确率更高，则更新
    if (!this.bestWeights || Object.keys(this.bestWeights).length === 0) {
      this.bestWeights = currentWeights;
    } else {
      const bestAccuracy = this.accuracyHistory.reduce((max, acc) => Math.max(max, acc), 0);
      if (currentAccuracy > bestAccuracy * 1.05 || 
          (currentAccuracy > bestAccuracy && currentSpecialAccuracy > 0.25)) {
        this.bestWeights = currentWeights;
        console.log('发现更优权重组合，已记录');
      }
    }
  }

  /**
   * 生成优化建议
   */
  private static generateOptimizationRecommendations(
    results: BacktestResult[], 
    algorithmPerformance: Record<string, number>
  ): string[] {
    const recommendations: string[] = [];
    
    // 分析整体表现
    const avgCorrect = results.reduce((sum, r) => sum + r.correctCount, 0) / results.length;
    const specialAccuracy = results.filter(r => r.specialNumberAccuracy).length / results.length;
    
    if (avgCorrect < 3) {
      recommendations.push('整体命中率较低，建议增加历史数据训练量');
    }
    
    if (specialAccuracy < 0.2) {
      recommendations.push('特码命中率偏低，建议加强特码相关算法权重');
    }
    
    // 分析算法表现
    const underperformingAlgos = Object.entries(algorithmPerformance)
      .filter(([_, accuracy]) => accuracy < 0.15)
      .map(([name, _]) => name);
    
    if (underperformingAlgos.length > 0) {
      recommendations.push(`以下算法表现不佳，考虑调整: ${underperformingAlgos.join(', ')}`);
    }
    
    // 分析号码分布
    const allPredicted = results.flatMap(r => r.predictedNumbers);
    const allActual = results.flatMap(r => r.actualNumbers);
    
    const predictedDist = this.analyzeNumberDistribution(allPredicted);
    const actualDist = this.analyzeNumberDistribution(allActual);
    
    // 找出预测偏差较大的号码范围
    for (let i = 1; i <= 49; i++) {
      const predictedFreq = predictedDist[i] || 0;
      const actualFreq = actualDist[i] || 0;
      const diff = Math.abs(predictedFreq - actualFreq);
      
      if (diff > results.length * 0.3) {
        if (predictedFreq > actualFreq) {
          recommendations.push(`号码${i}预测频率过高，建议降低相关评分`);
        } else {
          recommendations.push(`号码${i}预测频率过低，建议增加相关评分`);
        }
      }
    }
    
    // 分析生肖表现
    const zodiacPerformance = this.analyzeZodiacPerformance(results);
    const underperformingZodiacs = Object.entries(zodiacPerformance)
      .filter(([_, accuracy]) => accuracy < 0.15)
      .map(([name, _]) => name);
    
    if (underperformingZodiacs.length > 0) {
      recommendations.push(`以下生肖预测准确率偏低: ${underperformingZodiacs.join(', ')}`);
    }
    
    return recommendations.slice(0, 5); // 最多返回5条建议
  }

  /**
   * 分析号码分布
   */
  private static analyzeNumberDistribution(numbers: number[]): Record<number, number> {
    const distribution: Record<number, number> = {};
    numbers.forEach(num => {
      distribution[num] = (distribution[num] || 0) + 1;
    });
    return distribution;
  }

  /**
   * 分析生肖表现
   */
  private static analyzeZodiacPerformance(results: BacktestResult[]): Record<string, number> {
    const zodiacStats: Record<string, { predicted: number, actual: number, correct: number }> = {};
    
    results.forEach(result => {
      const predictedZodiacs = result.predictedNumbers.map(n => this.NUM_TO_ZODIAC[n]);
      const actualZodiacs = result.actualNumbers.map(n => this.NUM_TO_ZODIAC[n]);
      
      actualZodiacs.forEach(zodiac => {
        if (!zodiacStats[zodiac]) {
          zodiacStats[zodiac] = { predicted: 0, actual: 0, correct: 0 };
        }
        zodiacStats[zodiac].actual++;
        
        if (predictedZodiacs.includes(zodiac)) {
          zodiacStats[zodiac].predicted++;
          zodiacStats[zodiac].correct++;
        }
      });
    });
    
    const performance: Record<string, number> = {};
    Object.keys(zodiacStats).forEach(zodiac => {
      if (zodiacStats[zodiac].predicted > 0) {
        performance[zodiac] = zodiacStats[zodiac].correct / zodiacStats[zodiac].predicted;
      }
    });
    
    return performance;
  }

  /**
   * 分析算法贡献度
   */
  private static analyzeAlgorithmContributions(stats: NumberStat[], actualNumbers: number[]): Record<string, number> {
    const contributions: Record<string, number> = {};
    
    // 找出实际命中的号码
    const hitNumbers = stats.filter(s => actualNumbers.includes(s.num));
    
    hitNumbers.forEach(stat => {
      // 找出对该号码贡献最大的算法
      let maxContribution = 0;
      let mainAlgorithm = '';
      
      this.algorithmWeights.forEach(weight => {
        const contribution = (stat[weight.key] as number) * weight.weight;
        if (contribution > maxContribution) {
          maxContribution = contribution;
          mainAlgorithm = weight.name;
        }
      });
      
      if (mainAlgorithm) {
        contributions[mainAlgorithm] = (contributions[mainAlgorithm] || 0) + 1;
      }
    });
    
    return contributions;
  }

  /**
   * 为主函数优化的生成函数
   */
  static generate(history: DbRecord[], type: LotteryType): PredictionData {
    this.initializeMaps();
    
    // 检查是否需要回测
    const currentDate = new Date().toISOString().split('T')[0];
    if (this.lastOptimizationDate.split('T')[0] !== currentDate) {
      // 每日自动回测一次
      try {
        const backtestResult = this.autoBacktest(history.slice(0, 100), 20);
        console.log('自动回测结果:', {
          准确率: backtestResult.accuracy.toFixed(3),
          特码准确率: backtestResult.specialAccuracy.toFixed(3),
          建议: backtestResult.recommendations
        });
      } catch (error) {
        console.warn('自动回测失败:', error);
      }
    }
    
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
    
    // 获取当前时间信息
    const currentDateObj = history[0].draw_time ? new Date(history[0].draw_time) : new Date();
    const currentMonth = currentDateObj.getMonth() + 1;
    const currentSeason = this.getSeasonByMonth(currentMonth);
    const currentWeek = Math.floor(currentDateObj.getDate() / 7) + 1;
    const currentDay = currentDateObj.getDate();
    const currentWeekday = currentDateObj.getDay();
    
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
        
        totalScore: 0
      };
    });

    // ==========================================
    // 执行所有算法分析（与原始代码相同）
    // ==========================================
    
    // 1. 生肖转移概率
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

    // 2. 特码转移概率
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

    // 3. 历史镜像分析
    const mirrorScores = this.calculateHistoryMirror(fullHistory, lastDrawNums);
    stats.forEach(s => s.scoreHistoryMirror = mirrorScores[s.num] || 0);

    // 4. 特码轨迹分析
    const trajectoryAnalysis = this.analyzeTrajectory(fullHistory, lastSpecial);
    stats.forEach(s => {
      s.scoreSpecialTraj = trajectoryAnalysis[s.num] || 0;
    });

    // 5. 形态几何分析
    const patternScores = this.calculatePatternScores(lastDrawNums, recent10);
    stats.forEach(s => {
      s.scorePattern = patternScores[s.num] || 0;
    });

    // 6. 尾数力场分析
    const tailScores = this.calculateTailScores(recent10);
    stats.forEach(s => {
      s.scoreTail = tailScores[s.tail] || 0;
    });

    // 7. 三合局势分析
    const zodiacScores = this.calculateZodiacScores(recent20, lastSpecialZodiac);
    stats.forEach(s => {
      s.scoreZodiac = zodiacScores[s.zodiac] || 0;
    });

    // 8. 五行平衡分析
    const wuxingScores = this.calculateWuxingScores(recent10);
    stats.forEach(s => {
      s.scoreWuXing = wuxingScores[s.wuxing] || 0;
    });

    // 9. 波色惯性分析
    const waveScores = this.calculateWaveScores(recent10, lastSpecial);
    stats.forEach(s => {
      s.scoreWave = waveScores[s.wave] || 0;
    });

    // 10. 黄金密钥分析
    const goldNumbers = this.calculateGoldNumbers(lastDrawSum, lastSpecial);
    stats.forEach(s => {
      if (goldNumbers.includes(s.num)) s.scoreGold = 25;
    });

    // 11. 遗漏回补分析
    const omissionScores = this.calculateOmissionScores(fullHistory, 40);
    stats.forEach(s => {
      s.scoreOmission = omissionScores[s.num] || 0;
    });

    // 12. 季节规律分析
    const seasonalScores = this.calculateSeasonalScores(currentMonth, currentWeek);
    stats.forEach(s => {
      s.scoreSeasonal = seasonalScores[s.zodiac] || 0;
      if (s.num % 10 === currentMonth % 10) s.scoreSeasonal += 5;
    });

    // 13. 质数分布分析
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

    // 14. 和值分析
    const sumAnalysis = this.analyzeSumPatterns(recent20, lastDrawSum);
    stats.forEach(s => {
      const simulatedSum = lastDrawSum - lastSpecial + s.num;
      s.scoreSumAnalysis = sumAnalysis.getScore(simulatedSum);
    });

    // 15. 位置分析
    const positionScores = this.calculatePositionScores(recent20);
    stats.forEach(s => {
      s.scorePosition = positionScores[s.num] || 0;
    });

    // 16. 频率分析
    const frequencyScores = this.calculateFrequencyScores(recent30);
    stats.forEach(s => {
      s.scoreFrequency = frequencyScores[s.num] || 0;
    });

    // 17. 聚类分析
    const clusterScores = this.calculateClusterScores(lastDrawNums, recent20);
    stats.forEach(s => {
      s.scoreCluster = clusterScores[s.num] || 0;
    });

    // 18. 对称分析
    const symmetryScores = this.calculateSymmetryScores(recent20, lastDrawNums);
    stats.forEach(s => {
      s.scoreSymmetry = symmetryScores[s.num] || 0;
    });

    // 19. 周期分析
    const periodicScores = this.calculatePeriodicScores(fullHistory, currentWeek);
    stats.forEach(s => {
      s.scorePeriodic = periodicScores[s.num] || 0;
    });

    // 20. 趋势分析
    const trendScores = this.calculateTrendScores(fullHistory);
    stats.forEach(s => {
      s.scoreTrend = trendScores[s.num] || 0;
    });

    // 21. 头数分析
    const headAnalysis = this.analyzeHeadPatterns(recent30, lastDrawHead, currentWeekday);
    stats.forEach(s => {
      s.scoreHeadAnalysis = headAnalysis.getScore(s.head, s.num);
    });

    // 22. 尾数模式分析
    const tailPatternAnalysis = this.analyzeTailPatterns(recent20, lastDrawTail, currentDay);
    stats.forEach(s => {
      s.scoreTailPattern = tailPatternAnalysis.getScore(s.tail, s.num);
    });

    // 23. 关联性分析
    const correlationScores = this.calculateCorrelationScores(recent30, lastDrawNums);
    stats.forEach(s => {
      s.scoreCorrelation = correlationScores[s.num] || 0;
    });

    // 24. 属性分析
    const propertyAnalysis = this.analyzePropertyPatterns(recent20, lastSpecial);
    stats.forEach(s => {
      s.scoreProperty = propertyAnalysis.getScore(s);
    });

    // 25. 时间模式分析
    const timePatternScores = this.calculateTimePatternScores(currentWeekday, currentMonthPeriod, currentDay);
    stats.forEach(s => {
      s.scoreTimePattern = timePatternScores[s.num] || 0;
    });

    // 26. 连号模式分析
    const seriesPatternScores = this.analyzeSeriesPatterns(recent20, lastDrawNums);
    stats.forEach(s => {
      s.scoreSeriesPattern = seriesPatternScores[s.num] || 0;
    });

    // 27. 和值分区分析
    const sumZoneAnalysis = this.analyzeSumZonePatterns(recent20, lastDrawSum);
    stats.forEach(s => {
      const simulatedSum = lastDrawSum - lastSpecial + s.num;
      s.scoreSumZone = sumZoneAnalysis.getScore(simulatedSum);
    });

    // 28. 五行相生相克分析
    const elementRelationScores = this.calculateElementRelationScores(recent10, lastSpecial);
    stats.forEach(s => {
      s.scoreElementRelation = elementRelationScores[s.num] || 0;
    });

    // 29. 矩阵坐标分析
    const matrixCoordinateScores = this.calculateMatrixCoordinateScores(recent20, lastMatrix, currentWeekday);
    stats.forEach(s => {
      s.scoreMatrixCoordinate = matrixCoordinateScores[s.num] || 0;
    });

    // 30. 晶格分布分析
    const latticeDistributionScores = this.calculateLatticeDistributionScores(recent30, lastSpecial);
    stats.forEach(s => {
      s.scoreLatticeDistribution = latticeDistributionScores[s.num] || 0;
    });

    // 31. 混沌模式分析
    const chaosPatternScores = this.analyzeChaosPatterns(recent50, lastSpecial);
    stats.forEach(s => {
      s.scoreChaosPattern = chaosPatternScores[s.num] || 0;
    });

    // 32. 分形维度分析
    const fractalDimensionScores = this.calculateFractalDimensionScores(recent30);
    stats.forEach(s => {
      s.scoreFractalDimension = fractalDimensionScores[s.num] || 0;
    });

    // 33. 信息熵分析
    const entropyAnalysisScores = this.analyzeEntropyPatterns(recent20, lastSpecial);
    stats.forEach(s => {
      s.scoreEntropyAnalysis = entropyAnalysisScores[s.num] || 0;
    });

    // 34. 确定性核心分析
    const deterministicCoreScores = this.calculateDeterministicCoreScores(fullHistory, lastSpecial, currentWeek);
    stats.forEach(s => {
      s.scoreDeterministicCore = deterministicCoreScores[s.num] || 0;
    });

    // ==========================================
    // 最终汇总 - 使用动态调整的权重
    // ==========================================
    stats.forEach(s => {
      // 使用动态权重计算总分
      let totalScore = 0;
      
      this.algorithmWeights.forEach(weight => {
        const score = s[weight.key] as number;
        totalScore += score * weight.weight;
      });
      
      // 确定性微调
      const deterministicAdjustment = this.getDeterministicAdjustment(
        s.num, lastSpecial, currentDay, currentWeekday
      );
      totalScore += deterministicAdjustment;
      
      // 附加分
      if (s.tail % 2 === lastDrawTail % 2) {
        totalScore += 2;
      }
      
      if (s.head === (lastDrawHead + 1) % 5) {
        totalScore += 3;
      }
      
      s.totalScore = totalScore;
    });

    // ==========================================
    // 重复惩罚机制
    // ==========================================
    stats.forEach(s => {
      if (s.num === lastSpecial) {
        s.totalScore *= 0.3;
      }
      
      if (s.zodiac === lastSpecialZodiac && s.num !== lastSpecial) {
        s.totalScore *= 0.85;
      }
      
      if (lastDrawNums.includes(s.num) && s.num !== lastSpecial) {
        s.totalScore *= 0.9;
      }
      
      const recentZodiacCount = this.getRecentZodiacCount(recent20, s.zodiac);
      if (recentZodiacCount > 8) {
        s.totalScore *= 0.8;
      }
    });

    // 排序
    stats.sort((a, b) => b.totalScore - a.totalScore);

    // 多样性选码
    const final18 = this.selectDiverseNumbers(stats, 18);
    const resultNumbers = final18.map(s => s.num).sort((a, b) => a - b).map(n => n < 10 ? `0${n}` : `${n}`);

    // 计算推荐肖
    const zMap: Record<string, number> = {};
    final18.forEach(s => zMap[s.zodiac] = (zMap[s.zodiac] || 0) + s.totalScore);
    
    const allZodiacs = Object.keys(this.ZODIACS_MAP);
    const zodiacScoresList = allZodiacs.map(z => ({
      zodiac: z,
      score: zMap[z] || 0
    })).sort((a, b) => b.score - a.score);
    
    const recZodiacs = zodiacScoresList
      .filter(z => z.zodiac !== lastSpecialZodiac)
      .slice(0, 6)
      .map(z => z.zodiac);

    if (recZodiacs.length < 6) {
      const remainingZodiacs = zodiacScoresList
        .filter(z => !recZodiacs.includes(z.zodiac))
        .slice(0, 6 - recZodiacs.length)
        .map(z => z.zodiac);
      recZodiacs.push(...remainingZodiacs);
    }

    // 计算推荐波
    const wMap: Record<string, number> = { red: 0, blue: 0, green: 0 };
    final18.forEach(s => wMap[s.wave]++);
    const recWaves = Object.keys(wMap).sort((a, b) => wMap[b as any] - wMap[a as any]);

    // 增强头数和尾数推荐
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

  /**
   * 为回测优化的生成函数
   */
  private static generateForBacktest(history: DbRecord[], type: LotteryType): PredictionData {
    // 简化版本，只使用必要的算法
    this.initializeMaps();
    
    if (!history || history.length < 30) return this.generateDeterministic();

    const recent20 = history.slice(0, 20);
    const lastDrawNums = this.parseNumbers(history[0].open_code);
    const lastSpecial = lastDrawNums[lastDrawNums.length - 1];
    
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
        
        // 只初始化关键分数
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
        
        totalScore: 0
      };
    });

    // 执行关键算法
    const zodiacTransMap: Record<string, number> = {};
    let zodiacTransTotal = 0;

    for (let i = 1; i < history.length - 1; i++) {
      const histNums = this.parseNumbers(history[i].open_code);
      const histSpecial = histNums[histNums.length - 1];
      const histZodiac = this.NUM_TO_ZODIAC[histSpecial];
      const lastSpecialZodiac = this.NUM_TO_ZODIAC[lastSpecial];

      if (histZodiac === lastSpecialZodiac) {
        const nextNums = this.parseNumbers(history[i-1].open_code);
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
    for (let i = 1; i < history.length - 1; i++) {
      const histNums = this.parseNumbers(history[i].open_code);
      const histSpecial = histNums[histNums.length - 1];
      
      if (histSpecial === lastSpecial) {
        const nextNums = this.parseNumbers(history[i-1].open_code);
        const nextSpecial = nextNums[nextNums.length - 1];
        numTransMap[nextSpecial] = (numTransMap[nextSpecial] || 0) + 1;
      }
    }
    stats.forEach(s => s.scoreNumberTrans = (numTransMap[s.num] || 0) * 6);

    // 遗漏回补分析
    const omissionScores = this.calculateOmissionScores(history, 30);
    stats.forEach(s => {
      s.scoreOmission = omissionScores[s.num] || 0;
    });

    // 频率分析
    const frequencyScores = this.calculateFrequencyScores(recent20);
    stats.forEach(s => {
      s.scoreFrequency = frequencyScores[s.num] || 0;
    });

    // 使用动态权重计算总分
    stats.forEach(s => {
      let totalScore = 0;
      
      this.algorithmWeights.forEach(weight => {
        const score = s[weight.key] as number;
        totalScore += score * weight.weight;
      });
      
      s.totalScore = totalScore;
    });

    // 重复惩罚
    stats.forEach(s => {
      if (s.num === lastSpecial) {
        s.totalScore *= 0.3;
      }
      
      if (lastDrawNums.includes(s.num) && s.num !== lastSpecial) {
        s.totalScore *= 0.9;
      }
    });

    stats.sort((a, b) => b.totalScore - a.totalScore);
    const final18 = this.selectDiverseNumbers(stats, 18);
    const resultNumbers = final18.map(s => s.num).sort((a, b) => a - b).map(n => n < 10 ? `0${n}` : `${n}`);

    // 简化推荐
    const zodiacs = ['蛇', '马', '羊', '猴', '鸡', '狗'];
    
    return {
      zodiacs,
      numbers: resultNumbers,
      wave: { main: 'red', defense: 'blue' },
      heads: ['0', '1', '2'],
      tails: ['1', '2', '7', '8']
    };
  }

  /**
   * 为回测计算详细统计
   */
  private static calculateStatsForBacktest(history: DbRecord[], date: string): NumberStat[] {
    this.initializeMaps();
    
    if (!history || history.length < 30) return [];

    const recent20 = history.slice(0, 20);
    const lastDrawNums = this.parseNumbers(history[0].open_code);
    const lastSpecial = lastDrawNums[lastDrawNums.length - 1];
    
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
        
        totalScore: 0
      };
    });

    // 执行关键算法
    const zodiacTransMap: Record<string, number> = {};
    let zodiacTransTotal = 0;

    for (let i = 1; i < history.length - 1; i++) {
      const histNums = this.parseNumbers(history[i].open_code);
      const histSpecial = histNums[histNums.length - 1];
      const histZodiac = this.NUM_TO_ZODIAC[histSpecial];
      const lastSpecialZodiac = this.NUM_TO_ZODIAC[lastSpecial];

      if (histZodiac === lastSpecialZodiac) {
        const nextNums = this.parseNumbers(history[i-1].open_code);
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
    for (let i = 1; i < history.length - 1; i++) {
      const histNums = this.parseNumbers(history[i].open_code);
      const histSpecial = histNums[histNums.length - 1];
      
      if (histSpecial === lastSpecial) {
        const nextNums = this.parseNumbers(history[i-1].open_code);
        const nextSpecial = nextNums[nextNums.length - 1];
        numTransMap[nextSpecial] = (numTransMap[nextSpecial] || 0) + 1;
      }
    }
    stats.forEach(s => s.scoreNumberTrans = (numTransMap[s.num] || 0) * 6);

    // 遗漏回补分析
    const omissionScores = this.calculateOmissionScores(history, 30);
    stats.forEach(s => {
      s.scoreOmission = omissionScores[s.num] || 0;
    });

    // 频率分析
    const frequencyScores = this.calculateFrequencyScores(recent20);
    stats.forEach(s => {
      s.scoreFrequency = frequencyScores[s.num] || 0;
    });

    // 使用动态权重计算总分
    stats.forEach(s => {
      let totalScore = 0;
      
      this.algorithmWeights.forEach(weight => {
        const score = s[weight.key] as number;
        totalScore += score * weight.weight;
      });
      
      s.totalScore = totalScore;
    });

    stats.sort((a, b) => b.totalScore - a.totalScore);
    return stats;
  }

  // ==========================================
  // 原有的辅助方法和算法实现（保持不变）
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
      
      if (zodiac === lastSpecialZodiac) score -= 10;
      
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
      headOmission[head] = history.length;
    }
    
    history.forEach((rec, index) => {
      this.parseNumbers(rec.open_code).forEach(num => {
        const head = Math.floor(num / 10);
        headOmission[head] = Math.min(headOmission[head], index);
      });
    });
    
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
        
        const omission = headOmission[head] || history.length;
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
      tailOmission[tail] = history.length;
    }
    
    history.forEach((rec, index) => {
      this.parseNumbers(rec.open_code).forEach(num => {
        const tail = num % 10;
        tailOmission[tail] = Math.min(tailOmission[tail], index);
      });
    });
    
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
        
        const omission = tailOmission[tail] || history.length;
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

  private static getDeterministicAdjustment(
    num: number, 
    lastSpecial: number, 
    day: number, 
    weekday: number
  ): number {
    const hash = this.deterministicHash(num, lastSpecial, day, weekday);
    return (hash % 50) / 100;
  }

  private static deterministicHash(...args: number[]): number {
    let hash = 5381;
    for (const arg of args) {
      hash = ((hash << 5) + hash) + arg;
    }
    return Math.abs(hash) % 10000;
  }

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

  private static reconstructPhaseSpace(trajectory: number[], dimension: number): number[][] {
    const phaseSpace: number[][] = [];
    
    for (let i = 0; i <= trajectory.length - dimension; i++) {
      phaseSpace.push(trajectory.slice(i, i + dimension));
    }
    
    return phaseSpace;
  }

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

  private static entropyChangeAnalysis(history: DbRecord[]): 'increasing' | 'decreasing' | 'stable' {
    return this.analyzeEntropyTrend(history);
  }

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

  private static getRecentZodiacCount(history: DbRecord[], zodiac: string): number {
    let count = 0;
    history.forEach(rec => {
      this.parseNumbers(rec.open_code).forEach(num => {
        if (this.NUM_TO_ZODIAC[num] === zodiac) {
          count++;
        }
      });
    });
    return count;
  }

  private static sumDigits(num: number): number {
    return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }

  private static getNumberFrequency(history: DbRecord[], num: number): number {
    let count = 0;
    history.forEach(rec => {
      if (this.parseNumbers(rec.open_code).includes(num)) {
        count++;
      }
    });
    return count;
  }

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

  private static getSumZone(sum: number): 'small' | 'medium' | 'large' {
    if (sum >= this.SUM_ZONES.small.min && sum <= this.SUM_ZONES.small.max) {
      return 'small';
    } else if (sum >= this.SUM_ZONES.medium.min && sum <= this.SUM_ZONES.medium.max) {
      return 'medium';
    } else {
      return 'large';
    }
  }

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

  private static parseNumbers(code: string): number[] {
    if (!code) return [];
    return code.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
  }

  private static getNumWave(num: number): string {
    if (this.WAVES_MAP.red.includes(num)) return 'red';
    if (this.WAVES_MAP.blue.includes(num)) return 'blue';
    if (this.WAVES_MAP.green.includes(num)) return 'green';
    return 'red';
  }

  private static getSeasonByMonth(month: number): string {
    if (month >= 3 && month <= 5) return '春';
    if (month >= 6 && month <= 8) return '夏';
    if (month >= 9 && month <= 11) return '秋';
    return '冬';
  }

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
   * 手动触发权重调整
   */
  static manualOptimize(history: DbRecord[]): {
    success: boolean;
    message: string;
    oldWeights: Record<string, number>;
    newWeights: Record<string, number>;
  } {
    try {
      const oldWeights = this.algorithmWeights.reduce((acc, w) => {
        acc[w.name] = w.weight;
        return acc;
      }, {} as Record<string, number>);
      
      // 运行回测
      const backtestResult = this.autoBacktest(history, 30);
      
      // 根据回测结果调整权重
      Object.entries(backtestResult.algorithmPerformance).forEach(([algoName, accuracy]) => {
        const weight = this.algorithmWeights.find(w => w.name === algoName);
        if (weight) {
          // 根据准确率调整权重
          if (accuracy > 0.2) {
            weight.weight *= 1.15; // 表现好，增加权重
          } else if (accuracy < 0.1) {
            weight.weight *= 0.85; // 表现差，减少权重
          }
        }
      });
      
      // 规范化权重
      this.normalizeWeights();
      
      const newWeights = this.algorithmWeights.reduce((acc, w) => {
        acc[w.name] = w.weight;
        return acc;
      }, {} as Record<string, number>);
      
      return {
        success: true,
        message: `优化完成，准确率: ${backtestResult.accuracy.toFixed(3)}, 特码准确率: ${backtestResult.specialAccuracy.toFixed(3)}`,
        oldWeights,
        newWeights
      };
    } catch (error) {
      return {
        success: false,
        message: `优化失败: ${error}`,
        oldWeights: {},
        newWeights: {}
      };
    }
  }

  /**
   * 获取当前算法状态
   */
  static getAlgorithmStatus(): {
    optimizationCycle: number;
    lastOptimizationDate: string;
    averageAccuracy: number;
    averageSpecialAccuracy: number;
    algorithmWeights: Array<{name: string, weight: number, accuracy: number}>;
  } {
    const avgAccuracy = this.accuracyHistory.length > 0 
      ? this.accuracyHistory.reduce((a, b) => a + b, 0) / this.accuracyHistory.length 
      : 0;
    
    const avgSpecialAccuracy = this.specialAccuracyHistory.length > 0
      ? this.specialAccuracyHistory.reduce((a, b) => a + b, 0) / this.specialAccuracyHistory.length
      : 0;
    
    return {
      optimizationCycle: this.optimizationCycle,
      lastOptimizationDate: this.lastOptimizationDate,
      averageAccuracy: avgAccuracy,
      averageSpecialAccuracy: avgSpecialAccuracy,
      algorithmWeights: this.algorithmWeights.map(w => ({
        name: w.name,
        weight: w.weight,
        accuracy: w.accuracy
      }))
    };
  }

  /**
   * 重置算法权重
   */
  static resetWeights(): void {
    this.algorithmWeights = [
      { name: '生肖转移概率', key: 'scoreZodiacTrans', weight: 2.5, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '特码转移概率', key: 'scoreNumberTrans', weight: 2.0, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '历史镜像', key: 'scoreHistoryMirror', weight: 1.5, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '特码轨迹', key: 'scoreSpecialTraj', weight: 1.3, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '形态几何', key: 'scorePattern', weight: 1.2, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '尾数力场', key: 'scoreTail', weight: 1.0, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '三合局势', key: 'scoreZodiac', weight: 1.0, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '五行平衡', key: 'scoreWuXing', weight: 0.9, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '波色惯性', key: 'scoreWave', weight: 0.9, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '黄金密钥', key: 'scoreGold', weight: 0.8, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '遗漏回补', key: 'scoreOmission', weight: 0.8, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '季节规律', key: 'scoreSeasonal', weight: 0.7, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '质数分布', key: 'scorePrime', weight: 0.7, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '和值分析', key: 'scoreSumAnalysis', weight: 0.6, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '位置分析', key: 'scorePosition', weight: 0.6, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '频率分析', key: 'scoreFrequency', weight: 0.6, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '聚类分析', key: 'scoreCluster', weight: 0.5, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '对称分析', key: 'scoreSymmetry', weight: 0.5, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '周期分析', key: 'scorePeriodic', weight: 0.5, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '趋势分析', key: 'scoreTrend', weight: 0.5, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '头数分析', key: 'scoreHeadAnalysis', weight: 0.8, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '尾数模式', key: 'scoreTailPattern', weight: 0.8, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '关联性分析', key: 'scoreCorrelation', weight: 0.7, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '属性分析', key: 'scoreProperty', weight: 0.7, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '时间模式', key: 'scoreTimePattern', weight: 0.6, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '连号模式', key: 'scoreSeriesPattern', weight: 0.6, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '和值分区', key: 'scoreSumZone', weight: 0.5, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '五行相生相克', key: 'scoreElementRelation', weight: 0.5, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '矩阵坐标分析', key: 'scoreMatrixCoordinate', weight: 0.4, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '晶格分布分析', key: 'scoreLatticeDistribution', weight: 0.4, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '混沌模式分析', key: 'scoreChaosPattern', weight: 0.4, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '分形维度分析', key: 'scoreFractalDimension', weight: 0.4, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '信息熵分析', key: 'scoreEntropyAnalysis', weight: 0.4, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 },
      { name: '确定性核心分析', key: 'scoreDeterministicCore', weight: 0.6, accuracy: 0, recentAccuracy: [], adjustments: 0, lastAdjustment: 0 }
    ];
    
    this.optimizationCycle = 0;
    this.lastOptimizationDate = '';
    this.accuracyHistory = [];
    this.specialAccuracyHistory = [];
    
    console.log('算法权重已重置为默认值');
  }
}
