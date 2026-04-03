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

fs.writeFileSync(
  path.join(__dirname, 'public/docs.json'),
  JSON.stringify(output, null, 2)
);

console.log(`✅ ${Object.keys(output).length}개 문서를 docs.json으로 빌드했습니다.`);
