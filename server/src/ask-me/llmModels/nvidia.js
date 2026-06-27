const BASE_URL = 'https://integrate.api.nvidia.com/v1';
// Model slug as listed on build.nvidia.com — change via NVIDIA_MODEL env var to swap
const MODEL    = process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct';

function buildSystemPrompt(context) {
  return [
    `You are an AI assistant embedded in ${context.profile.name}'s developer portfolio.`,
    `Answer questions about ${context.profile.name} using only the information provided below.`,
    `Be concise, helpful, and friendly. Format responses with markdown when it adds clarity.`,
    `If you don't know something, say so — do not invent information.`,
    '',
    '--- PORTFOLIO DATA ---',
    context.contextText,
    '--- END ---',
  ].join('\n');
}

function buildMessages(message, history, context) {
  return [
    { role: 'system', content: buildSystemPrompt(context) },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ];
}

// Non-streaming (kept as reference / fallback)
export async function callNvidia(message, history, context) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error('NVIDIA_API_KEY is not set');

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: MODEL, messages: buildMessages(message, history, context), temperature: 0.6, max_tokens: 1024 }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || err.message || `NVIDIA API ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response from model.';
}

// Streaming — async generator that yields text chunks
export async function* callNvidiaStream(message, history, context) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error('NVIDIA_API_KEY is not set');

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL,
      messages: buildMessages(message, history, context),
      temperature: 0.6,
      max_tokens: 1024,
      stream: true,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || err.message || `NVIDIA API ${response.status}`);
  }

  const reader  = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer    = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // keep any incomplete trailing line

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;

      const payload = trimmed.slice(6);
      if (payload === '[DONE]') return;

      try {
        const parsed = JSON.parse(payload);
        const chunk  = parsed.choices?.[0]?.delta?.content;
        if (chunk) yield chunk;
      } catch {
        // ignore malformed lines
      }
    }
  }
}
