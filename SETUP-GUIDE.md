# 🚀 UnButter Reports - 배포 가이드

이 문서는 GitHub 리포지토리 생성부터 Vercel 배포까지 전체 과정을 안내합니다.

## ✅ 완료된 작업

- [x] 프로젝트 초기화
- [x] 문서 동기화 스크립트 (`sync-docs.js`)
- [x] GitHub Actions 배포 설정 (`.github/workflows/deploy.yml`)
- [x] Markdown 웹 뷰어 (`docs-viewer.html`)
- [x] Git 초기 커밋 완료

## 🔜 다음 단계

### 1️⃣ GitHub CLI 인증

```bash
# GitHub 로그인
gh auth login

# 브라우저 또는 토큰으로 인증
# - 브라우저 선택 (권장)
# - GitHub.com 선택
# - HTTPS 프로토콜 선택
# - 인증 완료
```

### 2️⃣ GitHub 리포지토리 생성

```bash
cd /Users/jeong-ing/.openclaw/workspace/unbutter-reports

# 리포지토리 생성 & push
gh repo create unbutter-reports --public --source=. --remote=origin --push
```

**성공 시 출력:**
```
✓ Created repository jeong-ing/unbutter-reports on GitHub
✓ Added remote origin
✓ Pushed commits to origin/main
```

**리포지토리 URL:** `https://github.com/[YOUR-USERNAME]/unbutter-reports`

### 3️⃣ Vercel 프로젝트 생성

#### 옵션 A: Vercel 웹사이트에서

1. [Vercel](https://vercel.com) 접속 → 로그인
2. "New Project" 클릭
3. GitHub 계정 연동
4. `unbutter-reports` 리포지토리 선택
5. **Framework Preset**: Other (자동 선택됨)
6. **Root Directory**: `./` (기본값)
7. "Deploy" 클릭

#### 옵션 B: Vercel CLI로

```bash
# Vercel CLI 설치 (없는 경우)
npm install -g vercel

# Vercel 로그인
vercel login

# 프로젝트 배포
cd /Users/jeong-ing/.openclaw/workspace/unbutter-reports
vercel --prod
```

### 4️⃣ GitHub Actions 활성화 확인

리포지토리가 생성되면 GitHub Actions가 자동으로 활성화됩니다.

**확인 방법:**
1. GitHub 리포지토리 접속
2. "Actions" 탭 클릭
3. "문서 동기화 & 배포" 워크플로우 확인

**자동 실행 스케줄:**
- 매일 오전 9시 (KST) - `cron: '0 0 * * *'`
- Git push 시 자동 실행

### 5️⃣ 배포 확인

```bash
# Vercel 배포 URL 확인
vercel inspect --prod

# 브라우저에서 열기
open https://unbutter-reports.vercel.app
```

## 🔧 설정 검증

### 문서 동기화 테스트

```bash
# 수동 동기화 실행
node sync-docs.js

# 출력 예시:
# 📁 스캔 중: unbutter-agents → agents
#    ✅ 13개 파일 발견
# ...
# ✅ 동기화 완료!
# 📊 총 44개 파일이 docs/ 폴더로 복사되었습니다.
```

### Git & GitHub 연동 확인

```bash
# 리모트 확인
git remote -v

# 예상 출력:
# origin  https://github.com/[YOUR-USERNAME]/unbutter-reports.git (fetch)
# origin  https://github.com/[YOUR-USERNAME]/unbutter-reports.git (push)
```

### Vercel 로컬 테스트

```bash
# Vercel 개발 서버 실행
vercel dev

# 브라우저에서 열기
# http://localhost:3000
```

## 🎯 기능 확인 체크리스트

배포 후 다음 기능들이 정상 작동하는지 확인:

- [ ] **메인 페이지**: 문서 뷰어가 로드되는가?
- [ ] **사이드바**: 카테고리가 표시되는가?
- [ ] **파일 목록**: 각 카테고리의 파일들이 보이는가?
- [ ] **문서 렌더링**: Markdown이 제대로 렌더링되는가?
- [ ] **네비게이션**: 파일 클릭 시 내용이 표시되는가?
- [ ] **GitHub Actions**: 자동 동기화가 작동하는가?

## 🐛 문제 해결

### GitHub CLI 인증 실패

```bash
# 기존 인증 제거
gh auth logout

# 다시 로그인
gh auth login
```

### Vercel 배포 실패

```bash
# Vercel 로그 확인
vercel logs

# 프로젝트 재배포
vercel --prod --force
```

### 문서 동기화 안됨

```bash
# Node.js 경로 확인
which node

# 스크립트 수동 실행
/opt/homebrew/bin/node sync-docs.js
```

## 📱 업데이트 방법

새로운 문서가 추가되면:

```bash
# 1. 문서 동기화
node sync-docs.js

# 2. Git 커밋
git add .
git commit -m "📚 문서 업데이트"

# 3. GitHub push (자동 배포 트리거)
git push origin main
```

## 🔗 유용한 링크

- **GitHub 리포지토리**: `https://github.com/[YOUR-USERNAME]/unbutter-reports`
- **Vercel 대시보드**: `https://vercel.com/dashboard`
- **프로덕션 URL**: `https://unbutter-reports.vercel.app`

---

**다음 단계가 완료되면 이 문서를 업데이트하세요!**
