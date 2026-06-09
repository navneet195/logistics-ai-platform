import time
import json

def stream_text(text: str):
    for word in text.split():
        yield f"data: {word}\n\n"
        time.sleep(0.05)
        