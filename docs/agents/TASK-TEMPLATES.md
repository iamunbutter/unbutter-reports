# TASK 템플릿 시스템

## 사용법

정인이 짧은 명령어로 복잡한 작업 지시 가능:

```
/task blog-post "언버터 탄생기"
/task feature dashboard-v3
/task campaign instagram-launch
```

---

## 템플릿 1: SIMPLE (콘텐츠 제작)

**용도:** 블로그, SNS 콘텐츠, 카피라이팅

```yaml
type: SIMPLE
trigger: /task blog-post, /task sns, /task copy

workflow:
  - 기획팀: 콘텐츠 전략 + 초안
  - 디자인팀: 이미지/영상
  - 검토: 브랜드 톤 일치?
  
산출물:
  - 최종 텍스트
  - 이미지/영상
  - 발행 가이드
```

**예시:**
```
정인: "/task blog-post 레몬향 이야기"

버터봇 자동 실행:
1. 기획팀 → 블로그 초안 작성
2. 디자인팀 → 이미지 5장 생성
3. 검토 → 브랜드 톤 확인
4. 아카이브 저장
5. 정인 보고
```

---

## 템플릿 2: FEATURE (기능 개발)

**용도:** 웹/앱 기능, 자동화, 시스템 구축

```yaml
type: FEATURE
trigger: /task feature, /task build, /task automation

workflow:
  - 기획팀: 요구사항 정의 + 유저 플로우
  - 개발팀: 아키텍처 설계 + 구현 (기획 완료 후 시작)
  - 디자인팀: UI/UX 목업 (독립 실행)
  - 개발팀: 통합 + 테스트
  - 검토: 동작 확인 + 코드 리뷰
  
산출물:
  - 기획서
  - 코드 (GitHub)
  - 테스트 결과
  - 배포 URL
```

**예시:**
```
정인: "/task feature 크롬확장-v2"

버터봇 자동 실행:
1. 기획팀 → 기능 명세서
2. 디자인팀 || 기획팀 (병렬)
3. 개발팀 → 구현 (기획+디자인 대기)
4. 검토 → 테스트
5. GitHub 푸시
6. 아카이브
7. 정인 보고
```

---

## 템플릿 3: CAMPAIGN (마케팅 캠페인)

**용도:** SNS 캠페인, 광고, 런칭

```yaml
type: CAMPAIGN
trigger: /task campaign, /task launch, /task ad

workflow:
  - 기획팀: 캠페인 전략 + 타겟 분석
  - 디자인팀: 크리에이티브 (배너, 영상, 카피)
  - 개발팀: 랜딩페이지/트래킹 (필요 시)
  - 검토: ROI 시뮬레이션
  
산출물:
  - 캠페인 기획서
  - 크리에이티브 에셋
  - 실행 가이드
```

**예시:**
```
정인: "/task campaign 샘플신청-이벤트"

버터봇 자동 실행:
1. 기획팀 → 이벤트 기획서
2. 디자인팀 → 인스타 게시물 10장
3. 개발팀 → 구글폼 연동
4. 검토 → 예상 전환율
5. 아카이브
6. 정인 보고
```

---

## 단축 명령어

### 자주 쓰는 TASK
```
/blog [제목]           → 블로그 글 작성
/insta [주제]          → 인스타 게시물
/feature [기능명]      → 기능 개발
/dashboard            → 대시보드 개선
/automation [대상]     → 자동화 구축
```

### 긴급 모드
```
/urgent [task]         → 검토 스킵, 즉시 실행
```

### 반복 TASK
```
/schedule weekly 블로그  → 매주 자동 실행
```

---

## 커스텀 템플릿 추가

```yaml
# custom-task.yaml
type: CUSTOM
name: 제품-리뷰-분석
workflow:
  - 기획팀: 리뷰 수집 + 감성 분석
  - 디자인팀: 인포그래픽
산출물:
  - 분석 보고서
  - 인포그래픽
```

---

## 버터봇 내부 처리 로직

```javascript
function parseTask(input) {
  if (input.startsWith('/task blog-post')) {
    return {
      type: 'SIMPLE',
      teams: ['기획팀', '디자인팀'],
      dependencies: [],
      checklist: ['브랜드 톤', '이미지 품질']
    };
  }
  
  if (input.startsWith('/task feature')) {
    return {
      type: 'FEATURE',
      teams: ['기획팀', '개발팀', '디자인팀'],
      dependencies: {
        '개발팀': ['기획팀', '디자인팀']
      },
      checklist: ['동작 확인', '코드 리뷰', '보안']
    };
  }
  
  // ... 기타 템플릿
}
```

---

**다음 단계:**
1. 워크플로우 엔진에 템플릿 통합
2. `/task` 명령어 파서 구현
3. 테스트

---

**정인이 이제 할 수 있는 것:**

기존:
```
"대시보드 개선해. 문서 클릭하면 내용 보이게 하고, 
카테고리별로 분류하고, GitHub 자동 배포하고,
Markdown 렌더링 되게 하고..."
```

개선 후:
```
"/task feature dashboard-v3"
```

→ 끝! 🧈
