import { useState, useEffect, useRef } from 'react';

export function useTypingEffect(fullText, isStreaming, speed = 18) {
  const [displayed, setDisplayed] = useState('');
  const fullTextRef = useRef(fullText);
  const posRef      = useRef(0);
  const intervalRef = useRef(null);

  // Keep ref current so the interval closure always reads the latest text
  useEffect(() => {
    fullTextRef.current = fullText;
  });

  useEffect(() => {
    if (!isStreaming) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      posRef.current = 0;
      setDisplayed('');
      return;
    }

    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      const target = fullTextRef.current;
      if (posRef.current < target.length) {
        // Drain faster when backlog is large so it never lags behind
        const step = target.length - posRef.current > 20 ? 3 : 1;
        posRef.current = Math.min(posRef.current + step, target.length);
        setDisplayed(target.slice(0, posRef.current));
      }
    }, speed);

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isStreaming]);

  // Snap to full text when streaming ends
  useEffect(() => {
    if (!isStreaming && fullText) {
      setDisplayed(fullText);
    }
  }, [isStreaming, fullText]);

  return displayed;
}
