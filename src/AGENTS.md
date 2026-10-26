# src/ — 초대장 앱 코드

## 범위

이 디렉터리가 소유하는 것: 화면 구성(`App.jsx`), 네 섹션 컴포넌트(`components/Home`, `Intro`, `Photo`, `Location`)와 각자의 CSS, 전역 스타일(`index.css`, `App.css`), 마운트(`main.jsx`).

이 디렉터리의 범위가 아닌 것:
- 사진 파일 자체(`public/images/`). 여기서는 경로로만 참조하고, 파일을 만들거나 바꾸지 않는다.
- 메타 태그, 외부 스크립트·글꼴 로드(`index.html`). 공유 미리보기나 지도 스크립트 문제는 여기 코드가 아니라 `index.html`의 일이다.
- 배포 경로 설정(`vite.config.js`)과 빌드 결과물(`dist/`).

## 항상 성립해야 하는 것

- `Photo.jsx`의 `PHOTO_COUNT`(현재 24)는 `public/images/SIHUN_N.jpg` 파일 수와 같고, N은 1부터 빈 번호 없이 이어진다. 확인: `ls public/images/SIHUN_*.jpg | wc -l`.
- `INITIAL_DISPLAY`(6)는 `PHOTO_COUNT`보다 작다. 같거나 크면 '더보기' 버튼이 "0장 더보기"가 된다.
- 모든 `public/` 자원 참조는 `/ohsihun-1st-HBD/...` 절대 경로다. JSX의 `src`, CSS의 `url()` 모두 같다. 상대 경로나 `import`로 바꾸면 배포본에서 깨진다.
- 섹션 `id`는 `intro`, `photo`, `location` 세 개이고 `Home`의 버튼 `href`(`#photo`, `#location`)와 짝이 맞는다.
- 확대 모달이 열리면 `document.body.style.overflow`가 `hidden`, 닫히면 `auto`다. 열어 둔 채 다른 경로로 닫히는 길(ESC, 배경 클릭, ✕, 사진 클릭)이 하나라도 `overflow`를 복원하지 않으면 페이지가 영영 안 움직인다.
- 촬영일 캡션은 EXIF 날짜가 있을 때만 그린다. 날짜 없이 "시훈이😍"만 나오는 분기를 만들지 않는다.
- 행사·아이·장소 정보는 `Intro.jsx`의 `babyInfo`, `Location.jsx`의 `locationInfo`, `Home.jsx`의 JSX 문자열에만 있다. 과거 기록이므로 값을 바꾸지 않는다.

## 컴포넌트별 방식

### `Home`
- framer-motion `variants`로 부모(`contentsVariants`) → 자식(`eachVariants`) 순차 등장. `delayChildren 0.3`, `staggerChildren 0.2`. 사진은 별도로 `delay 1`, `duration 1.4` 페이드인.
- `import { motion }` 위의 `eslint-disable-next-line no-unused-vars`는 JSX에서만 쓰이는 식별자를 lint가 못 보는 문제를 막는 것이다. 지우면 lint가 실패한다.
- 대표 사진은 CSS `background`(`Home.css`의 `.home__img`)로 넣는다. `<img>`가 아니다. 모양 애니메이션(`profile__animate`)이 `border-radius`를 바꾸기 때문이다.
- '👶 시훈이 소개' 버튼은 주석 처리된 상태가 최종이다. 되살리지 않는다.

### `Intro`
- 상태 없는 정적 섹션. 프로필 사진은 `SIHUN_12` 고정.

### `Photo`
- 격자는 `Array.from({ length: displayCount })`로 번호를 생성하므로 사진 목록 배열이 따로 없다. 사진을 "빼는" 유일한 방법은 파일 번호를 당기고 `PHOTO_COUNT`를 줄이는 것이다.
- `LazyImage`는 IntersectionObserver(`threshold 0.1`, `rootMargin 100px`)로 보일 때만 `<img>`를 붙이고, 그때 exifr로 같은 URL의 EXIF를 읽는다. 날짜 우선순위는 `DateTimeOriginal` → `DateTime` → `CreateDate`. 실패는 `console.log`로만 남기고 캡션 없이 넘어간다.
- 모달의 `selectedPhoto`는 1부터 시작하는 번호다(0이 아님). `{selectedPhoto && ...}` 조건이 이 전제 위에 있으므로 0 기반으로 바꾸면 1번 사진 모달이 안 열린다.
- ESC 핸들러는 모달이 닫혀 있어도 `closeModal`을 부른다. 무해하지만, 닫힘 처리에 부수 효과를 추가할 때는 열려 있을 때만 실행되게 조건을 걸어야 한다.
- '접기'는 `photoSectionRef`로 섹션 상단에 `scrollIntoView`한다. 접은 뒤 화면이 사진첩 중간에 남으면 안 된다.

### `Location`
- 지도는 `useEffect` 안에서 `window.naver.maps`를 직접 호출한다. React 상태와 연결되지 않으며, effect는 의존성 `[]`로 한 번만 돈다. cleanup이 없어 개발 모드 `StrictMode`에서는 두 번 생성된다(배포본은 한 번).
- `window.naver`가 없으면 `console.error` 후 조용히 빈 div로 남긴다. 사용자에게 보이는 오류 메시지는 일부러 없다.
- 정보창 내용은 네이버 API에 HTML 문자열로 넘기므로 여기만 인라인 `style`을 쓴다. 이 예외를 다른 곳으로 넓히지 않는다.
- 주소 복사는 `navigator.clipboard.writeText` + `alert`. 복사 대상은 `locationInfo.address`(도로명 주소)뿐이다.
- `locationInfo`의 지도 URL 옆에 남은 "실제 장소 링크로 변경" 주석은 더 이상 할 일이 아니다. 검색 링크가 최종이며, 주석은 지워도 되고 두어도 된다.

## 수정할 때 확인할 것

- `npm run lint` 0 오류, `npm run build` 성공.
- `npm run dev` → `http://localhost:5173/ohsihun-1st-HBD/`에서 바뀐 섹션을 연다. 사진첩·지도를 건드렸으면 브라우저 폭 480px 이하에서도 본다.
- `Photo`를 건드렸으면: 더보기 → 끝까지 스크롤 → 깨진 타일 없음 → 아무 사진 클릭 → ESC로 닫힘 → 페이지가 다시 스크롤됨 → 접기 → 사진첩 제목이 화면 위에 옴.
- `Location`을 건드렸으면: 지도가 뜨고 정보창이 열려 있으며, 마커 클릭으로 닫혔다 열린다. 주소 복사 후 붙여넣기 결과가 "세종 부강면 갈산길 73"이다.
- `Home`을 건드렸으면: 새로고침 직후 사진이 1초 뒤 나타나고 제목·일시·문구·버튼이 차례로 뜬다. 두 버튼이 각각 사진첩과 오시는 길로 이동한다.
