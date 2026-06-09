from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.chat_engine import run_chat
from app.utils.stream import stream_text

router = APIRouter()


@router.post("/chat")
def chat(payload: dict):
    result = run_chat(payload["message"])
    return result


@router.get("/chat/stream")
def chat_stream(message: str):
    response = f"Analyzing query: {message}. Fetching SQL results now..."
    return StreamingResponse(
        stream_text(response),
        media_type="text/event-stream"
    )