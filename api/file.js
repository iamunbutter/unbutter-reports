const fs = require('fs');
const path = require('path');

// 안전한 파일 경로 검증
function isSafePath(filePath) {
  if (filePath.includes('..')) {
    return false;
  }
  
  const allowedExtensions = ['.md', '.txt', '.json'];
  const ext = path.extname(filePath).toLowerCase();
  
  return allowedExtensions.includes(ext);
}

// docs/ 디렉토리의 모든 .md 파일 목록 반환
function listMarkdownFiles(docsPath) {
  const files = [];
  
  function walk(dir, basePath = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(basePath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walk(fullPath, relativePath);
      } else if (item.endsWith('.md')) {
        files.push(`docs/${relativePath}`);
      }
    });
  }
  
  if (fs.existsSync(docsPath)) {
    walk(docsPath);
  }
  
  return files;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // 파일 목록 요청
  if (!req.query.path) {
    const docsPath = path.join(__dirname, '..', 'docs');
    const files = listMarkdownFiles(docsPath);
    
    return res.status(200).json(files);
  }
  
  // 개별 파일 요청
  const requestedPath = req.query.path;
  
  if (!isSafePath(requestedPath)) {
    return res.status(403).json({ 
      error: 'Forbidden',
      message: '허용되지 않은 파일 경로입니다'
    });
  }
  
  try {
    const fullPath = path.join(__dirname, '..', requestedPath);
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: `파일을 찾을 수 없습니다: ${requestedPath}`
      });
    }
    
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    return res.status(200).json({
      success: true,
      path: requestedPath,
      content: content,
      size: Buffer.byteLength(content, 'utf-8')
    });
    
  } catch (error) {
    console.error('File read error:', error);
    
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: '파일을 읽는 중 오류가 발생했습니다',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
