# 이미지 폴더

## 파일

- `SIHUN_1.jpg` ~ `SIHUN_24.jpg`: 사진첩 사진. 번호는 촬영일 순이고 빈 번호가 있으면 안 됩니다.
- `parking.jpg`: 오시는 길의 주차 안내 사진.

## 역할이 정해진 사진

- `SIHUN_23`: 첫 화면 큰 사진 (`src/components/Home.css`)
- `SIHUN_12`: 소개 프로필 사진 (`src/components/Intro.jsx`)
- `SIHUN_6`: 메신저 공유 미리보기 (`index.html`)

## 사진을 바꿀 때

- 사진 안의 촬영 일시(EXIF)가 있어야 날짜 캡션이 표시됩니다. 메타데이터를 지우는 도구로 가공하지 마세요.
- 사진 수가 바뀌면 `src/components/Photo.jsx`의 `PHOTO_COUNT`를 같이 고칩니다.
- 권장: JPG, 세로가 긴 사진. 용량·크기 제한은 없고 원본 그대로 올립니다(보호자 결정).
