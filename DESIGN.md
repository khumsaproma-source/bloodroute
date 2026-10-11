# Design Brief

## Direction

Clinical Calm — a hospital-grade blood-route console: precise, reassuring, information-dense but never sterile or cold.

## Tone

Refined clinical minimalism — a calm neutral canvas with a single crimson accent for blood and urgency, executed with conviction.

## Differentiation

Route distance and ETA read as instrument-grade telemetry: monospace numerals, a crimson flow-path on the map, and pill status chips — it looks like medical logistics, not a travel app.

## Color Palette

| Token      | OKLCH       | Role                                          |
| ---------- | ----------- | --------------------------------------------- |
| background | 0.98 0.006 240 | Cool clinical off-white canvas            |
| foreground | 0.22 0.02 255  | Deep slate ink for text                    |
| card       | 1 0.002 240    | Bright white elevated surfaces             |
| primary    | 0.5 0.2 22     | Crimson — blood, CTAs, active route        |
| accent     | 0.6 0.11 195   | Teal — trust, secondary actions, map calm  |
| muted      | 0.95 0.01 240  | Neutral panels, inactive chips             |
| destructive| 0.52 0.22 25   | Shortage alert (distinct from primary)     |
| success    | 0.58 0.14 155  | Delivered / sufficient stock               |
| warning    | 0.72 0.15 78   | Low stock, caution                         |

## Typography

- Display: Space Grotesk — headings, distances, numbers (Latin).
- Body: Figtree — UI labels and paragraphs (Latin).
- Thai: Noto Sans Thai — all Thai text (loaded via Google Fonts, falls back gracefully).
- Mono: JetBrains Mono — units, coordinates, tabular data.
- Scale: hero `text-4xl md:text-6xl font-bold tracking-tight`, h2 `text-2xl md:text-3xl font-bold`, label `text-xs font-semibold tracking-widest uppercase`, body `text-base`.

## Elevation & Depth

White cards float on a cool off-white canvas with layered soft slate shadows; the primary CTA alone carries a crimson-tinted shadow as a focal signal.

## Structural Zones

| Zone    | Background        | Border    | Notes                                          |
| ------- | ----------------- | --------- | ---------------------------------------------- |
| Header  | `bg-card`         | `border-b`| Sticky top bar: brand mark, user menu          |
| Content | `bg-background`   | —         | Map dominant; alternate `bg-muted/40` panels   |
| Sidebar | `bg-sidebar`      | `border-r`| Route form + saved requests, cool neutral      |
| Footer  | `bg-muted/40`     | `border-t`| Legend: blood groups, stock status             |

## Spacing & Rhythm

Generous section gaps (`gap-6 md:gap-8`), tight grouping inside forms (`space-y-3`), 4px base unit; map and sidebar share a 2-column grid on desktop, stack on mobile.

## Component Patterns

- Buttons: `rounded-lg`, primary = crimson gradient, secondary = teal outline, hover lifts with `shadow-elevated`.
- Cards: `rounded-xl`, `bg-card`, `border-border`, `shadow-sm`; hover → `shadow-elevated`.
- Badges: full pills, blood-group chips crimson-tinted, status chips tinted success/warning/destructive.

## Motion

- Entrance: `animate-fade-in` 0.4s, staggered `animate-slide-up` for result panels.
- Hover: `transition-smooth` 0.3s lift + shadow.
- Decorative: `animate-pulse-route` on active route marker; `animate-flow-dash` on the route polyline.

## Constraints

- Thai UI strings throughout; Thai font must load before Latin fallback.
- Tokens only — no hex/rgb literals in components.
- Map overlays (dialogs, popups) must sit above Leaflet panes.
- No email notifications or monthly reports (out of scope).

## Signature Detail

The animated crimson flow-dash route polyline with monospace distance/ETA telemetry — a medical logistics instrument signature.
