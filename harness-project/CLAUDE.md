# 프로젝트: CS Quiz

## 기술 스택
- Next.js 15 (App Router)
- TypeScript strict mode
- Tailwind CSS
- Vitest (단위 테스트)

## 아키텍처 규칙
- CRITICAL: 문제 데이터는 `src/data/questions.ts`에 정적 배열로 관리한다. 외부 DB나 API 호출 없음
- CRITICAL: 퀴즈 상태(선택 답안, 현재 문제 번호)는 클라이언트 컴포넌트에서만 관리한다. 서버 컴포넌트에 상태 로직을 두지 말 것
- CRITICAL: 정답 데이터는 결과 페이지 렌더링 시점에만 노출한다. 퀴즈 진행 중에는 클라이언트에 정답을 내려보내지 않는다
- 컴포넌트는 `src/components/` 하위에, 타입은 `src/types/` 하위에, 유틸리티는 `src/lib/` 하위에 분리
- 페이지 컴포넌트는 `src/app/` 하위 App Router 구조를 따른다

## 개발 프로세스
- CRITICAL: 새 기능 구현 시 반드시 테스트를 먼저 작성하고, 테스트가 통과하는 구현을 작성할 것 (TDD)
- 커밋 메시지는 conventional commits 형식을 따를 것 (feat:, fix:, docs:, refactor:)

## 앱 명령어
```
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
npm run test     # Vitest (단위 테스트)
```

## 하네스 명령어
```
python3 scripts/execute.py {task-name}        # phase 순차 실행
python3 scripts/execute.py {task-name} --push # 실행 후 원격 브랜치 push
python3 -m pytest scripts/                    # harness 자체 테스트 (pytest 필요)
```

> Windows에서 `python3`가 없으면 `python`으로 대체한다.
