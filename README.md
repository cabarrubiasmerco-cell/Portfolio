# Merco M. Cabarrubias — Developer Portfolio

A unique, minimalist, and editorial developer portfolio for **Merco M. Cabarrubias**, an Information Technology student at **Cebu Eastern College (CEC)** and aspiring software engineer.

![Portfolio Preview](merco-profile.png)

---

## 🌟 Highlights & Key Features

- **Unique & Minimalist Aesthetic**: Monochromatic palette, ambient radial glow, ultra-clean typography (Plus Jakarta Sans, Space Grotesk, JetBrains Mono).
- **Interactive Developer Terminal (CLI)**: Type interactive commands (`help`, `about`, `projects`, `skills`, `education`, `contact`, `roblox`, `sudo hire`, `clear`) right inside the browser.
- **Command Palette (`Ctrl+K` / `⌘K`)**: Fast, keyboard-first navigation and fuzzy search.
- **Tactile Web Audio API Feedback**: Subtle micro-sound clicks synthesizing native audio oscillators (zero audio file dependencies, instant response, with mute toggle).
- **Dark & Light Mode Engine**: Seamless theme switching with persistent localStorage and keyboard shortcut (`T`).
- **Live Local Time**: Displays real-time Philippine Standard Time (PST/PHT, UTC+8) for Cebu City with animated live status dot.
- **Case Studies & Interactive Previews**:
  - **TasteTrack (Django Web App)**: Full-stack architecture, data models, and uploaded dish gallery.
  - **Disaster Survival Challenge (Roblox Experience)**: Multiplayer mechanics breakdown and direct launch link to [Roblox Experience](https://www.roblox.com/games/103655048302039/Disaster-Game).
  - **Ocean Conservation & Scarborough Shoal**: Interactive live iframe sandbox allowing visitors to test the website directly inside the portfolio modal.
- **Resume Modal & Quick Download**: In-browser inspection and instant download of curriculum vitae.
- **Direct Contact & Mailer**: One-click email & phone copying with toast notifications, plus quick mailto composer.

---

## 📁 Project Architecture

```text
Merco/
├── index.html                   # Primary portfolio application
├── README.md                    # Project documentation & deployment guide
├── assets/
│   ├── css/
│   │   └── style.css            # Custom editorial design system & responsive styling
│   ├── js/
│   │   └── main.js              # Interactive terminal, command palette, audio synth & modals
│   └── images/
│       ├── merco-profile.png    # Centered portrait headshot
│       ├── merco-resume.png     # High-resolution resume preview
│       └── projects/
│           ├── tastetrack/      # Authentic recipe uploads & screenshots
│           ├── roblox/          # Disaster game Place icon (CDN synced)
│           └── ocean/           # Marine conservation media & visuals
└── projects/
    └── ocean-conservation/      # Embedded, runnable copy of LAB_ACT1.1
        ├── index.html
        ├── OceanConservation.html
        ├── issues.html
        ├── opinion.html
        ├── css/
        └── image/
```

---

## 🚀 How to Run Locally

Because this portfolio is built with modern vanilla web standards (HTML5, CSS3, ES6 JavaScript), you do not need Node.js or complicated build steps.

### Option 1: Double-Click
Simply double-click `index.html` to open it in Chrome, Edge, Brave, or Firefox.

### Option 2: Local HTTP Server (Python)
```bash
# In the project root directory:
python -m http.server 3000
```
Then visit `http://localhost:3000` in your web browser.

### Option 3: VS Code Live Server
Right-click `index.html` and click **"Open with Live Server"**.

---

## 🌐 1-Click Free Deployment Options

### GitHub Pages (Recommended)
1. Push this folder to a GitHub repository named `username.github.io` (or any repo name).
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, select `Deploy from a branch` and choose `main` / `root`.
4. Your portfolio will be live at `https://<username>.github.io` in under 60 seconds!

### Vercel / Netlify
1. Drag and drop the `Merco` directory onto the [Netlify Drop](https://app.netlify.com/drop) dashboard, or connect the GitHub repository to [Vercel](https://vercel.com).
2. No build command required; publish directory is `./`.

---

## 📬 Contact & Inquiries

- **Candidate**: Merco M. Cabarrubias
- **Degree**: Bachelor of Science in Information Technology (BSIT)
- **Institution**: Cebu Eastern College (CEC)
- **Honor**: Dean's Lister (A.Y. 2023 - 2024)
- **Email**: [cabarrubiasmerco@gmail.com](mailto:cabarrubiasmerco@gmail.com)
- **Phone**: [+63 993 574 7851](tel:09935747851)
- **Location**: Cebu City, Philippines
