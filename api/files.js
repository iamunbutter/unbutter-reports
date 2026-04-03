// Vercel Serverless Function - 파일 목록 조회
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
  
  // 정적으로 생성된 파일 목록 반환
  const files = [
    { path: 'docs/agents/TASK-TEMPLATES.md', category: 'agents' },
    { path: 'docs/agents/butterbot-coo-prompt.md', category: 'agents' },
    { path: 'docs/agents/design-lead-prompt.md', category: 'agents' },
    { path: 'docs/agents/design-member-prompt.md', category: 'agents' },
    { path: 'docs/agents/dev-lead-prompt.md', category: 'agents' },
    { path: 'docs/agents/dev-member-prompt.md', category: 'agents' },
    { path: 'docs/agents/developer-agent-prompt.md', category: 'agents' },
    { path: 'docs/agents/editor-agent-prompt.md', category: 'agents' },
    { path: 'docs/agents/marketer-agent-prompt.md', category: 'agents' },
    { path: 'docs/agents/planning-lead-prompt.md', category: 'agents' },
    { path: 'docs/agents/planning-member-prompt.md', category: 'agents' },
    { path: 'docs/agents/pm-agent-prompt.md', category: 'agents' },
    { path: 'docs/agents/publisher-agent-prompt.md', category: 'agents' },
    { path: 'docs/agents/workflow/README.md', category: 'agents' },
    { path: 'docs/brand/assets/keywords.md', category: 'brand' },
    { path: 'docs/brand/assets/logo.md', category: 'brand' },
    { path: 'docs/brand/core/icp.md', category: 'brand' },
    { path: 'docs/brand/core/product.md', category: 'brand' },
    { path: 'docs/brand/core/story.md', category: 'brand' },
    { path: 'docs/brand/core/tonality-update.md', category: 'brand' },
    { path: 'docs/brand/core/tonality.md', category: 'brand' },
    { path: 'docs/brand/guidelines/blog.md', category: 'brand' },
    { path: 'docs/brand/guidelines/instagram.md', category: 'brand' },
    { path: 'docs/marketing/campaigns/2026-04-week1.md', category: 'marketing' },
    { path: 'docs/marketing/content-library/blog/brand-story-draft-v2.md', category: 'marketing' },
    { path: 'docs/marketing/content-library/blog/brand-story-draft.md', category: 'marketing' },
    { path: 'docs/marketing/content-library/blog/brand-story-final-v3.md', category: 'marketing' },
    { path: 'docs/marketing/content-library/blog/brand-story-final.md', category: 'marketing' },
    { path: 'docs/marketing/insights/learnings.md', category: 'marketing' },
    { path: 'docs/marketing/insights/what-doesnt.md', category: 'marketing' },
    { path: 'docs/marketing/insights/what-works.md', category: 'marketing' }
  ];
  
  return res.status(200).json(files);
}
