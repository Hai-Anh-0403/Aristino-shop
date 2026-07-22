# Quickstart Guide: Aristino Frontend Rebuild

This guide provides steps to install dependencies and run local test scenarios verifying component layout, localization mappings, and responsiveness.

## Prerequisites
- Node.js 18+ and npm installed
- Next.js workspace setup under `frontend/`

## Setup Instructions

1. **Install Dependencies**:
   Navigate to the frontend folder and install the required UI packages:
   ```bash
   cd frontend
   npm install js-cookie @tailwindcss/line-clamp
   npm install --save-dev typescript @types/js-cookie jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
   ```

2. **Tailwind Verification**:
   Ensure `frontend/tailwind.config.js` is updated with the custom color tokens (`brand-navy`, `brand-gold`) and fonts defined in [spec.md](./spec.md).

## Verification Scenarios

### Scenario 1: Desktop Layout Render
- **Action**: Run the local development server:
  ```bash
  npm run dev
  ```
- **Expectation**: Access `http://localhost:3000`. The navigation header renders with exactly 7 premium English categories in uppercase. No language switcher is visible.

### Scenario 2: Shopping Bag Drawer Slide-In
- **Action**: Click the shopping bag icon on the desktop header.
- **Expectation**: The sidebar drawer slides in from the right edge with a dark blurred backdrop overlay. Click the close button or backdrop; the drawer slides back out.

### Scenario 3: Product Card Layout Check
- **Action**: Inspect collection grid card elements.
- **Expectation**: Long titles are truncated at exactly 2 lines. Hovering over images triggers a smooth scale-105 zoom effect.

### Running Tests
Run standard unit tests validating component renders:
```bash
npm run test
```
