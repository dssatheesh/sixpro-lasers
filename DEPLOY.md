# Deploying sixprolasers.com

The site is plain HTML/CSS/JS — no build step, no server code. You upload the folder and
it runs. Total payload is ~3.1 MB across 32 files.

## What we already know about your domain

Checked live on 2026-09-07:

| Record | Current value | Meaning |
|---|---|---|
| Nameservers | `jo.ns.cloudflare.com`, `koa.ns.cloudflare.com` | **DNS is already managed in Cloudflare** |
| MX | `aspmx.l.google.com` (+ alt1–4) | Email runs on **Google Workspace** |
| TXT | Google SPF + site verification | Mail authentication is set up |
| A / AAAA / CNAME | **none** | **No website exists yet** — the web side is empty |

You own the domain and it is already on Cloudflare, so Cloudflare Pages is the path of
least resistance: same login, no nameserver changes, DNS records created for you.

> **Your email is safe.** A website uses `A`/`CNAME` records. Email uses `MX` records.
> Adding the first does not touch the second — Google Workspace keeps working throughout.

---

## Recommended: Cloudflare Pages (free)

Free, unlimited bandwidth, automatic HTTPS, and Cloudflare has data centres in Bengaluru,
Chennai, Mumbai, Hyderabad and Delhi — so the site loads fast for Indian customers.

### Step 1 — Deploy (command line — do it this way)

The dashboard keeps steering static uploads into the *Workers* flow, which asks for bindings
and build settings a static site does not have. The CLI skips all of that and creates a
proper Pages project. Verified on this machine: Node 24.18.0, npm 11.16.0, wrangler 4.129.0.

Open **PowerShell**, not Command Prompt, and run three commands.

> In `cmd.exe` a plain `cd` does NOT change drives - it stays on C: and wrangler then
> reports `ENOENT ... 'C:\Users\<you>\dist'`. In cmd use `cd /d` instead.

```powershell
cd "E:SIXPRO_DesktopAPP"

npx wrangler login
# A browser tab opens. Sign in to the Cloudflare account that manages
# sixprolasers.com and click "Allow". Close the tab when it says success.

npx wrangler pages deploy dist --project-name=sixpro --branch=production
```

On the very first run wrangler asks two questions:

- *"The project you specified does not exist. Would you like to create it?"* → **Create a new project**
- *"Enter the production branch name:"* → press **Enter** to accept `production`

It then uploads the files and prints a URL like `https://sixpro.pages.dev` — open it and
confirm the site loads.

> **Always pass `--branch=production`.** This folder is not a git repository, so without it
> wrangler can label a deploy as a preview: it uploads fine and gives you a working URL, but
> the live domain never changes and it looks as though your edits did not publish.

**Upload `dist`, never the project root.** `dist/` holds only what should be public. The root
also contains `.claude/`, `README.md` and `DEPLOY.md`, which would end up readable at
`sixprolasers.com/README.md`.

**To publish changes later**, rebuild `dist` and re-run the same deploy command:

```powershell
cd "E:SIXPRO_DesktopAPP"
Remove-Item -Recurse -Force dist; New-Item -ItemType Directory dist | Out-Null
Copy-Item index.html,robots.txt,sitemap.xml,_headers dist
Copy-Item -Recurse css,js,assets dist
npx wrangler pages deploy dist --project-name=sixpro --branch=production
```

#### Troubleshooting

| Symptom | Cause and fix |
|---|---|
| `wrangler login` hangs | Copy the URL it printed into a browser manually. |
| Logged into the wrong account | `npx wrangler logout` then `npx wrangler login` again. |
| `Project not found` | The first deploy creates it. Keep `--project-name=sixpro` identical every time. |
| Asks for a build command | You are in the Workers flow, not Pages. The command above cannot be — it says `pages deploy`. |
| `npx` not recognised | Install Node LTS from <https://nodejs.org>, reopen PowerShell. |
| `ENOENT ... C:\Users\...\dist` | You are in cmd.exe on the C: drive. Use `cd /d "E:\SIXPRO_DesktopAPP"`, or pass an absolute path to the folder. |

#### Dashboard alternative

Only if you prefer clicking: **Compute → Workers & Pages → Create application → `Pages` tab
→ Upload assets** → name `sixpro` → drag the `dist` folder → **Deploy site**. The `Pages`
tab is the part people miss; the default tab builds a Worker.

### Step 2 — Point your domain at it (the CNAME)

Your DNS is already in Cloudflare, so the easiest route is to let Pages create the record:

1. In the Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter `www.sixprolasers.com` → **Continue** → **Activate domain**.
   Cloudflare detects the zone in the same account and writes the CNAME for you.
3. Repeat for `sixprolasers.com` so the bare domain resolves too.

Certificates are issued automatically — usually a minute or two, occasionally up to 15.

#### If you would rather add the records by hand

DNS → **Records** → **Add record**, replacing `sixpro` with your actual Pages project name:

| Type | Name | Target | Proxy | TTL |
|---|---|---|---|---|
| CNAME | `www` | `sixpro.pages.dev` | **Proxied** (orange cloud) | Auto |
| CNAME | `@` | `sixpro.pages.dev` | **Proxied** (orange cloud) | Auto |

The `@` row is the apex (`sixprolasers.com` with no prefix). A CNAME at the apex is
normally illegal in DNS — Cloudflare allows it via CNAME flattening, but **only while the
record is proxied**, so the orange cloud must stay on.

#### Send the apex to www

The site canonicalises to `https://www.sixprolasers.com/`, so redirect the bare domain to
it. Cloudflare Pages' `_redirects` file matches paths only and cannot do host redirects, so
use a Redirect Rule instead (free on all plans):

**Rules → Redirect Rules → Create rule**

- Field `Hostname` — Operator `equals` — Value `sixprolasers.com`
- Then: **Dynamic** redirect, Status **301**
- Expression: `concat("https://www.sixprolasers.com", http.request.uri.path)`
- Tick **Preserve query string**

#### ⚠️ Your email is not affected

Website traffic uses `CNAME`/`A` records. Google Workspace uses `MX` records, which are
separate rows you are not touching. Leave the existing `MX`, `SPF` (`v=spf1 include:_spf.google.com`)
and `google-site-verification` records exactly as they are and mail keeps flowing.

### Step 3 — Activate the RFQ form from the live domain

FormSubmit activates **per origin**, so this must be done from the real domain:

1. Open `https://www.sixprolasers.com`, fill in the RFQ form, submit.
2. Open **marketing@sixprolasers.com** and click **Activate Form** in the FormSubmit email.
3. Submit once more — the enquiry should arrive.

Until that is done the form falls back to opening the visitor's mail client, so nothing is
lost. See README section 2.

### Step 4 — Tell Google the site exists

1. <https://search.google.com/search-console> → add `sixprolasers.com`.
   Verification is easy: the domain already carries a Google verification TXT record.
2. Submit `https://www.sixprolasers.com/sitemap.xml`.
3. Create a Google Business Profile for the Peenya unit so the map listing shows SIXPRO
   rather than a neighbouring business.

---

## What to upload

Everything except the development files:

```
UPLOAD                          SKIP
  index.html                      node_modules/    (if present)
  css/styles.css                  .claude/
  js/main.js                      README.md
  robots.txt                      DEPLOY.md
  sitemap.xml
  assets/sixpro-mark.png, sixpro-mark.webp
  assets/favicon-64.png, apple-touch-icon.png
  assets/img/*.webp  *.jpg
  assets/img/CREDITS.md         <- keep: the footer links to it
  _headers                      <- keep: Cloudflare Pages reads it
```

`assets/img/CREDITS.md` must be uploaded — the footer credit link points at it, and the
Creative Commons licences on the stock photography require attribution to stay reachable.

---

## What `_headers` does

`_headers` is read by Cloudflare Pages and never served to visitors. It sets:

- **Security headers** — `nosniff`, `Referrer-Policy`, `X-Frame-Options`, a
  `Permissions-Policy` that switches off camera/mic/geolocation, and a Content Security
  Policy scoped to exactly what the page uses: Google Fonts, the Google Maps iframe, and
  the FormSubmit endpoint. Verified against the live page — no violations, fonts, map,
  images and the RFQ POST all work.
- **Caching that will not strand your visitors.** Filenames here are stable rather than
  content-hashed, so a year-long cache would leave returning visitors on an old copy after
  every edit. Instead: HTML always revalidates, CSS/JS cache for an hour, and photography
  caches for a day then serves stale-while-revalidate for a week.

If you swap in your own machine photos and want them live immediately rather than within a
day, purge the cache: Cloudflare dashboard → **Caching** → **Configuration** →
**Purge Everything**.

---

## Updating the site later

Cloudflare Pages → your project → **Create deployment** → drag the folder again. Each
deployment is versioned, and you can roll back to any previous one with one click.

If you would rather push changes with Git, put the folder in a GitHub repo and connect it
under **Workers & Pages → Create → Pages → Connect to Git**; every push then deploys
automatically.

---

## Alternatives

| Host | Free tier | Why you might pick it |
|---|---|---|
| **Cloudflare Pages** | Unlimited bandwidth | DNS already here; fastest India routing. **Recommended.** |
| **Netlify** | 100 GB/mo, 100 form submissions/mo | Has **built-in forms** — would replace FormSubmit entirely and remove the per-origin activation problem. Needs one CNAME added in Cloudflare. |
| **GitHub Pages** | Unlimited public repos | Fine, but no form handling and a slower first byte from India. |
| **Indian shared hosting** (Hostinger, BigRock) | Paid, ~₹200–500/mo | Only worth it if you later need PHP, a CMS, or business email in one panel. Overkill for a static site. |

**Avoid Vercel's free Hobby plan** — its terms exclude commercial use, and this is a
company website.

If you want to drop the FormSubmit dependency, say so and I will switch the form to Netlify
Forms; it is a small change and removes the activation step for good.

## After a deploy, nothing looks different

The files are almost certainly live — check before re-deploying:

```bash
curl -s https://www.sixprolasers.com/css/styles.css | wc -c   # compare to your local file
```

If the byte counts match, the deploy worked and you are looking at a cached copy.

**Why it happens.** The HTML is sent with `max-age=0, must-revalidate`, so it is always
rechecked. CSS and JS are not — the edge serves them with a multi-hour `max-age`, and a
browser that already holds a copy will not even ask for a new one until that expires. You
get the new HTML with the old stylesheet, which usually looks like "nothing changed".

**The fix that is already in place.** `index.html` loads them with a version token:

```html
<link rel="stylesheet" href="css/styles.css?v=20261029-1">
<script src="js/main.js?v=20261029-1" defer></script>
```

Because the HTML is never cached, a new token is seen immediately, and a new token is a new
URL, so the browser has to fetch it. **Bump both tokens whenever you change `styles.css` or
`main.js`** — any new value works; the date plus a counter is easy to read.

**Photographs** are a separate case. They are cached for a day and may be served stale for
up to a week after that. If you replace an image and keep the filename, purge the cache:
Cloudflare dashboard → your domain → **Caching** → **Configuration** → **Purge Everything**.

**To check what a first-time visitor sees**, open the site in a private window — that skips
your own browser cache entirely. A hard reload (Ctrl+Shift+R) does the same for one page.
