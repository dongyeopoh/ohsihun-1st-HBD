# 지켜야 할 규칙

## 완료 기준 (모든 변경에 적용)

1. `npm run lint`가 오류 0으로 끝난다.
2. `npm run build`가 성공한다. `SIHUN_23.jpg didn't resolve at build time` 경고는 정상이며 실패가 아니다.
3. 바뀐 화면을 `npm run dev`로 띄워 직접 눈으로 확인한다. 사진첩이나 지도를 건드렸으면 폭 480px 이하(휴대폰)에서도 확인한다. 자동 테스트가 없으므로 이 확인을 생략하면 완료가 아니다.

## 변경 범위

- 이 사이트는 끝난 행사의 기념 보존본이다. 보호자가 요청하지 않은 기능 추가, 디자인 변경, 문구 수정은 하지 않는다. 요청받은 변경만 한다.
- 아이·행사·장소 정보(이름, 출생 정보, 일시, 주소, 좌표)는 바꾸지 않는다. 이 값들은 각 컴포넌트 상단 상수(`babyInfo`, `locationInfo`)와 `Home.jsx`의 JSX 문자열에만 있고, 다른 곳에 복사본을 만들지 않는다.
- 공개할 수 있는 개인정보는 아이 이름·성별·출생 연월일시·몸무게·혈액형·사진·행사 일시·행사장 주소까지다. 그 밖의 것(가족 실명, 연락처, 계좌번호, 집 주소, 사진 안의 GPS 좌표)은 화면, 메타 태그, 사진 메타데이터 어디에도 넣지 않는다.
- 외부 스크립트·스타일시트는 현재의 네이버 지도 API와 Google Fonts 둘뿐이다. 새 외부 리소스를 `index.html`에 추가하지 않는다.

## 사진 파일

- `public/images/SIHUN_N.jpg` 파일을 압축, 리사이즈, 회전, 메타데이터 삭제 등으로 가공하지 않는다. 예외는 보호자가 승인한 작업(GPS 좌표 제거, 용량 축소)뿐이며, 그 작업에서도 `DateTimeOriginal`은 남겨야 한다.
- 번호는 1부터 빈 번호 없이 이어져야 하고, `Photo.jsx`의 `PHOTO_COUNT`는 실제 파일 수와 같아야 한다. 확인: `ls public/images/SIHUN_*.jpg | wc -l` 결과가 `PHOTO_COUNT`와 같다.
- 사진을 추가·교체·삭제하면 `Home.css`(`SIHUN_23`), `Intro.jsx`(`SIHUN_12`), `index.html`(`SIHUN_6`)이 가리키는 대표 사진이 의도한 사진인지 다시 확인한다.

## 경로

- 배포 경로는 `/ohsihun-1st-HBD/`이며 저장소 이름과 묶여 있다. `vite.config.js`의 `base`와 소스 안에 적힌 모든 `/ohsihun-1st-HBD/images/...` 절대 경로가 같은 값이어야 한다. 한쪽만 바꾸면 이미지가 전부 깨진다.
- `public/` 자원을 JSX나 CSS에서 참조할 때는 `/ohsihun-1st-HBD/...` 절대 경로로 쓴다. `import`로 가져오거나 상대 경로(`./images/...`)로 쓰지 않는다. `index.html` 안에서만 `/favicon.ico`처럼 루트 경로로 쓴다(빌드 도구가 접두어를 붙여 준다).
- 섹션 `id`(`intro`, `photo`, `location`)는 첫 화면 버튼의 앵커 대상이다. 이름을 바꾸거나 없애지 않는다.

## 코드 구조

- 섹션 하나는 `src/components/<이름>.jsx`와 `src/components/<이름>.css` 한 쌍이다. 스타일은 그 CSS 파일에만 두고 인라인 `style`이나 CSS-in-JS를 쓰지 않는다. 예외는 네이버 지도 정보창 내용처럼 외부 API에 문자열로 넘겨야 하는 HTML뿐이다. 컴포넌트 CSS는 전역으로 합쳐지므로, `.button`이나 `.section__title`처럼 여러 파일에 정의된 클래스를 고칠 때는 정의된 모든 파일을 같이 고친다.
- 클래스 이름은 `블록__요소` 형식(`photo__grid-item`, `home__title`)이고, 상태는 별도 클래스(`show`, `collapsed`, `is-visible`)로 붙인다.
- 글꼴: 본문 `Do Hyeon`, 제목 `Jua`. 모두 Google Fonts에서 로드하며 로컬 폰트 파일을 추가하지 않는다.
- 반응형 분기점은 1024px, 768px, 480px 세 개다. 화면 관련 변경은 세 분기점 모두에서 확인한다.
- 파일은 JavaScript(JSX)다. TypeScript 파일을 섞지 않는다.

## 의존성

- 패키지 관리자는 npm이고 `package-lock.json`을 커밋한다. `package.json`을 바꾸면 같은 커밋에 `package-lock.json`도 들어가야 한다.
- 런타임 의존성(`dependencies`)을 새로 추가하지 않는다. 현재 네 개(react, react-dom, framer-motion, exifr)로 끝이다.

## git

- 작업 브랜치는 `main`이다. 소스와 `dist/`를 모두 `main`에 커밋한다. `gh-pages` 브랜치에는 직접 커밋하지 않으며, 오직 `git subtree push --prefix dist origin gh-pages`로만 갱신한다.
- `dist/`는 `.gitignore`에 있지만 추적 중이다. 빌드 뒤 반드시 `git add -f dist`로 올린다. 소스만 커밋하고 `dist/`를 빠뜨리면 공개 사이트는 바뀌지 않는다.
- 소스 변경과 그 빌드 결과물은 같은 커밋에 넣는다. 둘이 어긋난 커밋을 만들지 않는다.
- 커밋 메시지는 한국어로 쓴다.
- `node_modules/`, `.DS_Store`, 그리고 `.gitignore`에 적힌 로컬 작업 폴더는 커밋하지 않는다.
