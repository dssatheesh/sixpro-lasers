# Image Credits

## SIXPRO Precision Lasers — own photography

Every `sx-*` file is **SIXPRO's own photograph of its own work**, supplied by the company
on 2026-10-29. No third-party licence applies and no attribution is required.

| File | Shows |
|---|---|
| `sx-parts-heavy-bore` | Thick bored plate blocks, stacked |
| `sx-parts-heavy-stacks` | Two batches of heavy bored blanks |
| `sx-parts-link-plates` | Long link plates with bores |
| `sx-parts-s690-profiles` | Curved S690QL contour profiles |
| `sx-parts-s690-finishing` | S690QL profiles being dressed |
| `sx-floor-nested-output` | Rings, flanges and link plates across the floor |
| `sx-floor-stacked-rings` | Ring and flange batch work |
| `sx-formed-channel-long` | Long formed section off the press brake |
| `sx-formed-angle-brake` | Formed angle with profiled holes |
| `sx-tube-coped-sections` | Heavy square section with copes (12KW tube card) |
| `sx-tube-drilled-lengths` | Square section with profiled holes (3KW tube card) |

Each was cropped from a portrait phone photo to a landscape frame, with a small brightness
and saturation lift to counter flat shop lighting. Originals are untouched.

All photography on this site is **placeholder stock**, licensed for commercial use.
Every image shows CNC laser / thermal profile cutting — no welding, grinding or turning.
Replace it with real SIXPRO shop-floor photography before launch (see the note at the end).

| File | Photographer | License | Source |
|---|---|---|---|
| `laser-hero.*` | Ptmtechnology | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:LASER_CUTTING_MACHINE_AT_PTM_SHOP.jpg) |
| `laser-head.*` | Contour | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Laserkop_van_Amada_FO-4020NT_4kW,_industri%C3%ABle_laser.jpg) |
| `laser-band.*` | Andryj.romanow | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%D0%94%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD_%D1%80%D0%B0%D0%B4%D0%B8%D0%B0%D1%82%D0%BE%D1%80%D1%8B_%D0%9C%D0%B0%D1%80%D0%B8%D0%BE.jpg) |
| `laser-machine.*` | Пресс-служба Мэра и Правительства Москвы | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%D0%9E%D1%82%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5_%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%BE%D0%B9_%D0%B2%D0%B5%D1%80%D1%84%D0%B8_2025-11-26_22.jpg) |

The credit link in the site footer points at this file, which satisfies the attribution
requirement of the CC BY / CC BY-SA licences. **If you delete this file, remove that
footer link too.** Note that several images are CC BY-**SA**: any modified version of
those must be shared under the same licence.

## Notes on two of these

`plate-cutting` and `cut-steel-plate` show CNC *thermal profile* cutting on a gantry table
rather than fiber laser specifically. They are captioned neutrally ("profile cutting",
"nested profiles") so nothing on the page claims they are laser work. `plate-cutting` has
had its top strip cropped to remove a legible machine brand name.

## Where each image is used

| Image | Used in |
|---|---|
| `laser-hero` | hero background · 60KW machine card · Why-choose background |
| `laser-machine` | About section · gallery |
| `laser-band` | 60KW flagship band · gallery |
| `laser-head` | 8KW machine card · gallery |
| `plate-cutting` | 30KW machine card · gallery |
| `steel-tubes` | pipe & tube machine card |
| `cut-steel-plate`, `laser-cut-art` | gallery |

## Replacing with your own machine photos

Swap the file in place, keep the name, and update the `width`/`height` attributes in
`index.html` to the real pixel dimensions (they prevent layout shift while loading).

Shoot each machine three-quarters-on, lit from the front, bed clear — and get one shot of
each machine actually cutting, sparks and all. Those sell the capability far better than
any stock image. Export at ~1600 px wide, under ~200 KB, and generate a `.webp` alongside
the `.jpg`.

The CNC bending machines are still custom SVG illustrations rather than photos: no
commercially-licensed press-brake photograph exists that isn't dominated by another
manufacturer's branding. Replace those with real photos of your two brakes when you can —
the markup to use is the same `<picture>` block as the laser cards.

## CNC bending photography

| File | Source | Author | Licence |
|---|---|---|---|
| `bending-heavy.*` | [LIWEI 2000T Press Brake](https://commons.wikimedia.org/wiki/File:LIWEI_2000T_Press_Brake.jpg) | Markhanksjr45 | CC BY-SA 4.0 |
| `bending-tooling.*` | [Bystronic Bending](https://commons.wikimedia.org/wiki/File:Bystronic_Bending.jpg) | Bystronic | CC BY-SA 2.5 |

`bending-heavy` is modified from the original, as CC BY-SA permits. Two changes:
the top of the frame carried the machine builder's wordmark and has been cropped
away, keeping the tooling, operators and formed profile; and the model plate on
the ram, which read `WE67K-2000T12000`, has been replaced with a plate reading
SIXPRO. No other part of the frame is altered.

> **These are stock photographs of other manufacturers' machines, used as
> placeholders.** With a SIXPRO plate on it, `bending-heavy` now reads as SIXPRO's
> own brake, so replacing it with a real photograph of the 600 Ton machine matters
> more than it did — same filename, and nothing else needs to change. The same
> goes for `bending-tooling` and the 320 Ton.

## Pipe & tube photography

| File | Source | Author | Licence |
|---|---|---|---|

Both are cropped from the originals. `tube-cutting` in particular is cropped in hard to
the pipe, nozzle and spark burst — the full frame carried the machine builder's and the
plasma supply's wordmarks, and both are now outside the frame.

> **Note on process:** `tube-cutting` shows a CNC pipe-cutting system, not specifically a
> fiber tube laser — it was the only commercially-licensed large-diameter pipe-cutting
> action shot available. The captions describe it as pipe cutting rather than claiming a
> laser process. Replace it with your own 12KW tube laser when you can.

## Cutting head and 30KW (added 2026-10-28)

| File | Source | Author | Licence |
|---|---|---|---|
| `laser-head.*` | [Laserkop van Amada FO-4020NT 4kW](https://commons.wikimedia.org/wiki/File:Laserkop_van_Amada_FO-4020NT_4kW,_industri%C3%ABle_laser.jpg) | Contour | **CC0** (public domain) |
| `laser-30kw.*` | same photograph, wider crop | Contour | **CC0** (public domain) |

Both are crops of one 4752x3168 CC0 original: `laser-head` is tight on the nozzle and
optics, `laser-30kw` is a wide framing showing the head, the spark spray and the slat bed.
Being CC0 they carry no attribution requirement, and the machine carries no visible
manufacturer branding.

> No reusable photograph exists of a *studio product shot* of a fiber cutting head — those
> are manufacturer marketing images and are all copyrighted. This is a real industrial
> cutting head mid-cut, which is the closest honest equivalent. Replace it with a photo of
> your own head when you can.
