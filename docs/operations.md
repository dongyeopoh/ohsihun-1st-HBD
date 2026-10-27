# 실행과 배포

## 전제 조건

- Node.js 20.19 이상 또는 22.12 이상(빌드 도구 Vite 7의 요구 조건). 확인된 동작 버전은 Node 24.15.0, npm 11.12.1이다. 다른 패키지 관리자는 쓰지 않는다.
- GitHub 계정이 `dongyeopoh/ohsihun-1st-HBD` 저장소에 쓰기 권한을 갖고 있어야 배포할 수 있다. 로컬 실행에는 권한이 필요 없다.
- 지도를 로컬에서 보려면 접속 주소가 네이버 클라우드 플랫폼 콘솔에 등록된 개발 주소(`http://localhost:5173/ohsihun-1st-HBD/`)와 일치해야 한다. 다른 포트에서는 인증이 실패한다.

## 처음 설정

```bash
git clone https://github.com/dongyeopoh/ohsihun-1st-HBD.git   # 기본 브랜치 main이 바로 체크아웃된다
cd ohsihun-1st-HBD
npm ci                   # package-lock.json 기준으로 설치
```

`npm install` 대신 `npm ci`를 쓰는 이유: 잠금 파일과 어긋난 버전이 설치되면 빌드 결과 해시가 달라져 불필요한 `dist/` 변경이 생긴다.

## 개발

```bash
npm run dev
# 브라우저에서 http://localhost:5173/ohsihun-1st-HBD/ 를 연다 (루트 / 는 안 된다)
```

## 검증

```bash
npm run lint      # 오류 0이어야 한다
npm run build     # dist/ 생성. 'SIHUN_23.jpg didn't resolve at build time' 경고는 정상
npm run preview -- --port 5173   # 개발 서버를 먼저 끈 뒤 http://localhost:5173/ohsihun-1st-HBD/ 에서 빌드 결과 확인. 기본 포트 4173은 네이버 콘솔에 등록되지 않아 지도 인증이 실패한다
```

세 가지 외에 자동 테스트는 없다. 변경한 화면은 반드시 직접 열어 본다.

## 배포

순서를 바꾸면 안 된다. 빌드 전에 커밋하면 옛 결과물이 배포되고, `-f` 없이 `git add`하면 새 번들 파일이 빠진다.

```bash
npm run lint && npm run build
git add -f dist
git add -A
git commit -m "변경 내용을 한국어로"
git push origin main
git subtree push --prefix dist origin gh-pages
```

마지막 명령이 `dist/`의 내용만 `gh-pages` 브랜치 루트로 올리고, GitHub Pages가 1~2분 안에 `https://dongyeopoh.github.io/ohsihun-1st-HBD/`에 반영한다. 반영 확인은 브라우저에서 강력 새로고침(캐시 무시)으로 한다.

`git subtree push`가 거부되면(원격 `gh-pages`가 로컬 이력과 어긋난 경우):

```bash
git fetch origin gh-pages
git subtree pull --prefix dist origin gh-pages -m "gh-pages 동기화"
git subtree push --prefix dist origin gh-pages
```

## 되돌리기

공개 사이트를 이전 상태로 돌리려면 `main`에서 `dist/`를 이전 커밋 상태로 복원한 뒤 다시 배포한다.

```bash
git checkout <이전 커밋> -- dist
git commit -m "배포 되돌림"
git subtree push --prefix dist origin gh-pages
```

## 설정 값

환경 변수는 없다. 코드에 박힌 설정 값은 두 개뿐이다.

| 값 | 위치 | 의미 |
|---|---|---|
| `base: '/ohsihun-1st-HBD/'` | `vite.config.js` | 배포 경로. 저장소 이름과 같아야 한다. 바꾸면 소스 안의 절대 이미지 경로도 전부 같이 바꿔야 한다. |
| `ncpKeyId=2965gcgzan` | `index.html` | 네이버 지도(신규 Maps) 클라이언트 키. 바꾸면 네이버 콘솔에서 새 키에 배포·개발 주소를 등록해야 한다. 이 키는 다른 사이트와 공유된다. |

## 데이터 초기화

없다. 모든 내용이 소스와 `public/images/`에 들어 있다.
