# 외부에 약속한 것

이 사이트는 API를 제공하지 않는다. 바깥에서 기대고 있는 약속은 세 가지다: 공개 URL, 메신저·SNS 공유 미리보기, 그리고 사이트가 의존하는 두 외부 서비스와의 호출 형식.

## 공개 URL

- 주소: `https://dongyeopoh.github.io/ohsihun-1st-HBD/` (끝의 `/` 포함). 이 주소는 초대장으로 이미 배포되었으므로 바꿀 수 없다. 저장소 이름을 바꾸면 이 주소가 깨진다.
- 하위 경로는 없다. 단일 페이지이며 섹션 이동은 앵커로만 한다: `#intro`(소개), `#photo`(사진첩), `#location`(오시는 길). 외부에서 `.../#photo`처럼 링크해도 동작해야 한다.
- 없는 경로를 요청하면 GitHub Pages 기본 404 페이지가 나온다. 사이트 자체의 404 페이지는 없다.
- 정적 파일 주소: `/ohsihun-1st-HBD/images/SIHUN_N.jpg` (N은 1~24), `/ohsihun-1st-HBD/images/parking.jpg`. 사진 번호를 바꾸면 이 주소도 바뀌므로 외부에서 직접 링크한 곳이 있다면 깨진다.

## 공유 미리보기 (Open Graph / Twitter Card)

카카오톡, 메신저, SNS에 주소를 붙여 넣었을 때 보이는 카드다. `index.html` 헤드의 메타 태그가 전부이며, 다음 값이 약속이다.

| 항목 | 값 |
|---|---|
| 제목 | 시훈이의 첫 생일 초대장 |
| 설명 | Sihun's first birthday party invitation |
| 이미지 | `https://dongyeopoh.github.io/ohsihun-1st-HBD/images/SIHUN_6.jpg` (절대 URL이어야 한다) |
| 카드 형식 | `summary_large_image` (가로로 큰 이미지) |

- 이미지 주소는 배포된 사이트에서 실제로 열려야 한다. 로컬 경로나 상대 경로는 메신저가 읽지 못한다.
- 메신저들은 미리보기를 캐시한다. 메타 태그를 바꿔도 이미 공유된 링크의 카드는 즉시 바뀌지 않는다.

## 네이버 지도 API 호출 형식

- 로드: `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=2965gcgzan` 를 헤드에서 동기 스크립트로 불러온다(신규 Maps). `callback` 파라미터를 쓰는 비동기 로드는 쓰지 않는다. 성공하면 `window.naver.maps`가 생긴다.
- 인증 실패 함수: 스크립트보다 앞에서 전역 함수 `window.navermap_authFailure`를 정의해 둔다. 신규 Maps는 키 오류나 서비스 URL 미등록으로 인증에 실패하면 이 함수를 호출하고, 사이트는 콘솔에 오류 한 줄(원인 후보: 키 오류, 서비스 URL 미등록)을 남긴다. 화면에는 띄우지 않는다.
- 사용하는 기능: `Map`(center, zoom 18, zoomControl TOP_RIGHT, draggable, scrollWheel, disableDoubleClickZoom), `Marker`, `InfoWindow`, `Event.addListener(marker, 'click')`, 그리고 컴포넌트가 내려갈 때의 `Map.destroy()`.
- 실패: 스크립트가 로드되지 않으면 `window.naver`가 없고, 사이트는 콘솔 오류 한 줄을 남기고 지도 영역을 비워 둔다. 인증 실패는 위 함수가 콘솔에 남기며, 지도 영역은 역시 빈 상자로 남는다.

## Google Fonts 호출 형식

- `https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Black+Han+Sans&family=Do+Hyeon&family=Dongle&family=Jua&display=swap` 를 스타일시트로 불러온다.
- 실제로 쓰는 글꼴은 `Do Hyeon`(본문)과 `Jua`(제목), 그리고 `Jua`의 대체로 지정된 `Dongle`이다. 나머지 두 가지는 요청하지만 쓰이지 않는다.
- 실패: 글꼴 서버가 응답하지 않으면 `display=swap` 덕분에 시스템 글꼴로 바로 보이고, 나중에 교체된다.
