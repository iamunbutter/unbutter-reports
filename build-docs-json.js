const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');
const output = {};

function walkDir(dir, baseCategory = '') {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      walkDir(fullPath, file);
    } else if (file.endsWith('.md')) {
      const relativePath = fullPath.replace(docsDir + '/', '');
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      output[`docs/${relativePath}`] = {
        path: `docs/${relativePath}`,
        category: baseCategory || relativePath.split('/')[0],
        content: content,
        size: Buffer.byteLength(content, 'utf-8')
      };
    }
  });
}

walkDir(docsDir);

// public 폴더 생성
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// docs.json 저장
const outputPath = path.join(publicDir, 'docs.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

// index.html 복사
const indexSrc = path.join(__dirname, 'index-v2.html');
const indexDest = path.join(publicDir, 'index.html');
fs.copyFileSync(indexSrc, indexDest);

console.log(`✅ ${Object.keys(output).length}개 문서를 docs.json으로 빌드했습니다.`);
