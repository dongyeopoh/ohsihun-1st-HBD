# 알아두어야 할 것들

## 개발 서버 주소에 경로가 붙는다

- 증상: `npm run dev` 뒤 `http://localhost:5173/`을 열면 빈 화면이나 404가 나온다.
- 원인: `vite.config.js`의 `base: '/ohsihun-1st-HBD/'` 때문에 개발 서버도 그 경로 아래에서만 응답한다.
- 대응: `http://localhost:5173/ohsihun-1st-HBD/`로 연다. `npm run preview -- --port 5173`도 마찬가지로 `http://localhost:5173/ohsihun-1st-HBD/`로 연다(기본 포트 4173은 네이버 콘솔에 등록되지 않아 지도가 뜨지 않는다).

## 저장소를 새로 받으면 소스가 안 보인다

- 증상: `git clone` 직후 `src/`가 없고 빌드 결과물만 있다.
- 원인: 원격 저장소의 기본 브랜치가 `gh-pages`(배포 브랜치)로 되어 있어 그 브랜치가 체크아웃된다.
- 대응: `git checkout main`. 소스 작업은 항상 `main`에서 한다.

## 빌드했는데 커밋에 `dist/`가 안 들어간다

- 증상: `git add .` 뒤 `git status`에 `dist/` 변경이 없다.
- 원인: `.gitignore`에 `dist`가 있다. 이미 추적 중인 파일의 수정은 잡히지만 새로 생긴 해시 이름의 번들 파일(`assets/index-XXXX.js`)은 무시된다.
- 대응: `git add -f dist`. 확인: `git status`에서 `dist/assets/` 아래 새 파일이 보여야 한다.

## 촬영일 캡션이 안 뜨는 사진

- 증상: 어떤 사진에는 날짜와 "시훈이😍"가 겹쳐 보이는데 어떤 사진에는 아무것도 없다.
- 원인: 캡션은 사진 파일 안의 EXIF 촬영 일시에서 자동으로 만든다. 메신저로 받은 사진, 스크린샷, 일부 편집 앱의 내보내기 결과는 EXIF가 지워져 있어 캡션이 생기지 않는다. 현재 24장은 모두 촬영 일시를 갖고 있다. `parking.jpg`는 EXIF가 없지만 캡션 대상이 아니다.
- 대응: 사진을 교체·추가할 때는 카메라 원본 또는 EXIF가 보존된 내보내기를 쓴다. 확인: `node -e 'require("exifr").parse("public/images/SIHUN_1.jpg",{pick:["DateTimeOriginal"]}).then(console.log)'`가 날짜를 출력해야 한다.

## 캡션 날짜는 촬영지 현지 시각 기준이다

- 증상: 사진의 촬영 시각 메타데이터를 다른 도구(예: 파일 정보 창, 사진 앱)로 보면 UTC 기준 날짜가 하루 다르게 보일 수 있는데, 사이트 캡션은 항상 EXIF에 적힌 날짜 그대로다.
- 원인: exifr가 EXIF의 "YYYY:MM:DD HH:MM:SS" 문자열을 시간대 환산 없이 그 숫자 그대로 `Date`로 만들고, `toLocaleDateString('ko-KR')`도 같은 기준으로 그린다. 방문자가 어느 나라에서 보든 캡션 날짜는 같다.
- 대응: 없음. 캡션 날짜가 틀려 보인다는 보고가 오면 사진 파일의 EXIF 값 자체를 확인한다.

## 사진 파일 요청이 두 번 보인다

- 증상: 브라우저 네트워크 탭에 같은 `SIHUN_N.jpg`가 두 번 나타난다.
- 원인: `<img>`가 한 번 받고, exifr가 EXIF를 읽기 위해 같은 URL을 따로 받는다. 버그가 아니다.
- 대응: 없음. 사진 용량을 줄이는 것은 보호자 결정으로 하지 않는다.

## 지도가 빈 회색 상자로 나온다

- 증상: 지도 자리에 아무것도 없고 콘솔에 "네이버 지도 인증에 실패했습니다." 또는 "네이버 지도 API가 로드되지 않았습니다."가 찍힌다.
- 원인 후보 (순서대로 확인):
  1. 콘솔에 "네이버 지도 인증에 실패했습니다."가 있다: `index.html`의 `window.navermap_authFailure`가 호출된 것이다. 접속 주소가 네이버 콘솔에 등록된 URL이 아니거나(예: 포트 5174나 `127.0.0.1`로 열었는데 `http://localhost:5173`만 등록됨), 키 값이 틀렸다.
  2. 광고 차단기나 사내망이 `oapi.map.naver.com`을 막는다.
  3. `index.html`의 script 태그가 React 번들보다 뒤로 밀렸다. 지도 스크립트는 반드시 헤드에서 동기 로드되어야 `Location`이 마운트될 때 `window.naver`가 있다. 인증 실패 함수 정의도 지도 스크립트보다 앞에 있어야 한다.
- 대응: 콘솔의 인증 실패 메시지 확인 → 콘솔 등록 URL 확인(개발은 반드시 `http://localhost:5173/ohsihun-1st-HBD/`) → 네트워크 탭에서 `maps.js` 상태 확인 → `index.html` 순서 확인.

## 컴포넌트 CSS는 전역이고 같은 클래스는 마지막 import가 이긴다

- 증상: `Home.css`의 `.button` 여백을 고쳤는데 첫 화면 버튼이 안 바뀐다.
- 원인: 각 컴포넌트의 CSS 파일은 이름만 나뉘어 있을 뿐 모두 하나의 전역 스타일시트로 합쳐진다. `.button`, `.button-group`은 `Home.css`와 `Location.css`에, `.section__title`, `.section__subtitle`은 `Intro.css`, `Photo.css`, `Location.css`에 각각 다른 값으로 중복 정의되어 있고, `App.jsx`의 import 순서(Home → Intro → Photo → Location)상 `Location.css`의 정의가 마지막이라 이긴다.
- 대응: 공통 클래스를 고칠 때는 같은 이름이 정의된 모든 CSS 파일을 `grep`으로 찾아 같이 고친다. 확인: `grep -n "^\.button\b\|^\.section__title" src/components/*.css`.

## 저장소를 새로 받는 절차는 소스가 `main`에 올라간 뒤에야 성립한다

- 증상: `git checkout main`이 "pathspec 'main' did not match"로 실패한다.
- 원인: 원격에는 아직 `gh-pages` 브랜치만 있다. 소스 최초 커밋과 `git push origin main`이 끝나기 전까지는 복제한 저장소에 `main`이 없다.
- 대응: 소스가 있는 로컬 작업 폴더에서 먼저 `main`을 푸시한다. 그 전에는 새로 복제한 곳에서 소스 작업을 할 수 없다.

## `sips -Z`는 작은 사진을 확대한다

- 증상: 긴 변이 2000px 이하인 사진에 `sips -Z 2000`을 걸면 사진이 2000px로 커지고 용량도 는다.
- 원인: `sips -Z`(`--resampleHeightWidthMax`)는 "긴 변을 지정한 값으로 맞추는" 동작이지 "지정한 값 이하로 제한하는" 동작이 아니다. 작은 사진도 그 값까지 확대한다.
- 대응: 긴 변이 2000을 넘는 파일에만 적용한다. `sips -g pixelWidth -g pixelHeight <파일>`로 먼저 재고 조건을 걸어 실행한다. 2026년 10월에 축소를 시험하면서 확인한 사실이다(축소 자체는 보호자 결정으로 하지 않았다). `sips`는 촬영 일시·GPS·방향 메타데이터를 보존하지만, 방향 태그가 없던 파일에 "회전 없음" 태그를 새로 붙이기도 한다.

## 사진을 추가·교체·삭제할 때 순서

1. 촬영 일시가 있는 JPG를 원본 그대로 준비한다(축소·메타데이터 제거를 하지 않는다. 보호자 결정). 확인: `node -e 'require("exifr").parse("<파일>",{pick:["DateTimeOriginal"]}).then(e=>console.log(e?.DateTimeOriginal))'` 가 날짜를 출력해야 한다.
2. 촬영일 순서에 맞는 번호 자리에 넣고, 뒤 번호를 한 칸씩 민다. 빈 번호를 남기지 않는다.
3. `Photo.jsx`의 `PHOTO_COUNT`를 파일 수에 맞춘다.
4. `Home.css`의 `SIHUN_23`, `Intro.jsx`의 `SIHUN_12`, `index.html`의 `SIHUN_6`이 여전히 의도한 사진인지 연다.
5. `npm run dev`에서 사진첩을 끝까지 펼쳐 깨진 타일이 없는지, 캡션이 뜨는지 본다.
6. `npm run build` 뒤 `ls dist/images | wc -l`이 `public/images` 파일 수와 같은지 본다.
