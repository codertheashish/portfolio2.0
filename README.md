# Ashish Kumar Prajapati — Portfolio (Next.js)

Dark cyber-themed portfolio converted from HTML to Next.js 14 App Router.

---

## 📁 Folder Structure

```
ashish-portfolio/
├── app/
│   ├── layout.js        ← Root layout + Google Fonts + SEO metadata
│   ├── page.js          ← Main page (orchestrates all components)
│   └── globals.css      ← All CSS (same styles as original)
├── components/
│   ├── Intro.jsx        ← Loading screen with particle canvas
│   ├── Navbar.jsx       ← Fixed navbar with mobile hamburger
│   ├── Hero.jsx         ← Hero section with typing animation
│   ├── About.jsx        ← About + info cards
│   ├── Skills.jsx       ← Skills grid + animated progress bars
│   ├── Experience.jsx   ← Timeline (internship + education)
│   ├── Projects.jsx     ← Project cards with filter
│   ├── Certs.jsx        ← Certifications grid
│   └── Contact.jsx      ← Contact form + social links
├── public/              ← Put your resume PDF here
├── package.json
├── next.config.js
└── README.md
```

---

## 🚀 Run Locally (Step by Step)

### Step 1 — Node.js install karo
Download from: https://nodejs.org (LTS version)

Check karo:
```bash
node -v   # 18.0+ hona chahiye
npm -v
```

### Step 2 — Project folder mein jao
```bash
cd ashish-portfolio
```

### Step 3 — Dependencies install karo
```bash
npm install
```

### Step 4 — Dev server start karo
```bash
npm run dev
```

Browser mein open karo: **http://localhost:3000**

---

## 🌐 Deploy on Vercel (FREE — Recommended)

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
```
Pehli baar GitHub se login karega → auto deploy!

### Option B — Vercel Website
1. GitHub pe push karo: `git push`
2. https://vercel.com pe jao
3. "Import Project" → GitHub repo select karo
4. Deploy button dabao ✅

---

## 🔧 Customization

### Certificate links update karo
`components/Certs.jsx` open karo → `link` field mein apni actual links daalo:
```js
{ link: 'YOUR_AWS_CERT_LINK_HERE' }  // ← yahan real link daalo
```

### Resume update karo
`public/` folder mein `Ashish_Resume.pdf` daalo.

---

## ⚡ What's Different from HTML Version

| Feature | HTML | Next.js |
|---------|------|---------|
| SEO Metadata | ❌ Basic | ✅ Full Open Graph |
| Google Fonts | CDN link | ✅ next/font (faster) |
| Components | Single file | ✅ Separate files |
| State Management | Global JS vars | ✅ React useState |
| Deployment | Manual | ✅ Auto with Vercel |
| Performance | Good | ✅ Better (SSG) |
