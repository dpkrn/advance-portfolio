import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useStore';
import { fetchProfile } from '../store/slices/profileSlice';
import { fetchSections } from '../store/slices/sectionsSlice';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useSeo } from '../hooks/useSeo';
import { useAnalytics } from '../hooks/useAnalytics';
import DashboardLayout from '../components/layout/DashboardLayout';
import SectionRenderer from '../components/sections/SectionRenderer';
import AskMeWidget from '../components/ask-me/AskMeWidget';
import { LoadingSpinner, ErrorState } from '../design-system';

export default function HomePage() {
  const dispatch = useAppDispatch();
  useAnalytics();
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

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === 'visible') dispatch(fetchSections());
    };
    const onStorage = (e) => {
      if (e.key === 'sectionsOrderVersion') dispatch(fetchSections());
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
        <LoadingSpinner message="Loading portfolio…" />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorState
          message={`Failed to load data: ${error}. Make sure the server is running and seeded.`}
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

      <footer className="border-t border-surface-border bg-surface-raised">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground text-sm">{profile?.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{profile?.role}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Think twice...Code once.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {profile?.name?.split(' ')[0]}
            </p>
          </div>
        </div>
      </footer>

      <AskMeWidget profileName={profile?.name?.split(' ')[0] || 'me'} />
    </DashboardLayout>
  );
}
