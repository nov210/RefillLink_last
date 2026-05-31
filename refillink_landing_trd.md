# 리필링크 홍보용 랜딩 페이지 TRD

## 1. 문서 개요

### 문서명
리필링크 홍보용 랜딩 페이지 TRD

### 문서 목적
본 문서는 리필링크 홍보용 랜딩 페이지의 기술 구현 범위, 시스템 구조, 데이터 저장 방식, 프론트엔드 기능, Firebase 연동, 이벤트 트래킹, 배포 방식 등을 정의한다.

### 대상 산출물
정적 랜딩 페이지

### 구현 방식
- HTML
- CSS
- JavaScript
- Firebase Hosting
- Firebase Firestore
- Google Analytics 또는 Firebase Analytics

---

## 2. 기술 스택

### Frontend

| 항목 | 기술 |
|---|---|
| Markup | HTML5 |
| Style | CSS3 |
| Logic | Vanilla JavaScript |
| 반응형 | CSS Media Query |
| 애니메이션 | CSS Transition / Intersection Observer 선택 적용 |

### Backend / Data

| 항목 | 기술 |
|---|---|
| 데이터베이스 | Firebase Firestore |
| 서버리스 처리 | Firebase SDK |
| 호스팅 | Firebase Hosting |
| 이벤트 분석 | Google Analytics 또는 Firebase Analytics |

### 제외 기술
초기 MVP에서는 아래 기술을 사용하지 않는다.

- React
- Next.js
- Vue
- 별도 Node.js API 서버
- 결제 API
- QR 생성 API
- 지도 API
- 관리자 대시보드

---

## 3. 시스템 아키텍처

### 기본 구조

```text
사용자 브라우저
   ↓
Firebase Hosting
   ↓
정적 파일 제공
HTML / CSS / JS
   ↓
Firebase SDK
   ↓
Firestore 저장
   ↓
Analytics 이벤트 기록
```

### 구성 요소

1. 정적 랜딩 페이지
   - `index.html`
   - `style.css`
   - `main.js`

2. Firebase
   - Hosting: 정적 페이지 배포
   - Firestore: 폼 제출 데이터 저장
   - Analytics: CTA, 폼 제출, 계산기 사용 이벤트 기록

---

## 4. 디렉토리 구조

```text
refillink-landing/
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── firebase.js
│   │   └── analytics.js
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── illustrations/
│   └── favicon.ico
│
├── firebase.json
├── .firebaserc
└── README.md
```

### 파일 역할

| 파일 | 역할 |
|---|---|
| `index.html` | 전체 랜딩 페이지 마크업 |
| `style.css` | 레이아웃, 반응형, 색상, UI 스타일 |
| `main.js` | 스크롤, 계산기, FAQ, 폼 제어 |
| `firebase.js` | Firebase 초기화 및 Firestore 저장 |
| `analytics.js` | 이벤트 트래킹 처리 |
| `firebase.json` | Firebase Hosting 설정 |

---

## 5. 페이지 섹션 구조

### 섹션 ID 정의

| 섹션 | HTML ID |
|---|---|
| 히어로 | `#hero` |
| 문제 공감 | `#problem` |
| 차별점 | `#difference` |
| 예상 손실 계산기 | `#loss-calculator` |
| 이용 방식 | `#how-it-works` |
| 점주 혜택 | `#owner-benefits` |
| 예측 기능 예정 | `#prediction` |
| 베타 혜택 | `#beta-benefits` |
| 소비자 출시 알림 | `#consumer-waitlist` |
| FAQ | `#faq` |
| 점주 상담 신청 | `#owner-apply` |

### 내비게이션 이동 대상

| 메뉴 | 이동 대상 |
|---|---|
| 문제 | `#problem` |
| 차별점 | `#difference` |
| 이용 방식 | `#how-it-works` |
| 베타 혜택 | `#beta-benefits` |
| FAQ | `#faq` |
| 입점 상담 신청하기 | `#owner-apply` |

---

## 6. 프론트엔드 기능 요구사항

### 6.1 상단 내비게이션

#### 기능
- 클릭 시 해당 섹션으로 부드럽게 스크롤 이동
- 모바일에서는 햄버거 메뉴 또는 간소화된 메뉴 제공
- 모바일 하단 고정 CTA 제공 가능

#### 구현 방식
- `scrollIntoView({ behavior: 'smooth' })`
- 또는 앵커 링크 + CSS `scroll-behavior: smooth`

#### 예외 처리
- 대상 섹션 ID가 없을 경우 콘솔 경고만 출력
- 페이지 오류는 발생시키지 않음

---

### 6.2 CTA 버튼

#### CTA 종류

| CTA | 목적 | 이동 위치 |
|---|---|---|
| 입점 상담 신청하기 | 점주 신청 유도 | `#owner-apply` |
| 출시 알림 받기 | 소비자 알림 신청 유도 | `#consumer-waitlist` |

#### 이벤트 트래킹
CTA 클릭 시 이벤트를 기록한다.

```javascript
trackEvent('cta_click_owner');
trackEvent('cta_click_consumer');
```

---

### 6.3 예상 손실 계산기

#### 입력 필드

| 필드 | 타입 | 필수 여부 |
|---|---|---|
| 하루 평균 폐기 금액 | number | 필수 |
| 월 영업일 수 | number | 필수 |

#### 계산식

```text
월 예상 손실 = 하루 평균 폐기 금액 × 월 영업일 수
연간 예상 손실 = 월 예상 손실 × 12
```

#### 출력값
- 월 예상 폐기 손실
- 연간 예상 폐기 손실

#### 예시

```text
하루 폐기 금액: 50,000원
월 영업일 수: 25일

월 예상 손실: 1,250,000원
연간 예상 손실: 15,000,000원
```

#### 유효성 검증
- 음수 입력 불가
- 빈 값 입력 시 결과 미노출
- 숫자가 아닌 값 입력 불가
- 월 영업일 수는 1~31 사이 권장

#### 이벤트 트래킹
계산 결과가 최초 표시될 때 이벤트 기록

```javascript
trackEvent('loss_calculator_used');
```

---

### 6.4 점주 입점 상담 신청 폼

#### 폼 ID

```html
<form id="ownerApplyForm">
```

#### 필드 정의

| 필드명 | key | 타입 | 필수 여부 |
|---|---|---|---|
| 가게명 | `storeName` | text | 필수 |
| 업종 | `businessType` | text/select | 필수 |
| 위치/상권 | `location` | text | 필수 |
| 담당자 이름 | `managerName` | text | 필수 |
| 연락처 | `phone` | tel | 필수 |

#### 제출 버튼
입점 상담 신청하기

#### 제출 완료 메시지
신청이 완료되었습니다.  
리필링크 팀이 확인 후 빠르게 연락드릴게요.

#### 저장 위치
Firestore 컬렉션:

```text
ownerApplications
```

#### 저장 데이터 구조

```json
{
  "storeName": "김밥천국 홍대점",
  "businessType": "분식",
  "location": "서울 마포구 홍대입구",
  "managerName": "김성준",
  "phone": "010-0000-0000",
  "source": "landing",
  "createdAt": "serverTimestamp",
  "status": "new"
}
```

#### 유효성 검증
- 필수값 누락 시 제출 불가
- 연락처는 최소 9자리 이상 입력
- 개인정보 수집 동의 체크 필요

#### 에러 메시지 예시
- 가게명을 입력해주세요.
- 업종을 입력해주세요.
- 위치/상권을 입력해주세요.
- 담당자 이름을 입력해주세요.
- 연락처를 입력해주세요.
- 개인정보 수집에 동의해주세요.

#### 이벤트 트래킹
폼 제출 성공 시:

```javascript
trackEvent('owner_lead_submit');
```

---

### 6.5 소비자 출시 알림 신청 폼

#### 폼 ID

```html
<form id="consumerWaitlistForm">
```

#### 필드 정의

| 필드명 | key | 타입 | 필수 여부 |
|---|---|---|---|
| 이름 또는 닉네임 | `name` | text | 필수 |
| 휴대폰 번호 또는 이메일 | `contact` | text | 필수 |
| 자주 이용하는 지역 | `preferredArea` | text | 필수 |
| 관심 카테고리 | `categories` | checkbox | 선택 |

#### 관심 카테고리 옵션
- 식사
- 카페
- 베이커리
- 분식
- 도시락

#### 제출 버튼
출시 알림 받기

#### 제출 완료 메시지
신청이 완료되었습니다.  
리필링크 출시 소식을 가장 먼저 알려드릴게요.

#### 저장 위치
Firestore 컬렉션:

```text
consumerWaitlist
```

#### 저장 데이터 구조

```json
{
  "name": "지현",
  "contact": "test@example.com",
  "preferredArea": "강남역",
  "categories": ["식사", "카페", "베이커리"],
  "source": "landing",
  "createdAt": "serverTimestamp",
  "status": "new"
}
```

#### 유효성 검증
- 이름 또는 닉네임 필수
- 연락처 또는 이메일 필수
- 자주 이용하는 지역 필수
- 개인정보 수집 동의 체크 필요

#### 이벤트 트래킹
폼 제출 성공 시:

```javascript
trackEvent('consumer_waitlist_submit');
```

---

### 6.6 FAQ 아코디언

#### 기능
- 질문 클릭 시 답변 영역 열림
- 다시 클릭 시 닫힘
- 한 번에 여러 개 열림 허용
- 모바일에서도 터치 영역 충분히 확보

#### 이벤트 트래킹
FAQ 열림 시:

```javascript
trackEvent('faq_open', {
  question: '입점하려면 비용이 드나요?'
});
```

---

## 7. Firebase 설계

### 7.1 Firebase 프로젝트

#### 권장 프로젝트명
```text
refillink-landing
```

#### 사용 서비스
- Firebase Hosting
- Cloud Firestore
- Firebase Analytics

---

### 7.2 Firestore 컬렉션 구조

```text
Firestore
├── ownerApplications
│   └── {documentId}
│
└── consumerWaitlist
    └── {documentId}
```

---

### 7.3 ownerApplications 컬렉션

#### 필드 정의

| 필드 | 타입 | 설명 |
|---|---|---|
| `storeName` | string | 가게명 |
| `businessType` | string | 업종 |
| `location` | string | 위치/상권 |
| `managerName` | string | 담당자 이름 |
| `phone` | string | 연락처 |
| `source` | string | 유입 출처 |
| `createdAt` | timestamp | 제출 일시 |
| `status` | string | 처리 상태 |

#### status 값

| 값 | 의미 |
|---|---|
| `new` | 신규 신청 |
| `contacted` | 연락 완료 |
| `qualified` | 입점 가능 |
| `rejected` | 입점 부적합 |

초기 MVP에서는 `new`만 저장하고, 상태 관리는 추후 관리자 기능에서 확장한다.

---

### 7.4 consumerWaitlist 컬렉션

#### 필드 정의

| 필드 | 타입 | 설명 |
|---|---|---|
| `name` | string | 이름 또는 닉네임 |
| `contact` | string | 휴대폰 번호 또는 이메일 |
| `preferredArea` | string | 자주 이용하는 지역 |
| `categories` | array | 관심 카테고리 |
| `source` | string | 유입 출처 |
| `createdAt` | timestamp | 제출 일시 |
| `status` | string | 처리 상태 |

#### status 값

| 값 | 의미 |
|---|---|
| `new` | 신규 신청 |
| `notified` | 출시 알림 발송 완료 |

초기 MVP에서는 `new`만 저장한다.

---

### 7.5 Firestore 보안 규칙

#### MVP 기본 방향
초기 랜딩 페이지에서는 사용자 인증 없이 폼 제출이 가능해야 한다.  
단, 읽기 권한은 차단한다.

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /ownerApplications/{docId} {
      allow create: if request.resource.data.keys().hasOnly([
        'storeName',
        'businessType',
        'location',
        'managerName',
        'phone',
        'source',
        'createdAt',
        'status'
      ]);
      allow read, update, delete: if false;
    }

    match /consumerWaitlist/{docId} {
      allow create: if request.resource.data.keys().hasOnly([
        'name',
        'contact',
        'preferredArea',
        'categories',
        'source',
        'createdAt',
        'status'
      ]);
      allow read, update, delete: if false;
    }
  }
}
```

#### 추가 보안 고려사항
- 스팸 제출 방지를 위해 추후 reCAPTCHA 적용 가능
- 동일 연락처 중복 제출 방지 로직 추가 가능
- 관리자 페이지 도입 시 인증 기반 읽기 권한 추가

---

## 8. JavaScript 모듈 설계

### 8.1 main.js

#### 담당 기능
- 내비게이션 스크롤
- 모바일 메뉴
- 예상 손실 계산기
- FAQ 아코디언
- 폼 이벤트 연결

#### 주요 함수
```javascript
initNavigation();
initLossCalculator();
initFAQ();
initForms();
```

---

### 8.2 firebase.js

#### 담당 기능
- Firebase 초기화
- Firestore 인스턴스 생성
- 점주 신청 데이터 저장
- 소비자 알림 신청 데이터 저장

#### 주요 함수
```javascript
saveOwnerApplication(data);
saveConsumerWaitlist(data);
```

---

### 8.3 analytics.js

#### 담당 기능
- CTA 클릭 이벤트 기록
- 폼 제출 이벤트 기록
- 계산기 사용 이벤트 기록
- FAQ 열림 이벤트 기록

#### 주요 함수
```javascript
trackEvent(eventName, params);
```

---

## 9. 이벤트 트래킹 정의

### 이벤트 목록

| 이벤트명 | 발생 시점 | 주요 파라미터 |
|---|---|---|
| `cta_click_owner` | 입점 상담 신청 CTA 클릭 | section |
| `cta_click_consumer` | 출시 알림 받기 CTA 클릭 | section |
| `owner_lead_submit` | 점주 폼 제출 성공 | businessType, location |
| `consumer_waitlist_submit` | 소비자 폼 제출 성공 | preferredArea, categories |
| `loss_calculator_used` | 계산기 사용 | dailyLoss, monthlyDays, monthlyLoss, yearlyLoss |
| `faq_open` | FAQ 항목 열림 | question |

### CTA 파라미터 예시
```json
{
  "section": "hero"
}
```

### 계산기 이벤트 파라미터 예시
```json
{
  "dailyLoss": 50000,
  "monthlyDays": 25,
  "monthlyLoss": 1250000,
  "yearlyLoss": 15000000
}
```

---

## 10. 반응형 요구사항

### 10.1 Breakpoint

| 구간 | 기준 |
|---|---|
| Mobile | 0px ~ 767px |
| Tablet | 768px ~ 1023px |
| Desktop | 1024px 이상 |

---

### 10.2 Desktop

#### 레이아웃
- 최대 콘텐츠 폭: 1120px ~ 1200px
- 히어로: 좌측 카피, 우측 일러스트
- 비교표: 테이블 형태
- 혜택: 4개 카드 그리드
- FAQ: 1열 또는 2열 가능

---

### 10.3 Mobile

#### 레이아웃
- 단일 컬럼
- 히어로 일러스트는 카피 아래 배치
- 비교표는 카드형 또는 가로 스크롤
- CTA 버튼은 전체 폭 사용
- 하단 고정 CTA 적용 가능

#### 모바일 CTA
입점 상담 신청하기

하단 고정 영역에 표시한다.

---

## 11. UI 상태 정의

### 11.1 버튼 상태

| 상태 | 설명 |
|---|---|
| Default | 기본 상태 |
| Hover | 데스크톱 마우스 오버 |
| Active | 클릭 중 |
| Disabled | 제출 중 또는 입력 오류 |
| Loading | 폼 제출 처리 중 |

#### Loading 문구
제출 중...

---

### 11.2 폼 상태

| 상태 | 설명 |
|---|---|
| Empty | 초기 상태 |
| Typing | 입력 중 |
| Invalid | 필수값 누락 또는 형식 오류 |
| Submitting | Firestore 저장 중 |
| Success | 제출 완료 |
| Error | 제출 실패 |

#### 제출 실패 메시지
일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.

---

## 12. 개인정보 동의 처리

### 점주 폼 동의 문구
입점 상담을 위해 입력하신 가게명, 담당자명, 연락처, 위치 정보를 수집합니다.  
수집된 정보는 리필링크 입점 상담 및 베타 운영 안내 목적으로만 사용됩니다.

### 소비자 폼 동의 문구
출시 알림 제공을 위해 입력하신 이름 또는 닉네임, 연락처, 관심 지역 정보를 수집합니다.  
수집된 정보는 리필링크 출시 안내 및 베타 소식 전달 목적으로만 사용됩니다.

### 구현 요구사항
- 체크박스 필수
- 미체크 시 제출 불가
- 동의 문구는 폼 하단에 표시

---

## 13. 성능 요구사항

### 목표
- 모바일 기준 첫 화면 3초 이내 표시
- 이미지보다 SVG 또는 경량 일러스트 우선 사용
- 외부 라이브러리 사용 최소화

### 권장 사항
- 이미지 WebP 사용
- SVG 일러스트 사용
- CSS/JS 파일 최소화
- 불필요한 폰트 로딩 제한
- Lazy Loading 적용

---

## 14. 접근성 요구사항

### 기본 요구사항
- 모든 입력 필드에 `label` 제공
- 버튼은 키보드로 접근 가능해야 함
- 색상만으로 상태를 구분하지 않음
- 폼 오류 메시지는 텍스트로 제공
- 대비가 충분한 텍스트 색상 사용

### 예시
```html
<label for="storeName">가게명</label>
<input id="storeName" name="storeName" type="text" required />
```

---

## 15. SEO 요구사항

### 기본 메타 태그
```html
<title>리필링크 | 버릴 음식을 매출로 바꾸는 마감 재고 판매 플랫폼</title>
<meta name="description" content="리필링크는 마감 전 남은 음식을 근처 소비자에게 연결해 점주의 폐기 손실을 줄이고 추가 매출을 만드는 마감 재고 판매 플랫폼입니다." />
```

### Open Graph
```html
<meta property="og:title" content="리필링크 | 매일 버리는 음식, 오늘 매출로 바꾸세요" />
<meta property="og:description" content="마감 재고를 근처 소비자에게 실시간 노출하고 예약·결제·픽업까지 연결하는 플랫폼입니다." />
<meta property="og:type" content="website" />
<meta property="og:image" content="/assets/images/og-image.png" />
```

### 권장 키워드
- 마감 재고
- 음식 폐기 줄이기
- 점주 매출
- 식당 폐기 손실
- 마감 할인
- 픽업 할인
- 리필링크

---

## 16. 배포 요구사항

### Hosting
Firebase Hosting 사용

### 배포 명령어 예시
```bash
firebase login
firebase init hosting
firebase deploy
```

### 배포 환경

| 환경 | 목적 |
|---|---|
| Local | 개발 |
| Preview | 내부 확인 |
| Production | 실제 공개 |

### Production URL
추후 Firebase Hosting 또는 커스텀 도메인 연결

예시:
```text
https://refillink.web.app
https://refillink.kr
```

---

## 17. Firebase 설정 예시

### firebase.json
```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 18. 에러 처리 정책

### Firestore 저장 실패
신청을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.

### 네트워크 오류
네트워크 연결이 불안정합니다. 연결 상태를 확인해주세요.

### 필수값 누락
각 필드 하단에 개별 오류 메시지를 표시한다.

예:
연락처를 입력해주세요.

---

## 19. 보안 및 스팸 방지

### MVP 기준
- Firestore 읽기 권한 차단
- create 권한만 허용
- 필드 키 제한
- 필수값 프론트엔드 검증

### 추후 적용 권장
- Firebase App Check
- reCAPTCHA
- 동일 연락처 중복 제출 제한
- IP 기반 과도한 요청 제한
- 관리자 인증 페이지

---

## 20. 테스트 체크리스트

### 20.1 화면 테스트

| 항목 | 확인 여부 |
|---|---|
| 데스크톱에서 레이아웃 정상 표시 |  |
| 모바일에서 레이아웃 정상 표시 |  |
| CTA 버튼 정상 이동 |  |
| 비교표 모바일 표시 정상 |  |
| FAQ 아코디언 정상 작동 |  |
| 하단 고정 CTA 정상 표시 |  |

### 20.2 폼 테스트

| 항목 | 확인 여부 |
|---|---|
| 점주 폼 필수값 검증 |  |
| 소비자 폼 필수값 검증 |  |
| 개인정보 동의 미체크 시 제출 차단 |  |
| Firestore에 점주 데이터 저장 |  |
| Firestore에 소비자 데이터 저장 |  |
| 제출 완료 메시지 표시 |  |
| 제출 실패 메시지 표시 |  |

### 20.3 계산기 테스트

| 항목 | 확인 여부 |
|---|---|
| 하루 폐기 금액 입력 가능 |  |
| 월 영업일 수 입력 가능 |  |
| 월 예상 손실 계산 정확 |  |
| 연간 예상 손실 계산 정확 |  |
| 음수 입력 방지 |  |
| 빈 값일 때 결과 미표시 |  |

### 20.4 이벤트 트래킹 테스트

| 이벤트 | 확인 여부 |
|---|---|
| `cta_click_owner` |  |
| `cta_click_consumer` |  |
| `owner_lead_submit` |  |
| `consumer_waitlist_submit` |  |
| `loss_calculator_used` |  |
| `faq_open` |  |

---

## 21. MVP 포함 범위

### 포함
- 정적 랜딩 페이지
- 반응형 UI
- 상단 내비게이션
- CTA 스크롤 이동
- 점주 입점 상담 신청 폼
- 소비자 출시 알림 신청 폼
- 예상 손실 계산기
- FAQ 아코디언
- Firestore 데이터 저장
- Firebase Hosting 배포
- 기본 이벤트 트래킹
- 개인정보 수집 동의 체크

### 제외
- 앱 기능 구현
- 관리자 페이지
- 로그인
- 결제
- QR 픽업
- 지도 기능
- 실시간 마감딜 등록
- 마감 예측 알고리즘
- 푸시 알림
- 점주 대시보드

---

## 22. 개발 우선순위

### Phase 1: 기본 화면 구현
1. HTML 구조 작성
2. CSS 디자인 시스템 적용
3. 반응형 레이아웃 구현
4. 섹션별 콘텐츠 배치

### Phase 2: 인터랙션 구현
1. 스크롤 이동
2. FAQ 아코디언
3. 예상 손실 계산기
4. 모바일 메뉴
5. CTA 버튼 동작

### Phase 3: Firebase 연동
1. Firebase 프로젝트 생성
2. Firestore 컬렉션 생성
3. 점주 폼 저장
4. 소비자 폼 저장
5. 제출 완료/실패 처리

### Phase 4: 트래킹 및 배포
1. Analytics 이벤트 연결
2. Firebase Hosting 설정
3. 배포 테스트
4. 모바일 QA
5. 최종 배포

---

## 23. 최종 기술 요약

리필링크 홍보용 랜딩 페이지는 초기 검증을 위한 정적 웹페이지로 구현한다.

프론트엔드는 HTML, CSS, Vanilla JavaScript만 사용하여 가볍게 제작하고, 신청 데이터는 Firebase Firestore에 저장한다. 배포는 Firebase Hosting을 사용한다.

핵심 기능은 점주 입점 상담 신청, 소비자 출시 알림 신청, 예상 손실 계산기, FAQ 아코디언, CTA 이벤트 트래킹이다.

초기 MVP에서는 결제, QR, 지도, 예측 알고리즘, 관리자 페이지는 구현하지 않는다.
