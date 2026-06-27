import { useState, useCallback } from 'react';
import api from '../services/api';

let messageId = 0;
function nextId() {
  messageId += 1;
  return `msg-${messageId}`;
}

export function useAskMe() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text?.trim();
    if (!trimmed || loading) return;

    const userMsg = { id: nextId(), role: 'user', content: trimmed };
    let historySnapshot;

    setMessages((prev) => {
      historySnapshot = [...prev, userMsg];
      return historySnapshot;
    });

    setLoading(true);
    setError(null);

    try {
      const history = historySnapshot.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const { answer, provider } = await api.askQuestion(trimmed, history);

      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'assistant', content: answer, provider },
      ]);
    } catch (err) {
      setError(err.message || 'Failed to get a response');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearChat };
}
