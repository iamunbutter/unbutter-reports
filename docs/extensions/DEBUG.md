# 로드 안 될 때 체크리스트

## 1. 크롬 버전 확인
- 주소창에 `chrome://version/` 입력
- Manifest V3는 Chrome 88+ 필요

## 2. 에러 로그 확인
- `chrome://extensions/` 페이지에서
- 확장 프로그램 카드 아래 **"오류"** 빨간 글씨 있는지 확인
- 있으면 클릭해서 에러 내용 확인

## 3. 폴더 권한 확인
터미널에서:
```bash
ls -la /Users/jeong-ing/.openclaw/workspace/unbutter-chrome-extension/
```

모든 파일이 읽기 가능해야 함

## 4. 강제 새로고침
- `chrome://extensions/` 페이지에서 F5 또는 ⌘+R

## 5. 크롬 재시작
- 크롬 완전히 종료 후 재실행

## 6. 대안: ZIP으로 설치
```bash
cd /Users/jeong-ing/.openclaw/workspace
zip -r unbutter-extension.zip unbutter-chrome-extension -x "*.DS_Store" "*/icons/*"
```

그 다음 크롬에서:
- "압축된 확장 프로그램 로드" (개발자 모드에서)
- unbutter-extension.zip 선택

---

**여전히 안 되면:**
1. `chrome://extensions/` 스크린샷
2. 콘솔 (F12) 에러 메시지
3. 크롬 버전

보내주면 정확히 진단할게! 🧈
