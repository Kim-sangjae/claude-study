# claude-study

Claude Code를 활용해 다양한 프로젝트를 직접 만들어보는 개인 학습 레포지터리입니다.

---

## 프로젝트 목록

### 1. YouTube 댓글 분석기 [`youtube-comment-analyzer/`](./youtube-comment-analyzer/)

> YouTube URL을 입력하면 댓글을 자동 수집하고 AI가 감성 분석 리포트를 생성하는 로컬 웹 앱

| 항목 | 내용 |
|------|------|
| UI | Streamlit |
| AI 분석 | Google Gemini API (`gemini-2.5-flash`) |
| 댓글 수집 | YouTube Data API v3 |
| 실행 | `streamlit run app.py` |

**주요 기능**
- YouTube URL 입력 → 댓글 최대 300개 자동 수집
- 긍정 / 중립 / 부정 감성 비율 시각화
- 주요 주제 및 키워드 추출
- 크리에이터를 위한 종합 조언 생성

---

## 스택 요약

| 도구 | 용도 |
|------|------|
| Python | 전체 백엔드 |
| Streamlit | 로컬 웹 UI |
| Google Gemini API | AI 분석 |
| YouTube Data API v3 | 댓글 수집 |
| Claude Code | 개발 어시스턴트 |

---

## 레포 구조

```
claude-study/
└── youtube-comment-analyzer/   # 프로젝트 1
```
