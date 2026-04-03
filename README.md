# 언버터 리포트

## GitHub Pages 활성화

1. https://github.com/iamunbutter/unbutter-reports/settings/pages 접속
2. Source: `Deploy from a branch`
3. Branch: `main` / `/ (root)`
4. Save

배포 URL: https://iamunbutter.github.io/unbutter-reports/

## 로컬 빌드

```bash
node build-docs-json.js
cp index-v2.html index.html
```

## 자동 동기화

매일 오전 9시 자동 실행:
```bash
node /Users/jeong-ing/.openclaw/workspace/unbutter-agents/butterbot-auto.js daily
```
