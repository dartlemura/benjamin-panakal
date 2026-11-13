# Benjamin Anthony Panakal — official website

A fast, SEO-first personal website built with [Astro](https://astro.build). It is pre-rendered HTML, so search engines read everything without running JavaScript.

**You do not need to edit any file to deploy it.** The site address, canonical URLs, sitemap, robots.txt and structured data are all worked out automatically from your GitHub repository name.

---

## Deploy to GitHub Pages (no coding, no command line)

You need a free GitHub account. The repository must be **Public** (free GitHub Pages requires it).

### 1. Create the repository
1. Go to <https://github.com/new>.
2. **Repository name:** anything you like, for example `benjamin-anthony-panakal`.
   *(Tip: if you name it exactly `<your-username>.github.io`, the site lives at the cleanest address, `https://<your-username>.github.io/`.)*
3. Choose **Public**, then click **Create repository**.

### 2. Upload the project
1. Unzip `ben.zip` on your computer.
2. On the new empty repository page, click **uploading an existing file**.
3. Open the unzipped `benjamin-panakal` folder, select **everything inside it** (all files and folders, including the hidden-looking `.github` folder) and drag it into the browser.
   Upload the *contents*, not the ZIP and not the outer folder.
4. Wait for the upload to finish, then click **Commit changes**.

**Check:** in your repository you should now see `.github`, `public`, `scripts`, `src`, `package.json` and more. Open `.github` → `workflows` → `deploy.yml`.
If the `.github` folder is missing (some browsers skip it): click **Add file → Create new file**, type the name `.github/workflows/deploy.yml`, paste in the contents of `deploy-workflow-copy.yml` from this project, and commit.

### 3. Turn on GitHub Pages
1. In the repository open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.

### 4. Publish
1. Open the **Actions** tab. The *Deploy to GitHub Pages* workflow starts by itself after each upload (about 1–2 minutes).
2. If the first run shows a red ✗ because Pages was not switched on yet, open it and click **Re-run all jobs**.
3. When it turns green, your site is live at:
   - `https://<your-username>.github.io/<repository-name>/` or
   - `https://<your-username>.github.io/` if the repository is named `<your-username>.github.io`.

Every later change you commit to `main` redeploys automatically.

### Optional: use your own domain
1. In the repository go to **Settings → Secrets and variables → Actions → Variables → New repository variable**.
   Name: `SITE_URL`   Value: `https://your-domain.com` (no trailing slash).
2. In **Settings → Pages → Custom domain**, enter the same domain and follow GitHub's DNS instructions. Turn on **Enforce HTTPS**.
3. Re-run the workflow (Actions → *Deploy to GitHub Pages* → **Run workflow**).

All canonical URLs, sitemap entries, Open Graph tags and structured data switch to the new domain automatically.

---

## After it is live: get found on Google
1. Open [Google Search Console](https://search.google.com/search-console) and add your site as a **URL prefix** property (use the exact address of your site).
2. Verify ownership, then submit `sitemap.xml` under **Sitemaps** (for example `https://<your-username>.github.io/<repository-name>/sitemap.xml`).
3. Use **URL Inspection → Request indexing** for the home page.

> For the strongest SEO, use a user site (`<username>.github.io`) or a custom domain. Crawlers only read `robots.txt` at the very root of a domain, so on a project address (`.../<repository-name>/`) the sitemap should be submitted in Search Console, which the steps above already do.

---

## Adding real content later (optional)
The site only publishes facts that are verified. Today it publishes Home and Contact. Other sections (Biography, About, Background, Education, Achievements, Projects, Articles, Gallery) appear **automatically** as soon as you add real entries to **`src/data/content.ts`**. Edit it directly on GitHub (open the file → pencil icon → **Commit changes**) and the site redeploys.
More real profiles (LinkedIn, GitHub, etc.) can be added to `person.profiles` in `src/data/site.ts`; they feed the structured data and the footer.

Nothing is invented: a section with no entries has no page, no menu link, no sitemap entry and no structured data.

---

## Run it on your computer (optional)
Requires [Node.js](https://nodejs.org) **22.23.4 or newer** (works on Windows, macOS and Linux).

```bash
npm ci               # install exactly the locked versions
npm run dev          # live preview at http://localhost:4321
npm run build        # production build into dist/ + automatic SEO checks
npm run preview      # serve the built dist/ folder locally
```

| Command | What it does |
| --- | --- |
| `npm run build:preview` | Builds every page template with clearly labelled **sample** content (not indexable) so you can review the design. |
| `npm run status` | Shows which sections are live. |
| `npm run check` | Re-runs the SEO checks on `dist/`. |

On a local build the placeholder address `example.com` is used and a notice is shown. This is expected; GitHub sets the real address when it deploys.

To test a specific address locally — Windows PowerShell: `$env:SITE_URL="https://your-domain.com"; npm run build`   ·   Windows cmd: `set SITE_URL=https://your-domain.com && npm run build`   ·   macOS/Linux: `SITE_URL=https://your-domain.com npm run build`

## What the build checks automatically
Unique title, meta description and canonical URL on every page · exactly one `<h1>` · valid JSON-LD with no dangling `@id` references · sitemap and robots.txt match the production URL · every link, font and image carries the correct base path and exists · images have alt text and dimensions · no external scripts. A failed check stops the build, so a broken site is never published.

## Troubleshooting
- **Site looks unstyled or links 404:** the deployment was not built by GitHub Actions. Make sure **Settings → Pages → Source** is **GitHub Actions**.
- **Red ✗ in the Actions tab:** open the run and read the failing step. Pages not enabled yet → enable it and **Re-run all jobs**.
- **`npm ci` fails on your computer:** update Node.js to 22.23.4 or newer (`node -v` shows your version).

## Project layout
```
.github/workflows/deploy.yml   GitHub Pages deployment
site.config.mjs                auto-detects production URL + base path
astro.config.mjs               Astro configuration
src/data/content.ts            all verified content
src/data/site.ts               person facts, sections, URL helpers
src/lib/schema.ts              JSON-LD (Person, WebSite, ProfilePage, WebPage, BreadcrumbList)
src/pages/                     home, contact, section pages, 404, sitemap.xml, robots.txt
src/layouts/Base.astro         head metadata, header, footer
src/styles/global.css          monochrome design system
public/                        fonts, icons, social card
scripts/                       build checks and helpers
```
