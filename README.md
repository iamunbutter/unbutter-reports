# 🧈 UnButter Reports - 문서 아카이브

워크스페이스의 모든 문서를 자동으로 수집하고 웹에서 볼 수 있는 시스템입니다.

## 🎯 기능

- ✅ **자동 문서 수집**: `unbutter-*` 폴더의 모든 `.md` 파일 자동 동기화
- ✅ **카테고리 분류**: agents, brand, marketing 등 카테고리별 정리
- ✅ **웹 렌더링**: Markdown을 아름답게 렌더링
- ✅ **GitHub Actions**: 매일 자동 동기화
- ✅ **Vercel 배포**: Git push 시 자동 배포

## 🚀 배포 상태

- **프로덕션**: [Vercel에서 확인](https://unbutter-reports.vercel.app) (배포 후)
- **마지막 동기화**: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}

## 📁 문서 구조

\`\`\`
docs/
├── agents/         # 에이전트 프롬프트 및 태스크
├── brand/          # 브랜드 가이드라인
├── marketing/      # 마케팅 캠페인 & 인사이트
├── current/        # 현재 진행 중인 작업
├── dashboard/      # 대시보드 문서
├── extensions/     # 크롬 확장 프로그램
└── misc/           # 기타 문서
\`\`\`

## 🔄 문서 동기화

### 수동 동기화

\`\`\`bash
node sync-docs.js
\`\`\`

### 자동 동기화

- **매일 오전 9시 (KST)** - GitHub Actions 자동 실행
- **Git push 시** - 자동으로 최신 문서 동기화

## 🛠️ 개발

### 로컬 실행

\`\`\`bash
# 문서 동기화
node sync-docs.js

# Vercel 로컬 개발 서버
npm install -g vercel
vercel dev
\`\`\`

### 파일 추가

새로운 `.md` 파일은 다음 위치에 추가:

- \`/Users/jeong-ing/.openclaw/workspace/unbutter-*/*.md\`

다음 동기화 시 자동으로 \`docs/\` 폴더로 복사됩니다.

## 🔗 GitHub 리포지토리 생성

리포지토리를 생성하려면:

\`\`\`bash
# GitHub CLI 인증
gh auth login

# 리포지토리 생성 & push
gh repo create unbutter-reports --public --source=. --remote=origin --push
\`\`\`

## 📦 Vercel 연동

1. [Vercel](https://vercel.com) 로그인
2. "Import Project" 클릭
3. GitHub 리포지토리 선택: \`unbutter-reports\`
4. 자동 배포 시작

### 환경 변수 (필요시)

\`\`\`
WORKSPACE_PATH=/Users/jeong-ing/.openclaw/workspace
\`\`\`

## 📊 통계

현재 문서:
- **총 파일 수**: 44개
- **카테고리**: 7개
- **총 용량**: 약 150KB

---

**마지막 업데이트**: ${new Date().toISOString()}
