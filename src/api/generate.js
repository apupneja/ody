const BASE = '/api';

export function streamGeneration(prompt, callbacks) {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch(`${BASE}/generate/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Generation failed: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events from buffer
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep incomplete line

        let eventType = null;
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith('data: ') && eventType) {
            try {
              const data = JSON.parse(line.slice(6));
              if (callbacks[eventType]) {
                callbacks[eventType](data);
              }
            } catch (e) {
              // skip malformed JSON
            }
            eventType = null;
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError' && callbacks.error) {
        callbacks.error(err);
      }
    }
  })();

  return () => controller.abort();
}
