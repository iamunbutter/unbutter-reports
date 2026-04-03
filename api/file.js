import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const requestedPath = req.query.path;
  
  if (!requestedPath) {
    return res.status(400).json({ error: 'path parameter required' });
  }
  
  // 보안 검증
  if (requestedPath.includes('..') || !requestedPath.startsWith('docs/')) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  try {
    // Vercel 환경: process.cwd()는 프로젝트 루트
    const fullPath = path.join(process.cwd(), requestedPath);
    
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
      content: content
    });
    
  } catch (error) {
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message
    });
  }
}
