# Implementation Plan: Aristino Frontend Rebuild

**Branch**: `001-aristino-frontend-spec` | **Date**: 2026-07-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from [spec.md](./spec.md)

---

## Summary
We are rebuilding the frontend layers of the Aristino e-commerce homepage in Next.js 14 (App Router) and Tailwind CSS with 100% English translation. State management for the Cart Drawer will be persisted in browser cookies to enable initial SSR render and prevent hydration layout shifts. Styling uses custom theme tokens for navy/gold/charcoal palettes.

## Technical Context

- **Language/Version**: Next.js 14+ (App Router, Node.js v18+ runtime), TypeScript
- **Primary Dependencies**: `React`, `Tailwind CSS`, `js-cookie`, `lucide-react`
- **Storage**: Browser Cookies (for client shopping cart persistence)
- **Testing**: Jest, React Testing Library, `@testing-library/jest-dom`
- **Target Platform**: Vercel / Node.js
- **Project Type**: Web Application
- **Performance Goals**: Instant page loads, zero Cumulative Layout Shift (CLS) on sticky header, smooth hover transition animations.
- **Constraints**: Follows the `Aristino Localization Constitution` (VND-to-USD pricing conversion, no language switcher, exact category structure).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I. Structural Fidelity**: ✅ Checked. Navigation hierarchy and list ordering exactly mirror the legacy layout.
- **Principle II. Premium Tone**: ✅ Checked. Component copy uses elevated, sophisticated terms.
- **Principle III. UX Navigation Consistency**: ✅ Checked. Menu links match constitution translation tables.
- **Principle IV. Layout Alignment**: ✅ Checked. Product cards limit titles to 2 lines to preserve uniform grid alignment.
- **Principle V. SEO Strategy**: ✅ Checked. Dynamic metadata configurations are defined.
- **Principle VI. Project Architecture & Naming Conventions**: ✅ Checked. Frontend is isolated in a separate `/frontend` workspace folder, keeping backend routers and controllers separated.

## Project Structure

### Documentation (this feature)
```text
specs/001-aristino-frontend-spec/
├── plan.md              # This file
├── research.md          # Phase 0 decisions
├── data-model.md        # Data entities (Product, CartItem)
├── quickstart.md        # Scenario verification steps
└── contracts/
    └── cart-cookie.json # Cookie schema contract
```

### Source Code (repository root)
We select Option 2: Web application (frontend/backend division).

```text
backend/
├── src/
│   ├── controllers/   # e.g., name.controller.tsx
│   ├── routers/       # e.g., name.router.tsx
│   ├── models/
│   └── services/
└── tests/

frontend/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── ProductCard.tsx
│   │   └── CartDrawer.tsx
│   ├── app/
│   │   └── [locale]/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   └── services/
└── tests/
```

**Structure Decision**: Monorepo layout dividing `frontend/` and `backend/` as workspace root folders.

---

## Verification Plan

### Automated Tests
Run unit tests checking if components render standard localized navigation texts:
```bash
cd frontend
npm run test
```

### Manual Verification
1. Launch Dev Server (`npm run dev`).
2. Test responsive resizing:
   - On Desktop viewports, verify that 7 uppercase navigation links show in premium English.
   - On Mobile viewports, check if clicking the menu button slides in the drawer from the left edge.
3. Test Cart Drawer functionality:
   - Trigger the drawer via header bag click. Verify it slides in from the right edge with custom styling and lists empty cart labels in premium English.
4. Test Customer Feedback panel in Admin Dashboard:
   - Navigate to `/admin/dashboard` and click the "Khách hàng" (Customers) tab.
   - Verify that all submitted contact form messages load and are displayed.
   - Test the search bar for filtering messages.
   - Click "Chi tiết" to inspect details and "Xóa" to verify deletion.
