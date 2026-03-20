# Stack&Stock FE

`Stack&Stock`의 프론트엔드 저장소입니다.

## 프로젝트 개요

- 장르: 스토리 기반 투자 시뮬레이션
- 핵심 흐름: 로그인/회원가입 → 메인 메뉴 → 인트로 스토리 → 방 안에서 정보 수집 및 투자 행동 → 랜덤 이벤트 → 엔딩
- 상태 관리: `zustand`
- 애니메이션: `framer-motion`
- HTTP 통신: `axios`
- 프레임워크: `Create React App` 기반 React 앱

## 디렉터리 구조

```text
FE/
├── README.md
├── HowToUse.txt
└── stack-and-stock/
    ├── package.json
    ├── public/
    └── src/
        ├── api/          # 인증, 게임 진행, 데모용 API 계층
        ├── components/   # 모달, 메인 메뉴, 하단 패널, 주식 UI
        ├── scenes/       # 인증, 인트로, 플레이, 이벤트, 엔딩 씬
        ├── store/        # 인증/게임 전역 상태
        ├── data/         # 더미 데이터
        └── styles/       # 전역 및 화면별 스타일
```

## 주요 기능

### 1. 인증

- 이메일 기반 로그인/회원가입 UI 제공
- 세션 쿠키 기반 인증 사용
- 앱 시작 시 `/api/users/me`로 세션 확인 후 자동 진입 처리

### 2. 메인 메뉴

- 새 게임 시작
- 이어하기
- 3일 분량 데모 플레이
- 이벤트 테스트 / 엔딩 테스트 진입 버튼 제공

### 3. 게임 플레이

- 오전/오후/밤 흐름에 따라 방 안 오브젝트와 상호작용
- TV, 신문, 휴대폰, 공부, 주식 거래 등 행동 실행
- 행동력(AP), 현금, 보유 종목, 기사 정보, 번뜩임 수치 관리
- 일일 정산 모달과 아카이브/도움말 모달 제공

### 4. 이벤트/엔딩

- 선택형, 확률형, 단발형 이벤트 씬 분리
- 특정 선택에 따라 후속 이벤트 예약 API 호출
- 엔딩 번호를 백엔드에서 받아 엔딩 화면에 매핑

## 기술 스택

- React 19
- react-scripts 5
- Zustand
- Axios
- Framer Motion
- Lucide React
- Testing Library

## 실행 방법

루트가 아니라 `stack-and-stock/`에서 실행해야 합니다.

```bash
cd stack-and-stock
npm install
npm start
```

개발 서버 기본 주소:

```text
http://localhost:3000
```

## 백엔드 연결 전제

현재 프런트엔드 코드는 아래 백엔드를 기준으로 작성되어 있습니다.

- API Base URL: `http://localhost:8080`
- `axios`에서 `withCredentials: true` 설정 사용
- 인증 및 게임 진행 API가 정상 동작해야 일반 플레이가 가능합니다

관련 주요 엔드포인트 예시:

- `POST /api/auth/login`
- `POST /api/auth/signup`
- `GET /api/users/me`
- `POST /api/runs/new`
- `GET /api/runs/continue`
- `GET /api/runs/:runId/daily-start`
- `POST /api/actions`
- `POST /api/trades/execute`

## 데모 모드

백엔드 없이 전체 흐름을 일부 확인할 수 있도록 `demoApi.js`가 포함되어 있습니다.

- 메인 메뉴의 `데모 플레이 (3days)` 버튼으로 진입
- 데모 모드에서는 일부 API 호출이 로컬 더미 데이터로 대체됨
- 뉴스, 가격, 이벤트 결과가 고정된 시나리오로 제공됨

## 개발 포인트

- 앱의 씬 전환은 [`App.js`](/Users/hye/Desktop/Stack&Stock/FE/stack-and-stock/src/App.js)에서 관리합니다.
- 인증 상태는 [`useAuthStore.js`](/Users/hye/Desktop/Stack&Stock/FE/stack-and-stock/src/store/useAuthStore.js), 게임 상태는 [`useGameStore.js`](/Users/hye/Desktop/Stack&Stock/FE/stack-and-stock/src/store/useGameStore.js)에서 관리합니다.
- API 통신 래퍼는 [`gameApi.js`](/Users/hye/Desktop/Stack&Stock/FE/stack-and-stock/src/api/gameApi.js), [`authApi.js`](/Users/hye/Desktop/Stack&Stock/FE/stack-and-stock/src/api/authApi.js), [`axiosClient.js`](/Users/hye/Desktop/Stack&Stock/FE/stack-and-stock/src/api/axiosClient.js)에 있습니다.


## 참고

- 간단한 실행 메모는 [`HowToUse.txt`](/Users/hye/Desktop/Stack&Stock/FE/HowToUse.txt)에 적혀 있습니다.
- CRA 기본 문서는 [`stack-and-stock/README.md`](/Users/hye/Desktop/Stack&Stock/FE/stack-and-stock/README.md)에 남아 있습니다.
