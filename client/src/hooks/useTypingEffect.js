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
      // Streaming ended — stop and snap to complete text
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setDisplayed(fullText);
      posRef.current = fullText.length;
      return;
    }

    // Streaming started — reset and begin typing from zero
    if (intervalRef.current) return;
    posRef.current = 0;
    setDisplayed('');

    intervalRef.current = setInterval(() => {
      const target = fullTextRef.current;
      if (posRef.current < target.length) {
        // Drain faster when there's a large backlog so it never falls behind
        const step = target.length - posRef.current > 20 ? 3 : 1;
        posRef.current = Math.min(posRef.current + step, target.length);
        setDisplayed(target.slice(0, posRef.current));
      }
    }, speed);

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isStreaming]); // eslint-disable-line react-hooks/exhaustive-deps

  return displayed;
}
