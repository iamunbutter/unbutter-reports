# 집에서 할 일 (우선순위별)

## 🔴 긴급 (맥미니 설정)

### 1. 잠자기 모드 비활성화
```bash
# 디스플레이 잠자기 끄기
sudo pmset -a displaysleep 0

# 컴퓨터 잠자기 끄기
sudo pmset -a sleep 0

# 하드 디스크 잠자기 끄기
sudo pmset -a disksleep 0

# 확인
pmset -g
```

**또는 시스템 설정:**
- 설정 > 잠자기 > "다음 시간 후 디스플레이 잠자기" → 안 함
- 설정 > 에너지 > "가능한 경우 하드 디스크를 잠자기 상태로 전환" → 체크 해제

### 2. 네트워크 안정화
```bash
# 원격 로그인 활성화 (SSH)
sudo systemsetup -setremotelogin on

# 방화벽에서 OpenClaw 허용
# 설정 > 네트워크 > 방화벽 > OpenClaw 추가
```

### 3. 자동 재시작 설정
```bash
# 정전 후 자동 재시작
sudo pmset -a autorestart 1

# 시스템 동결 시 자동 재시작
sudo systemsetup -setrestartfreeze on
```

---

## 🟡 중요 (OpenClaw 설정)

### 4. 텔레그램 승인 버튼 수정

**현재 문제:** 승인 버튼 클릭 안 됨

**해결:**
```bash
# OpenClaw 설정 확인
cat ~/.openclaw/openclaw.json | grep -A 20 telegram

# 예상: inlineButtons 설정 추가 필요
# 또는 텔레그램 봇 권한 확인
```

**문서 확인:**
```bash
cat /opt/homebrew/lib/node_modules/openclaw/docs/exec-approvals.md | less
```

---

## 🟢 작업 (블로그 자동화)

### 5. 네이버 세션 저장
```bash
cd /Users/jeong-ing/.openclaw/workspace
node save-naver-session.js
```

**절차:**
1. 브라우저 자동 열림
2. QR 코드로 로그인
3. 30초 대기
4. `naver-session.json` 자동 저장

### 6. 블로그 자동 발행 테스트
```bash
node naver-blog-publisher-v2.js
```

**예상 동작:**
1. 저장된 세션으로 자동 로그인
2. 블로그 글쓰기 페이지 이동
3. 제목 입력: "언버터 탄생기"
4. 본문 자동 입력 (사람처럼 타이핑)
5. 임시저장 (수동 확인 후 발행)

### 7. 에러 발생 시 로그 확인
```bash
# 에러 메시지 캡처
node naver-blog-publisher-v2.js 2>&1 | tee blog-test.log

# 나에게 로그 보내기
cat blog-test.log
```

---

## 📋 이후 업무 계획

### Phase 1: 블로그 자동화 완성
- [x] 에이전트 팀 구조 설계
- [x] 브랜드 베이스 구축
- [x] 첫 블로그 글 완성
- [ ] 네이버 세션 저장
- [ ] 자동 발행 테스트
- [ ] 이미지 추가 기능
- [ ] 2편 작성 ("그래서 왜 버터인데?")

### Phase 2: 에이전트 팀 재구조화
**현재 구조:**
- PM 에이전트 (전략)
- 개발자 에이전트 (초안 생성)
- 마케터 에이전트 (검토)
- 에디터 에이전트 (다듬기)
- 퍼블리셔 에이전트 (발행)

**정인이 제안 구조:**
```
버터봇 (COO) - Opus
└─ 3개 팀
   ├─ 기획팀 (팀장 + 팀원들)
   ├─ 개발팀 (팀장 + 팀원들)
   └─ 디자인팀 (팀장 + 팀원들)
```

**하네스 엔지니어링:**
- TASK: 명확한 작업 단위
- TEAM: 역할별 팀 구성
- LINK: 팀 간 체인 연결
- 검토 → 회고 → 완성 → 전달

### Phase 3: 아카이빙 웹 구축
- 기획서 저장
- 아키텍처 문서
- 작업 히스토리
- 팀 간 공유 대시보드

### Phase 4: 숏폼 자동화
- CapCut API 조사
- 자막/컷 편집 자동화
- 별도 웹 툴 개발

---

## 📂 파일 위치

**작업 파일:**
- `/Users/jeong-ing/.openclaw/workspace/`

**브랜드 자료:**
- `unbutter-brand/` (ICP, 제품, 톤앤매너, 스토리)

**에이전트 프롬프트:**
- `unbutter-agents/` (PM, 개발자, 마케터, 에디터, 퍼블리셔)

**블로그 글:**
- `unbutter-marketing/content-library/blog/brand-story-final-v3.md`

**스크립트:**
- `save-naver-session.js` (세션 저장)
- `naver-blog-publisher-v2.js` (블로그 발행)

---

## ⚠️ 주의사항

1. **세션 저장 전 확인:**
   - 네이버 로그인 페이지 정상 작동
   - QR 코드 스캔 가능

2. **블로그 발행 전 확인:**
   - 임시저장 먼저 (발행 버튼 주석 처리됨)
   - 수동 확인 후 발행

3. **에러 발생 시:**
   - 로그 캡처해서 나에게 보내기
   - 브라우저 창 닫지 말고 상태 확인

---

**집 가서 차근차근 하자! 🧈💛🤎**
