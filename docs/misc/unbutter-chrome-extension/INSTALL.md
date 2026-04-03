# 🧈 크롬 확장 설치 가이드

## 1. 아이콘 생성 (임시)

현재 아이콘이 없어도 작동하지만, 추가하려면:

### 방법 1: 이모지를 스크린샷으로
1. 메모장에 `🧈` 이모지 크게 입력
2. 스크린샷 → 크롭
3. 16x16, 48x48, 128x128 크기로 저장
4. `icons/` 폴더에 `icon16.png`, `icon48.png`, `icon128.png` 이름으로 저장

### 방법 2: 아이콘 없이 사용
- `manifest.json`에서 `icons` 부분 삭제:

```json
{
  "manifest_version": 3,
  "name": "언버터 블로그 자동화",
  "version": "1.0.0",
  "description": "네이버 블로그 자동 발행 도우미",
  "permissions": ["storage", "activeTab", "scripting"],
  "host_permissions": [
    "https://blog.naver.com/*",
    "https://m.blog.naver.com/*"
  ],
  "action": {
    "default_popup": "popup.html"
  },
  "content_scripts": [
    {
      "matches": [
        "https://blog.naver.com/*",
        "https://m.blog.naver.com/*"
      ],
      "js": ["content.js"]
    }
  ]
}
```

## 2. 크롬 확장 설치

1. **크롬 열기**
   - 주소창에 `chrome://extensions/` 입력

2. **개발자 모드 켜기**
   - 우측 상단 토글 ON

3. **폴더 선택**
   - "압축해제된 확장 프로그램을 로드합니다" 클릭
   - 아래 경로 입력:
   ```
   /Users/jeong-ing/.openclaw/workspace/unbutter-chrome-extension
   ```

4. **완료!**
   - 툴바에 확장 아이콘 표시됨

## 3. 사용 방법

1. 네이버 블로그 로그인
2. 글쓰기 페이지 열기
3. 확장 아이콘 클릭
4. 제목/본문 입력 → "자동 작성하기"

---

**문제 해결:**

- **아이콘 없음 오류**: manifest.json에서 icons 부분 삭제
- **확장 안 보임**: 개발자 모드 확인
- **작동 안 함**: 콘솔 로그 확인 (F12)

🧈 Made by 버터봇
