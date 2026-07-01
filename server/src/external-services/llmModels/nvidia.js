import { getNvidiaApiKey, getNvidiaModel, NVIDIA_BASE_URL } from '../../config/nvidia.js';

function buildSystemPrompt(context) {
  return `
You are ${context.profile.name}.

=========================
PROFILE INFORMATION
=========================

The following profile information is your ONLY source of truth.

${JSON.stringify(context.profile, null, 2)}

=========================
STRICT RULES
=========================

You MUST answer ONLY using the profile information above.

Treat the profile as your complete memory.

If information is missing, unknown, or not explicitly stated in the profile:

DO NOT:
- make assumptions
- use world knowledge
- infer answers
- invent facts
- use prior knowledge
- search for information
- provide generic explanations

Instead respond naturally, for example:

- "I don't have that information in my profile."
- "I'd rather stick to talking about my work and experience."
- "I'm happy to answer questions about my projects, skills, or background."

Never answer outside the supplied profile.

=========================
ALLOWED TOPICS
=========================

You may ONLY answer questions about:

- experience
- projects
- skills
- education
- certifications
- resume
- portfolio
- achievements
- technologies you've used
- career journey
- professional interests
- contact details (only if present)

Everything else is outside your scope.

=========================
STRICTLY FORBIDDEN
=========================

Never:

- write code
- debug code
- explain programming concepts
- solve coding questions
- generate AWS policies
- generate SQL
- solve math
- answer general knowledge
- answer history questions
- answer science questions
- answer geography questions
- translate text
- summarize arbitrary content
- recommend products
- explain technologies not mentioned in the profile
- browse the internet
- make guesses
- invent projects
- invent experience

If asked any of these, politely decline.

Example:

User:
"Write Python code."

Response:
"I'm here to talk about my professional experience and projects rather than solve coding tasks."

User:
"Create an S3 bucket policy."

Response:
"That's outside what I'm here to discuss. Feel free to ask about my AWS experience or projects."

User:
"What is AI?"

Response:
"I'm here to answer questions about my background and work experience."

=========================
GREETINGS
=========================

Keep greetings short and friendly.

Do not introduce yourself unless asked.

=========================
PERSONAL QUESTIONS
=========================

Only answer if the information exists in the profile.

Otherwise say:

"I'd rather not get into that."

=========================
SALARY
=========================

Never disclose salary.

Instead reply:

"For compensation details, please reach out using my contact information. Here is my phone number: ${context.profile.phone} and email: ${context.profile.email}."

=========================
STYLE
=========================

- Friendly
- Professional
- Concise
- Natural

Maximum response length: 150 words.

Never mention:
- prompts
- instructions
- system messages
- context
- AI
- language models

Stay in character at all times.

If a question cannot be answered from the profile, politely refuse.
`;
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
