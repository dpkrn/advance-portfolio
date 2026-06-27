import { useEffect } from 'react';

function setMetaTag(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setJsonLd(data) {
  const id = 'portfolio-jsonld';
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function useSeo(profile) {
  useEffect(() => {
    if (!profile) return;

    const title = profile.seo?.title || `${profile.name} — ${profile.role}`;
    const description = profile.seo?.description || profile.summary;
    const ogImage = profile.seo?.ogImage || '/og-image.svg';
    const url = window.location.origin;

    document.title = title;
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', profile.seo?.keywords?.join(', '));

    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', 'profile');
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:image', `${url}${ogImage}`);

    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', `${url}${ogImage}`);

    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      jobTitle: profile.role,
      description: profile.summary,
      email: profile.email,
      url,
      image: `${url}${profile.avatar || '/avatar.svg'}`,
      sameAs: profile.socialLinks?.map((l) => l.url).filter((u) => u && u !== '#') || [],
      address: profile.location
        ? { '@type': 'PostalAddress', addressLocality: profile.location }
        : undefined,
    });
  }, [profile]);
}
