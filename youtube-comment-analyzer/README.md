# 🎬 YouTube 댓글 분석기

YouTube URL 하나만 입력하면 댓글을 자동으로 수집하고, AI가 감성 분석 및 인사이트 리포트를 생성해주는 로컬 웹 앱입니다.

---

## 프로젝트 개요

유튜브 크리에이터가 자신의 영상에 달린 댓글을 빠르게 파악할 수 있도록 돕는 도구입니다.  
URL만 입력하면 수백 개의 댓글을 자동으로 읽고, AI가 시청자 반응을 정리해 리포트로 보여줍니다.

**주요 기능**

- YouTube URL 입력 → 댓글 자동 수집 (최대 300개)
- 감성 분석: 긍정 / 중립 / 부정 비율 시각화
- 주요 주제 및 키워드 추출
- 시청자가 좋아하는 점 요약
- 개선 제안 사항 정리
- 주목할만한 대표 댓글 선정
- 크리에이터를 위한 종합 조언

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 언어 | Python 3.10+ |
| UI 프레임워크 | [Streamlit](https://streamlit.io) |
| AI 분석 | Google Gemini API (`gemini-2.5-flash`) |
| 댓글 수집 | YouTube Data API v3 |
| 환경변수 관리 | python-dotenv |

---

## 사용된 API

### 1. YouTube Data API v3
- **용도**: 영상 정보 조회, 댓글 수집
- **발급**: [Google Cloud Console](https://console.cloud.google.com) → API 및 서비스 → YouTube Data API v3 활성화
- **무료 한도**: 하루 10,000 유닛 (댓글 조회 1회 = 1 유닛)

### 2. Google Gemini API
- **용도**: 댓글 감성 분석 및 리포트 생성
- **모델**: `gemini-2.5-flash`
- **발급**: [Google AI Studio](https://aistudio.google.com/api-keys)
- **무료 한도**: 분당 15회 요청 (무료 tier 기준)

---

## 설치 및 실행

### 1. 패키지 설치

```bash
pip install -r requirements.txt
```

### 2. API 키 설정

`.env.example`을 복사해서 `.env` 파일을 만들고 실제 키를 입력합니다.

```bash
# Windows
copy .env.example .env
```

```env
YOUTUBE_API_KEY=여기에_YouTube_Data_API_v3_키
GEMINI_API_KEY=여기에_Google_AI_Studio_API_키
```

### 3. 앱 실행

```bash
streamlit run app.py
```

브라우저에서 `http://localhost:8501` 자동으로 열립니다.

---

## 사용 방법

1. YouTube URL을 입력란에 붙여넣기
2. 수집할 댓글 수 슬라이더 조정 (기본 150개)
3. **분석 시작** 버튼 클릭
4. 리포트 확인

> 일반 URL, 단축 URL(`youtu.be`), Shorts URL 모두 지원합니다.

---

## 파일 구조

```
youtube-comment-analyzer/
├── app.py              # 앱 전체 코드
├── requirements.txt    # 패키지 목록
├── .env.example        # API 키 템플릿
├── .gitignore
└── CLAUDE.md
```
