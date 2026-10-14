#!/usr/bin/env python3
"""Draws the marks on the paper: scratches, hairs, dust, specks, stains.

The page background has two layers of small accidents over its grain,
like the dirt on old film or cheap newsprint. They are generated here
rather than drawn by hand so that no two marks are alike: every mark's
place, size, shape, weight and faintness is rolled at random.

Run it from the project folder to roll a fresh set:

    python3 scripts/paper-marks.py            # same marks as now
    python3 scripts/paper-marks.py 42         # a different set (any number)

It rewrites the two tokens --marks-fine and --marks-soft in
src/styles/tokens.css. Each is a small SVG written into the stylesheet,
so nothing extra is downloaded.
"""
import math
import random
import re
import sys
import urllib.parse

seed = int(sys.argv[1]) if len(sys.argv) > 1 else 1908
rnd = random.Random(seed)
INK = '#2B2622'


def n(x):
    """A number written as briefly as possible, to keep the file small."""
    return f'{x:.1f}'.rstrip('0').rstrip('.')


def blob(cx, cy, r, points=None, lump=0.55):
    """An uneven closed shape: a circle whose edge wanders in and out."""
    points = points or rnd.randint(5, 9)
    pts = []
    for i in range(points):
        a = math.tau * i / points + rnd.uniform(-0.3, 0.3)
        rr = r * rnd.uniform(1 - lump, 1 + lump)
        pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr))
    # Smooth through the points with quadratic curves (midpoint method).
    mids = [((pts[i][0] + pts[(i + 1) % points][0]) / 2, (pts[i][1] + pts[(i + 1) % points][1]) / 2) for i in range(points)]
    d = f'M{n(mids[-1][0])} {n(mids[-1][1])}'
    for i in range(points):
        d += f'Q{n(pts[i][0])} {n(pts[i][1])} {n(mids[i][0])} {n(mids[i][1])}'
    return d + 'Z'


def wander(x, y, angle, length, steps, drift):
    """A line that sets off in a direction and loses its way a little."""
    d = f'M{n(x)} {n(y)}'
    step = length / steps
    for _ in range(steps):
        angle += rnd.uniform(-drift, drift)
        x += math.cos(angle) * step
        y += math.sin(angle) * step
        d += f'L{n(x)} {n(y)}'
    return d


def fine_layer(W, H):
    """Sharp marks: scratches, hairs, dust, specks, splatters."""
    out = []
    inside = lambda m: (rnd.uniform(m, W - m), rnd.uniform(m, H - m))

    # Scratches. Some long and faint, some short and hard; some broken
    # into dashes where the point skipped; none quite straight.
    for _ in range(rnd.randint(7, 10)):
        x, y = inside(120)
        steep = rnd.random() < 0.6
        angle = math.radians(rnd.uniform(75, 105) if steep else rnd.uniform(0, 360))
        length = rnd.choice([rnd.uniform(12, 40), rnd.uniform(40, 110), rnd.uniform(110, 230)])
        width = rnd.choice([0.3, 0.4, 0.5, 0.7, 1.0])
        dash = ''
        if rnd.random() < 0.45:
            dash = f" stroke-dasharray='{' '.join(n(rnd.uniform(2, 40)) for _ in range(rnd.choice([2, 4, 6])))}'"
        d = wander(x, y, angle, length, rnd.randint(2, 6), rnd.uniform(0.02, 0.18))
        out.append(f"<path d='{d}' fill='none' stroke-width='{width}' opacity='{rnd.uniform(.08,.24):.2f}'{dash}/>")

    # Hairs and lint: thin lines that curl back on themselves.
    for _ in range(rnd.randint(5, 8)):
        x, y = inside(60)
        d = wander(x, y, rnd.uniform(0, math.tau), rnd.uniform(14, 70), rnd.randint(5, 9), rnd.uniform(0.5, 1.3))
        out.append(f"<path d='{d}' fill='none' stroke-width='{rnd.choice([.35,.45,.6])}' stroke-linejoin='round' opacity='{rnd.uniform(.10,.22):.2f}'/>")

    # Dust: small uneven lumps, each its own shape.
    for _ in range(rnd.randint(16, 22)):
        x, y = inside(20)
        out.append(f"<path d='{blob(x, y, rnd.uniform(.6, 2.6))}' opacity='{rnd.uniform(.10,.30):.2f}'/>")

    # Speck clusters: a pinch of fine dots that landed together.
    for _ in range(rnd.randint(4, 6)):
        cx, cy = inside(40)
        spread = rnd.uniform(5, 22)
        for _ in range(rnd.randint(3, 9)):
            out.append(
                f"<circle cx='{n(cx + rnd.gauss(0, spread))}' cy='{n(cy + rnd.gauss(0, spread))}' "
                f"r='{n(rnd.uniform(.3, 1.1))}' opacity='{rnd.uniform(.10,.28):.2f}'/>"
            )

    # Splatters: one drop with smaller ones thrown off to one side.
    for _ in range(rnd.randint(2, 3)):
        cx, cy = inside(60)
        out.append(f"<path d='{blob(cx, cy, rnd.uniform(2.5, 5), lump=.4)}' opacity='{rnd.uniform(.08,.16):.2f}'/>")
        throw = rnd.uniform(0, math.tau)
        for _ in range(rnd.randint(3, 7)):
            dist, a = rnd.uniform(6, 30), throw + rnd.uniform(-0.6, 0.6)
            out.append(f"<path d='{blob(cx + math.cos(a) * dist, cy + math.sin(a) * dist, rnd.uniform(.4, 1.6))}' opacity='{rnd.uniform(.08,.20):.2f}'/>")

    rnd.shuffle(out)
    # The filter pushes every edge about by a pixel or two according to a
    # cloud of noise, so even the "straight" scratches tremble.
    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{W}' height='{H}'>"
        f"<filter id='r' x='-5%' y='-5%' width='110%' height='110%'><feTurbulence type='fractalNoise' baseFrequency='.035' numOctaves='2' seed='{seed % 97}'/>"
        "<feDisplacementMap in='SourceGraphic' scale='5'/></filter>"
        f"<g filter='url(#r)' fill='{INK}' stroke='{INK}' stroke-linecap='round'>{''.join(out)}</g></svg>"
    )


def soft_layer(W, H):
    """Soft marks: stains, spills, rings and smudges, blurred and faint."""
    out = []
    inside = lambda m: (rnd.uniform(m, W - m), rnd.uniform(m, H - m))

    # Spills: large uneven patches, barely darker than the paper.
    for _ in range(rnd.randint(3, 5)):
        x, y = inside(90)
        out.append(f"<path d='{blob(x, y, rnd.uniform(14, 46), points=rnd.randint(7, 11), lump=.45)}' opacity='{rnd.uniform(.012,.03):.3f}'/>")

    # Rings: where a drop dried from the edge inward, or a cup stood.
    for _ in range(rnd.randint(1, 2)):
        x, y = inside(110)
        out.append(
            f"<path d='{blob(x, y, rnd.uniform(18, 52), points=rnd.randint(9, 12), lump=.12)}' fill='none' "
            f"stroke-width='{n(rnd.uniform(1, 2.6))}' stroke-dasharray='{n(rnd.uniform(40,160))} {n(rnd.uniform(6,60))}' opacity='{rnd.uniform(.03,.06):.3f}'/>"
        )

    # Smudges: a thumb dragged across, wider than it is tall.
    for _ in range(rnd.randint(2, 4)):
        x, y = inside(70)
        rx, ry, turn = rnd.uniform(10, 34), rnd.uniform(2, 7), rnd.uniform(0, 180)
        out.append(f"<ellipse cx='{n(x)}' cy='{n(y)}' rx='{n(rx)}' ry='{n(ry)}' transform='rotate({n(turn)} {n(x)} {n(y)})' opacity='{rnd.uniform(.018,.04):.3f}'/>")

    # Drips: small soft dots, like a fine spray.
    for _ in range(rnd.randint(8, 14)):
        x, y = inside(30)
        out.append(f"<path d='{blob(x, y, rnd.uniform(2, 6), lump=.35)}' opacity='{rnd.uniform(.02,.05):.3f}'/>")

    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{W}' height='{H}'>"
        f"<filter id='s' x='-10%' y='-10%' width='120%' height='120%'><feTurbulence type='fractalNoise' baseFrequency='.02' numOctaves='2' seed='{(seed * 7) % 89}'/>"
        "<feDisplacementMap in='SourceGraphic' scale='14'/><feGaussianBlur stdDeviation='2.2'/></filter>"
        f"<g filter='url(#s)' fill='{INK}' stroke='{INK}'>{''.join(out)}</g></svg>"
    )


def as_url(svg):
    return 'data:image/svg+xml,' + urllib.parse.quote(svg, safe="/:=' ,.()")


# Two tiles of different sizes, neither a multiple of the other or of the
# grain's, so the three layers drift out of step and the eye finds no
# repeat for several screens in any direction.
tokens = {'--marks-fine': as_url(fine_layer(1100, 1370)), '--marks-soft': as_url(soft_layer(830, 1010))}

path = 'src/styles/tokens.css'
css = open(path).read()
for name, url in tokens.items():
    css, count = re.subn(rf'({re.escape(name)}: url\(")[^"]*("\);)', lambda m: m.group(1) + url + m.group(2), css)
    if count != 1:
        sys.exit(f'Could not find {name} in {path}.')
open(path, 'w').write(css)
print(f'seed {seed}:', ', '.join(f'{name} {len(url)} bytes' for name, url in tokens.items()))
