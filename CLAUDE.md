# CLAUDE.md — TGI401 Webflow Code Injection

> **Project:** The Girls in 401 (TGI401) — Custom mobile experience for Webflow site
> **Live Site:** thegirlsin401.com (Webflow)
> **Asset CDN:** 401files.vercel.app
> **Version:** v7.11

---

## What This Is

This repo contains **custom CSS + JS injection files** that override the default Webflow behavior on thegirlsin401.com. The Webflow site has a desktop-first design with draggable windows (macOS aesthetic). These inject files add a fully custom **mobile experience** on top of Webflow — without changing the Webflow Designer project itself.

The two core files are:
- **`tgi401-inject.css`** — All custom styles (mobile layout, product modal, chrome bar, social proof toast, typography, accessibility)
- **`tgi401-inject.js`** — All custom behavior (product modal with image carousel, Stripe checkout, social proof notifications, icon grid management, form handling)

Everything else in the repo is **static assets** (images, fonts) served from Vercel.

---

## How It Works

The inject files are loaded into Webflow via **Custom Code** (Site Settings → Custom Code → Footer Code). They load from the Vercel CDN:

```html
<!-- Paste this in Webflow → Site Settings → Custom Code → Footer Code -->
<link rel="stylesheet" href="https://401files.vercel.app/tgi401-inject.css">
<script src="https://401files.vercel.app/tgi401-inject.js" defer></script>
```

Once loaded, the CSS and JS:
1. **Hide** default Webflow elements on mobile (nav bar, desktop popups, rotation blocker)
2. **Inject** a retro Mac OS chrome bar at the top of the page
3. **Inject** a fixed logo below the chrome bar
4. **Rebuild** the mobile icon grid — hides all default icons, then injects product icons (Roomie Tee + Roomie Hat) alongside 3 kept icons
5. **Inject** a full-screen product detail modal with image carousel, size selector, and Stripe checkout
6. **Inject** social proof toast notifications (retro Mac OS style)
7. **Inject** a sticky "SHOP DROP 01" CTA button at the bottom
8. **Fix** the email signup form field names and submission

Desktop is left mostly untouched — just typography overrides and z-index focus management for the draggable windows.

---

## File Reference

| File | Purpose |
|---|---|
| `tgi401-inject.css` | All custom styles — mobile layout, modal, chrome bar, typography, accessibility |
| `tgi401-inject.js` | All custom behavior — modal, carousel, Stripe checkout, social proof, grid management |
| `bootsy-tm.otf` | Brand display font (Bootsy TM) — used for headings |
| `index.html` | Standalone preview/development page (NOT used in Webflow) |
| `logo-chrome.webp` / `logo-chrome-sm.png` | Chrome logo for fixed header |
| `shirt-gradient-sm.png` | Roomie Tee product icon |
| `hat-gradient-sm.png` | Roomie Hat product icon |
| `bear.png`, `flamingo.png`, `snail.png`, `turtle.png` | Mascot/icon assets |
| `favicon.svg` | Site favicon |

---

## Product Data (Hardcoded in JS)

The product catalog lives directly in `tgi401-inject.js` (the `products` object around line 130):

```javascript
var products = {
  tee: {
    name: 'The Roomie Tee',
    price: '$45',
    sizes: ['XS', 'S/M', 'L/XL'],
    stripeUrl: 'https://buy.stripe.com/bJebJ13uTd9u1aO9d2b7y01',
    images: [ /* array of CDN image URLs */ ]
  },
  hat: {
    name: 'The Roomie Hat',
    price: '$55',
    sizes: null,  // one size
    stripeUrl: 'https://buy.stripe.com/9B05kD3uT0mI2eS88Yb7y02',
    images: [ /* array of CDN image URLs */ ]
  }
};
```

**To add a new product:** Add a new key to the `products` object with the same shape, then add a product icon in the grid injection section (~line 340).

**To change prices or Stripe links:** Edit the `price` and `stripeUrl` fields directly.

---

## Key Webflow Class Names

The inject files target specific Webflow class names. If anything breaks after a Webflow Designer change, these are the classes to check:

| Class | What It Is |
|---|---|
| `.mobile-icons` | The main icon grid container on mobile |
| `.w-layout-cell` | Individual icon cells in the grid |
| `.draggable3` / `.draggable3-copy` | Icon wrapper elements |
| `.text-block-3` | Icon labels |
| `.nav-bar` | Default Webflow navigation |
| `.shoppop`, `.apppop`, `.bagpopup`, `.brandvaluespop` | Desktop popup/window elements |
| `.horizontal-mobile-block` | Rotation blocker overlay |
| `.bg-desktop` / `.bg-mobile` | Background video elements |
| `.cart-button-2` | Webflow cart button (wired to chrome bar cart link) |
| `.section` / `.background` | Main page structure |

---

## How to Integrate Into Webflow

### Method 1: Custom Code (Current Setup)
1. Go to **Webflow Dashboard → Site Settings → Custom Code**
2. In the **Footer Code** section, paste:
   ```html
   <link rel="stylesheet" href="https://401files.vercel.app/tgi401-inject.css">
   <script src="https://401files.vercel.app/tgi401-inject.js" defer></script>
   ```
3. **Publish** the Webflow site

### Method 2: Page-Level Custom Code
If you only want the injection on specific pages:
1. Go to **Pages → (select page) → Page Settings → Custom Code → Before </body> tag**
2. Paste the same two lines above
3. Publish

### Method 3: Embed Block
For more control, add an **Embed** element in the Webflow Designer:
1. Drag an **Embed** component onto the page (at the bottom)
2. Paste the two `<link>` and `<script>` tags
3. Publish

---

## Making Changes

### Editing Styles
All styles are in `tgi401-inject.css`. The file is organized by breakpoint:
- **Lines 1–13:** Custom cursor (desktop only)
- **Lines 30–613:** Mobile styles (`max-width: 767px`) — this is the bulk of the file
- **Lines 619–625:** Tablet styles (`768px–991px`)
- **Lines 631–660:** Desktop polish
- **Lines 666–708:** Typography (@font-face + font assignments)
- **Lines 714–732:** Accessibility (focus styles, skip link)

### Editing Behavior
All JS is in `tgi401-inject.js`. Key sections:
- **Lines 21–80:** Mobile icon grid setup + tap handlers
- **Lines 83–115:** Chrome bar creation
- **Lines 118–126:** Fixed logo
- **Lines 129–159:** Product data
- **Lines 162–306:** Product modal (carousel, sizes, buy button)
- **Lines 314–359:** Product icon grid injection
- **Lines 367–410:** Social proof toast
- **Lines 413–475:** Sticky CTA button
- **Lines 479–523:** Email form fix
- **Lines 527–531:** Size label renaming ("Shize" → "Size")
- **Lines 534–540:** Desktop z-index focus management
- **Lines 543–551:** Accessibility (skip link)

### After Making Changes
1. Commit and push to this repo (`git push`)
2. Vercel auto-deploys from `main` branch
3. Changes go live immediately on the Webflow site (no Webflow publish needed — the files are loaded from Vercel CDN)

---

## Deployment

This repo is deployed to **Vercel** at `401files.vercel.app`. Any push to `main` triggers an automatic deploy. The Vercel project serves all files as static assets.

---

## Common Tasks

### "Add a new product"
1. Add product images to the repo root
2. Add the product object to the `products` variable in `tgi401-inject.js`
3. Add a product icon `<div>` in the grid injection section (~line 340)
4. Push to deploy

### "Change the Stripe checkout link"
1. Edit the `stripeUrl` in the `products` object in `tgi401-inject.js`
2. Push to deploy

### "Update product photos"
1. Edit the `images` array in the product object in `tgi401-inject.js`
2. For icon thumbnails, replace the `-sm.png` files in the repo
3. Push to deploy

### "The mobile layout broke after a Webflow change"
Check if any of the Webflow class names listed above were renamed or removed in the Designer. The inject files depend on those specific class names.

### "Add the injection to a new Webflow page"
Use Method 1 (site-wide) or Method 2 (page-specific) from the integration section above.
