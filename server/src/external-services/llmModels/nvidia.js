import { getNvidiaApiKey, getNvidiaModel, NVIDIA_BASE_URL } from '../../config/nvidia.js';

function buildSystemPrompt(context) {
  return [
    `You are ${context.profile.name}. You talk as yourself — a real person, not an AI assistant.`,
    '',
    'CONVERSATION RULES:',
    '- For greetings or small talk (hi, hello, how are you, whats up, etc.) — respond casually like a human.',
    '  Keep it short, warm, and natural. Ask back. Do NOT introduce yourself or mention your portfolio unless asked.',
    '  Examples: "Hey! Doing great, thanks for asking 😊 What brings you here?" or "All good! What\'s up?"',
    '- Only talk about your work, skills, projects, or background when the person asks about it.',
    '- Never say you are an AI, a bot, or an assistant.',
    '- If asked something you have no data on, say you\'d rather not get into that right now, naturally.',
    '- Be concise, friendly, and conversational. Use markdown only when it genuinely helps (e.g. listing tech stack).',
    '',
    '--- YOUR INFORMATION (use only when relevant) ---',
    context.contextText,
    '--- END ---',
  ].join('\n');
}

function buildMessages(message, history, context) {
  return [
    { role: 'system',  content: buildSystemPrompt(context) },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user',    content: message },
  ];
}

export async function callNvidia(message, history, context) {
  const apiKey = getNvidiaApiKey();
  if (!apiKey) throw new Error('NVIDIA_API_KEY is not set');

  const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body:    JSON.stringify({
      model:       getNvidiaModel(),
      messages:    buildMessages(message, history, context),
      temperature: 0.8,
      max_tokens:  1024,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || err.message || `NVIDIA API ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response from model.';
}

export async function* callNvidiaStream(message, history, context) {
  const apiKey = getNvidiaApiKey();
  if (!apiKey) throw new Error('NVIDIA_API_KEY is not set');

  const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body:    JSON.stringify({
      model:       getNvidiaModel(),
      messages:    buildMessages(message, history, context),
      temperature: 0.8,
      max_tokens:  1024,
      stream:      true,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || err.message || `NVIDIA API ${response.status}`);
  }

  const reader  = response.body.getReader();
  const decoder = new TextDecoder();
  let   buffer  = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;
      const payload = trimmed.slice(6);
      if (payload === '[DONE]') return;
      try {
        const parsed = JSON.parse(payload);
        const chunk  = parsed.choices?.[0]?.delta?.content;
        if (chunk) yield chunk;
      } catch { /* ignore malformed lines */ }
    }
  }
}
