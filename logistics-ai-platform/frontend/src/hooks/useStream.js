export async function streamMessage(onChunk) {
    const res = await fetch("http://localhost:8000/chat/stream?message=test");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        onChunk(decoder.decode(value));
    }
}