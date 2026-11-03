# Rebuilds dist/ — the folder that gets deployed to Cloudflare Pages.
#
# dist/ is a copy of the site with the working files left out (README, DEPLOY,
# .claude, .wrangler, the build scripts themselves). It also gets a fresh
# cache-busting token stamped into index.html, so a deploy is visible straight
# away instead of hiding behind a cached stylesheet.
#
#   .\build.ps1

$ErrorActionPreference = 'Stop'

$root = $PSScriptRoot
$dist = Join-Path $root 'dist'

if (Test-Path $dist) { Remove-Item $dist -Recurse -Force }
New-Item -ItemType Directory -Path $dist | Out-Null

foreach ($f in 'index.html', 'robots.txt', 'sitemap.xml', '_headers') {
    Copy-Item (Join-Path $root $f) -Destination $dist
}
foreach ($d in 'css', 'js', 'assets') {
    Copy-Item (Join-Path $root $d) -Destination $dist -Recurse
}

# Stamp the version token. index.html in the repo keeps whatever token it has;
# only the deployed copy is rewritten, so every deploy is a new URL for the
# browser and it cannot serve you a stale styles.css or main.js.
$stamp = Get-Date -Format 'yyyyMMdd-HHmm'
$page  = Join-Path $dist 'index.html'

# Read and write through .NET with an explicit BOM-less UTF-8 encoder. Get-Content
# would decode this BOM-less file using the system ANSI codepage and turn every
# non-ASCII character into mojibake, and Set-Content -Encoding utf8 would add a BOM
# in front of <!DOCTYPE html>. Both are silent; neither is wanted.
$utf8  = New-Object System.Text.UTF8Encoding($false)
$html  = [System.IO.File]::ReadAllText($page, $utf8)
$html  = $html -replace '(styles\.css|main\.js)\?v=[^"]*', ('$1?v=' + $stamp)
[System.IO.File]::WriteAllText($page, $html, $utf8)

$count = (Get-ChildItem $dist -Recurse -File).Count
$size  = '{0:N1} MB' -f ((Get-ChildItem $dist -Recurse -File | Measure-Object Length -Sum).Sum / 1MB)
Write-Host "dist/ rebuilt - $count files, $size, version $stamp"
Write-Host ""
Write-Host "Deploy with:"
Write-Host "  npx.cmd wrangler pages deploy `"$dist`" --project-name=sixpro --branch=production"
