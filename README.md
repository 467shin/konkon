# ⛩️ Kon Kon

## 일본 여행자를 위한 금전 관리 웹앱

<details open>
<summary>목차</summary>

1. [기획 배경](#기획-배경)
2. [기술 스택 및 선정 이유](#기술-스택-및-선정-이유)
3. [API 명세](#api-명세)
4. [DB 설계](#db-설계)

</details>

## 기획 배경

1. 한국 사람은 뒷사람의 눈치를 보고 계산을 빠르게 끝내기 위해 동전을 얼마나 들고 있든 1000엔 지폐를 내버리는 경향이 있다.
2. 결국 귀국 날이 다가오면 동전을 쩔렁쩔렁 들고 다니게 되며, 이를 털기 위해 가챠 등 불필요한 소비를 하게 된다.
   <br>
   ~~물론 나는 일본여행 갈 때마다 10만원 단위로 가챠퐁에 쓰는 만큼 구엽고 아기자기한 것을 좋아한다.~~

## 기술 스택 및 선정 이유

### Front-end

- React : TypeScript와 가장 궁합이 좋고, user pool이 넓어 reference를 구하기 쉬운 React를 선정하였습니다.
- TypeScript : Runtime error에서 벗어나 개발 단계의 품을 줄여주고 Web Service의 성능을 올려주는 정적 타입 언어인 TypeScript를 선정하였습니다.
- Styled-Component : 코드 경량화를 위해 CSS-in-JS 방식의 styled-component를 선정하였습니다.

### Back-end

- Express.js : 프로젝트의 규모가 그리 크지 않기 때문에 간단한 기능 구현에 있어 가장 가볍고 빠르게 개발할 수 있는 Express.js를 선정하였습니다.
- MongoDB : DataBase 설계 당시 3개의 Schema가 상호 관계를 가지고 있었고, RDBMS를 사용할 경우 쿼리문이 복잡해질 상황이 우려되었습니다. 이에 Embedded 방식을 통해 유연한 스키마를 지원하는 NoSQL 중에서, Express.js와 궁합이 좋은 MongoDB를 선정하였습니다.

## API 명세

### users

<details>
<summary>click to open!</summary>

<br>

**1. 아이디 중복 체크**

- GET /api/user
  ```
  req { id }
  res { isValid: t/f }
  ```

**2. 회원 가입 기능**

- POST /api/user
  ```
  req { nickname, id, password }
  res { success : t/f }
  ```

**3. 로그인 기능**

- PATCH /api/user/
  ```
  req { id, password }
  res { loginSuccess : t/f, nickname, currency } && cookie
  ```

**4. 로그아웃 기능**

- DELETE /api/user
  ```
  res cookie
  res { success: t/f, message }
  ```

</details>

### pay

<details>
<summary>click to open!</summary>

<br>

**1. 잔고 조회 기능**

- GET /api/pay
  ```
  req cookie
  res { currency }
  ```

**2. 결제 기능 + 금액 수정 기능**

- 계산되는 금액과 권장되는 화폐 단위, 거스름돈을 서버로 보냄
- 유저가 가진 단위 별 금액이 갱신되며 history에 결제 내역이 추가된다.
- 친구한테 1000엔짜리 하나 빌려주거나 길에서 돈 주웠을 때 사용하는 API
- 내역이 history에 들어감
- 금액을 보내면 바뀐 금액을 반환해준다
- POST /api/pay
  ```
  req { pay } && cookie
  res { success, currency }
  ```

**3. 금액 쪼개기 기능**

- ex) 1000엔을 500엔 2개로 or 500엔을 100엔 5개로 쪼갤 때 사용
- unit으로 자릿수를 보낸다.
- PATCH /api/pay
  ```
  req { unit } && cookie
  res { currency }
  ```

**4. 금액 전체 수정 기능**

- 지폐 동전 하나하나 입력하여 등록 및 수정함
- 수정하면 히스토리에 금액 중간 점검 같은 느낌으로 찍힘
- PUT /api/pay
  ```
  req { currency } && cookie
  res { success, currency }
  ```

</details>

### history

<details>
<summary>click to open!</summary>

<br>

**1. 내 결제 내역 조회**

- 지금까지 서버로 전송된 히스토리 조회
- GET api/history

  ```
  req cookie
  res { histories }
  ```

**2. 결제 내역 수정**

- 가계부에 내용 작성
- PATCH

  ```
  req { _id, description }
  res { success, message }
  ```

**3. 결제 내역 삭제**

- 어라 잘못 했다 지운다
- DELETE

  ```
  req { _id }
  res { success, message }

  ```

</details>

## DB 설계

### 1. users

- **id**

  - str
  - unique

- **nickname**

  - str
  - max 20

- **pw**

  - str
  - min 5

- **currency(embedded doc)**

### 2. history

- **userId**

  - user's object id

- **date**

  - date

- **discription**

  - string

- **beforeCurrency(embedded doc)**

- **paidCurrency(embedded doc)**

### 3. currency

- **array**
  - [0] \* 9
  - [ 10000, 5000 ... 10 ]

### 고민점

- user는 자신의 자산 상황을 currency를 참조하여야 한다. One-to-One
- history는 계산의 결과를 currency를 참조하여야 한다. One-to-One
- user는 history를 여러 개 가져야 한다. One-to-Squillions

- user --- cur && history --- cur은 Embedded
- user --< history는 References 방식으로
