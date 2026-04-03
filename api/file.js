const fs = require('fs');
const path = require('path');

// 안전한 파일 경로 검증
function isSafePath(filePath) {
  // .. 경로 순회 방지
  if (filePath.includes('..')) {
    return false;
  }
  
  // 허용된 확장자만 읽기 가능
  const allowedExtensions = ['.md', '.txt', '.json'];
  const ext = path.extname(filePath).toLowerCase();
  
  return allowedExtensions.includes(ext);
}

module.exports = async (req, res) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET 요청만 허용
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { path: requestedPath } = req.query;
  
  if (!requestedPath) {
    return res.status(400).json({ 
      error: 'Bad Request',
      message: 'path 파라미터가 필요합니다'
    });
  }
  
  // 경로 보안 검증
  if (!isSafePath(requestedPath)) {
    return res.status(403).json({ 
      error: 'Forbidden',
      message: '허용되지 않은 파일 경로입니다'
    });
  }
  
  try {
    // 워크스페이스 기준 절대 경로 생성
    const workspacePath = process.env.WORKSPACE_PATH || '/Users/jeong-ing/.openclaw/workspace';
    const fullPath = path.join(workspacePath, requestedPath);
    
    // 파일 존재 확인
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: `파일을 찾을 수 없습니다: ${requestedPath}`
      });
    }
    
    // 파일 읽기
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // 성공 응답
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
