import type { Content } from './content';

/**
 * DESIGN PREVIEW ONLY.
 * Used when building with PREVIEW_DESIGN=1 so every page template can be reviewed.
 * Every string is plainly labelled as a sample, the build is noindex'd and
 * robots.txt disallows everything. This never ships in a normal build.
 */
const sample = 'Sample text for design review only. This is not information about Benjamin.';

export const preview: Content = {
  lastReviewed: '2026-11-12',
  profile: { description: '', jobTitle: '', photo: null },
  contact: { email: '' },
  biography: [sample, sample + ' ' + sample, sample],
  about: [sample, sample],
  background: [
    { title: 'Sample role title', org: 'Sample organisation', period: '2022 – Present', summary: sample },
    { title: 'Sample earlier role', org: 'Sample organisation', period: '2019 – 2022', summary: sample },
  ],
  education: [
    { title: 'Sample qualification', org: 'Sample institution', period: '2015 – 2019', summary: sample },
  ],
  achievements: [
    { title: 'Sample achievement', org: 'Sample body', period: '2023', summary: sample },
    { title: 'Another sample achievement', org: 'Sample body', period: '2021', summary: sample },
  ],
  projects: [
    { title: 'Sample project one', period: '2024', summary: sample },
    { title: 'Sample project two', period: '2023', summary: sample },
    { title: 'Sample project three', period: '2022', summary: sample },
  ],
  articles: [
    { title: 'Sample article title', url: 'https://example.com/sample-1', publisher: 'Sample Publisher', date: '2025-03-14', summary: sample },
    { title: 'Another sample article', url: 'https://example.com/sample-2', publisher: 'Sample Publisher', date: '2024-08-02', summary: sample },
  ],
  gallery: [
    { src: '/og/sample-landscape.svg', alt: 'Sample landscape placeholder', width: 1200, height: 800, caption: 'Sample' },
    { src: '/og/sample-portrait.svg', alt: 'Sample portrait placeholder', width: 800, height: 1000, caption: 'Sample' },
    { src: '/og/sample-landscape.svg', alt: 'Sample landscape placeholder', width: 1200, height: 800 },
    { src: '/og/sample-portrait.svg', alt: 'Sample portrait placeholder', width: 800, height: 1000 },
  ],
};
