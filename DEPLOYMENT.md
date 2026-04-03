# 🚀 Vercel 배포 가이드

## 사전 준비

1. **Vercel 계정 생성**: https://vercel.com
2. **GitHub 연동** (선택): 자동 배포 원할 경우

## 방법 1: Vercel CLI로 배포 (추천)

### 1단계: Vercel CLI 설치

```bash
npm install -g vercel
```

### 2단계: 로그인

```bash
vercel login
```

이메일 또는 GitHub 계정으로 로그인.

### 3단계: 프로젝트 디렉토리 이동

```bash
cd /Users/jeong-ing/.openclaw/workspace/unbutter-reports
```

### 4단계: 첫 배포 (테스트)

```bash
vercel
```

- 프로젝트 이름: `unbutter-reports` (또는 원하는 이름)
- 설정 확인 후 Enter

배포 완료되면 URL이 나옵니다. 예: `https://unbutter-reports-xxx.vercel.app`

### 5단계: 프로덕션 배포

```bash
vercel --prod
```

또는

```bash
npm run deploy
```

## 방법 2: GitHub 연동 자동 배포

### 1단계: GitHub 리포지토리 생성

```bash
git init
git add .
git commit -m "Initial commit: Dashboard v2"
git branch -M main
git remote add origin https://github.com/당신의계정/unbutter-reports.git
git push -u origin main
```

### 2단계: Vercel에서 Import

1. https://vercel.com/new 접속
2. "Import Git Repository" 클릭
3. `unbutter-reports` 선택
4. 설정 확인 후 Deploy

이후 `main` 브랜치에 push하면 자동 배포됩니다!

## ⚙️ 환경 변수 설정

Vercel 대시보드 → 프로젝트 → Settings → Environment Variables

### 필수 변수

없음! 기본 경로로 동작합니다.

### 선택 변수

```
WORKSPACE_PATH=/Users/jeong-ing/.openclaw/workspace
```

워크스페이스 경로를 변경하려면 설정하세요.

## 🔍 배포 후 확인 사항

1. **메인 페이지 로드**: `https://your-project.vercel.app`
2. **문서 클릭**: 모달에서 Markdown이 정상 렌더링되는지 확인
3. **API 테스트**: 개발자 도구(F12) → Network 탭에서 `/api/file` 응답 확인

## 🐛 트러블슈팅

### 1. API가 404 오류

**원인**: `vercel.json` 라우팅 설정 누락

**해결**:
```bash
vercel --force
```

강제 재배포.

### 2. 파일을 못 읽어옴

**원인**: Vercel은 파일 시스템 접근이 제한됩니다.

**해결**: 
- Vercel에서는 프로젝트 내 파일만 읽을 수 있음
- 외부 워크스페이스 파일은 빌드 시점에 복사해야 함
- **또는** GitHub API/외부 저장소에서 읽어오도록 변경

### 3. Markdown이 깨짐

**원인**: `marked.js` CDN 로드 실패

**해결**:
```bash
npm install marked --save
```

로컬 의존성으로 설치 후 번들링.

## 📊 배포 상태 모니터링

```bash
# 최근 배포 확인
vercel ls

# 로그 확인
vercel logs

# 도메인 확인
vercel domains ls
```

## 🌐 커스텀 도메인 연결

1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. "Add Domain" 클릭
3. `reports.unbutter.co.kr` 입력
4. DNS 레코드 추가:
   ```
   Type: CNAME
   Name: reports
   Value: cname.vercel-dns.com
   ```

## 🔄 업데이트 배포

파일 수정 후:

```bash
git add .
git commit -m "Update: 새 문서 추가"
git push

# 또는 CLI로 직접
vercel --prod
```

## 💡 팁

- **Preview 배포**: `vercel`만 입력하면 테스트 URL 생성
- **Production 배포**: `vercel --prod`로 실제 URL 업데이트
- **롤백**: Vercel 대시보드에서 이전 배포 버전으로 복원 가능
- **Analytics**: Vercel Analytics 무료 - 트래픽 확인 가능

---

문제 있으면 버터봇에게 물어보세요! 🧈
