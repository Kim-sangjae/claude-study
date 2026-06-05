# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

YouTube URL을 입력하면 댓글을 수집하고 Claude AI로 분석하여 리포트를 생성하는 로컬 Streamlit 앱.

## Setup

```bash
pip install -r requirements.txt
cp .env.example .env
# .env 파일에 실제 API 키 입력
```

## Run

```bash
streamlit run app.py
```

## Stack

- **UI**: Streamlit
- **YouTube 댓글 수집**: YouTube Data API v3 (`google-api-python-client`)
- **AI 분석**: Gemini API (`google-generativeai` SDK, model: `gemini-2.5-flash`)
- **환경변수**: `python-dotenv`

## Required API Keys (in `.env`)

- `YOUTUBE_API_KEY` — Google Cloud Console에서 YouTube Data API v3 활성화 후 발급
- `GEMINI_API_KEY` — aistudio.google.com/api-keys 에서 발급

## Key Files

- `app.py` — 전체 앱 코드 (단일 파일)
  - `extract_video_id()` — 다양한 YouTube URL 형식에서 video ID 추출
  - `fetch_video_info_and_comments()` — YouTube API로 영상 정보 + 댓글 수집
  - `analyze_with_gemini()` — Gemini API로 댓글 감성 분석, 주제 추출, 리포트 생성
  - `render_report()` — Streamlit으로 리포트 렌더링
