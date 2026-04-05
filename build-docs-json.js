const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');
const output = {};

// 카테고리 설정
const CATEGORY_CONFIG = {
  agents: { name: '에이전트', icon: '🤖', color: '#6366f1' },
  brand: { name: '브랜드', icon: '🧈', color: '#f59e0b' },
  marketing: { name: '마케팅', icon: '📢', color: '#ec4899' },
  extensions: { name: '확장프로그램', icon: '🧩', color: '#10b981' },
  dashboard: { name: '대시보드', icon: '📊', color: '#3b82f6' },
  current: { name: '현황/태스크', icon: '✅', color: '#8b5cf6' },
  reports: { name: '리포트', icon: '📋', color: '#14b8a6' },
  misc: { name: '기타', icon: '📁', color: '#9ca3af' },
};

function extractTitle(content, fileName) {
  const match = content.match(/^#\s+(.+)$/m);
  if (match) return match[1].trim();
  return fileName.replace(/\.md$/, '').replace(/[-_]/g, ' ');
}

function extractDescription(content) {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('```') && !trimmed.startsWith('---') && !trimmed.startsWith('|')) {
      return trimmed.substring(0, 120);
    }
  }
  return '';
}

function walkDir(dir, category = '') {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDir(fullPath, category || file);
    } else if (file.endsWith('.md')) {
      const relativePath = path.relative(docsDir, fullPath);
      const key = `docs/${relativePath}`;
      const content = fs.readFileSync(fullPath, 'utf-8');
      const cat = category || relativePath.split('/')[0];

      output[key] = {
        path: key,
        category: cat,
        title: extractTitle(content, file),
        description: extractDescription(content),
        content: content,
        size: Buffer.byteLength(content, 'utf-8'),
        lastModified: stat.mtimeMs
      };
    }
  });
}

walkDir(docsDir);

// 카테고리 메타데이터도 포함
const result = {
  categories: CATEGORY_CONFIG,
  documents: output
};

const outputPath = path.join(__dirname, 'docs.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log(`✅ ${Object.keys(output).length}개 문서를 docs.json으로 빌드했습니다.`);
