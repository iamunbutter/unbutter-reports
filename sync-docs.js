#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const WORKSPACE = '/Users/jeong-ing/.openclaw/workspace';
const DOCS_DIR = path.join(__dirname, 'docs');

// 카테고리 매핑
const CATEGORY_MAP = {
  'unbutter-agents': 'agents',
  'unbutter-brand': 'brand',
  'unbutter-chrome-extension': 'extensions',
  'unbutter-current': 'current',
  'unbutter-dashboard': 'dashboard',
  'unbutter-marketing': 'marketing',
  'unbutter-reports': 'reports'
};

// docs 디렉토리 초기화
if (fs.existsSync(DOCS_DIR)) {
  fs.rmSync(DOCS_DIR, { recursive: true });
}
fs.mkdirSync(DOCS_DIR, { recursive: true });

// 카테고리별 디렉토리 생성
Object.values(CATEGORY_MAP).forEach(category => {
  fs.mkdirSync(path.join(DOCS_DIR, category), { recursive: true });
});

// Markdown 파일 수집 함수
function collectMarkdownFiles(dir, category) {
  const files = [];
  
  function walk(currentPath, relativePath = '') {
    try {
      const items = fs.readdirSync(currentPath);
      
      items.forEach(item => {
        // node_modules, .git, .next 등 제외
        if (item.startsWith('.') || item === 'node_modules') {
          return;
        }
        
        const fullPath = path.join(currentPath, item);
        const newRelativePath = relativePath ? path.join(relativePath, item) : item;
        
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          walk(fullPath, newRelativePath);
        } else if (item.endsWith('.md')) {
          files.push({
            sourcePath: fullPath,
            relativePath: newRelativePath,
            category
          });
        }
      });
    } catch (err) {
      console.warn(`⚠️  디렉토리 읽기 오류 (${currentPath}):`, err.message);
    }
  }
  
  walk(dir);
  return files;
}

// 모든 unbutter-* 디렉토리 스캔
const allFiles = [];
const workspaceItems = fs.readdirSync(WORKSPACE);

workspaceItems.forEach(item => {
  if (item.startsWith('unbutter-') && item !== 'unbutter-reports') {
    const fullPath = path.join(WORKSPACE, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      const category = CATEGORY_MAP[item] || 'misc';
      console.log(`📁 스캔 중: ${item} → ${category}`);
      const files = collectMarkdownFiles(fullPath, category);
      allFiles.push(...files);
      console.log(`   ✅ ${files.length}개 파일 발견`);
    }
  }
});

// 개별 .md 파일도 처리
workspaceItems.forEach(item => {
  if (item.startsWith('unbutter-') && item.endsWith('.md')) {
    const fullPath = path.join(WORKSPACE, item);
    const category = 'misc';
    allFiles.push({
      sourcePath: fullPath,
      relativePath: item,
      category
    });
    console.log(`📄 개별 파일: ${item} → ${category}`);
  }
});

// 파일 복사
console.log(`\n📋 총 ${allFiles.length}개 파일 복사 중...\n`);

allFiles.forEach(({ sourcePath, relativePath, category }) => {
  const destPath = path.join(DOCS_DIR, category, relativePath);
  const destDir = path.dirname(destPath);
  
  // 하위 디렉토리 생성
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // 파일 복사
  fs.copyFileSync(sourcePath, destPath);
  console.log(`   ✓ ${category}/${relativePath}`);
});

// 인덱스 파일 생성
const indexContent = `# UnButter 문서 아카이브

마지막 업데이트: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}

## 📚 카테고리

${Object.entries(CATEGORY_MAP).map(([dir, category]) => {
  const categoryPath = path.join(DOCS_DIR, category);
  let count = 0;
  
  function countFiles(dir) {
    try {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          countFiles(fullPath);
        } else if (item.endsWith('.md')) {
          count++;
        }
      });
    } catch (err) {
      // ignore
    }
  }
  
  countFiles(categoryPath);
  return `- [${category}](./docs/${category}) - ${count}개 문서`;
}).join('\n')}

---

이 문서는 자동으로 생성되었습니다.
`;

fs.writeFileSync(path.join(__dirname, 'README.md'), indexContent);

console.log(`\n✅ 동기화 완료!`);
console.log(`📊 총 ${allFiles.length}개 파일이 docs/ 폴더로 복사되었습니다.`);
