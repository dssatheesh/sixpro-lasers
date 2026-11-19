#!/usr/bin/env bash
# Rebuilds dist/ — the folder that gets deployed to Cloudflare Pages.
#
# dist/ is a copy of the site with the working files left out (README, DEPLOY,
# .claude, .wrangler, the build scripts themselves). It also gets a fresh
# cache-busting token stamped into index.html, so a deploy is visible straight
# away instead of hiding behind a cached stylesheet.
#
#   ./build.sh
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
dist="$root/dist"

rm -rf "$dist"
mkdir -p "$dist"

cp "$root/index.html" "$root/robots.txt" "$root/sitemap.xml" "$root/_headers" "$dist/"
cp -r "$root/css" "$root/js" "$root/assets" "$dist/"

# Google Search Console ownership file(s), e.g. google1234abcd.html.
# Must stay at the site root and must not be deleted, or verification lapses.
for g in "$root"/google*.html; do [ -f "$g" ] && cp "$g" "$dist/"; done

# Stamp the version token. index.html in the repo keeps whatever token it has;
# only the deployed copy is rewritten, so every deploy is a new URL for the
# browser and it cannot serve you a stale styles.css or main.js.
stamp="$(date +%Y%m%d-%H%M)"
perl -pi -e "s/(styles\.css|main\.js)\?v=[^\"]*/\$1?v=$stamp/g" "$dist/index.html"

count="$(find "$dist" -type f | wc -l | tr -d ' ')"
size="$(du -sh "$dist" | cut -f1)"
echo "dist/ rebuilt - $count files, $size, version $stamp"
echo
echo "Deploy with:"
echo "  npx wrangler pages deploy \"$dist\" --project-name=sixpro --branch=production"
