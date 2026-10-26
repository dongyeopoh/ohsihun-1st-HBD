# 시훈이 첫 돌잔치 초대장 🎉

2026년 1월 31일 세종 다연재에서 열린 시훈이 첫 돌잔치 초대장입니다. React + Vite로 만든 한 페이지짜리 사이트이며, 행사가 끝난 지금은 기념으로 보존하고 있습니다.

공개 주소: https://dongyeopoh.github.io/ohsihun-1st-HBD/

## 구성

- 📱 모바일, 태블릿, 데스크탑 반응형
- ✨ framer-motion 첫 화면 등장 애니메이션
- 📸 사진첩 24장: 화면에 들어올 때 불러오고, 사진 안의 촬영 일시를 읽어 날짜 캡션을 자동으로 표시
- 🗺️ 네이버 지도, 네이버/카카오 지도 링크, 주차 안내
- 📋 주소 복사

## 사진

- 파일: `public/images/SIHUN_1.jpg` ~ `SIHUN_24.jpg` (촬영일 순, 빈 번호 없이), 주차 안내 `parking.jpg`
- 첫 화면 사진은 `SIHUN_23` (`src/components/Home.css`), 소개 사진은 `SIHUN_12` (`src/components/Intro.jsx`), 공유 미리보기 이미지는 `SIHUN_6` (`index.html`)
- 사진 수를 바꾸면 `src/components/Photo.jsx`의 `PHOTO_COUNT`를 같이 맞춥니다. 처음 보이는 장수는 `INITIAL_DISPLAY`(6)입니다.
- 날짜 캡션은 사진 파일의 EXIF 촬영 일시로 만들어지므로, 메타데이터가 지워진 사진에는 캡션이 생기지 않습니다.

## 정보 위치

- 첫 화면 문구·일시: `src/components/Home.jsx`
- 아이 소개: `src/components/Intro.jsx`의 `babyInfo`
- 장소·좌표·지도 링크: `src/components/Location.jsx`의 `locationInfo`
- 공유 미리보기(제목·이미지): `index.html`

## 개발

```bash
npm ci
npm run dev      # http://localhost:5173/ohsihun-1st-HBD/
npm run lint
npm run build
```

## 배포 (GitHub Pages)

```bash
npm run build
git add -f dist
git add -A
git commit -m "변경 내용"
git push origin main
git subtree push --prefix dist origin gh-pages
```

## 기술 스택

React 19, Vite 7, Framer Motion, exifr, CSS

## 참고

[emoket/simple-invitation](https://github.com/emoket/simple-invitation)을 바탕으로 만들었습니다.
