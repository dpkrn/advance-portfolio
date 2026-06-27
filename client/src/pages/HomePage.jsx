import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useStore';
import { fetchProfile } from '../store/slices/profileSlice';
import { fetchSections } from '../store/slices/sectionsSlice';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useSeo } from '../hooks/useSeo';
import DashboardLayout from '../components/layout/DashboardLayout';
import SectionRenderer from '../components/sections/SectionRenderer';
import AskMeWidget from '../components/ask-me/AskMeWidget';
import { LoadingSpinner, ErrorState } from '../design-system';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { data: profile, loading: profileLoading, error: profileError } = useAppSelector(
    (state) => state.profile
  );
  const { items: sections, loading: sectionsLoading, error: sectionsError } = useAppSelector(
    (state) => state.sections
  );

  const sectionIds = useMemo(() => sections.map((s) => s.slug), [sections]);
  useScrollSpy(sectionIds);
  useSeo(profile);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchSections());
  }, [dispatch]);

  // Refetch when returning to the tab so admin reorder changes appear
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === 'visible') {
        dispatch(fetchSections());
      }
    };
    const onStorage = (e) => {
      if (e.key === 'sectionsOrderVersion') {
        dispatch(fetchSections());
      }
    };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, [dispatch]);

  const loading = profileLoading || sectionsLoading;
  const error = profileError || sectionsError;

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner message="Loading your digital identity..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorState
          message={`Failed to load portfolio data: ${error}. Make sure the server is running and seeded.`}
          onRetry={() => {
            dispatch(fetchProfile());
            dispatch(fetchSections());
          }}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {sections.map((section) => (
        <SectionRenderer key={section.slug} section={section} profile={profile} />
      ))}
      <footer className="border-t border-surface-border py-8 text-center text-sm text-muted-foreground">
        <p>Built with React, Redux Toolkit, Node.js & MongoDB</p>
        <p className="mt-1">© {new Date().getFullYear()} {profile?.name}. Living digital identity.</p>
      </footer>
      <AskMeWidget profileName={profile?.name?.split(' ')[0] || 'me'} />
    </DashboardLayout>
  );
}
