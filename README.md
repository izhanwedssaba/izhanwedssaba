# The Wedding of Mohammed Izhan & Bazila Saba — Website

This is a lightweight, mobile-first, vanilla HTML/CSS/JS wedding invitation site designed for GitHub Pages.

Features
- Opening monogram animation (I ❦ S)
- Responsive hero and elegant typography
- Live countdown to 18 October 2026
- Blessings form (client-side only, stored in browser localStorage)
- Nikah and Valima sections with times and venues
- QR placeholder for Valima (replace with actual QR image as needed)
- No background music; ready for GitHub Pages

Colors
- Luxury Ivory (#FAF7F2)
- Antique Gold (#C6A664)
- Deep Emerald (#0F5132)

How to use / Deploy
1. The site is a static site. It can be hosted on GitHub Pages directly from this repository's main branch.

2. To preview locally:
   - Open `index.html` in a browser.

3. To publish on GitHub Pages:
   - Push the repository to GitHub (this repo already contains the files).
   - In the repository settings -> Pages, set the source to the `main` branch and the root (`/`).
   - Save and wait a minute; the site will be available at `https://<your-username>.github.io/<repo>/`.

Customization
- Replace the QR placeholder in `index.html` (section with class `qr-placeholder`) with an actual QR image, e.g. an `<img src="assets/valima-qr.png" alt="Valima QR">`.
- Update times/venues directly in `index.html`.
- Fonts are loaded from Google Fonts; you can change them in the `<head>` of `index.html`.

Notes
- The blessings form stores messages locally in the visitor's browser (localStorage). If you want server-side storage or sharing across devices, integrate a backend or form service.
- No third-party JS libraries were used; animations are pure CSS/JS.

License
- Feel free to use and adapt this design for personal use.
