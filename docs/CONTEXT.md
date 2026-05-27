# AI Context & Architecture Guide (NSL Click)

**Attention AI Assistants**: Read this file entirely before modifying any code. This project has a specific architecture, data source structure, and design guideline. 

---

## 1. High-Level Architecture

NSL Click is a Node.js + Express application that acts as a portal for Students, Partners, and Admins.
**Crucially, it uses Google Sheets as its primary database.**

### Roles & Access:
1. **Student**: Logs in via `StudentID` (e.g., `NSL-12345`). Views their own profile (`/profile`).
2. **Partner**: Logs in via `AccessCode`. Views a filtered dashboard (`/partner/dashboard`) showing multiple students. Filtering is based on allowed professions and center codes assigned to the partner.
3. **Admin**: Logs in via a master password. Has full CRUD capabilities for Students and Partners, and can trigger batch media generation jobs (`/admin`).

### Security:
- **Cloudflare Turnstile**: Used on all 3 login forms. Verified on the backend via the `verifyTurnstile` helper in `routes/auth.js`.
- **CSRF**: Custom session-based CSRF protection (skipped for `/login`).
- **Rate Limiting**: `express-rate-limit` is applied to all login endpoints.
- **Session**: `cookie-session` is used for stateless, encrypted cookie sessions.

---

## 2. Directory Structure

- `/server.js`: The main entry point. Sets up Express, middlewares, Multer, sessions, and imports routes.
- `/routes/`: Contains modular route handlers:
  - `auth.js`: All login/logout endpoints + Turnstile verification.
  - `student.js`: Student profile rendering and photo proxies.
  - `partner.js`: Partner dashboard and filtering logic.
  - `admin.js`: Admin CRUD endpoints, OAuth, and batch processing routes.
- `/services/`: The core business logic and API integrations.
  - `sheets.js`: Connects to Google Sheets (Master Database). Contains data parsing and fallback logic.
  - `drive.js`: Uploads/downloads files to/from Google Drive.
  - `googleAuth.js`: Manages both Service Account credentials (`credentials.json` for Sheets/Drive) and OAuth2 Client (`token.json` for YouTube).
  - `youtube.js`: Uploads videos to YouTube using OAuth2.
  - `pdf.js`: Uses **Puppeteer** to generate PDF Setcards from `views/setcard-template.ejs`.
  - `video.js`: Uses **FFmpeg** to process raw videos, add Canva overlays, and convert formats.
  - `jobs.js`: Simple in-memory background job tracker for PDF/Video batch generation.
- `/views/`: EJS templates for the frontend.
- `/public/`: Static assets (CSS, client-side JS, images).
- `/docs/`: Project documentation and guidelines.

---

## 3. Data Source (Google Sheets)

The project relies on a specific Google Spreadsheet defined by `process.env.GOOGLE_SPREADSHEET_ID`.

- **Master Sheet (`CHECKLIST`)**: The main source of truth for student demographics and media links (Photo Link, Activity Photo Link, Raw Video Link, YouTube Link, Setcard Link).
- **Assess Sheet (`NSL-ASSESS`)**: Contains academic data (NSL Score, NSL Grade, Deutsch Level, Intake).
- **Partner Sheet (`PARTNER_ACCESS`)**: Contains hashed access codes and permissions for partners.

**Important Data Sync Detail**:
In `services/sheets.js`, `getAllStudents()` fetches both `CHECKLIST` and `NSL-ASSESS` and **merges** them based on the `StudentID` key. Any update to a student field uses an inverse-mapping dictionary to find the exact column letter in the Google Sheet.

---

## 4. Media Processing Workflows

### Images (Google Drive Proxy)
Google Drive links (Photo/Activity Photo) cannot be embedded directly in `<img>` tags due to Google's strict CORS/Iframe policies. Therefore, the backend acts as a proxy:
- Route: `/proxy/students/:studentId/photo`
- Logic: Backend downloads the image stream from Google Drive and pipes it directly to the response object (`res.pipe()`) with `Content-Type: image/jpeg`.

### PDF Generation
- Admins select students and trigger PDF generation.
- `pdf.js` downloads the student's photo temporarily, converts it to base64, injects it into `views/setcard-template.ejs`, and uses Puppeteer to "print" the HTML to a PDF file.
- The PDF is uploaded to Google Drive, and the link is saved back to Google Sheets.

### Video Generation
- Admins select students and trigger Video generation.
- `video.js` downloads the raw video from Google Drive, detects metadata (orientation, audio).
- FFmpeg overlays a transparent Canva PNG (`public/assets/overlay_vertical.png` or `overlay_horizontal.png`) on top of the video.
- The output is uploaded to **YouTube** (Unlisted). If YouTube quota is exceeded, it falls back to uploading to Google Drive.

---

## 5. Design System & Frontend

The frontend uses **Vanilla CSS** with a robust CSS Variable system defined in `public/css/nsl-design-system.css`.
- **Theme**: Dark-mode inspired, glassmorphism (`backdrop-filter`), neon accents (Cyan/Pink gradients).
- **Frameworks**: NO Tailwind, NO Bootstrap. Strictly Vanilla CSS using the design system tokens.
- **Guideline**: If you need to build a new page or component, you MUST read `docs/nsl_design_guidelines.md` and use the existing CSS variables (`var(--primary)`, `var(--glass-bg)`, etc.). **Do not introduce arbitrary hex colors or inline styles.**

---

## 6. How to Edit Code

If a user asks you to fix a bug or add a feature:
1. Identify the layer: Is it a Route (`routes/`), a Service (`services/`), or Frontend (`views/` & `public/css/`)?
2. **Do not break the Google Sheets integration**. Remember that `getAllStudents` caches data for 30 seconds.
3. If modifying frontend, ensure responsiveness (Mobile First) and adhere strictly to the Bauhaus/Glassmorphism design.
4. When writing or appending logs, avoid using shell commands like `echo "log" >> file`. Use native JS file system tools or specific agent actions.

**End of Context**
