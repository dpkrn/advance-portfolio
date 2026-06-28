import { useState, useEffect, useRef } from 'react';

export function useTypingEffect(fullText, isStreaming, speed = 10) {
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
      setDisplayed(fullText);
      posRef.current = fullText.length;
      return;
    }

    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      const target = fullTextRef.current;
      if (posRef.current < target.length) {
        posRef.current++;
        setDisplayed(target.slice(0, posRef.current));
      }
    }, speed);

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isStreaming]);

  return displayed;
}
