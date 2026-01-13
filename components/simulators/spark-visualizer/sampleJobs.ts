// Spark 샘플 Job 데이터

import { SparkJob, RDD, Stage, Task, Partition } from './types'

// 파티션 색상
const PARTITION_COLORS = [
  '#EF4444', // red
  '#F97316', // orange
  '#EAB308', // yellow
  '#22C55E', // green
  '#06B6D4', // cyan
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#EC4899', // pink
]

// 파티션 생성 헬퍼
function createPartitions(count: number, dataPerPartition: string[][]): Partition[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `p${i}`,
    data: dataPerPartition[i] || [],
    color: PARTITION_COLORS[i % PARTITION_COLORS.length],
  }))
}

// 1. 기본 Word Count Job
const wordCountJob: SparkJob = {
  id: 'word-count',
  name: 'Word Count',
  description: 'Spark의 대표적인 예제. 텍스트 파일에서 단어별 빈도를 계산합니다.',
  category: 'basic',
  code: `# Word Count 예제
val textFile = sc.textFile("hdfs://data/input.txt")

val words = textFile
  .flatMap(line => line.split(" "))  // 단어로 분리 (Narrow)
  .map(word => (word, 1))            // (word, 1) 튜플 생성 (Narrow)
  .reduceByKey(_ + _)                // 단어별 합계 (Wide - Shuffle!)

words.saveAsTextFile("hdfs://data/output")`,
  rdds: [
    {
      id: 'rdd-1',
      name: 'textFile',
      partitions: createPartitions(3, [
        ['Hello World', 'Hello Spark'],
        ['Spark is fast', 'Spark is easy'],
        ['Big Data processing', 'Data analytics'],
      ]),
      parentIds: [],
      cached: false,
    },
    {
      id: 'rdd-2',
      name: 'words (flatMap)',
      partitions: createPartitions(3, [
        ['Hello', 'World', 'Hello', 'Spark'],
        ['Spark', 'is', 'fast', 'Spark', 'is', 'easy'],
        ['Big', 'Data', 'processing', 'Data', 'analytics'],
      ]),
      parentIds: ['rdd-1'],
      operation: {
        id: 'op-1',
        name: 'flatMap',
        type: 'transformation',
        operation: 'flatMap',
        description: '한 줄을 여러 단어로 분리',
        isWide: false,
        code: '.flatMap(line => line.split(" "))',
      },
      cached: false,
    },
    {
      id: 'rdd-3',
      name: 'pairs (map)',
      partitions: createPartitions(3, [
        ['(Hello,1)', '(World,1)', '(Hello,1)', '(Spark,1)'],
        ['(Spark,1)', '(is,1)', '(fast,1)', '(Spark,1)', '(is,1)', '(easy,1)'],
        ['(Big,1)', '(Data,1)', '(processing,1)', '(Data,1)', '(analytics,1)'],
      ]),
      parentIds: ['rdd-2'],
      operation: {
        id: 'op-2',
        name: 'map',
        type: 'transformation',
        operation: 'map',
        description: '각 단어를 (word, 1) 튜플로 변환',
        isWide: false,
        code: '.map(word => (word, 1))',
      },
      cached: false,
    },
    {
      id: 'rdd-4',
      name: 'counts (reduceByKey)',
      partitions: createPartitions(3, [
        ['(Hello,2)', '(World,1)'],
        ['(Spark,3)', '(is,2)', '(fast,1)', '(easy,1)'],
        ['(Big,1)', '(Data,2)', '(processing,1)', '(analytics,1)'],
      ]),
      parentIds: ['rdd-3'],
      operation: {
        id: 'op-3',
        name: 'reduceByKey',
        type: 'transformation',
        operation: 'reduceByKey',
        description: '같은 키를 가진 값들을 합침 (Shuffle 발생!)',
        isWide: true,
        code: '.reduceByKey(_ + _)',
      },
      cached: false,
    },
  ],
  stages: [
    {
      id: 'stage-0',
      name: 'Stage 0: Map Side',
      rddIds: ['rdd-1', 'rdd-2', 'rdd-3'],
      tasks: [
        { id: 't0-0', partitionId: 'p0', executor: 'executor-1', duration: 120, status: 'completed', inputRows: 2, outputRows: 4 },
        { id: 't0-1', partitionId: 'p1', executor: 'executor-2', duration: 150, status: 'completed', inputRows: 2, outputRows: 6 },
        { id: 't0-2', partitionId: 'p2', executor: 'executor-1', duration: 130, status: 'completed', inputRows: 2, outputRows: 5 },
      ],
      shuffleRead: 0,
      shuffleWrite: 1024,
      status: 'completed',
    },
    {
      id: 'stage-1',
      name: 'Stage 1: Reduce Side',
      rddIds: ['rdd-4'],
      tasks: [
        { id: 't1-0', partitionId: 'p0', executor: 'executor-2', duration: 200, status: 'completed', inputRows: 15, outputRows: 2 },
        { id: 't1-1', partitionId: 'p1', executor: 'executor-1', duration: 180, status: 'completed', inputRows: 15, outputRows: 4 },
        { id: 't1-2', partitionId: 'p2', executor: 'executor-2', duration: 190, status: 'completed', inputRows: 15, outputRows: 4 },
      ],
      shuffleRead: 1024,
      shuffleWrite: 0,
      status: 'completed',
    },
  ],
  totalDuration: 970,
}

// 2. Join 연산 예제
const joinJob: SparkJob = {
  id: 'join-example',
  name: 'Join Operation',
  description: '두 RDD를 조인하는 예제. Inner Join의 동작 방식을 시각화합니다.',
  category: 'join',
  code: `# Join 예제
val users = sc.parallelize(Seq(
  (1, "Alice"), (2, "Bob"), (3, "Charlie")
))

val orders = sc.parallelize(Seq(
  (1, "iPhone"), (1, "MacBook"), (2, "Galaxy"), (3, "Pixel")
))

// Inner Join - 사용자별 주문 조회
val userOrders = users.join(orders)  // Wide Transformation (Shuffle!)

userOrders.collect()`,
  rdds: [
    {
      id: 'rdd-users',
      name: 'users',
      partitions: createPartitions(2, [
        ['(1, Alice)', '(2, Bob)'],
        ['(3, Charlie)'],
      ]),
      parentIds: [],
      cached: false,
    },
    {
      id: 'rdd-orders',
      name: 'orders',
      partitions: createPartitions(2, [
        ['(1, iPhone)', '(1, MacBook)'],
        ['(2, Galaxy)', '(3, Pixel)'],
      ]),
      parentIds: [],
      cached: false,
    },
    {
      id: 'rdd-joined',
      name: 'userOrders (join)',
      partitions: createPartitions(2, [
        ['(1, (Alice, iPhone))', '(1, (Alice, MacBook))'],
        ['(2, (Bob, Galaxy))', '(3, (Charlie, Pixel))'],
      ]),
      parentIds: ['rdd-users', 'rdd-orders'],
      operation: {
        id: 'op-join',
        name: 'join',
        type: 'transformation',
        operation: 'join',
        description: '두 RDD를 키 기준으로 조인 (Shuffle 발생!)',
        isWide: true,
        code: 'users.join(orders)',
      },
      cached: false,
    },
  ],
  stages: [
    {
      id: 'stage-0',
      name: 'Stage 0: Shuffle Users',
      rddIds: ['rdd-users'],
      tasks: [
        { id: 't0-0', partitionId: 'p0', executor: 'executor-1', duration: 80, status: 'completed', inputRows: 2, outputRows: 2 },
        { id: 't0-1', partitionId: 'p1', executor: 'executor-2', duration: 60, status: 'completed', inputRows: 1, outputRows: 1 },
      ],
      shuffleRead: 0,
      shuffleWrite: 512,
      status: 'completed',
    },
    {
      id: 'stage-1',
      name: 'Stage 1: Shuffle Orders',
      rddIds: ['rdd-orders'],
      tasks: [
        { id: 't1-0', partitionId: 'p0', executor: 'executor-2', duration: 90, status: 'completed', inputRows: 2, outputRows: 2 },
        { id: 't1-1', partitionId: 'p1', executor: 'executor-1', duration: 70, status: 'completed', inputRows: 2, outputRows: 2 },
      ],
      shuffleRead: 0,
      shuffleWrite: 512,
      status: 'completed',
    },
    {
      id: 'stage-2',
      name: 'Stage 2: Join',
      rddIds: ['rdd-joined'],
      tasks: [
        { id: 't2-0', partitionId: 'p0', executor: 'executor-1', duration: 150, status: 'completed', inputRows: 4, outputRows: 2 },
        { id: 't2-1', partitionId: 'p1', executor: 'executor-2', duration: 140, status: 'completed', inputRows: 3, outputRows: 2 },
      ],
      shuffleRead: 1024,
      shuffleWrite: 0,
      status: 'completed',
    },
  ],
  totalDuration: 590,
}

// 3. 집계 연산 예제
const aggregationJob: SparkJob = {
  id: 'aggregation',
  name: 'GroupBy Aggregation',
  description: '그룹별 집계 연산. groupByKey vs reduceByKey 성능 차이를 보여줍니다.',
  category: 'aggregation',
  code: `# 집계 연산 예제
val sales = sc.parallelize(Seq(
  ("Electronics", 1000), ("Electronics", 2000),
  ("Clothing", 500), ("Clothing", 800), ("Clothing", 300),
  ("Food", 200), ("Food", 150)
))

// 카테고리별 총 매출 계산
val categoryTotals = sales
  .reduceByKey(_ + _)  // Wide Transformation

// 상위 카테고리 조회
val topCategories = categoryTotals
  .sortByKey(ascending = false)  // Wide Transformation
  .take(3)`,
  rdds: [
    {
      id: 'rdd-sales',
      name: 'sales',
      partitions: createPartitions(2, [
        ['(Electronics, 1000)', '(Electronics, 2000)', '(Clothing, 500)'],
        ['(Clothing, 800)', '(Clothing, 300)', '(Food, 200)', '(Food, 150)'],
      ]),
      parentIds: [],
      cached: false,
    },
    {
      id: 'rdd-totals',
      name: 'categoryTotals (reduceByKey)',
      partitions: createPartitions(2, [
        ['(Electronics, 3000)'],
        ['(Clothing, 1600)', '(Food, 350)'],
      ]),
      parentIds: ['rdd-sales'],
      operation: {
        id: 'op-reduce',
        name: 'reduceByKey',
        type: 'transformation',
        operation: 'reduceByKey',
        description: '카테고리별 매출 합계 (Shuffle)',
        isWide: true,
        code: '.reduceByKey(_ + _)',
      },
      cached: false,
    },
    {
      id: 'rdd-sorted',
      name: 'sorted (sortByKey)',
      partitions: createPartitions(2, [
        ['(Electronics, 3000)', '(Clothing, 1600)'],
        ['(Food, 350)'],
      ]),
      parentIds: ['rdd-totals'],
      operation: {
        id: 'op-sort',
        name: 'sortByKey',
        type: 'transformation',
        operation: 'sortByKey',
        description: '매출 기준 정렬 (Shuffle)',
        isWide: true,
        code: '.sortByKey(ascending = false)',
      },
      cached: false,
    },
  ],
  stages: [
    {
      id: 'stage-0',
      name: 'Stage 0: Map',
      rddIds: ['rdd-sales'],
      tasks: [
        { id: 't0-0', partitionId: 'p0', executor: 'executor-1', duration: 50, status: 'completed', inputRows: 3, outputRows: 3 },
        { id: 't0-1', partitionId: 'p1', executor: 'executor-2', duration: 60, status: 'completed', inputRows: 4, outputRows: 4 },
      ],
      shuffleRead: 0,
      shuffleWrite: 256,
      status: 'completed',
    },
    {
      id: 'stage-1',
      name: 'Stage 1: Reduce',
      rddIds: ['rdd-totals'],
      tasks: [
        { id: 't1-0', partitionId: 'p0', executor: 'executor-2', duration: 80, status: 'completed', inputRows: 3, outputRows: 1 },
        { id: 't1-1', partitionId: 'p1', executor: 'executor-1', duration: 90, status: 'completed', inputRows: 4, outputRows: 2 },
      ],
      shuffleRead: 256,
      shuffleWrite: 128,
      status: 'completed',
    },
    {
      id: 'stage-2',
      name: 'Stage 2: Sort',
      rddIds: ['rdd-sorted'],
      tasks: [
        { id: 't2-0', partitionId: 'p0', executor: 'executor-1', duration: 100, status: 'completed', inputRows: 3, outputRows: 2 },
        { id: 't2-1', partitionId: 'p1', executor: 'executor-2', duration: 70, status: 'completed', inputRows: 3, outputRows: 1 },
      ],
      shuffleRead: 128,
      shuffleWrite: 0,
      status: 'completed',
    },
  ],
  totalDuration: 450,
}

// 4. 캐싱 최적화 예제
const cachingJob: SparkJob = {
  id: 'caching',
  name: 'Caching Optimization',
  description: 'RDD 캐싱을 통한 반복 연산 최적화. 캐시 유무에 따른 성능 차이를 보여줍니다.',
  category: 'advanced',
  code: `# 캐싱 최적화 예제
val logs = sc.textFile("hdfs://logs/access.log")
  .filter(_.contains("ERROR"))
  .map(line => (line.split(" ")(0), 1))  // (IP, 1)

// 캐싱! 여러 번 사용될 RDD
logs.cache()

// 첫 번째 액션: 에러 수 카운트
val errorCount = logs.count()

// 두 번째 액션: IP별 에러 수
val errorsByIP = logs.reduceByKey(_ + _).collect()

// 세 번째 액션: 상위 에러 발생 IP
val topErrorIPs = logs.reduceByKey(_ + _)
  .map(_.swap)
  .sortByKey(false)
  .take(10)`,
  rdds: [
    {
      id: 'rdd-logs',
      name: 'logs (textFile)',
      partitions: createPartitions(3, [
        ['ERROR 192.168.1.1 ...', 'INFO ...', 'ERROR 192.168.1.2 ...'],
        ['WARN ...', 'ERROR 10.0.0.1 ...', 'ERROR 192.168.1.1 ...'],
        ['ERROR 10.0.0.2 ...', 'DEBUG ...', 'ERROR 10.0.0.1 ...'],
      ]),
      parentIds: [],
      cached: false,
    },
    {
      id: 'rdd-filtered',
      name: 'filtered (filter)',
      partitions: createPartitions(3, [
        ['ERROR 192.168.1.1 ...', 'ERROR 192.168.1.2 ...'],
        ['ERROR 10.0.0.1 ...', 'ERROR 192.168.1.1 ...'],
        ['ERROR 10.0.0.2 ...', 'ERROR 10.0.0.1 ...'],
      ]),
      parentIds: ['rdd-logs'],
      operation: {
        id: 'op-filter',
        name: 'filter',
        type: 'transformation',
        operation: 'filter',
        description: 'ERROR 로그만 필터링',
        isWide: false,
        code: '.filter(_.contains("ERROR"))',
      },
      cached: false,
    },
    {
      id: 'rdd-mapped',
      name: 'mapped (map) [CACHED]',
      partitions: createPartitions(3, [
        ['(192.168.1.1, 1)', '(192.168.1.2, 1)'],
        ['(10.0.0.1, 1)', '(192.168.1.1, 1)'],
        ['(10.0.0.2, 1)', '(10.0.0.1, 1)'],
      ]),
      parentIds: ['rdd-filtered'],
      operation: {
        id: 'op-map',
        name: 'map',
        type: 'transformation',
        operation: 'map',
        description: '(IP, 1) 튜플 생성',
        isWide: false,
        code: '.map(line => (line.split(" ")(0), 1))',
      },
      cached: true, // 캐싱됨!
    },
    {
      id: 'rdd-reduced',
      name: 'errorsByIP (reduceByKey)',
      partitions: createPartitions(3, [
        ['(192.168.1.1, 2)'],
        ['(192.168.1.2, 1)', '(10.0.0.1, 2)'],
        ['(10.0.0.2, 1)'],
      ]),
      parentIds: ['rdd-mapped'],
      operation: {
        id: 'op-reduce2',
        name: 'reduceByKey',
        type: 'transformation',
        operation: 'reduceByKey',
        description: 'IP별 에러 수 집계',
        isWide: true,
        code: '.reduceByKey(_ + _)',
      },
      cached: false,
    },
  ],
  stages: [
    {
      id: 'stage-0',
      name: 'Stage 0: Filter & Map (+ Cache)',
      rddIds: ['rdd-logs', 'rdd-filtered', 'rdd-mapped'],
      tasks: [
        { id: 't0-0', partitionId: 'p0', executor: 'executor-1', duration: 200, status: 'completed', inputRows: 3, outputRows: 2 },
        { id: 't0-1', partitionId: 'p1', executor: 'executor-2', duration: 180, status: 'completed', inputRows: 3, outputRows: 2 },
        { id: 't0-2', partitionId: 'p2', executor: 'executor-1', duration: 190, status: 'completed', inputRows: 3, outputRows: 2 },
      ],
      shuffleRead: 0,
      shuffleWrite: 512,
      status: 'completed',
    },
    {
      id: 'stage-1',
      name: 'Stage 1: ReduceByKey (from Cache)',
      rddIds: ['rdd-reduced'],
      tasks: [
        { id: 't1-0', partitionId: 'p0', executor: 'executor-2', duration: 50, status: 'completed', inputRows: 2, outputRows: 1 },
        { id: 't1-1', partitionId: 'p1', executor: 'executor-1', duration: 60, status: 'completed', inputRows: 2, outputRows: 2 },
        { id: 't1-2', partitionId: 'p2', executor: 'executor-2', duration: 55, status: 'completed', inputRows: 2, outputRows: 1 },
      ],
      shuffleRead: 512,
      shuffleWrite: 0,
      status: 'completed',
    },
  ],
  totalDuration: 735,
}

// 5. Narrow vs Wide Transformations 비교
const narrowWideJob: SparkJob = {
  id: 'narrow-wide',
  name: 'Narrow vs Wide',
  description: 'Narrow와 Wide 변환의 차이점. Narrow는 파티션 내에서, Wide는 Shuffle이 필요합니다.',
  category: 'basic',
  code: `# Narrow vs Wide Transformations
val data = sc.parallelize(1 to 100, 4)

// Narrow Transformations (파티션 내 처리)
val doubled = data.map(_ * 2)      // Narrow
val evens = doubled.filter(_ % 4 == 0)  // Narrow

// Wide Transformations (Shuffle 필요)
val pairs = evens.map(x => (x % 10, x))
val grouped = pairs.groupByKey()   // Wide - Shuffle!
val sorted = grouped.sortByKey()   // Wide - Shuffle!

sorted.collect()`,
  rdds: [
    {
      id: 'rdd-data',
      name: 'data',
      partitions: createPartitions(4, [
        ['1-25'],
        ['26-50'],
        ['51-75'],
        ['76-100'],
      ]),
      parentIds: [],
      cached: false,
    },
    {
      id: 'rdd-doubled',
      name: 'doubled (map)',
      partitions: createPartitions(4, [
        ['2-50'],
        ['52-100'],
        ['102-150'],
        ['152-200'],
      ]),
      parentIds: ['rdd-data'],
      operation: {
        id: 'op-double',
        name: 'map',
        type: 'transformation',
        operation: 'map',
        description: '각 숫자를 2배로 (Narrow)',
        isWide: false,
        code: '.map(_ * 2)',
      },
      cached: false,
    },
    {
      id: 'rdd-evens',
      name: 'evens (filter)',
      partitions: createPartitions(4, [
        ['4, 8, 12, ...'],
        ['52, 56, 60, ...'],
        ['104, 108, ...'],
        ['152, 156, ...'],
      ]),
      parentIds: ['rdd-doubled'],
      operation: {
        id: 'op-filter2',
        name: 'filter',
        type: 'transformation',
        operation: 'filter',
        description: '4의 배수만 필터 (Narrow)',
        isWide: false,
        code: '.filter(_ % 4 == 0)',
      },
      cached: false,
    },
    {
      id: 'rdd-pairs',
      name: 'pairs (map)',
      partitions: createPartitions(4, [
        ['(4,4), (8,8), ...'],
        ['(2,52), (6,56), ...'],
        ['(4,104), (8,108), ...'],
        ['(2,152), (6,156), ...'],
      ]),
      parentIds: ['rdd-evens'],
      operation: {
        id: 'op-pairs',
        name: 'map',
        type: 'transformation',
        operation: 'map',
        description: '(key, value) 튜플 생성 (Narrow)',
        isWide: false,
        code: '.map(x => (x % 10, x))',
      },
      cached: false,
    },
    {
      id: 'rdd-grouped',
      name: 'grouped (groupByKey)',
      partitions: createPartitions(4, [
        ['(0, [20, 40, ...])'],
        ['(2, [52, 152, ...]), (4, [4, 104, ...])'],
        ['(6, [56, 156, ...])'],
        ['(8, [8, 108, ...])'],
      ]),
      parentIds: ['rdd-pairs'],
      operation: {
        id: 'op-group',
        name: 'groupByKey',
        type: 'transformation',
        operation: 'groupByKey',
        description: '키별 그룹화 (Wide - Shuffle!)',
        isWide: true,
        code: '.groupByKey()',
      },
      cached: false,
    },
  ],
  stages: [
    {
      id: 'stage-0',
      name: 'Stage 0: Narrow Transformations',
      rddIds: ['rdd-data', 'rdd-doubled', 'rdd-evens', 'rdd-pairs'],
      tasks: [
        { id: 't0-0', partitionId: 'p0', executor: 'executor-1', duration: 30, status: 'completed', inputRows: 25, outputRows: 6 },
        { id: 't0-1', partitionId: 'p1', executor: 'executor-2', duration: 35, status: 'completed', inputRows: 25, outputRows: 6 },
        { id: 't0-2', partitionId: 'p2', executor: 'executor-1', duration: 32, status: 'completed', inputRows: 25, outputRows: 6 },
        { id: 't0-3', partitionId: 'p3', executor: 'executor-2', duration: 28, status: 'completed', inputRows: 25, outputRows: 6 },
      ],
      shuffleRead: 0,
      shuffleWrite: 768,
      status: 'completed',
    },
    {
      id: 'stage-1',
      name: 'Stage 1: GroupByKey (Wide)',
      rddIds: ['rdd-grouped'],
      tasks: [
        { id: 't1-0', partitionId: 'p0', executor: 'executor-2', duration: 80, status: 'completed', inputRows: 6, outputRows: 1 },
        { id: 't1-1', partitionId: 'p1', executor: 'executor-1', duration: 90, status: 'completed', inputRows: 8, outputRows: 2 },
        { id: 't1-2', partitionId: 'p2', executor: 'executor-2', duration: 75, status: 'completed', inputRows: 5, outputRows: 1 },
        { id: 't1-3', partitionId: 'p3', executor: 'executor-1', duration: 85, status: 'completed', inputRows: 5, outputRows: 1 },
      ],
      shuffleRead: 768,
      shuffleWrite: 0,
      status: 'completed',
    },
  ],
  totalDuration: 455,
}

export const sampleJobs: SparkJob[] = [
  wordCountJob,
  joinJob,
  aggregationJob,
  cachingJob,
  narrowWideJob,
]

export const jobCategories = {
  basic: '기본 예제',
  aggregation: '집계 연산',
  join: 'Join 연산',
  advanced: '고급 최적화',
}
