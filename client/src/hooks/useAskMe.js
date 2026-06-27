import { useState, useCallback, useRef } from 'react';
import api from '../services/api';

let messageId = 0;
function nextId() { return `msg-${++messageId}`; }

function getOrCreateSessionId() {
  const key = 'ask_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function useAskMe() {
  const sessionId  = useRef(getOrCreateSessionId());
  const activeRef  = useRef(false); // prevents overlapping sends
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false); // waiting for first token
  const [isStreaming, setIsStreaming] = useState(false); // tokens arriving
  const [error, setError]       = useState(null);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text?.trim();
    if (!trimmed || activeRef.current) return;

    activeRef.current = true;
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', content: trimmed }]);
    setLoading(true);
    setIsStreaming(false);
    setError(null);

    const assistantId   = nextId();
    let   gotFirstChunk = false;

    await api.askQuestionStream(trimmed, sessionId.current, {
      onChunk: (chunk) => {
        if (!gotFirstChunk) {
          gotFirstChunk = true;
          // Transition: dots → streaming text
          setLoading(false);
          setIsStreaming(true);
          setMessages((prev) => [
            ...prev,
            { id: assistantId, role: 'assistant', content: chunk, streaming: true },
          ]);
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            )
          );
        }
      },
      onDone: () => {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m))
        );
        setLoading(false);
        setIsStreaming(false);
        activeRef.current = false;
      },
      onError: (err) => {
        // Remove the partial assistant message if it was added
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        setError(err.message || 'Failed to get a response');
        setLoading(false);
        setIsStreaming(false);
        activeRef.current = false;
      },
    });
  }, []); // stable — activeRef gates concurrency, no dep on loading

  const clearChat = useCallback(() => {
    if (activeRef.current) return; // don't clear mid-stream
    const newId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem('ask_session_id', newId);
    sessionId.current = newId;
    setMessages([]);
    setError(null);
  }, []);

  const isBusy = loading || isStreaming;

  return { messages, loading, isStreaming, isBusy, error, sendMessage, clearChat };
}
