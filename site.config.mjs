// Works out the PRODUCTION URL and BASE PATH automatically. Nothing here needs editing.
//
// Order of precedence:
//   1. SITE_URL environment variable (optional; for a custom domain)
//        e.g. https://www.example-name.com   -> served from the root of that domain
//        e.g. https://user.github.io/my-repo -> a path in the URL becomes the base path
//   2. GitHub Actions (GITHUB_REPOSITORY = "owner/repo", set automatically on GitHub)
//        repo named "<owner>.github.io"  -> https://<owner>.github.io        (base "")
//        any other repo name             -> https://<owner>.github.io/<repo>  (base "/<repo>")
//   3. Local fallback: a placeholder origin, so local builds always work.
//
// Used by astro.config.mjs, the page templates and the build checks, so the
// canonical URLs, sitemap, robots.txt, Open Graph tags and JSON-LD always agree.

const normaliseBase = (b) => {
  const t = (b || '').trim().replace(/\/+$/, '');
  return t && t !== '/' ? (t.startsWith('/') ? t : `/${t}`) : '';
};

export function resolveSite(env = process.env) {
  const explicit = (env.SITE_URL || '').trim();
  if (explicit) {
    let u;
    try {
      u = new URL(explicit);
    } catch {
      throw new Error(`SITE_URL is not a valid URL: "${explicit}". Use the full address, e.g. https://your-domain.com`);
    }
    return { origin: u.origin, base: normaliseBase(u.pathname), source: 'SITE_URL' };
  }

  const repo = (env.GITHUB_REPOSITORY || '').trim();
  if (repo.includes('/')) {
    const [owner, name] = repo.split('/');
    const host = `${owner.toLowerCase()}.github.io`;
    const isUserSite = name.toLowerCase() === host;
    return { origin: `https://${host}`, base: isUserSite ? '' : `/${name}`, source: 'github' };
  }

  return { origin: 'https://example.com', base: '', source: 'placeholder' };
}
