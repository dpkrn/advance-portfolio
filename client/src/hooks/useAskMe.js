import { useState, useCallback, useRef, useEffect } from 'react';
import api from '../services/api';

// ── localStorage helpers ───────────────────────────────────────────────────
const LS_SESSION_KEY  = 'ask_session_id';
const msgKey = (id)  => `ask_messages_${id}`;

function getOrCreateSessionId() {
  let id = localStorage.getItem(LS_SESSION_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(LS_SESSION_KEY, id);
  }
  return id;
}

function loadPersistedMessages(sessionId) {
  try {
    const raw = localStorage.getItem(msgKey(sessionId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistMessages(sessionId, messages) {
  try {
    // Never persist mid-stream messages
    const done = messages.filter(m => !m.streaming);
    if (done.length === 0) {
      localStorage.removeItem(msgKey(sessionId));
    } else {
      localStorage.setItem(msgKey(sessionId), JSON.stringify(done));
    }
  } catch { /* localStorage quota — silently skip */ }
}

// ── ID generator (timestamp+random avoids collisions with restored IDs) ────
function nextId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── hook ───────────────────────────────────────────────────────────────────
export function useAskMe() {
  const initialSessionId = getOrCreateSessionId();
  const sessionId        = useRef(initialSessionId);
  const activeRef        = useRef(false);

  const [messages, setMessages]     = useState(() => loadPersistedMessages(initialSessionId));
  const [loading, setLoading]       = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError]           = useState(null);

  // Persist every time messages change (skip while a stream is still open)
  useEffect(() => {
    persistMessages(sessionId.current, messages);
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text?.trim();
    if (!trimmed || activeRef.current) return;

    activeRef.current = true;
    setMessages(prev => [...prev, { id: nextId(), role: 'user', content: trimmed }]);
    setLoading(true);
    setIsStreaming(false);
    setError(null);

    const assistantId   = nextId();
    let   gotFirstChunk = false;

    await api.askQuestionStream(trimmed, sessionId.current, {
      onChunk: (chunk) => {
        if (!gotFirstChunk) {
          gotFirstChunk = true;
          setLoading(false);
          setIsStreaming(true);
          setMessages(prev => [
            ...prev,
            { id: assistantId, role: 'assistant', content: chunk, streaming: true },
          ]);
        } else {
          setMessages(prev =>
            prev.map(m => m.id === assistantId ? { ...m, content: m.content + chunk } : m)
          );
        }
      },
      onDone: () => {
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, streaming: false } : m)
        );
        setLoading(false);
        setIsStreaming(false);
        activeRef.current = false;
      },
      onError: (err) => {
        setMessages(prev => prev.filter(m => m.id !== assistantId));
        setError(err.message || 'Failed to get a response');
        setLoading(false);
        setIsStreaming(false);
        activeRef.current = false;
      },
    });
  }, []);

  // Clear only from localStorage — MongoDB session is preserved
  const clearChat = useCallback(() => {
    if (activeRef.current) return;

    const oldId = sessionId.current;
    localStorage.removeItem(msgKey(oldId));

    const newId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(LS_SESSION_KEY, newId);
    sessionId.current = newId;

    setMessages([]);
    setError(null);
  }, []);

  const isBusy = loading || isStreaming;

  return { messages, loading, isStreaming, isBusy, error, sendMessage, clearChat };
}
