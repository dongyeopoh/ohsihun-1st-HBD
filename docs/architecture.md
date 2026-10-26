# 시스템 구성

## 전체 모양

서버 코드가 없는 정적 단일 페이지 사이트다. 빌드 결과물(`dist/`)이 GitHub Pages에 그대로 올라가고, 방문자의 브라우저 안에서 모든 동작이 끝난다. 데이터베이스, API 서버, 로그인, 폼 전송은 없다.

```
방문자 브라우저
  │  GET https://dongyeopoh.github.io/ohsihun-1st-HBD/
  ▼
GitHub Pages (gh-pages 브랜치 루트 = dist/ 내용)
  ├── index.html ── <script> openapi.map.naver.com (네이버 지도 v3, 전역 window.naver)
  │               └─ <link>   fonts.googleapis.com (Do Hyeon, Jua 등 웹폰트)
  ├── assets/index-*.js, index-*.css   (React 앱 번들)
  └── images/SIHUN_1..24.jpg, parking.jpg   (public/ 에서 그대로 복사)
```

외부 의존 대상은 세 곳뿐이다. GitHub Pages(호스팅), 네이버 클라우드 플랫폼 지도 API(지도 렌더링, `index.html`의 script 태그로 로드), Google Fonts(글꼴). 세 곳 중 어느 하나가 응답하지 않아도 페이지 자체는 뜨되, 지도 영역이 비거나 글꼴이 기본 글꼴로 바뀐다.

## 화면 구성과 의존 방향

`index.html` → `src/main.jsx` → `src/App.jsx` → 네 개 섹션 컴포넌트가 위에서 아래로 한 번씩 배치된다. 섹션끼리는 서로를 참조하지 않는다. 공유하는 것은 `App.css`의 전역 글꼴 지정과, 여러 컴포넌트 CSS에 각각 정의되어 전역으로 합쳐지는 공통 클래스(`button`, `button-group`, `section__title`, `section__subtitle`)뿐이다.

| 컴포넌트 | 역할 | 의존하는 것 |
|---|---|---|
| `App` | 섹션 배치, 스크롤 300px 이후 '맨 위로' 버튼 표시 | 없음 |
| `Home` | 첫 화면: 대표 사진(`SIHUN_23`), 행사 일시, 사진첩·위치 앵커 버튼 | framer-motion(등장 애니메이션) |
| `Intro` | 아이 소개: 프로필 사진(`SIHUN_12`), 출생 정보 | 없음 |
| `Photo` | 사진첩: 24장 격자, 더보기/접기, 확대 모달, 촬영일 캡션 | exifr(EXIF 읽기), IntersectionObserver |
| `Location` | 오시는 길: 네이버 지도, 주소 복사, 외부 지도 링크, 주차 사진 | `window.naver.maps` 전역 |

행사·아이·장소 정보는 각 컴포넌트 파일 상단의 상수 객체(`babyInfo`, `locationInfo`)와 JSX 문자열에 직접 들어 있다. 별도의 데이터 파일이나 설정 파일은 없다.

## 대표 흐름: 방문자가 사진첩까지 내려갈 때

1. GitHub Pages가 `index.html`을 내려준다. 헤드에서 네이버 지도 스크립트와 Google Fonts가 동기 로드되고, 본문에서 React 번들이 실행된다.
2. `Home`이 마운트되면 framer-motion이 사진을 1초 뒤 페이드인하고, 제목·일시·버튼을 0.2초 간격으로 차례로 띄운다.
3. 방문자가 스크롤하면 `Photo`의 각 타일 안에 있는 `LazyImage`가 뷰포트 100px 앞에서 IntersectionObserver로 감지된다. 감지된 타일만 `<img>`를 실제로 붙인다.
4. 같은 타일에서 exifr가 같은 URL의 사진 파일 앞부분을 따로 받아 촬영 일시(`DateTimeOriginal` → `DateTime` → `CreateDate` 순)를 읽는다. 값이 있으면 "2025년 2월 12일" 형식과 "시훈이😍" 문구를 사진 위에 겹쳐 그린다. 값이 없으면 캡션 영역 자체를 그리지 않는다.
5. 처음에는 6장만 보이고 아래쪽이 흐려진다. '더보기'를 누르면 24장 전체가 펼쳐지고, '접기'를 누르면 6장으로 줄며 사진첩 상단으로 부드럽게 스크롤한다.
6. 타일을 누르면 확대 모달이 열리고 본문 스크롤이 잠긴다. 배경·✕·사진 클릭 또는 ESC로 닫힌다.

## 대표 흐름: 지도

`Location`이 마운트될 때 한 번, `window.naver.maps`가 있는지 확인한 뒤 `locationInfo`의 좌표로 지도(줌 18)·마커·정보창을 만들고 정보창을 바로 연다. 네이버 스크립트가 없으면 콘솔 오류만 남기고 지도 영역은 빈 상자로 남는다. 지도 API 호출은 모두 전역 객체를 통하며 React 상태와 연결되지 않는다.

## 배포 토폴로지

소스와 빌드 결과물이 같은 `main` 브랜치에 있다. `dist/`는 `.gitignore`에 들어 있지만 강제로 추적 중이다. `git subtree push --prefix dist origin gh-pages`가 `dist/`의 내용만 `gh-pages` 브랜치 루트로 밀어 올리고, GitHub Pages는 그 브랜치를 `/ohsihun-1st-HBD/` 경로에 서비스한다. 원격 저장소의 기본 브랜치는 `gh-pages`다.
