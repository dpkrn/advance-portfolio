import { useEffect, useRef } from 'react';
import { api } from '../services/api';

const LS_KEY = 'analytics_session_id';

function getOrCreateSessionId() {
  let id = localStorage.getItem(LS_KEY);
  if (!id) {
    id = `vs-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(LS_KEY, id);
  }
  return id;
}

export function useAnalytics() {
  const sessionId   = useRef(getOrCreateSessionId());
  const startTime   = useRef(Date.now());
  const sections    = useRef({});   // slug → { start: ms, total: seconds }
  const heartbeat   = useRef(null);
  const observers   = useRef([]);

  function getDuration() {
    return Math.round((Date.now() - startTime.current) / 1000);
  }

  function getSections() {
    return Object.entries(sections.current).map(([slug, data]) => ({
      slug,
      duration: data.total || 0,
      viewedAt: new Date().toISOString(),
    }));
  }

  function send(final = false) {
    api.trackVisit({
      sessionId: sessionId.current,
      referrer: document.referrer || '',
      duration: getDuration(),
      sections: getSections(),
    }).catch(() => {});
  }

  // Observe all sections for scroll tracking
  function observeSections() {
    observers.current.forEach((obs) => obs.disconnect());
    observers.current = [];

    document.querySelectorAll('[data-section-slug]').forEach((el) => {
      const slug = el.dataset.sectionSlug;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (!sections.current[slug]) sections.current[slug] = { start: null, total: 0 };
          if (entry.isIntersecting) {
            sections.current[slug].start = Date.now();
          } else if (sections.current[slug].start) {
            sections.current[slug].total += Math.round((Date.now() - sections.current[slug].start) / 1000);
            sections.current[slug].start = null;
          }
        },
        { threshold: 0.2 }
      );
      obs.observe(el);
      observers.current.push(obs);
    });
  }

  useEffect(() => {
    // Initial track
    send();
    // Observe sections (wait for them to mount)
    const t = setTimeout(observeSections, 1500);
    // Heartbeat every 30s
    heartbeat.current = setInterval(() => send(), 30_000);
    // Final send on unload
    const handleUnload = () => send(true);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearTimeout(t);
      clearInterval(heartbeat.current);
      window.removeEventListener('beforeunload', handleUnload);
      observers.current.forEach((obs) => obs.disconnect());
      send(true);
    };
  }, []);
}
