import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useStore';
import { setActiveSection } from '../store/slices/sectionsSlice';

export function useScrollSpy(sectionIds) {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          dispatch(setActiveSection(visible[0].target.id));
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, dispatch, location.pathname]);
}

export function scrollToSection(slug) {
  const el = document.getElementById(slug);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
