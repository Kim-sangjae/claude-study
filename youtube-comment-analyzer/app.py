import streamlit as st
import os
import json
import re
from dotenv import load_dotenv
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import google.generativeai as genai

load_dotenv()

st.set_page_config(
    page_title="YouTube 댓글 분석기",
    page_icon="🎬",
    layout="wide"
)


def extract_video_id(url: str) -> str | None:
    patterns = [
        r'(?:v=|\/)([0-9A-Za-z_-]{11})(?:[?&]|$)',
        r'youtu\.be\/([0-9A-Za-z_-]{11})',
        r'shorts\/([0-9A-Za-z_-]{11})',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def fetch_video_info_and_comments(video_id: str, max_comments: int = 200):
    youtube = build("youtube", "v3", developerKey=os.getenv("YOUTUBE_API_KEY"))

    video_resp = youtube.videos().list(part="snippet,statistics", id=video_id).execute()
    if not video_resp.get("items"):
        raise ValueError("영상을 찾을 수 없거나 비공개 영상입니다.")

    video = video_resp["items"][0]
    title = video["snippet"]["title"]
    channel = video["snippet"]["channelTitle"]
    view_count = int(video["statistics"].get("viewCount", 0))
    total_comments = int(video["statistics"].get("commentCount", 0))

    comments = []
    next_page_token = None

    while len(comments) < max_comments:
        try:
            resp = youtube.commentThreads().list(
                part="snippet",
                videoId=video_id,
                maxResults=min(100, max_comments - len(comments)),
                pageToken=next_page_token,
                textFormat="plainText",
                order="relevance",
            ).execute()
        except HttpError as e:
            if "commentsDisabled" in str(e):
                break
            raise

        for item in resp.get("items", []):
            snippet = item["snippet"]["topLevelComment"]["snippet"]
            comments.append({
                "text": snippet["textDisplay"],
                "likes": snippet["likeCount"],
            })

        next_page_token = resp.get("nextPageToken")
        if not next_page_token:
            break

    return title, channel, view_count, total_comments, comments


def analyze_with_gemini(title: str, channel: str, comments: list) -> dict:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel(
        "gemini-2.5-flash",
        generation_config={"response_mime_type": "application/json"},
    )

    comments_text = "\n".join(
        f"[👍{c['likes']}] {c['text']}" for c in comments[:200]
    )

    prompt = f"""당신은 YouTube 댓글 분석 전문가입니다.

영상 정보:
- 제목: {title}
- 채널: {channel}
- 분석 댓글 수: {len(comments)}개

댓글 목록 (좋아요 수 포함):
{comments_text}

위 댓글들을 분석하여 아래 JSON 스키마에 맞게 응답해주세요.

{{
  "sentiment": {{
    "positive": <긍정 비율 정수 0-100>,
    "negative": <부정 비율 정수 0-100>,
    "neutral": <중립 비율 정수 0-100>,
    "summary": "<전반적 분위기 한 문장>"
  }},
  "topics": ["<주제1>", "<주제2>", "<주제3>", "<주제4>", "<주제5>"],
  "positive_points": [
    "<시청자들이 긍정적으로 반응한 점 1>",
    "<시청자들이 긍정적으로 반응한 점 2>",
    "<시청자들이 긍정적으로 반응한 점 3>"
  ],
  "improvements": [
    "<개선 제안 1>",
    "<개선 제안 2>",
    "<개선 제안 3>"
  ],
  "notable_comments": [
    {{"text": "<주목할 댓글 원문>", "reason": "<선정 이유>"}},
    {{"text": "<주목할 댓글 원문>", "reason": "<선정 이유>"}},
    {{"text": "<주목할 댓글 원문>", "reason": "<선정 이유>"}}
  ],
  "creator_advice": "<크리에이터를 위한 종합 조언 2-3문장>"
}}"""

    response = model.generate_content(prompt)
    return json.loads(response.text)


def render_report(title, channel, view_count, total_comments, fetched, analysis):
    st.markdown("---")
    st.markdown(f"### 📺 {title}")
    st.caption(f"채널: {channel}")

    c1, c2, c3 = st.columns(3)
    c1.metric("총 조회수", f"{view_count:,}")
    c2.metric("총 댓글수", f"{total_comments:,}")
    c3.metric("분석 댓글수", f"{fetched:,}")

    st.markdown("---")
    st.subheader("😊 감성 분석")

    s = analysis.get("sentiment", {})
    pos, neg, neu = s.get("positive", 0), s.get("negative", 0), s.get("neutral", 0)

    c1, c2, c3 = st.columns(3)
    with c1:
        st.metric("긍정", f"{pos}%")
        st.progress(pos / 100)
    with c2:
        st.metric("중립", f"{neu}%")
        st.progress(neu / 100)
    with c3:
        st.metric("부정", f"{neg}%")
        st.progress(neg / 100)

    st.info(f"💬 {s.get('summary', '')}")

    st.markdown("---")
    st.subheader("🏷️ 주요 주제 / 키워드")
    topics = analysis.get("topics", [])
    if topics:
        st.markdown("  ".join(f"**`{t}`**" for t in topics))

    st.markdown("---")
    c1, c2 = st.columns(2)
    with c1:
        st.subheader("👍 긍정적 피드백")
        for p in analysis.get("positive_points", []):
            st.markdown(f"✅ {p}")
    with c2:
        st.subheader("💡 개선 제안")
        for i in analysis.get("improvements", []):
            st.markdown(f"🔧 {i}")

    st.markdown("---")
    st.subheader("💬 주목할만한 댓글")
    for c in analysis.get("notable_comments", []):
        preview = c.get("text", "")[:60]
        with st.expander(f"📌 {preview}{'...' if len(c.get('text','')) > 60 else ''}"):
            st.markdown(f"**댓글:** {c.get('text', '')}")
            st.markdown(f"**선정 이유:** {c.get('reason', '')}")

    st.markdown("---")
    st.subheader("🎯 크리에이터를 위한 종합 조언")
    st.success(analysis.get("creator_advice", ""))


def main():
    st.title("🎬 YouTube 댓글 분석기")
    st.markdown("YouTube URL을 입력하면 AI가 댓글을 분석하여 리포트를 생성합니다.")

    missing_keys = []
    if not os.getenv("YOUTUBE_API_KEY"):
        missing_keys.append("YOUTUBE_API_KEY")
    if not os.getenv("GEMINI_API_KEY"):
        missing_keys.append("GEMINI_API_KEY")

    if missing_keys:
        st.error(f"⚠️ 다음 API 키가 설정되지 않았습니다: {', '.join(missing_keys)}")
        st.code("# .env 파일에 아래 내용을 추가하세요\nYOUTUBE_API_KEY=여기에_유튜브_API_키\nGEMINI_API_KEY=여기에_Gemini_API_키")
        return

    url = st.text_input(
        "YouTube URL",
        placeholder="https://www.youtube.com/watch?v=...",
        help="일반 URL, 단축 URL(youtu.be), Shorts URL 모두 지원합니다.",
    )
    max_comments = st.slider("최대 댓글 수집 수", 50, 300, 150, 50)

    if st.button("🔍 분석 시작", type="primary", use_container_width=True):
        if not url:
            st.warning("YouTube URL을 입력해주세요.")
            return

        video_id = extract_video_id(url)
        if not video_id:
            st.error("올바른 YouTube URL을 입력해주세요.")
            return

        try:
            with st.status("분석 중...", expanded=True) as status:
                st.write("📡 YouTube에서 댓글을 가져오는 중...")
                title, channel, view_count, total_comments, comments = \
                    fetch_video_info_and_comments(video_id, max_comments)

                if not comments:
                    st.warning("댓글이 없거나 댓글 기능이 비활성화된 영상입니다.")
                    return

                st.write(f"✅ 댓글 {len(comments)}개 수집 완료")
                st.write("🤖 Gemini AI로 분석 중... (잠시 기다려주세요)")

                analysis = analyze_with_gemini(title, channel, comments)
                status.update(label="✅ 분석 완료!", state="complete")

            render_report(title, channel, view_count, total_comments, len(comments), analysis)

        except ValueError as e:
            st.error(f"❌ {e}")
        except Exception as e:
            st.error(f"❌ 오류 발생: {e}")
            with st.expander("상세 오류"):
                st.exception(e)


if __name__ == "__main__":
    main()
