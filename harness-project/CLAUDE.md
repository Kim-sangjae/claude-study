# CS Quiz

## Project Overview

CS 기초 지식(자료구조·알고리즘·OS·네트워크·DB·컴퓨터구조)을 객관식 30문제로 점검하는 학습용 풀스택 웹앱.
Google 로그인, 문제 게시판, 커뮤니티 기능, 관리자 승인 워크플로우를 포함한다.

---

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Test**: Vitest
- **Database**: Supabase (PostgreSQL) + Prisma ORM
- **Auth**: NextAuth.js v5 (Google OAuth)
- **Client State**: TanStack Query

---

## Commands

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run test     # Vitest 단위 테스트
npm run lint     # ESLint
```

**DB 명령어**
```bash
npx prisma migrate dev   # 스키마 변경 후 마이그레이션
npx prisma generate      # Prisma Client 재생성
npx prisma studio        # DB 브라우저 (localhost:5555)
npm run db:seed          # 초기 문제 데이터 시딩
```

**검증 순서** — 코드 수정 후 반드시:
```bash
npm run build && npm run test && npm run lint
```

### Harness

```bash
python scripts/execute.py {task-name}        # phase 순차 실행
python scripts/execute.py {task-name} --push # 실행 후 원격 브랜치 push
```

> Windows에서 `python3`가 없으면 `python`으로 대체한다.

---

## Navigation Guide

작업 유형에 맞는 문서만 골라서 읽는다.

### UI / 컴포넌트

> 컴포넌트 추가·수정, 스타일 변경, 반응형 레이아웃

| 문서 | 읽어야 할 내용 |
|------|--------------|
| `docs/UI_GUIDE.md` | 색상 팔레트, 컴포넌트 스타일 토큰, 상태별 UI, 안티패턴 |
| `docs/ARCHITECTURE.md` → *컴포넌트 인터페이스* | QuizCard / Navigator / ResultCard prop 정의 |
| `docs/ARCHITECTURE.md` → *패턴 및 렌더링 전략* | Server / Client Component 경계 규칙 |

### 페이지 추가·수정

> `/quiz`, `/result`, `/mypage`, `/board`, `/admin`, `/settings` 수정 또는 새 라우트 추가

| 문서 | 읽어야 할 내용 |
|------|--------------|
| `docs/ARCHITECTURE.md` → *v2 디렉토리 구조* | 전체 라우트 목록, API 라우트 구조 |
| `docs/ARCHITECTURE.md` → *렌더링 전략* | Server/Client Component 경계, 미들웨어 규칙 |
| `docs/ARCHITECTURE.md` → *미들웨어* | 보호 경로, 리다이렉트 규칙 |
| `docs/ADR.md` → ADR-013~019 | Supabase·NextAuth·Prisma·TanStack Query 선택 이유 |

### 인증 / 미들웨어

> Google 로그인, 세션, 닉네임 설정, 접근 제어

| 문서 | 읽어야 할 내용 |
|------|--------------|
| `docs/ARCHITECTURE.md` → *미들웨어* | 보호 경로, 닉네임 체크 로직 |
| `docs/ARCHITECTURE.md` → *환경 변수* | 필요한 env var 전체 목록 |
| `docs/ADR.md` → ADR-014 | NextAuth.js v5 선택 이유 |
| `src/lib/auth.ts` | NextAuth config, getSession 헬퍼 |

### API 라우트

> `src/app/api/` 하위 라우트 추가·수정

| 문서 | 읽어야 할 내용 |
|------|--------------|
| `docs/ARCHITECTURE.md` → *v2 디렉토리 구조* | API 라우트 전체 목록 |
| `docs/PRD.md` → *v2 기능 명세* | 각 API의 동작 명세 |
| `src/lib/prisma.ts` | Prisma client singleton 사용법 |
| `src/lib/auth.ts` | 세션 검증 헬퍼 |

### DB 스키마 / Prisma

> `prisma/schema.prisma` 수정, 마이그레이션, 새 모델 추가

| 문서 | 읽어야 할 내용 |
|------|--------------|
| `docs/ARCHITECTURE.md` → *데이터베이스 스키마* | 전체 Prisma 스키마 명세 |
| `docs/ADR.md` → ADR-013, ADR-015, ADR-019 | Supabase·Prisma·역정규화 선택 이유 |

### 문제 데이터

> `questions.ts` 수정, 카테고리 추가, 문제 품질 기준

| 문서 | 읽어야 할 내용 |
|------|--------------|
| `docs/ARCHITECTURE.md` → *questions.ts 명세* | id 형식, named export 규칙, 최소 수량 |
| `docs/ADR.md` → ADR-002, ADR-009 | 정적 배열 결정 이유, id 형식 규칙 |
| `docs/PRD.md` → *문제 데이터 범위* | 카테고리별 최소 문제 수, 품질 기준 |

### 비즈니스 로직 (순수 함수)

> `sample.ts` / `grade.ts` / `guard.ts` / `history.ts` 수정

| 문서 | 읽어야 할 내용 |
|------|--------------|
| `docs/ARCHITECTURE.md` → *모듈별 상세 명세* | 각 함수 시그니처, 엣지 케이스 처리 |
| `docs/ADR.md` → ADR-006, ADR-012 | Fisher-Yates 셔플 선택 이유, localStorage 히스토리 선택 이유 |

### 테스트 추가·수정

| 문서 | 읽어야 할 내용 |
|------|--------------|
| `docs/ARCHITECTURE.md` → *테스트 전략* | 테스트 파일 목록, 제외 대상, 불변조건 |

### 기능 요구사항 확인

| 문서 | 읽어야 할 내용 |
|------|--------------|
| `docs/PRD.md` | 페이지별 기능 명세, 에러·엣지 케이스, MVP 제외 항목 |

### 기술 결정 이유

| 문서 | 읽어야 할 내용 |
|------|--------------|
| `docs/ADR.md` | 프레임워크·라이브러리·패턴 선택 근거 전체 |

---

## AI Working Rules

### Think Before Coding
- 요구사항이 모호하면 구현 전 질문한다
- 여러 구현 방식이 있으면 선택지와 트레이드오프를 먼저 제시한다

### Simplicity First
- 요청된 기능 외 추가 금지
- 불필요한 추상화·미래 확장성 고려 금지

### Surgical Changes
- 필요한 파일만 수정, 관련 없는 리팩토링 금지
- 기존 코드 스타일·주석 유지

---

## Non-Obvious Rules

- **정답 prop 전달 금지**: `answer` 필드는 `grade.ts` 제출 시점에만 접근. 퀴즈 진행 중 어떤 컴포넌트에도 prop으로 내려보내지 않는다
- **sessionStorage 즉시 삭제**: `/result` 마운트 후 파싱 직후 `removeItem` 호출. 삭제를 `setResult` 이후로 미루면 Strict Mode 이중 실행 시 리다이렉트 버그 발생 (v2에서 sessionStorage 제거 후 불필요)
- **useRef 이중 실행 방어**: `result/page.tsx`의 `useEffect`는 `const didRead = useRef(false)` 가드 필수. React Strict Mode(dev)에서 effect가 2회 실행되기 때문 (v2 DB 전환 후 제거)
- **셔플은 Fisher-Yates만**: `Array.sort(() => Math.random() - 0.5)` 사용 금지
- **TDD**: 새 순수 함수 구현 시 테스트 먼저, 구현은 그 다음
- **API 인증 필수**: 모든 POST/PATCH API 라우트는 `getServerSession(authOptions)`로 세션 검증. 미인증 시 401 반환
- **admin 전용 API**: `/api/admin/*`는 session.user.role === 'ADMIN' 추가 검증. 미인증 시 403 반환
- **Prisma $transaction**: quiz 제출 시 QuizSession + QuestionAttempt + Question 통계 업데이트를 반드시 단일 트랜잭션으로 처리
- **커밋**: conventional commits (`feat:`, `fix:`, `refactor:`, `chore:`)
