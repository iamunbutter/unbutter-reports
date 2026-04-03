# 완전 자동화 워크플로우 시스템

버터봇 COO가 사용하는 자동화 시스템

---

## 구성 요소

### 1. task-parser.js
- 정인의 지시 분석
- `/task` 명령어 파싱
- 자연어 지시 자동 분류
- 필요 팀 판단

### 2. team-orchestrator.js
- 서브에이전트 자동 spawn
- 의존성 체인 관리
- 병렬 작업 스케줄링

### 3. review-checklist.js
- 브랜드 가이드 검증
- 금지어 검사
- TASK별 커스텀 검증
- 자동 통과/실패 판정

### 4. retrospective.js
- 작업 로그 분석
- 개선점 자동 추출
- 팀별 피드백 생성
- 회고 문서 자동 저장

---

## 사용 방법 (버터봇용)

```javascript
const { orchestrate } = require('./workflow/team-orchestrator');
const { runReview } = require('./workflow/review-checklist');
const { generateRetrospective, saveRetrospective } = require('./workflow/retrospective');

// 1. TASK 분석 및 팀 배분
const plan = await orchestrate("/task feature dashboard-v3");

// 2. sessions_spawn으로 팀 실행
plan.spawnCommands.forEach(cmd => {
  sessions_spawn(cmd);
});

// 3. 완료 대기 후 검토
const reviewResults = runReview(plan.task.taskType, '/path/to/outputs');

// 4. 회고 생성
const retro = generateRetrospective(plan.task, reviewResults, startTime, Date.now());
saveRetrospective(plan.task, retro);

// 5. 정인에게 보고
console.log(reviewResults.passed ? '✅ 완료!' : '⚠️ 일부 수정 필요');
```

---

## 정인의 사용법

### 명령어 방식
```
/task blog-post "언버터 탄생기"
/task feature 크롬확장-v2
/task campaign 샘플신청-이벤트
```

### 자연어 방식
```
"블로그 2편 작성해줘"
→ 자동 분류: blog-post

"대시보드 개선하자"
→ 자동 분류: dashboard

"인스타 캠페인 기획"
→ 자동 분류: campaign
```

---

## 실행 흐름

```
정인 지시
  ↓
버터봇: task-parser 실행
  ↓
팀 배분 계획 생성
  ↓
team-orchestrator: 의존성 체인 생성
  ↓
Phase 1: 독립 팀 병렬 실행
Phase 2: 의존 팀 순차 실행
  ↓
모든 팀 완료 대기
  ↓
review-checklist: 자동 검증
  ↓
통과? → retrospective 생성
실패? → 수정 요청
  ↓
정인에게 보고
```

---

## 예시: `/task feature dashboard-v3`

### 1. 파싱 결과
```json
{
  "taskType": "feature",
  "type": "FEATURE",
  "teams": ["기획팀", "개발팀", "디자인팀"],
  "dependencies": {
    "개발팀": ["기획팀", "디자인팀"]
  },
  "checklist": ["요구사항 충족", "코드 리뷰", "테스트 통과", "배포 가능"]
}
```

### 2. 실행 계획
```
Phase 1: 기획팀 || 디자인팀
Phase 2: 개발팀 (기획+디자인 대기)
```

### 3. 검토
```
✅ 요구사항 충족
✅ 코드 리뷰 통과
✅ 테스트 통과
✅ 배포 가능
```

### 4. 회고
```markdown
# 회고 - dashboard-v3

## 잘된 점
- 기획서 명확
- UI/UX 세련됨
- 코드 품질 우수

## 개선할 점
- (없음)

## 다음 액션
- 현재 프로세스 유지
```

---

## 테스트

```bash
cd /Users/jeong-ing/.openclaw/workspace/unbutter-agents/workflow
node test.js
```

---

**정인: 이제 한 줄로 끝!**

```
/task feature 블로그자동화
```

버터봇이 알아서:
1. 팀 배분 ✅
2. 병렬 실행 ✅
3. 검토 ✅
4. 회고 ✅
5. 보고 ✅
