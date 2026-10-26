# 시훈이 첫 돌잔치 초대장

## 프로젝트 개요

2026년 1월 31일 세종 다연재에서 열린 오시훈의 첫 돌잔치 초대장 웹사이트다. React 단일 페이지(첫 화면·소개·사진첩 24장·오시는 길)로, `https://dongyeopoh.github.io/ohsihun-1st-HBD/`에 공개되어 있다. 행사는 끝났고 지금은 가족의 기념 보존본이다. 새 기능보다 지금 모습을 깨뜨리지 않는 것이 우선이며, 보호자가 요청하지 않은 변경은 하지 않는다. 코드는 컴포넌트 네 개, 약 500줄이고 서버·DB·로그인이 없다.

## 프로젝트 구조

```
ohsihun-1st-HBD/
├── CLAUDE.md                          ← 이 문서 (AGENTS.md와 같은 내용)
├── AGENTS.md                          ← 이 문서 (CLAUDE.md와 같은 내용)
├── docs/
│   ├── architecture.md                ← 화면 구성, 외부 서비스, 방문자 흐름, 배포 토폴로지
│   ├── business-rules.md              ← 고정된 행사·아이 정보, 사진첩·지도·첫 화면의 동작 규칙
│   ├── security.md                    ← 개인정보 공개 범위, 사진 메타데이터 정책, 지도 키
│   ├── standards.md                   ← 완료 기준, 경로·코드·git 규칙 (전체 규칙의 원본)
│   ├── engineering-notes.md           ← 함정과 대응, 사진 교체 절차
│   ├── operations.md                  ← 설치·개발·검증·배포·되돌리기 명령
│   ├── contracts.md                   ← 공개 URL, 공유 미리보기, 외부 API 호출 형식
│   └── tracking/
│       ├── status.md                  ← 완료된 것과 남은 일
│       ├── decisions/
│       │   ├── index.md               ← 결정 기록 목록
│       │   └── 0001~0005-*.md         ← 보존 방침, git 구조, 공개 범위, EXIF 캡션, 사진 메타데이터
│       └── findings.md                ← 알지만 지금 안 고치는 문제
├── src/
│   ├── AGENTS.md                      ← 앱 코드의 범위, 불변 조건, 컴포넌트별 규칙
│   ├── App.jsx / App.css              ← 섹션 배치, 맨 위로 버튼, 전역 글꼴·버튼
│   ├── main.jsx / index.css           ← 마운트, 리셋
│   └── components/                    ← Home · Intro · Photo · Location (각각 .jsx + .css)
├── public/images/                     ← SIHUN_1~24.jpg, parking.jpg (원본 보존)
├── index.html                         ← 메타 태그, 네이버 지도 스크립트, 글꼴
├── vite.config.js                     ← base '/ohsihun-1st-HBD/'
└── dist/                              ← 빌드 결과물 (추적 중, 배포 원본)
```

## 반드시 지킬 것

1. **개인정보 공개 범위를 넓히지 않는다.** 지금 공개된 것(아이 이름·출생 정보·사진·행사장 주소)이 상한이다. 가족 실명, 연락처, 계좌번호, 집 주소, 사진 안의 GPS 좌표는 어디에도 넣지 않는다.
2. **사진 원본을 가공하지 않는다.** `public/images/`의 사진을 압축·회전·메타데이터 삭제하지 않는다. 촬영일 캡션이 사진 안의 촬영 일시에 의존한다. 보호자가 승인한 작업(GPS 제거, 용량 축소)에서도 촬영 일시는 남긴다.
3. **배포 경로 `/ohsihun-1st-HBD/`는 저장소 이름과 묶여 있다.** `vite.config.js`의 `base`와 소스에 적힌 절대 이미지 경로가 같은 값이어야 한다.
4. **완료 기준은 lint 통과, build 성공, 바뀐 화면 직접 확인 세 가지다.** 자동 테스트가 없으므로 화면 확인을 생략하면 완료가 아니다.
5. **소스와 `dist/`를 같은 커밋에 넣고, 배포는 `main`에서 subtree push로만 한다.** `dist/`는 `.gitignore`에 있어 `git add -f dist`가 필요하다. `gh-pages`에 직접 커밋하지 않는다.

## 작업 전 읽을 것

- 기본: `docs/standards.md`, `docs/engineering-notes.md`, `src/AGENTS.md`
- 사진을 추가·교체·삭제·재배치할 때: `docs/engineering-notes.md`의 "사진을 추가·교체·삭제할 때 순서"와 `docs/business-rules.md`의 "사진첩 규칙", "대표 사진 세 장의 역할". 번호 연속성과 대표 사진 세 장이 깨지기 쉽다.
- 사진 파일 자체를 다시 쓰는 작업(GPS 제거, 압축)을 할 때: `docs/security.md`의 "사진 파일 안의 메타데이터"와 `docs/tracking/decisions/0005-photo-metadata-policy.md`. 원본을 저장소 밖에 백업한 뒤 시작한다.
- 지도·장소를 건드릴 때: `docs/engineering-notes.md`의 "지도가 빈 회색 상자로 나온다"와 `docs/security.md`의 "네이버 지도 클라이언트 키".
- 배포할 때: `docs/operations.md`의 "배포" 전체. 순서가 틀리면 옛 결과물이 나가거나 번들 파일이 빠진다.
- `index.html`을 건드릴 때: `docs/contracts.md`의 "공유 미리보기". 메타 태그 값은 외부에 약속된 것이다.

## 문제가 생겼을 때

즉시 사용자에게 알리고 멈춘다:
- 공개 사이트가 빈 화면이나 깨진 화면이 되었을 때(배포 사고)
- 승인 범위 밖의 개인정보가 노출될 수 있는 변경이 필요해 보일 때
- `public/images/`의 사진 원본이 손상·삭제·덮어쓰기된 것을 발견했을 때
- 행사·아이·장소 정보를 바꿔야 하는 상황일 때

그 밖의 문제는 `docs/tracking/findings.md`에 "어떤 조건에서 무엇이 보이는가, 왜 지금 안 고치는가"를 적는다.
