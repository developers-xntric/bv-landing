# GEMINI.md — BlueVerse Landing Page Context

## 🎯 Project Overview
**BlueVerse** is a premium, high-converting landing page for a Dubai-based car detailing and protection studio. It targets luxury car owners with a "dark mode" aesthetic, emphasizing trust, quality, and specific protection against Dubai's harsh environmental conditions (heat, dust, etc.).

- **Type**: Static Web Application (Landing Page)
- **Primary Stack**: HTML5, CSS3 (Vanilla), Vanilla JavaScript
- **Key Features**:
  - Custom Carousel Engine for services and testimonials.
  - Scroll-reveal animations via `IntersectionObserver`.
  - Lead capture form with Google Sheets integration and WhatsApp redirection.
  - UTM tracking for marketing campaigns.
  - Mobile-first, responsive design with glassmorphism effects.

## 🏗️ Architecture & Structure
The project follows a standard static asset structure:
- `index.html`: The single entry point containing all sections (Hero, Services, Trust, FAQ, etc.).
- `css/style.css`: Monolithic stylesheet using CSS Variables for theme management.
- `js/main.js`: Core logic for carousels, form validation, animations, and API calls.
- `images/`: Organized assets including service photos, transformations, and branding.

## 🛠️ Building and Running
Since this is a static project, there is no build step required for local development.

- **Local Development**: Open `index.html` directly in a browser or use a simple live server (e.g., VS Code Live Server extension).
- **Testing**: Manual verification across breakpoints (mobile-first).
- **Deployment**: Can be hosted on any static hosting provider (Netlify, Vercel, GitHub Pages).

## 🎨 Development Conventions

### CSS & Styling
- **Variables**: Use defined `:root` variables in `css/style.css` for colors, spacing, and transitions.
- **Naming**: Primarily uses a functional/semantic naming convention (e.g., `.service-card`, `.navbar-inner`).
- **Responsive**: Mobile-first approach; media queries are typically grouped at the bottom of sections or the file.

### JavaScript
- **Vanilla JS**: No external frameworks (like React or jQuery). Keep it dependency-free.
- **Class-Based Carousels**: Use the `Carousel` class in `main.js` for any new sliding components.
- **Performance**: Use `{ passive: true }` for scroll event listeners.

### Content & SEO
- **Images**: Always provide `alt` text. Use high-resolution images suitable for luxury car branding.
- **Copy**: Focus on high-intent keywords: "PPF", "Car Wrapping", "Dubai Detailing", "Ceramic Coating".

## 🔌 Integration Details
- **Google Tag Manager**: Integrated in `<head>` and `<body>` of `index.html`.
- **Form Submission**:
  - Validates client-side in `main.js`.
  - Sends data to a Google Apps Script endpoint (`GOOGLE_SHEET_URL`).
  - Redirects user to WhatsApp with a pre-filled message.
  - Tracks UTM parameters (`utm_source`, `utm_medium`, etc.) for lead attribution.
