# TGI401 — Custom Webflow Injection

Custom CSS + JS that powers the mobile shopping experience on [thegirlsin401.com](https://thegirlsin401.com).

## What's here

- **`tgi401-inject.css`** — Mobile layout, product modal, retro Mac chrome bar, typography, social proof toast
- **`tgi401-inject.js`** — Product modal with image carousel, Stripe checkout, icon grid, social proof notifications
- **Static assets** — Product images, brand font (Bootsy TM), logos, mascots

## How it works

These files are loaded into the Webflow site via Custom Code injection. They override the default mobile experience with a custom iOS/retro Mac aesthetic — product modals, sticky shop CTA, chrome navigation bar — while leaving the desktop experience mostly untouched.

**CDN:** [401files.vercel.app](https://401files.vercel.app)

## Webflow integration

Add to **Site Settings → Custom Code → Footer Code**:

```html
<link rel="stylesheet" href="https://401files.vercel.app/tgi401-inject.css">
<script src="https://401files.vercel.app/tgi401-inject.js" defer></script>
```

## Making changes

1. Edit `tgi401-inject.css` or `tgi401-inject.js`
2. `git add . && git commit -m "description" && git push`
3. Vercel auto-deploys — changes go live immediately

## Using Claude Code

Open this repo in Claude Code for AI-assisted editing. The `CLAUDE.md` file gives Claude full context on the architecture, file structure, Webflow class dependencies, and common tasks.

```bash
cd /path/to/401files
claude
```

Ask things like:
- "Add a new product called The Roomie Hoodie for $65"
- "Change the tee price to $50"
- "Update the Stripe checkout link for the hat"
- "Make the chrome bar background pink"
- "Add a new product photo to the tee carousel"
