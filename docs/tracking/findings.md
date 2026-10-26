# 미해결 문제

## Google Fonts 요청에 쓰지 않는 글꼴 두 가지가 포함되어 있다

- 관찰: `index.html`이 `Bagel Fat One`, `Black Han Sans`, `Do Hyeon`, `Dongle`, `Jua` 다섯 글꼴을 요청하지만 CSS에서 쓰는 것은 `Do Hyeon`, `Jua`, 대체용 `Dongle` 셋이다. 첫 방문 시 쓰지 않는 글꼴 파일 두 개를 더 받는다.
- 영향: 첫 로딩이 약간 느려진다. 기능상 문제는 없다.
- 지금 안 고치는 이유: 보존 단계라 요청받지 않은 변경은 하지 않는다. 다른 이유로 `index.html`을 건드리는 작업이 생기면 그때 같이 정리한다.

## 웹 앱 매니페스트의 이름과 아이콘 경로가 틀려 있다

- 관찰: `public/manifest.json`의 `name`이 템플릿 기본값 "App"이다. 또 `manifest.json`과 `browserconfig.xml`의 아이콘 경로가 `/android-icon-36x36.png`처럼 루트 절대 경로라, 빌드 도구가 접두어를 붙이지 않아 배포 주소에서는 `https://dongyeopoh.github.io/android-icon-*.png`로 요청되어 404가 난다(`dist/manifest.json`에서 확인). `index.html`의 아이콘 링크는 접두어가 붙어 정상이다.
- 영향: 휴대폰 홈 화면에 추가하면 이름이 "App"으로 뜨고, 매니페스트 기준 아이콘은 뜨지 않는다. 브라우저 탭 제목과 파비콘은 정상이다.
- 지금 안 고치는 이유: 위와 같다. 고친다면 이름은 "시훈이 첫 생일"처럼 탭 제목과 맞추고, 아이콘 경로에 `/ohsihun-1st-HBD/`를 붙인다.
