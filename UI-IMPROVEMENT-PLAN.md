# 언버터 리포트 UI/UX 개선 기획서

**작성일:** 2026-04-03  
**작성자:** 기획팀 (SubAgent)  
**목표:** 정적 HTML 아카이브를 "모찌 리포트" 수준의 세련된 문서 뷰어로 전환

---

## 📋 목차

1. [현재 상태 분석](#1-현재-상태-분석)
2. [개선 목표 및 핵심 요구사항](#2-개선-목표-및-핵심-요구사항)
3. [UI/UX 개선안](#3-uiux-개선안)
4. [기술 구현 전략](#4-기술-구현-전략)
5. [배포 전략](#5-배포-전략)
6. [개발 로드맵](#6-개발-로드맵)

---

## 1. 현재 상태 분석

### ✅ 현재 구현된 기능
- 카테고리별 문서 분류 (기획서/아키텍처/디자인/마케팅/코드/태스크)
- 총 11개 문서 목록 표시
- 카테고리 필터링
- 실시간 검색
- 반응형 카드 레이아웃
- 언버터 브랜드 컬러 시스템 적용 (#fff1b5, #43302e)

### ❌ 부족한 점
1. **문서 내용 표시 불가:** "📄 문서 보기" 클릭 시 alert만 표시
2. **Markdown 렌더링 없음:** .md 파일을 읽어도 표시할 방법이 없음
3. **파일 시스템 접근 불가:** 정적 HTML이라 파일을 읽을 수 없음
4. **배포 고려 안 됨:** 로컬 절대 경로 하드코딩

### 🎯 벤치마크: 모찌 리포트 수준이란?
- **Notion 스타일 문서 뷰어:** 사이드패널 또는 모달로 문서 내용 전체 표시
- **아름다운 타이포그래피:** 가독성 높은 Markdown 렌더링
- **부드러운 애니메이션:** 문서 전환 시 fade/slide 효과
- **코드 하이라이팅:** 코드 블록 구문 강조
- **다크모드 (선택):** 눈의 피로 감소

---

## 2. 개선 목표 및 핵심 요구사항

### 목표
> **"클릭 한 번으로 문서 전체를 읽을 수 있는 세련된 아카이브"**

### 핵심 요구사항

#### ✅ 필수 (Phase 1)
1. **문서 내용 표시**
   - Markdown → HTML 렌더링
   - 사이드패널 또는 모달 방식
   - 닫기/뒤로가기 동작

2. **파일 시스템 연동**
   - `.md` 파일 읽기
   - API 엔드포인트 제공

3. **Vercel/Netlify 배포 가능**
   - 서버리스 함수로 파일 읽기
   - 환경변수로 경로 설정

#### 🎨 우선순위 높음 (Phase 2)
4. **세련된 UI**
   - 부드러운 트랜지션
   - 코드 하이라이팅
   - 반응형 레이아웃 개선

5. **UX 향상**
   - 로딩 상태 표시
   - 에러 핸들링 (파일 없음)
   - 키보드 단축키 (ESC, ←→)

#### 🌟 부가 기능 (Phase 3)
6. **다크모드**
7. **문서 내 검색**
8. **목차 자동 생성**
9. **파일 다운로드**

---

## 3. UI/UX 개선안

### 3.1 문서 표시 방식: 사이드패널 vs 모달

#### 🏆 **추천: 사이드패널 (Notion 스타일)**

**이유:**
- 카테고리/목록을 보면서 문서 탐색 가능
- 넓은 화면에서 효율적
- 문맥 전환 최소화

**구조:**
```
┌─────────────────────────────────────────────┐
│  Header: 🧈 언버터 리포트               11개 │
├──────────────┬──────────────────────────────┤
│              │                              │
│  카테고리    │                              │
│  (좌측 30%) │   문서 내용 (우측 70%)       │
│              │   - Markdown 렌더링          │
│  문서 목록   │   - 코드 하이라이팅          │
│              │   - 부드러운 스크롤          │
│              │                              │
│              │   [닫기 버튼]                │
└──────────────┴──────────────────────────────┘
```

**모바일:** 전체 화면 오버레이로 전환

#### 대안: 전체 화면 모달

**장점:**
- 문서에 집중 가능
- 구현이 더 간단

**단점:**
- 다른 문서로 바로 이동 어려움
- 컨텍스트 전환 비용 높음

### 3.2 UI 컴포넌트 상세 설계

#### A. 사이드패널 컴포넌트

```html
<div id="docPanel" class="doc-panel">
  <div class="panel-header">
    <button class="back-btn">← 목록으로</button>
    <button class="close-btn">✕</button>
  </div>
  
  <div class="panel-content">
    <!-- Markdown 렌더링 영역 -->
    <article id="docContent" class="markdown-body"></article>
  </div>
  
  <div class="panel-footer">
    <button class="download-btn">📥 다운로드</button>
    <button class="share-btn">🔗 링크 복사</button>
  </div>
</div>
```

#### B. 로딩 상태

```html
<div class="loading-skeleton">
  <div class="skeleton-title"></div>
  <div class="skeleton-line"></div>
  <div class="skeleton-line"></div>
  <div class="skeleton-line short"></div>
</div>
```

#### C. 에러 상태

```html
<div class="error-state">
  <div class="error-icon">⚠️</div>
  <div class="error-title">문서를 불러올 수 없습니다</div>
  <div class="error-desc">파일이 존재하지 않거나 접근 권한이 없습니다.</div>
  <button class="retry-btn">다시 시도</button>
</div>
```

### 3.3 스타일 가이드

#### 컬러 시스템 (기존 유지 + 확장)

```css
:root {
  /* Primary - 언버터 브랜드 */
  --butter-yellow: #fff1b5;
  --butter-gradient: linear-gradient(135deg, #fff9e6 0%, #fff1b5 100%);
  --cocoa-brown: #43302e;
  
  /* Category Colors */
  --color-planning: #3b82f6;
  --color-architecture: #10b981;
  --color-design: #8b5cf6;
  --color-marketing: #ec4899;
  --color-code: #6366f1;
  --color-task: #f59e0b;
  
  /* UI */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border: #e5e7eb;
  
  /* Markdown */
  --code-bg: #f3f4f6;
  --code-border: #d1d5db;
  --link-color: #43302e;
  --blockquote-bg: #fff9e6;
  --blockquote-border: #fff1b5;
}
```

#### 타이포그래피

```css
.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-primary);
}

.markdown-body h1 {
  font-size: 2.25rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--cocoa-brown);
  border-bottom: 3px solid var(--butter-yellow);
  padding-bottom: 0.5rem;
}

.markdown-body h2 {
  font-size: 1.875rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.markdown-body code {
  background: var(--code-bg);
  border: 1px solid var(--code-border);
  border-radius: 0.25rem;
  padding: 0.125rem 0.375rem;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.875em;
}

.markdown-body pre {
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 0.5rem;
  padding: 1.25rem;
  overflow-x: auto;
}
```

#### 애니메이션

```css
.doc-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 70%;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

.doc-panel.open {
  transform: translateX(0);
}

.panel-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  z-index: 999;
}

.panel-backdrop.visible {
  opacity: 1;
  pointer-events: auto;
}
```

---

## 4. 기술 구현 전략

### 4.1 아키텍처 선택: Hybrid Static + Serverless

#### 왜 이 방식?

1. **정적 HTML 유지:** 빠른 로딩, 캐싱 가능
2. **Serverless Function:** 파일 읽기만 API로 처리
3. **무료 배포:** Vercel/Netlify 무료 티어 충분

#### 구조

```
unbutter-reports/
├── index.html              # 메인 페이지 (정적)
├── style.css              # 스타일 분리
├── app.js                 # 클라이언트 로직
├── api/
│   └── getDocument.js     # Serverless Function
└── docs/                  # 문서 파일 (배포 시 포함)
    ├── AGENT-TEAM-STRUCTURE.md
    ├── unbutter-marketing/
    └── ...
```

### 4.2 Serverless Function 구현

#### Vercel Function (`/api/getDocument.js`)

```javascript
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  const { path: docPath } = req.query;
  
  // 보안: 상위 디렉토리 접근 방지
  if (docPath.includes('..')) {
    return res.status(400).json({ error: 'Invalid path' });
  }
  
  try {
    const filePath = path.join(process.cwd(), 'docs', docPath);
    const content = await fs.readFile(filePath, 'utf-8');
    
    res.status(200).json({ 
      content,
      path: docPath 
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'File not found' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
}
```

#### Netlify Function (`/netlify/functions/getDocument.js`)

```javascript
const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
  const docPath = event.queryStringParameters.path;
  
  if (!docPath || docPath.includes('..')) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid path' })
    };
  }
  
  try {
    const filePath = path.join(__dirname, '../../docs', docPath);
    const content = await fs.readFile(filePath, 'utf-8');
    
    return {
      statusCode: 200,
      body: JSON.stringify({ content, path: docPath })
    };
  } catch (error) {
    return {
      statusCode: error.code === 'ENOENT' ? 404 : 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### 4.3 Markdown 렌더링

#### 라이브러리 선택: **marked.js + highlight.js**

**이유:**
- `marked`: 가볍고 빠른 Markdown 파서 (31KB)
- `highlight.js`: 코드 하이라이팅 (73KB, 필요한 언어만 로드 시 ~20KB)
- CDN 사용 가능 (설치 불필요)

#### HTML에 추가

```html
<!-- Markdown 파싱 -->
<script src="https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js"></script>

<!-- 코드 하이라이팅 -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>

<!-- GitHub 스타일 Markdown CSS -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown.min.css">
```

#### 사용 예시

```javascript
async function loadDocument(docPath) {
  showLoading();
  
  try {
    const response = await fetch(`/api/getDocument?path=${encodeURIComponent(docPath)}`);
    
    if (!response.ok) {
      throw new Error('Failed to load document');
    }
    
    const { content } = await response.json();
    
    // Markdown → HTML 변환
    const html = marked.parse(content);
    
    // 렌더링
    const container = document.getElementById('docContent');
    container.innerHTML = html;
    
    // 코드 하이라이팅 적용
    container.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
    
    openPanel();
  } catch (error) {
    showError(error.message);
  }
}
```

### 4.4 클라이언트 로직 (`app.js`)

```javascript
class DocumentViewer {
  constructor() {
    this.panel = document.getElementById('docPanel');
    this.backdrop = document.getElementById('panelBackdrop');
    this.content = document.getElementById('docContent');
    this.currentDoc = null;
    
    this.bindEvents();
  }
  
  bindEvents() {
    // 닫기
    document.getElementById('closePanel').addEventListener('click', () => this.close());
    this.backdrop.addEventListener('click', () => this.close());
    
    // ESC 키
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.panel.classList.contains('open')) {
        this.close();
      }
    });
  }
  
  async open(docPath) {
    this.currentDoc = docPath;
    this.showLoading();
    this.panel.classList.add('open');
    this.backdrop.classList.add('visible');
    
    try {
      const response = await fetch(`/api/getDocument?path=${encodeURIComponent(docPath)}`);
      
      if (!response.ok) {
        throw new Error(response.status === 404 ? '문서를 찾을 수 없습니다' : '서버 오류');
      }
      
      const { content } = await response.json();
      this.render(content);
    } catch (error) {
      this.showError(error.message);
    }
  }
  
  render(markdown) {
    const html = marked.parse(markdown);
    this.content.innerHTML = html;
    
    // 코드 하이라이팅
    this.content.querySelectorAll('pre code').forEach(hljs.highlightElement);
    
    // 맨 위로 스크롤
    this.content.scrollTop = 0;
  }
  
  close() {
    this.panel.classList.remove('open');
    this.backdrop.classList.remove('visible');
    this.currentDoc = null;
  }
  
  showLoading() {
    this.content.innerHTML = `
      <div class="loading-skeleton">
        <div class="skeleton-title"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    `;
  }
  
  showError(message) {
    this.content.innerHTML = `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <div class="error-title">문서를 불러올 수 없습니다</div>
        <div class="error-desc">${message}</div>
        <button onclick="viewer.open('${this.currentDoc}')">다시 시도</button>
      </div>
    `;
  }
}

// 초기화
const viewer = new DocumentViewer();

// 문서 열기 (기존 openDoc 함수 대체)
function openDoc(path) {
  viewer.open(path);
}
```

---

## 5. 배포 전략

### 5.1 Vercel 배포 (권장)

#### 장점
- GitHub 연동 자동 배포
- Serverless Function 기본 지원
- 빠른 CDN
- 무료 티어: 100GB 대역폭/월

#### 배포 설정 (`vercel.json`)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "DOCS_PATH": "/var/task/docs"
  }
}
```

#### 배포 전 체크리스트

1. **문서 파일 복사**
   ```bash
   # workspace의 문서들을 unbutter-reports/docs/로 복사
   cp -r ../unbutter-marketing unbutter-reports/docs/
   cp -r ../unbutter-chrome-extension unbutter-reports/docs/
   # ...
   ```

2. **절대 경로 제거**
   - 문서 목록의 `path` 필드를 상대 경로로 수정
   - `/Users/jeong-ing/.openclaw/workspace/` 제거

3. **Git 저장소 생성**
   ```bash
   cd unbutter-reports
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create unbutter-reports --public --source=. --push
   ```

4. **Vercel 배포**
   ```bash
   npm i -g vercel
   vercel login
   vercel --prod
   ```

### 5.2 Netlify 배포 (대안)

#### 설정 (`netlify.toml`)

```toml
[build]
  publish = "."
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[dev]
  functions = "netlify/functions"
```

#### 배포 명령

```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
```

### 5.3 환경별 설정

#### 개발 (로컬)
- Node.js API 서버 실행
- `http://localhost:3000`

#### 프로덕션 (Vercel)
- Serverless Function 자동 처리
- `https://unbutter-reports.vercel.app`

---

## 6. 개발 로드맵

### Phase 1: 핵심 기능 (1-2일)

#### Day 1
- [ ] 프로젝트 구조 개편
  - `docs/` 폴더에 문서 복사
  - `style.css`, `app.js` 분리
- [ ] Serverless Function 구현
  - `/api/getDocument.js` 작성
  - 로컬 테스트 (Vercel Dev)
- [ ] Markdown 렌더링
  - `marked.js` + `highlight.js` 통합
  - 기본 스타일 적용

#### Day 2
- [ ] 사이드패널 UI 구현
  - HTML/CSS 작성
  - 열기/닫기 애니메이션
- [ ] DocumentViewer 클래스
  - API 연동
  - 로딩/에러 상태
- [ ] 배포
  - Vercel 첫 배포
  - 동작 확인

### Phase 2: UX 개선 (1일)

- [ ] 반응형 레이아웃
  - 모바일: 전체 화면 모달
  - 태블릿: 50/50 분할
- [ ] 키보드 단축키
  - ESC: 패널 닫기
  - ←/→: 이전/다음 문서
- [ ] 로딩 최적화
  - 스켈레톤 UI
  - 문서 캐싱 (localStorage)
- [ ] 에러 처리 강화
  - 재시도 버튼
  - 오프라인 감지

### Phase 3: 추가 기능 (선택)

- [ ] 다크모드
- [ ] 목차 자동 생성 (H2/H3 추출)
- [ ] 문서 내 검색 (Ctrl+F)
- [ ] 파일 다운로드
- [ ] 공유 링크 (URL에 문서 경로 포함)

---

## 7. 예상 결과

### Before (현재)
```
🧈 언버터 리포트
├── 카테고리 필터 ✅
├── 문서 목록 ✅
└── 문서 보기 ❌ (alert만 표시)
```

### After (개선 후)
```
🧈 언버터 리포트
├── 카테고리 필터 ✅
├── 문서 목록 ✅
└── 문서 뷰어 ✅
    ├── Markdown 렌더링 ✅
    ├── 코드 하이라이팅 ✅
    ├── 부드러운 애니메이션 ✅
    ├── 반응형 레이아웃 ✅
    └── Vercel 배포 ✅
```

### 사용자 플로우

1. **메인 페이지 진입**
   - 카테고리 카드 + 문서 목록 표시
   
2. **"📄 문서 보기" 클릭**
   - 사이드패널이 우측에서 슬라이드 인
   - 로딩 스켈레톤 → Markdown 렌더링
   
3. **문서 읽기**
   - 좌측: 목록 계속 표시 (다른 문서 바로 이동 가능)
   - 우측: 문서 내용 (스크롤 가능)
   
4. **닫기**
   - "← 목록으로" 버튼 또는 ESC 키
   - 패널 슬라이드 아웃

---

## 8. 기술 스택 요약

| 구분 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **프론트엔드** | HTML/CSS/JS | Vanilla | 정적 페이지 |
| | marked.js | 12.0.0 | Markdown → HTML |
| | highlight.js | 11.9.0 | 코드 하이라이팅 |
| | github-markdown-css | 5.5.0 | Markdown 스타일 |
| **백엔드** | Vercel Functions | - | 파일 읽기 API |
| | Node.js | 18+ | 서버리스 런타임 |
| **배포** | Vercel | - | 호스팅 + CDN |
| | GitHub | - | 버전 관리 |

---

## 9. 비용 분석

### 무료 티어 한도 (Vercel)

| 항목 | 무료 한도 | 예상 사용량 | 여유 |
|------|-----------|-------------|------|
| 대역폭 | 100GB/월 | ~1GB/월 | 99% |
| Function 실행 | 100시간/월 | ~0.1시간/월 | 99.9% |
| Function 호출 | 무제한 | ~1,000/월 | ✅ |
| 빌드 시간 | 6,000분/월 | ~5분/월 | 99.9% |

**결론:** 무료 티어로 충분히 운영 가능

---

## 10. 다음 단계

### 즉시 시작 가능
1. **파일 구조 개편** → `docs/` 폴더 생성 및 문서 복사
2. **API 구현** → `/api/getDocument.js` 작성
3. **UI 개발** → 사이드패널 HTML/CSS

### 의사결정 필요
- [ ] Vercel vs Netlify 선택 (추천: Vercel)
- [ ] 사이드패널 vs 모달 (추천: 사이드패널)
- [ ] 다크모드 포함 여부 (Phase 3로 연기 가능)

### 개발팀 전달사항
이 기획서를 기반으로:
1. `/api/getDocument.js` 구현
2. `app.js` 클라이언트 로직 작성
3. CSS 스타일 추가

코드 구현 시작 전 기획서 검토 요청드립니다.

---

**작성자:** 기획팀 SubAgent  
**검토 요청:** 개발팀  
**최종 승인:** 버터봇 (메인 에이전트)
