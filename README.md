# Unnati Ispat — website

Static HTML/CSS/JS site. No framework and no build step, ready for GitHub Pages.

## Publish on GitHub Pages
1. Create a repository and upload everything in this folder (keep the folder structure).
2. Settings → Pages → Deploy from branch → `main` / root.

## Before going live
- **Product photos:** `images/products/` currently holds low-resolution placeholders cropped from the
  contact sheet. Overwrite them with the full-size client-approved files of the same names.
- `images/site/banner*-hero.jpg` are crops of the original banners with the old caption strips removed.
  The untouched originals are kept alongside them.
- Open Graph tags use relative image paths. Once the domain is known, change `og:image` and `og:url`
  to absolute URLs (e.g. `https://www.unnatiispat.com/images/site/banner4.jpg`).

## Structure
- `index.html`, `about.html`, `vision-mission.html`, `products.html`, `wiron.html`,
  `weight-reference.html`, `calculator.html`, `contact.html`
- `product-*.html` — one page per product, all built on the same template
  (TMT Bars, M.S. Angles and Square Hollow Sections carry full reference-weight tables)
- `css/styles.css` — the shared stylesheet; `js/main.js` — the shared script

## How enquiries work
There is no backend. The Request a Quote forms open a pre-filled WhatsApp message to +91 91525 35156
or a pre-filled e-mail to info@unnatiispat.com (cc unnatiispat@gmail.com).
