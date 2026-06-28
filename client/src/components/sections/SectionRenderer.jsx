import { Suspense } from 'react';
import { getSectionComponent } from './registry';
import { LoadingSpinner } from '../../design-system';

export default function SectionRenderer({ section, profile }) {
  const Component = getSectionComponent(section.type);

  return (
    <div data-section-slug={section.slug}>
      <Suspense
        fallback={
          <div className="section-container py-12">
            <LoadingSpinner message={`Loading ${section.title}...`} />
          </div>
        }
      >
        <Component section={section} profile={profile} id={section.slug} />
      </Suspense>
    </div>
  );
}
