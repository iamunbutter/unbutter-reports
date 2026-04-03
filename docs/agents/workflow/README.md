# 🧈 버터봇 워크플로우 엔진

정인의 지시 → 자동 팀 배분 → 병렬/순차 실행 → 자동 검토 → 회고 → 보고

완전 자동화된 마케팅 워크플로우 시스템

---

## 📦 구조

```
workflow/
├── task-parser.js          # 1️⃣ 지시문 분석 & 팀 판단
├── team-orchestrator.js    # 2️⃣ 팀 spawn & 실행 관리
├── review-checklist.js     # 3️⃣ 품질 검토 & 브랜드 체크
├── retrospective.js        # 4️⃣ 회고 & 개선점 추출
├── workflow-engine.js      # 🚀 통합 엔진
├── example.js              # 📘 사용 예시
├── test.js                 # 🧪 테스트
└── README.md               # 📄 이 문서
```

---

## 🚀 빠른 시작

### 기본 사용

```javascript
const WorkflowEngine = require('./workflow-engine');

const engine = new WorkflowEngine();
const result = await engine.run("블로그 글 3편 작성해줘");

console.log(result.status);  // 'completed', 'excellent', 'pass', etc.
```

### CLI 사용

```bash
# 지시 실행
node workflow-engine.js "블로그 글 작성해줘"

# 예시 실행
node example.js          # 모든 예시
node example.js 1        # 특정 예시

# 테스트
node test.js
```

---

## 📚 모듈별 설명

### 1️⃣ TaskParser

**역할:** 정인의 자연어 지시를 분석하고 구조화된 태스크로 변환

**기능:**
- 필요한 팀 자동 판단 (planning, development, design)
- 우선순위 감지 (urgent, high, normal, low)
- 산출물 추출 (블로그 3편, 이미지 5장 등)
- 의존성 체인 생성 (순차 vs 병렬)

**예시:**

```javascript
const parser = new TaskParser();
const task = parser.parse("신제품 랜딩페이지 만들어줘");

console.log(task.teams);
// { planning: true, development: true, design: true }

console.log(task.dependencies.type);
// 'sequential'  (기획 → 개발 → 디자인)
```

**의존성 패턴:**

| 패턴 | 예시 | 실행 방식 |
|------|------|-----------|
| 순차 | 웹사이트, 랜딩페이지 | 기획 → 개발 → 디자인 |
| 병렬 | 블로그, SNS, 캠페인 | 기획 → (개발 + 디자인) |
| 디자인만 | 로고, 목업 | 디자인 |
| 기획만 | 기획서, 전략 | 기획 |

---

### 2️⃣ TeamOrchestrator

**역할:** 팀장 서브에이전트를 spawn하고 병렬/순차 작업 관리

**기능:**
- Phase별 팀 spawn
- 병렬 실행 (Promise.all)
- 의존성 대기 처리
- 실행 로그 저장

**예시:**

```javascript
const orchestrator = new TeamOrchestrator();
const execution = await orchestrator.execute(task);

console.log(execution.phases);
// [
//   { phase: 1, steps: ['planning'], duration: 5 },
//   { phase: 2, steps: ['development', 'design'], duration: 12 }
// ]

console.log(execution.results);
// {
//   planning: { status: 'completed', output: {...} },
//   development: { status: 'completed', output: {...} },
//   design: { status: 'completed', output: {...} }
// }
```

**실행 흐름:**

```
Phase 1: 기획팀 (단독)
   ↓
Phase 2: 개발팀 + 디자인팀 (병렬)
   ↓
완료
```

---

### 3️⃣ ReviewChecklist

**역할:** 자동 품질 검증 및 브랜드 가이드라인 체크

**기능:**
- 팀별 체크리스트 (planning, development, design)
- 브랜드 톤앤매너 검증
- 금지 키워드 체크
- 통과/실패 판정

**체크리스트:**

**기획팀 (Planning)**
- ✅ 타겟 오디언스 명확성
- ✅ 핵심 메시지 일관성
- ✅ 브랜드 톤앤매너
- ✅ SEO 키워드 포함
- ✅ CTA 명확성

**개발팀 (Development)**
- ✅ 반응형 디자인
- ✅ 페이지 로딩 속도
- ✅ 접근성 기준
- ✅ 기술적 SEO
- ✅ 모바일 최적화

**디자인팀 (Design)**
- ✅ 브랜드 컬러 사용
- ✅ 타이포그래피 일관성
- ✅ 시각적 위계
- ✅ 이미지 품질
- ✅ 전체 일관성

**브랜드 가이드라인:**

| 항목 | ✅ 허용 | ❌ 금지 |
|------|--------|--------|
| 톤 | 따뜻함, 자연스러움, 친근함 | 과장, 강압, 공격적 |
| 키워드 | 언버터, 베이커리, 자연, 건강 | 화학, 인공, 강력 |
| 메시징 | 제품 품질, 자연 유래, 피부 친화 | 의료 효과, 치료, 즉각 효과 |

**예시:**

```javascript
const reviewer = new ReviewChecklist();
const review = await reviewer.review(execution);

console.log(review.overall.score);  // 85
console.log(review.overall.status); // 'pass'
console.log(review.brandCompliance.compliant); // true

// 팀별 점수
console.log(review.teams.planning.score);  // 90
console.log(review.teams.design.score);    // 80
```

---

### 4️⃣ Retrospective

**역할:** 작업 로그 분석 및 개선점 자동 추출

**분석 카테고리:**
- 🚀 **효율성**: 소요 시간, 병렬 처리 효과
- 🎯 **품질**: 점수, 이슈, 브랜드 준수
- 🤝 **협업**: 의존성 관리, 팀 조율
- 🔄 **프로세스**: Phase 구조, 검토 효과

**산출물:**
- ✨ 잘한 점 (wins)
- 🤔 도전 과제 (challenges)
- 💡 개선 방안 (improvements)
- 📊 메트릭 (metrics)

**예시:**

```javascript
const retrospector = new Retrospective();
const retro = await retrospector.generate(execution, review);

console.log(retro.wins);
// [
//   { type: 'high-quality', message: '우수한 품질 (90점)' },
//   { type: 'fast-completion', message: '빠른 완료 시간 (45초)' }
// ]

console.log(retro.improvements);
// [
//   { 
//     category: 'efficiency',
//     priority: 'high',
//     issue: 'planning 팀이 예상보다 50% 더 소요됨',
//     suggestion: '작업 분해 또는 자동화 도구 활용 검토'
//   }
// ]
```

**트렌드 분석:**

```javascript
// 최근 10개 워크플로우 분석
const trends = await retrospector.analyzeTrends(10);

console.log(trends.avgScore);  // 85
console.log(trends.commonImprovements);
// [
//   { category: 'efficiency', count: 7 },
//   { category: 'quality', count: 5 }
// ]
```

---

## 🎯 WorkflowEngine (통합)

### 기본 설정

```javascript
const engine = new WorkflowEngine({
  workspaceRoot: '/path/to/workspace',
  autoReview: true,           // 자동 검토 (기본: true)
  autoRetrospective: true,    // 자동 회고 (기본: true)
  saveHistory: true           // 히스토리 저장 (기본: true)
});
```

### 실행 옵션

```javascript
const result = await engine.run("지시문", {
  retryOnFail: true,   // 검토 실패 시 자동 재작업
  maxRetries: 2        // 최대 재시도 횟수
});
```

### 반환값 구조

```javascript
{
  instruction: "블로그 글 3편 작성해줘",
  status: "excellent",        // completed, pass, excellent, fail, error
  startTime: "2026-04-03T12:00:00Z",
  endTime: "2026-04-03T12:01:30Z",
  duration: 90,               // 초
  
  task: { ... },              // TaskParser 결과
  execution: { ... },         // TeamOrchestrator 결과
  review: { ... },            // ReviewChecklist 결과
  retrospective: { ... }      // Retrospective 결과
}
```

### 유틸리티

```javascript
// 히스토리 조회
const history = await engine.getHistory(10);  // 최근 10개

// 통계
const stats = await engine.getStatistics();
console.log(engine.formatStatistics(stats));

// 최종 보고서
const report = engine.generateFinalReport(result);
console.log(report);
```

---

## 📝 사용 예시

### 1. 기본 사용

```javascript
const engine = new WorkflowEngine();
await engine.run("블로그 글 3편 작성해줘");
```

### 2. 복잡한 지시

```javascript
await engine.run(
  "신제품 런칭 랜딩페이지 만들어줘. 제품 설명 카피, 디자인, 개발 모두 포함"
);
// → planning → development + design 순차 실행
```

### 3. 긴급 작업

```javascript
await engine.run("급해! 오늘 오후까지 SNS 캠페인 이미지 5장 필요");
// → priority: 'urgent'
```

### 4. 재작업

```javascript
await engine.run("블로그 글 작성", {
  retryOnFail: true,
  maxRetries: 2
});
// 검토 실패 시 자동으로 2회까지 재시도
```

### 5. 빠른 실행 (검토 생략)

```javascript
const fastEngine = new WorkflowEngine({
  autoReview: false,
  autoRetrospective: false
});

await fastEngine.run("간단한 카피 3개");
```

### 6. 실전 캠페인

```javascript
const scenarios = [
  "블로그 '겨울 피부 관리 팁' 시리즈 3편",
  "인스타그램 릴스용 숏폼 스크립트 5개",
  "신제품 '바디버터' 상세페이지 제작",
  "뉴스레터 이번 주 콘텐츠 기획"
];

for (const scenario of scenarios) {
  await engine.run(scenario);
}

const stats = await engine.getStatistics();
console.log(stats);
```

---

## 🧪 테스트

### 전체 테스트 실행

```bash
node test.js
```

### 테스트 커버리지

- ✅ TaskParser (8개 테스트)
- ✅ TeamOrchestrator (5개 테스트)
- ✅ ReviewChecklist (5개 테스트)
- ✅ Retrospective (4개 테스트)
- ✅ WorkflowEngine 통합 (7개 테스트)
- ✅ 엣지 케이스 (5개 테스트)
- ✅ 성능 테스트 (2개 테스트)

**총 36개 테스트**

---

## 📊 워크플로우 플로우

```
📝 정인의 지시
    ↓
1️⃣ TaskParser
    - 팀 판단
    - 의존성 분석
    - 우선순위
    ↓
2️⃣ TeamOrchestrator
    - Phase 1: 기획팀
    - Phase 2: 개발팀 + 디자인팀 (병렬)
    ↓
3️⃣ ReviewChecklist
    - 팀별 체크리스트
    - 브랜드 가이드라인
    - 통과/실패 판정
    ↓
4️⃣ Retrospective
    - 메트릭 분석
    - 개선점 추출
    - 트렌드 분석
    ↓
📊 최종 보고서
```

---

## 🔧 커스터마이징

### 팀 추가

`task-parser.js`에서 `teamKeywords` 수정:

```javascript
this.teamKeywords = {
  planning: [...],
  development: [...],
  design: [...],
  video: ['영상', '비디오', '촬영', '편집']  // 추가
};
```

### 체크리스트 수정

`review-checklist.js`에서 `qualityChecks` 수정:

```javascript
this.qualityChecks = {
  planning: [
    { id: 'custom-check', name: '커스텀 체크', weight: 5 }
  ]
};
```

### 브랜드 가이드라인 수정

`review-checklist.js`에서 `brandGuidelines` 수정:

```javascript
this.brandGuidelines = {
  tone: {
    required: ['새로운 톤'],
    forbidden: ['금지 톤']
  }
};
```

---

## 📁 파일 저장 위치

```
workflow/
├── logs/              # 실행 로그
│   └── task_xxx.json
├── reviews/           # 검토 결과
│   └── task_xxx.json
├── retrospectives/    # 회고
│   └── task_xxx.json
└── history/           # 전체 히스토리
    └── task_xxx.json
```

---

## 🎓 고급 사용

### 트렌드 분석

```javascript
const retrospector = new Retrospective();
const trends = await retrospector.analyzeTrends(50);

console.log('평균 점수:', trends.avgScore);
console.log('공통 개선점:', trends.commonImprovements);
console.log('반복 도전 과제:', trends.recurringChallenges);
```

### 커스텀 실행 플로우

```javascript
// 1. 파싱만
const parser = new TaskParser();
const task = parser.parse("블로그 작성");

// 2. 팀 선택적 실행
task.teams.development = false;  // 개발팀 제외
const orchestrator = new TeamOrchestrator();
const execution = await orchestrator.execute(task);

// 3. 검토만
const reviewer = new ReviewChecklist();
const review = await reviewer.review(execution);
```

---

## 🐛 디버깅

### 로그 확인

```bash
# 실행 로그
cat workflow/logs/task_xxx.json

# 검토 결과
cat workflow/reviews/task_xxx.json

# 회고
cat workflow/retrospectives/task_xxx.json
```

### 상세 로그 활성화

```javascript
// 콘솔 로그 확인
console.log(parser.formatTaskSummary(task));
console.log(orchestrator.formatExecutionSummary(execution));
console.log(reviewer.formatReviewSummary(review));
console.log(retrospector.formatRetrospectiveSummary(retro));
```

---

## 🚀 프로덕션 배포

### 1. 실제 서브에이전트 연동

`team-orchestrator.js`의 `simulateAgentExecution` 교체:

```javascript
async spawnTeamLeader(team, task, previousResults) {
  // OpenClaw sessions_spawn 사용
  const sessionId = await sessions_spawn({
    runtime: 'agent:main',
    prompt: agentPrompt,
    model: 'anthropic/claude-sonnet-4'
  });
  
  // 결과 대기
  await sessions_yield();
  
  return result;
}
```

### 2. 실제 산출물 분석

`review-checklist.js`의 `evaluateCheck` 교체:

```javascript
async evaluateCheck(team, check, result) {
  // 실제 파일 읽기 및 분석
  const files = result.output.files;
  const content = await fs.readFile(files[0], 'utf-8');
  
  // AI로 품질 평가
  const score = await analyzeQuality(content, check);
  
  return score;
}
```

---

## 📞 지원

문제가 있으면 이슈를 남겨주세요!

---

## 📄 라이선스

MIT
