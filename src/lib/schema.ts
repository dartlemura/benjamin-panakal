import { SITE_URL, data, person, sections, isLive, url, locationLabel } from '../data/site';

/** Stable entity identifiers, reused on every page so Google can resolve one entity. */
export const ID = {
  website: `${SITE_URL}/#website`,
  person: `${SITE_URL}/#person`,
  profilePage: `${SITE_URL}/#profilepage`,
};

type Crumb = { name: string; path: string };

export type PageKind = 'profile' | 'webpage' | 'contact' | 'collection';

export type SchemaInput = {
  kind: PageKind;
  path: string;            // e.g. "/" or "/biography/"
  name: string;            // page title (without site suffix)
  description: string;
  breadcrumbs?: Crumb[];
  ogImage?: string;        // absolute URL
};

function personNode() {
  const p = data.profile;
  const node: Record<string, unknown> = {
    '@type': 'Person',
    '@id': ID.person,
    name: person.name,
    givenName: person.givenName,
    additionalName: person.additionalName,
    familyName: person.familyName,
    url: url('/'),
    sameAs: person.profiles.map((x) => x.url),
    homeLocation: {
      '@type': 'Place',
      name: locationLabel,
      address: {
        '@type': 'PostalAddress',
        addressLocality: person.locality,
        addressCountry: person.countryCode,
      },
    },
    mainEntityOfPage: { '@id': ID.profilePage },
  };

  // Everything below is emitted ONLY if the owner supplied it in content.ts.
  if (p.description) node.description = p.description;
  if (p.jobTitle) node.jobTitle = p.jobTitle;
  if (p.photo) node.image = url(p.photo.src);
  if (data.contact.email) node.email = data.contact.email;

  const schools = Array.from(new Set(data.education.map((e) => e.org).filter(Boolean) as string[]));
  if (schools.length) {
    node.alumniOf = schools.map((n) => ({ '@type': 'EducationalOrganization', name: n }));
  }
  const awards = data.achievements.map((a) => a.title).filter(Boolean);
  if (awards.length) node.award = awards;

  return node;
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    url: url('/'),
    name: person.name,
    description: `Official website of ${person.name}.`,
    inLanguage: 'en',
    publisher: { '@id': ID.person },
    about: { '@id': ID.person },
  };
}

function breadcrumbNode(path: string, crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url(path)}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: url(c.path),
    })),
  };
}

export function buildGraph(i: SchemaInput) {
  const pageUrl = url(i.path);
  const modified = data.lastReviewed;
  const graph: Record<string, unknown>[] = [websiteNode(), personNode()];

  const base = {
    url: pageUrl,
    name: i.name,
    description: i.description,
    inLanguage: 'en',
    isPartOf: { '@id': ID.website },
    dateModified: modified,
    ...(i.ogImage ? { primaryImageOfPage: { '@type': 'ImageObject', url: i.ogImage } } : {}),
  };

  if (i.kind === 'profile') {
    graph.push({
      '@type': 'ProfilePage',
      '@id': ID.profilePage,
      ...base,
      dateCreated: modified,
      mainEntity: { '@id': ID.person },
      about: { '@id': ID.person },
    });
  } else {
    const type = i.kind === 'contact' ? 'ContactPage' : i.kind === 'collection' ? 'CollectionPage' : 'WebPage';
    graph.push({
      '@type': type,
      '@id': `${pageUrl}#webpage`,
      ...base,
      about: { '@id': ID.person },
      ...(i.breadcrumbs?.length ? { breadcrumb: { '@id': `${pageUrl}#breadcrumb` } } : {}),
    });
    if (i.breadcrumbs?.length) graph.push(breadcrumbNode(i.path, i.breadcrumbs));
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

/** ItemList for real, supplied entries on listing pages (articles, projects). */
export function listNode(path: string, items: { name: string; url?: string; description?: string; datePublished?: string }[]) {
  return {
    '@type': 'ItemList',
    '@id': `${url(path)}#list`,
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'CreativeWork',
        name: it.name,
        ...(it.url ? { url: it.url } : {}),
        ...(it.description ? { description: it.description } : {}),
        ...(it.datePublished ? { datePublished: it.datePublished } : {}),
        creator: { '@id': ID.person },
      },
    })),
  };
}

export { sections, isLive };
