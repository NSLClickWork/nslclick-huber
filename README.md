# 🌟 NSL Click - Student Result & Management Portal

[![Language](https://img.shields.io/badge/Language-Node.js-green.svg)](https://nodejs.org)
[![Framework](https://img.shields.io/badge/Framework-Express-lightgrey.svg)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black.svg)](https://vercel.com)

A premium, enterprise-grade management system designed for **NSL (Study & Work in Germany)**. This portal provides an elegant, modern student/partner viewer and a powerful administrative dashboard for full student lifecycle management.

---

## 🚀 Key Features

### 🎓 For Students
- **🔐 Secure Access**: Instant login via Student ID protected by Cloudflare Turnstile CAPTCHA.
- **📊 Interactive Profiles**: Dynamic student profiles featuring German proficiency levels, test scores, NSL-Scores, and strengths.
- **📄 Document Integration**: Embedded Google Drive Photo proxies and YouTube video introductions.
- **🎨 Premium Design**: A modern, responsive UI featuring professional typography (Inter/Montserrat), high-contrast dark-mode-inspired aesthetics, and smooth glassmorphism.

### 🏢 For Partners
- **🔐 Secure Access**: Login via secure Access Code.
- **📊 Filtered Dashboard**: View only candidates matching specific professions and centers based on granular access control.
- **🌍 Multi-language**: Interface supports German (DE), English (EN), and Vietnamese (VI).

### 🛠 Administrative Dashboard
- **📈 Live Management**: A central hub to monitor, search, and manage student and partner entries in real-time.
- **✏️ CRUD Operations**: Fully functional student and partner management (Add, Edit, Archive, Restore, Revoke).
- **🤖 Automated Media Generation (Batch Jobs)**: 
  - Generates PDF Setcards via Puppeteer and uploads them to Google Drive.
  - Generates Video Introductions with Canva overlays via FFmpeg and uploads them to YouTube (with Google Drive fallback).

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js (v5+)
- **Database**: Google Sheets API (Acts as the primary database)
- **Storage**: Google Drive API (For images, raw videos, generated PDFs) & YouTube Data API v3 (For video uploads)
- **Templating**: EJS (Embedded JavaScript)
- **Styling**: Vanilla CSS (Custom Design System, Premium UI)
- **Security**: Cloudflare Turnstile, bcrypt, express-rate-limit, cookie-session, Custom CSRF protection
- **Media Processing**: Puppeteer (PDF generation), FFmpeg / fluent-ffmpeg (Video processing), OpenCV (Face cropping)

---

## 💻 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tommm1207/NSLClick-Huber.git
   cd NSLClick-Huber
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file based on `.env.example`. 
   ```env
   USE_MOCK_DATA=true # Keeps it running on local JSON without needing Google API
   # Admin fallback password is 'admin123' if no hash is provided
   # Partner fallback code is 'partner123'
   ```
   *Note: For production, you will need `credentials.json` (Google Service Account) and `token.json` (Google OAuth2).*

4. **Launch**
   ```bash
   npm run dev
   ```

---

## 🧪 Demo Login Credentials
When `USE_MOCK_DATA=true` or when Google API is not connected, you can test the 3 portals using these credentials:

- **🎓 Student Portal**: Login via Student ID `NSL-DEMO-01` or `NSL-DEMO-02`.
- **🏢 Partner Portal**: Navigate to the Partner tab and use Access Code `partner123`.
- **🛠 Admin Portal**: Navigate to the Admin tab and use Password `admin123`.

---

## ☁️ Deployment

This project is optimized for **Vercel** and generic VPS deployments.
- **Filesystem Compatibility**: Automatically uses `/tmp` for temporary storage on serverless environments.
- **OAuth Setup**: Ensure OAuth redirect URIs match your production domain.

---

## 📚 For AI Assistants & Contributors
Please refer to `docs/CONTEXT.md` and `docs/QUY_UOC_DU_AN.md` before making any structural changes to the codebase.

---

*Built with ❤️ for NSL (Germany) by [Khoi Nguyen (Tom-VN)](https://github.com/tommm1207)*
