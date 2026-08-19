# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start the Turbopack dev server (defaults to port 3000, falls back to 3001 if occupied)
- `npm run build` — production build (also type-checks via `tsc` as part of the build)
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config extending `eslint-config-next` core-web-vitals + typescript)
- No test suite is configured in this repo yet.

### Database (Prisma + SQLite)

- `npx prisma migrate dev --name <name>` — create and apply a migration in development
- `npx prisma generate` — regenerate the Prisma Client; **must be run manually after every `schema.prisma` change** (not automatic, and not run automatically by `migrate dev` either). **Restart `npm run dev` afterwards**: `src/lib/prisma.ts` caches the client on `globalThis` in development, so a running dev server keeps serving the pre-`generate` `PrismaClient` instance even after HMR reloads the regenerated files. The symptom is a server-side `Cannot read properties of undefined (reading 'findMany')` on the newly added model, while `npm run build` succeeds — a stale process, not a code bug.
- `npx prisma db seed` — run `prisma/seed.ts`; also not automatic, run explicitly after resetting/seeding data
- `npx prisma studio` — browse/edit local data

## Architecture

**Stack**: Next.js 16 (App Router) + TypeScript, Tailwind CSS v4, Prisma ORM v7 + SQLite, Framer Motion, `lucide-react`. Path alias `@/*` → `./src/*`.

**RTL/Persian by default**: `src/app/layout.tsx` sets `lang="fa" dir="rtl"` on `<html>`, loads the Vazirmatn font via `next/font/google`, and wraps every page in the shared `Navbar`/`Footer` (`src/components/shared/`). All copy is Persian; keep RTL-safe layout (logical spacing, no hardcoded left/right assumptions) when adding UI.

**Design system / theme**: the red color scale and `ink-*` text-color scale are defined once in `src/app/globals.css` via Tailwind v4's `@theme inline` (e.g. `--color-red-500`, `--color-ink-900`). These override Tailwind's built-in `red-*` palette with the project's own slightly-dark red, so `bg-red-500` etc. always resolve to the theme, never the default. Use those existing tokens (`bg-red-500`, `text-ink-500`, …) instead of introducing new ad-hoc colors. Base primitives live in `src/components/ui/` (`Button`, `Card`, `Badge`, `Container`, `SectionHeading`, `PlaceholderMedia`); page sections live in `src/components/sections/`.

**Data fetching pattern**: most section components under `src/components/sections/` that show real content (`GalleryPreview`, `BlogPreview`, `TestimonialsPreview`, `PricingPreview`, and the full pages under `src/app/*`) are `async` Server Components that query Prisma directly — there is no API layer for reads. `src/lib/prisma.ts` exports a singleton `prisma` client built from `PrismaClient` + the `PrismaBetterSqlite3` driver adapter (Prisma 7's SQL workflow requires an explicit driver adapter; see `.agents/skills/prisma-database-setup/references/sqlite.md` for the pattern). The generated client lives at `src/generated/prisma` (not `node_modules`) and is imported as `@/generated/prisma/client` — re-run `npx prisma generate` whenever `schema.prisma` changes or these imports go stale.

**SQLite modeling conventions** (see `prisma/schema.prisma`): SQLite has no native enum or scalar-list support, so:
- Enum-like fields (`User.role`, `GalleryItem.type`, `BlogPost`/`Package`/`Order`/`Lead` status-ish fields) are plain `String` columns; the allowed values are documented in a comment above each model rather than enforced by the schema.
- Array data (e.g. `Package.features`) is stored as a JSON-encoded string and `JSON.parse`d at the call site (see `PricingCard`).

**Placeholder-media pattern**: content models have an optional image field (`GalleryItem.url`, `BlogPost.coverImage`, `Testimonial.studentImage`). `src/components/ui/PlaceholderMedia.tsx` renders a real `next/image` when that URL is set, otherwise falls back to a deterministic gradient + icon tile. The fallback icon/gradient variant is derived purely in the presentation layer from `hashVariant(id)` in `src/lib/placeholder-icon.ts` — it is not stored in the database, so don't add icon/variant columns to the schema for this.

**Instagram section**: `InstagramFeed` renders DB-backed cards (`InstagramPost` model) that link out to instagram.com — it deliberately does **not** use Instagram's official `embed.js` blockquote embed or the oEmbed API. Instagram is blocked in Iran and Meta blocks Iranian IPs, so official embeds would render as empty boxes for most of this site's actual audience; oEmbed additionally requires a Meta app token that an Iranian developer account can't obtain. Post metadata also can't be scraped — every post URL hits a login wall unauthenticated — so captions and cover images are entered by hand via `prisma/seed.ts`. Cover images are self-hosted under `public/instagram/<shortcode>.jpg` rather than hotlinked from `scontent.cdninstagram.com`, whose URLs are short-lived, signed, and unreachable from Iran. The account handle and permalink construction live in `src/lib/instagram.ts` (permalinks are derived from `shortcode` + `type`, not stored); `Button` takes an `external` prop to render a plain new-tab anchor instead of a `next/link`.

**Routing**: public marketing pages are plain routes under `src/app/` (`/about`, `/gallery`, `/pricing`, `/blog`, `/blog/[slug]`, `/testimonials`, `/contact`). `/blog/[slug]` uses `generateStaticParams` sourced from Prisma at build time, so a newly added blog post needs a rebuild to get a static page. The homepage (`src/app/page.tsx`) deliberately renders only lightweight *preview* sections (a handful of items per section, e.g. `GalleryPreview.take: 6`) that link out to the corresponding full page — this is an intentional perf pattern (keep the homepage fast despite covering every content type), not a gap to "complete" by inlining full lists.

**Animation**: `src/components/motion/FadeIn.tsx` is currently a plain passthrough wrapper with no animation. This was deliberate — an earlier scroll/mount-triggered Framer Motion version left content at `opacity: 0` whenever the animation failed to run on a given device, so content visibility must never depend on client-side JS/animation state. If animation is reintroduced here, it must not gate the first paint of any text/content on JS executing.

**Why SQLite in production**: the DB is intentionally SQLite (a single file, `DATABASE_URL="file:./dev.db"`), not Postgres — chosen after pricing out managed Postgres/object-storage services as unnecessarily expensive for this project's scale. Production deploys to a single low-cost VPS with the app, SQLite file, and an `uploads/` directory for media all on the same box, rather than split managed services. Don't "upgrade" this to a hosted Postgres/object-storage setup without that context.
