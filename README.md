# SIXPRO Precision Lasers — Website

A static, dependency-free marketing site for SIXPRO Precision Lasers: CNC fiber laser
cutting and precision metal fabrication, built around the milestone of operating **India's
first 60KW fiber laser**.

No build step, no framework, no npm install. Three files do the work.

```
index.html          all content and structured data
css/styles.css      design system + responsive layouts
js/main.js          config, animations, gallery, RFQ form
assets/img/         optimised photography (WebP + JPEG fallback)
assets/sixpro-mark.png/.webp, favicon-64.png, apple-touch-icon.png
robots.txt, sitemap.xml
```

## Run it

Open `index.html` directly, or serve it (needed for the map iframe to behave):

```bash
npx serve .          # or: python -m http.server 8080
```

## ⚠️ Before you go live

Open the browser console on localhost — it prints the outstanding list every time
you load the page.

### 1. Contact details — done ✅

Taken from your pamphlet and already live. It all lives in one place: the `SITE` object at
the top of [`js/main.js`](js/main.js). Edit it there and the top bar, contact block, footer,
Google Map and RFQ destination update together.

```js
const SITE = {
  address: [
    'SIXPRO PRECISION LASERS',
    'Plot No. V30, Property No. 1/V-(30)(AB)',
    'Near SS Weigh Bridge, Chokkasandra',
    'Peenya 2nd Stage, Industrial Area',
    'Bengaluru – 560058, Karnataka, India'
  ],
  phone:     '+91 95385 95335',
  phoneDial: '+919538595335',
  email:     'MARKETING@SIXPROLASERS.COM',   // shown in top bar / footer
  rfqEmail:  'marketing@sixprolasers.com',   // where quote requests are sent
  emails: [
    { label: 'Managing Director', addr: 'SATHEESH_MD@SIXPROLASERS.COM' },
    { label: 'Design',            addr: 'DESIGNS@SIXPROLASERS.COM' },
    { label: 'Marketing',         addr: 'MARKETING@SIXPROLASERS.COM' },
    { label: 'Accounts',          addr: 'ACCOUNTS@SIXPROLASERS.COM' }
  ],
  parent: {
    name:  'YNSK LASER TECH',            // footer: "A group company of …"
    group: 'YNSK Group of Companies',   // header strip: "Powered by …"
    url:   'https://www.ynsklaser.in'
  },
  mapQuery: '13.0157139,77.5017304',                        // exact pin
  mapLink:  'https://maps.app.goo.gl/Wui1opSepR8peHcM9',    // "Open in Google Maps"
  social:   { linkedin: '', facebook: '', instagram: '', youtube: '' }
};
```

Quote requests go to `rfqEmail` (**marketing@sixprolasers.com**), kept separate from the
display `email` so changing the address shown in the top bar can never silently redirect
incoming enquiries.

All four departmental inboxes are listed in the contact block. The map needs no API key —
`mapQuery` holds coordinates rather than a text search so the pin lands on the unit itself
rather than Google guessing from the street address.
Empty `social` entries remove that icon automatically.

The `LocalBusiness` JSON-LD block at the bottom of `index.html` carries its own copy of the
address and phone for search engines — already updated, but keep it in sync if you edit above.

### 2. RFQ form delivery — needs activation FROM THE LIVE DOMAIN ⚠️

The form POSTs to [FormSubmit](https://formsubmit.co), which forwards submissions to
**marketing@sixprolasers.com**. No backend, no account, no API key.

```js
const ENDPOINT = 'https://formsubmit.co/ajax/marketing@sixprolasers.com';
```

**Two rules that are easy to trip over — both confirmed against the live endpoint:**

1. **It never works from a `file://` page.** Opening `index.html` straight off disk sends no
   `Referer` header, and FormSubmit replies:
   *"Make sure you open this page through a web server, FormSubmit will not work in pages
   browsed as HTML files."* Serve the site (`npx serve .`) or deploy it.

2. **Activation is per ORIGIN, not just per address.** Clicking the activation link once does
   not cover every URL the form is served from. `localhost`, a staging URL and the live
   domain each trigger their own activation email on first submission.

So the sequence that actually makes it live:

1. Deploy to the real domain.
2. Submit the form once from that domain.
3. Open marketing@sixprolasers.com, click **Activate Form** in the FormSubmit email.
4. Submit once more — it now delivers, and keeps delivering.

**Nothing is ever lost while this is pending.** Any rejection or network failure falls back to
opening the visitor's mail client with the whole enquiry pre-filled and addressed, and the
real reason is logged to the browser console verbatim, e.g.:

```
SIXPRO — the RFQ endpoint refused this submission.
FormSubmit said: This form needs Activation. We've sent you an email...
```

| Situation | What the visitor gets |
|---|---|
| Delivered | "Thank you — your request has been sent to our team." Form clears. |
| Awaiting activation / wrong origin | Mail client opens with the enquiry ready to send. Real reason in console. |
| Opened as a `file://` page | Same fallback, plus a console note to serve the site. |
| Network failure or 12 s timeout | Same fallback. Button never hangs. |

**Spam:** an off-screen `_honey` honeypot catches bots; FormSubmit drops anything that
arrives with it filled. Its own captcha is off (`_captcha=false`) so real visitors aren't
challenged.

**Optional hardening:** the activation email contains a random alias endpoint
(`formsubmit.co/ajax/<random-string>`). Using it keeps the inbox out of the page source —
though the address is already published in the contact block and footer.

Enquiry data passes through FormSubmit's servers. To move off it, swap `ENDPOINT` for
Formspree, Web3Forms or your own handler — the code posts plain `FormData`, so any of them
work unchanged. `ENDPOINT = ''` reverts to mail-client-only.

### 3. Replace the stock photography with your own

Every photo on the site is commercially-licensed CNC laser-cutting stock — no welding,
grinding or turning imagery anywhere. It is good placeholder material, but photos of *your*
floor will sell the 60KW far better.

Swap each file in place, keep the filename, and update the `width`/`height` attributes in
`index.html` to the real pixel dimensions. [`assets/img/CREDITS.md`](assets/img/CREDITS.md)
lists every image, its licence, and exactly where each one is used.

The three tiles in the **About showcase strip** reuse `laser-head`, `laser-hero` and
`laser-machine`, which also appear in the gallery — so replacing those three filenames
updates both places at once.

Both **CNC bending** cards use real press-brake photography. No commercially-licensed
press-brake photo exists that is free of another manufacturer's branding, so
`bending-heavy` is cropped to remove the builder's wordmark and its model plate has
been repainted to read SIXPRO — see `CREDITS.md`. Because that plate now puts your
name on a machine that is not yours, these two especially deserve replacing with
photos of your own 600 Ton and 320 Ton brakes.

### 4. Testimonials — done ✅

All three quotes are now attributed to named customers: Girish (Ganesh Fabtech),
Prasanan Chetty (Essar CNC) and Pramood K R. (Honey Comb International Inc.),
each the owner of their company. Worth confirming each of them is happy to be
named publicly before launch, since the attribution is now real rather than generic.

### 5. Certifications

The certifications grid is marked "to be confirmed". List what SIXPRO actually holds
(ISO 9001 etc.), or delete the `#certifications` section and its nav/footer links.

## Brand assets

The SIXPRO mark is **vector**, redrawn from the supplied logo — chrome shield, S ribbon,
and the red/blue lens flare. Vector means it stays sharp at any size, weighs a few KB, and
needs no image request.

| Where | What |
|---|---|
| `assets/sixpro-mark.png` + `.webp` | the logo emblem (256 px, rounded), used by the nav and footer |
| `assets/logo-sixpro.svg` | previous shield lockup, kept for reference; no longer used on the site |
| `assets/favicon-64.png`, `assets/apple-touch-icon.png` | browser-tab and phone home-screen icons, from the same logo |

The wordmark in the nav and footer is live text styled with a chrome gradient
(`.brand__text strong` in `css/styles.css`), not an image — so it stays selectable,
searchable and crisp.

**To use the original raster instead**, save it as `assets/img/logo.png` and replace the
`<svg class="brand__mark">…</svg>` in the nav and footer with:

```html
<img class="brand__mark" src="assets/img/logo.png" alt="SIXPRO Precision Lasers" width="40" height="42">
```

If you use the full-lockup raster, also delete the neighbouring `<span class="brand__text">`
block so the wordmark isn't duplicated.

> **Palette note:** the logo's accents are red and blue; the site's accent is laser amber,
> chosen to match the spark photography. The mark is small enough that they coexist
> comfortably. If you'd rather the whole site follow the logo, change `--amber`, `--amber-2`
> and `--grad` at the top of `css/styles.css` — every button, bar and heading accent
> derives from those three.

## What's included

**Sections** — Hero · Stats · About (+ 60KW showcase strip) · 60KW Flagship · Our Machines (60/30/8KW flat-sheet,
3KW & 12KW pipe & tube) · CNC Bending (600T & 320T) ·
Material Capacities · Industries Served · Why SIXPRO · Gallery · Testimonials ·
Certifications · RFQ + Contact + Map · Footer

**Behaviour** — sticky nav with scroll spy, mobile drawer, scroll-reveal animations,
animated counters, material capacity bars, keyboard-accessible gallery lightbox, validating
RFQ form, lazy-loaded map, back-to-top.

**Performance** — every image ships as WebP with a JPEG fallback; the largest is 188 KB and
the full WebP payload is about 1223 KB across the whole page. Only the hero (165 KB)
preloads; everything else is `loading="lazy"`. No JS dependencies at all.

**SEO** — semantic headings, meta description and keywords, canonical URL, Open Graph and
Twitter cards, `LocalBusiness` JSON-LD with the service list, `robots.txt` and
`sitemap.xml`. Update the `https://www.sixprolasers.com/` URLs in `index.html`,
`robots.txt` and `sitemap.xml` if the real domain differs.

**Accessibility** — skip link, visible focus rings, ARIA on the menu and lightbox, alt text
throughout, and a full `prefers-reduced-motion` path that disables every animation.

## Editing content

Machine specs, capacities and copy are plain HTML in `index.html` — each section is marked
with a comment banner. The material cards carry their own colours and bar length:

```html
<article class="matcard" style="--m1:#8E9AA8;--m2:#5A6675" data-max="80">
  ...
  <span class="matcard__n" data-count="80">0</span>   <!-- counter target -->
  <span class="bar__fill" style="--pct:100%"></span>  <!-- bar length -->
</article>
```

### Plate thickness on the gallery tiles

Each photo of our own work carries an amber thickness chip. The value lives in one place —
the `<span class="gal__thk">` inside that tile's `<figure>` in `index.html`. Edit the text,
and both the chip and the lightbox caption follow it. Delete the span to drop the chip.

Four of the nine are read straight off the steel in the photograph:

| Tile | Thickness | Read from |
|---|---|---|
| `sx-parts-s690-finishing` | 30 mm | part marked `7668_A_30T_S690QL` |
| `sx-parts-s690-profiles`  | 30 mm | same marking, plus a `STRENX 700` stencil |
| `sx-floor-nested-output`  | 15 mm | rings marked `152_B_15T`, `S690QL` |
| `sx-parts-heavy-stacks`   | 50 mm | partly legible `50 T` on the flat part |

The other five — `sx-parts-heavy-bore` (50), `sx-parts-link-plates` (20),
`sx-formed-angle-brake` (16), `sx-floor-stacked-rings` (12) and
`sx-formed-channel-long` (10) — are **estimates read off the photographs**, not measured.
`sx-parts-heavy-bore` is the same job as `sx-parts-heavy-stacks`, so it is on firm ground;
the rest are judgement. Confirm them against the job cards before launch — a thickness is a
capability claim a fabrication buyer will hold you to.

The two pipe & tube photos carry no chip: wall thickness is a different spec and nothing
legible in those frames gives it.

### Parent company

The brand lockup carries a third line under the wordmark — **Powered by YNSK GROUP OF
COMPANIES**, the group name picked out in amber and linking to `SITE.parent.url`. It sits
inside `.brandbox` beside the logo rather than in the nav row, so it costs the navigation
no horizontal space at any width. The footer separately reads *A group company of
YNSK LASER TECH*.
Both come from `SITE.parent` — `group` drives the header, `name` the footer.

Brand colours, spacing and fonts are CSS custom properties at the top of `css/styles.css`.

## Working across machines

The repo holds the *source*. `dist/` — the folder that actually gets deployed — is
generated, and is deliberately not committed, so the photographs are stored once rather
than twice.

### Set up on a new machine

```bash
git clone https://github.com/<your-username>/sixpro-lasers.git
cd sixpro-lasers
```

Then tell git who you are on that machine, if you have not already:

```bash
git config --global user.name  "Your Name"
git config --global user.email "you@example.com"
```

Nothing else to install. There is no `npm install`, no build toolchain — open `index.html`
in a browser, or serve the folder with `npx serve .` if you want the map iframe to behave.

### The everyday loop

```bash
git pull                 # take whatever the other machine pushed
#  ... edit index.html / css / js / assets ...
./build.ps1              # Windows   — regenerates dist/, stamps a fresh cache token
./build.sh               # macOS/Linux — same thing
git add -A
git commit -m "what changed"
git push
```

Then deploy `dist/` as usual — see [`DEPLOY.md`](DEPLOY.md).

**Pull before you start, push before you stop.** That one habit is what keeps two machines
from diverging. If you forget and both ends have changes, `git pull` will ask you to merge;
nothing is lost either way.

### What the build scripts do

They copy the site into `dist/`, leaving out the working files (`README.md`, `DEPLOY.md`,
`.claude/`, `.wrangler/`, the scripts themselves), and stamp a fresh `?v=` token onto the
`styles.css` and `main.js` links in the deployed copy. That token is what stops a returning
visitor being served a cached stylesheet after you deploy — see the cache section in
`DEPLOY.md`. `index.html` in the repo is left alone, so the token never shows up as a
spurious change in `git status`.

### What is deliberately not committed

| Path | Why |
|---|---|
| `dist/` | Generated. Rebuild it with `build.ps1` / `build.sh`. |
| `.wrangler/` | Wrangler's local cache — holds your Cloudflare account id. |
| `.claude/settings.local.json` | Per-machine tool permissions. |

`.gitattributes` normalises line endings to LF inside the repo, so a file edited on Windows
and then on macOS does not come back looking entirely rewritten.

## Deploying

Run `.uild.ps1` (Windows) or `./build.sh` (macOS/Linux) first — it regenerates `dist/`
and stamps a fresh cache-busting token. Then deploy `dist/`.

It is a static site — any host works. Netlify, Vercel, Cloudflare Pages or GitHub Pages:
drop the folder in, no build command, publish directory `.`.
