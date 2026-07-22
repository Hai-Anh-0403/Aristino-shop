# Research: Aristino Frontend Rebuild

This document captures key technical design decisions and justifications for the Aristino Frontend Rebuild.

## Decision 1: Next.js App Router for Static & Dynamic Rendering
- **Decision**: Next.js 14+ App Router.
- **Rationale**: Server Components allow rendering fast, static headers and SEO tags directly on the server, while Client Components (`"use client"`) handle interactive states like search overlay displays and drawers.
- **Alternatives Considered**: Next.js Pages Router (rejected due to outdated layouts API) or standard Single Page App like React CRA (rejected due to poor SEO capability).

## Decision 2: State Persistence with Cookies for the Shopping Bag
- **Decision**: Cart state stored in standard browser cookies via `js-cookie` or `cookies-next`.
- **Rationale**: Preserving state in cookies enables the Next.js App Router to read the basket contents server-side on the initial document request. This prevents the "flash of empty cart" hydration mismatch that occurs when checking `localStorage` client-side.
- **Alternatives Considered**: `localStorage` (rejected due to server-side rendering hydration issues).

## Decision 3: Header Actions & Search Layout
- **Decision**: Inline sliding search overlay panel.
- **Rationale**: Toggles dynamically on the current viewport without redirecting the user prematurely, offering suggestions before hitting full search page results.
- **Alternatives Considered**: Fullscreen search modal takeover (rejected to keep header transitions minimal and fast).

## Decision 4: Language Selection Removal
- **Decision**: Completely omit the language selector drop-down.
- **Rationale**: Since the site is a dedicated 100% English rebuild, leaving a placeholder picker introduces unnecessary visual noise and layout testing overhead.
- **Alternatives Considered**: Inactive mock dropdown (rejected to keep UI code clean).
