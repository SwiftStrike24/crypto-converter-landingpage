# CryptoVertX Landing Page Implementation

This document outlines the technical implementation details of the CryptoVertX landing page. It serves as the source of truth for all features, logic, and data flows.

## 1. Project Overview

CryptoVertX is a modern, responsive landing page for a desktop cryptocurrency conversion application. It is built with Next.js 15 (App Router) and features a dark, futuristic aesthetic with interactive animations. The page is designed to be performant, SEO-friendly, and easily maintainable.

### 1.1. Core Technologies

-   **Framework:** Next.js 15
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS 4, ShadCN UI, PostCSS
-   **Animation:** Framer Motion
-   **Font:** Geist
-   **Deployment:** Vercel / Cloudflare Pages
-   **Backend Storage:** Cloudflare R2 for application downloads

## 2. Project Structure

The `src` directory is organized to promote separation of concerns and modularity.

```
src/
├── app/                  # Next.js App Router: pages and API routes
│   ├── api/              # Backend API endpoints
│   ├── page.tsx          # Main landing page component
│   └── layout.tsx        # Root layout for the application
├── components/           # Reusable React components
│   ├── animations/       # Standalone animation components
│   ├── demo/             # Interactive demo components
│   ├── layout/           # Header, Footer, etc.
│   ├── sections/         # Major sections of the landing page
│   └── ui/               # UI primitives from ShadCN
├── lib/                  # Utility functions and shared logic
├── public/               # Static assets (images, fonts)
└── workers/              # (Currently unused) For potential background tasks
```

## 3. Page Composition

The main landing page (`src/app/page.tsx`) is composed of several modular sections, presented in the following order:

1.  **Header (`Header.tsx`)**
2.  **Hero (`Hero.tsx`)**
3.  **Features (`Features.tsx`)**
4.  **How It Works (`HowItWorks.tsx`)**
5.  **Download (`Download.tsx`)**
6.  **FAQ (`FAQ.tsx`)**
7.  **Footer (`Footer.tsx`)**

## 4. Component & Feature Breakdown

### 4.1. Layout Components

-   **`Header.tsx`**: Provides top-level navigation with smooth-scrolling links to page sections (`#features`, `#download`, etc.). It has a blurred, semi-transparent background that becomes opaque on scroll.
-   **`Footer.tsx`**: Contains site links, social media icons, and copyright information.

### 4.2. Page Sections

#### 4.2.1. Hero Section (`Hero.tsx`)

-   **Objective:** Create a strong first impression and introduce the application.
-   **Key Features:**
    -   **Live Crypto Data:** Fetches and displays real-time prices for featured cryptocurrencies from the CoinGecko API via `lib/api.ts`. Includes placeholder data for resilience.
    -   **Interactive Animations:**
        -   `WavyBackground.tsx`: A `react-three-fiber` and `shader`-based component that renders dynamic, neon-glowing 3D waves. The wave amplitude and motion are linked to page scroll for a dynamic effect.
        -   `ParticleWave.tsx`: A performant `canvas`-based particle system using an "ambient" animation to create a visually engaging starfield effect on page load. Particles drift with a subtle 3D parallax effect, have a neon glow, and form connections with nearby particles. The animation is interactive, with particles reacting to mouse movement and speeding up on scroll.
        -   `FloatingCryptoIcon` components feature physics-based floating animations and react to mouse-over events for a 3D parallax effect.
    -   **Converter Demo:** Embeds the interactive `ConverterDemo.tsx` component, allowing users to try the app's core functionality directly on the page.
    -   **Parallax Scroll:** The title, subtitle, and app preview move at different rates during page scroll to add depth.
-   **Optimization:** Makes heavy use of the `ClientOnly` wrapper to prevent hydration errors and ensure complex, client-side animations and data fetching do not run on the server. The particle animation uses a `<canvas>` element for better performance over SVG or DOM elements, and the wave background leverages WebGL through `react-three-fiber` for efficient rendering.

#### 4.2.2. Features Section (`Features.tsx`)

-   **Objective:** Showcase the key features of the CryptoVertX application.
-   **Key Features:**
    -   **Interactive Grid:** Users can click on different features in a grid.
    -   **Dynamic Highlight:** Clicking a feature updates a larger, central "highlight" panel to display that feature's icon, title, and description.
    -   **Rich Hover Effects:** Features extensive `framer-motion` animations on hover, including animated gradients, corner accents, and floating particles, to create a polished and engaging user experience.

#### 4.2.3. How It Works Section (`HowItWorks.tsx`)

-   **Objective:** Simply explain the user journey in three steps.
-   **Key Features:**
    -   Displays a three-step process: Download, Select, and Convert.
    -   Uses icons and brief descriptions for clarity.
    -   Features subtle `framer-motion` animations to fade in elements as the user scrolls them into view.
    -   **3D Scroll Animation:** Implements consistent entry (zoom-in from previous section) and exit (zoom-out) animations using `useTransform` hooks based on scroll progress, creating a seamless 3D-like transition effect.

#### 4.2.4. Download Section (`Download.tsx`)

-   **Objective:** Provide a platform-specific download link for the application.
-   **Key Features:**
    -   **Accurate R2 Metadata:** Connects to the `/api/files` backend endpoint to get metadata for the latest application installer from Cloudflare R2. The endpoint performs a `HEAD` on the selected object to return the authoritative `Content-Length` (as `sizeBytes`), `ETag`, and optional `sha256` from object metadata.
    -   **Platform Selector:** Allows users to select their operating system (currently Windows, with macOS as "Coming Soon").
    -   **Robust Error Handling:** If the API fails to fetch file data, it displays a user-friendly error message and a retry button.
    -   **Automatic Updates:** Periodically re-fetches metadata to check for new versions and displays a "New!" badge if a new version is detected.
    -   **Download Pipeline:** Uses the unified `/api/download?key=...` route for all downloads to ensure Range support and consistent headers. The browser manages resume via native Range requests.
    -   **Embedded Demo:** Includes another instance of the `ConverterDemo` for user engagement.
    -   **Dual Particle System:** Renders two instances of the `ParticleWave` component. An `ambient` green galaxy effect is active when scrolling into the section, and a `travel` effect creates a star-streaking transition when scrolling out of the section.
    -   **3D Scroll Animation:** Implements consistent entry (zoom-in from previous section) and exit (zoom-out) animations using `useTransform` hooks based on scroll progress, maintaining the seamless 3D-like transition effect throughout the page.

#### 4.2.5. FAQ Section (`FAQ.tsx`)

-   **Objective:** Answer common user questions.
-   **Key Features:**
    -   Uses the `Accordion` component from ShadCN UI to present questions and answers in a compact, expandable format.
    -   Content is hardcoded within the component.
    -   **Dual Particle System:** Features a unique, scroll-aware particle system. An `ambient` effect with blended primary and secondary colors is active when scrolling into the section, and a `travel` effect provides a final star-streaking transition at the end of the page.
    -   **3D Scroll Animation:** Implements consistent entry (zoom-in from previous section) animation using `useTransform` hooks based on scroll progress, completing the seamless 3D-like transition journey throughout the entire landing page.

### 4.3. Interactive Demo (`ConverterDemo.tsx`)

-   **Objective:** Simulate the core functionality of the desktop app.
-   **Key Features:**
    -   Fetches a list of available cryptocurrencies from the CoinGecko API.
    -   Allows users to select "from" and "to" currencies and input an amount.
    -   Performs a simulated conversion using live price data.
    -   Includes a "Technical Analysis" widget from TradingView to show market sentiment.
    -   Features a detailed, mock price chart that visualizes historical data.

### 4.4. 3D Scroll Animation System

The landing page implements a comprehensive, consistent 3D-like scrolling experience across all sections using Framer Motion's scroll-based animations. This creates an immersive journey that feels like moving through a 3D space.

#### 4.4.1. Animation Architecture

-   **Scroll Tracking:** Each section uses `useScroll` hooks with `['start start', 'end start']` offset configuration for precise control over when animations trigger.
-   **Entry Animations:** Each section (except Hero) zooms in from 90% scale to 100% scale with fade-in as it enters the viewport, triggered by the previous section's scroll progress.
-   **Exit Animations:** Each section (except FAQ) zooms out from 100% scale to 80% scale with fade-out as it exits the viewport, triggered by its own scroll progress.
-   **Visual Overlap:** Negative margins (`-mt-32`) and incremental z-index values create the necessary visual layering for smooth transitions.

#### 4.4.2. Section-Specific Implementation

1.  **Hero Section:** No entry animation (starts visible), exit animation based on its own scroll progress.
2.  **Features Section:** Entry from Hero, exit animation for transition to HowItWorks.
3.  **HowItWorks Section:** Entry from Features, exit animation for transition to Download.
4.  **Download Section:** Entry from HowItWorks, exit animation for transition to FAQ.
5.  **FAQ Section:** Entry from Download, no exit animation (final section).

#### 4.4.3. Technical Details

-   **Transform Logic:** Uses `useTransform` with scroll progress ranges `[0.3, 0.6]` for entry and `[0, 0.8]` for exit animations.
-   **Performance:** All animations are hardware-accelerated using CSS transforms and opacity.
-   **Consistency:** Standardized animation curves and timing ensure smooth visual flow.
-   **Z-Index Stacking:** Incremental z-index values (z-10, z-20, z-30, z-40) maintain proper layering.

## 5. Backend API

### 5.1. `/api/files`

-   **Purpose:** Fetches metadata for the latest available application installer from Cloudflare R2.
-   **Logic:**
    1.  Receives a `platform` query parameter (`windows` or `mac`).
    2.  Lists objects in the R2 bucket under the `latest/` prefix.
    3.  Filters to the correct installer file based on keywords (e.g., `Setup`/`Installer`) and file extensions (`.msi`/`.exe` for Windows, `.dmg`/`.pkg` for macOS).
    4.  Performs a `HEAD` on the selected object to retrieve authoritative metadata: `Content-Length` (returned as `sizeBytes`), `ETag`, optional `Metadata.sha256`.
    5.  Extracts version from the filename and formats the release date from `LastModified`.
    6.  Returns JSON: `{ key, filename, sizeBytes, size, version, releaseDate, etag, sha256 }` with `Cache-Control: no-store`.
    7.  Returns an error with appropriate status code if no file is found or R2 fails; no guessed sizes are used.

### 5.2. `/api/download`

-   **Purpose:** Streams files directly from R2 with full HTTP Range support for reliable, resumable downloads.
-   **Behavior:**
    -   Always streams via the API route (no presigned URLs are exposed to the client), ensuring consistent headers and telemetry.
    -   If the request includes a `Range` header, the route:
        -   Sends `GetObject` with the same `Range` to R2
        -   Returns `206 Partial Content` with `Content-Range` and `Content-Length` equal to the segment size
    -   If there is no `Range` header, the route returns `200 OK` with the full `Content-Length`.
-   **Headers:**
    -   `Accept-Ranges: bytes`
    -   `Cache-Control: no-store`
    -   `Content-Type: application/x-msi` for MSI files (fallback to R2-provided content type or `application/octet-stream`)
    -   `Content-Disposition: attachment; filename="<actual file name>"`
    -   `ETag` passthrough if provided by R2
-   **Errors:**
    -   Invalid ranges return `416 Range Not Satisfiable` with `Content-Range: bytes */<total>`
    -   Unauthorized returns `401`
-   **Telemetry:** Logs include request host, requested range, resulting status, `Content-Length`, `Content-Range`, and `ETag`.

## 6. Styling & Animations

-   **Theme:** A custom dark theme is defined in `tailwind.config.js` with specific colors for background, text, and primary/secondary accents.
-   **UI Components:** Leverages `shadcn/ui` for primitives like buttons, accordions, and tooltips, which are then custom-styled.
-   **Animations:** `framer-motion` is used for UI and layout animations. A unified particle system creates a seamless "travel" effect between sections.
    -   **`ParticleWave.tsx`**: A reusable HTML5 Canvas-based component renders all particle animations.
    -   **Dual-Particle System:** Each page section (`Features`, `HowItWorks`, etc.) uses two `ParticleWave` instances: one for an `ambient` background effect and one for a `travel` (star-streaking) effect that bridges the scroll transition to the next section.
    -   These animations are scroll-aware and react to mouse input, creating an immersive, continuous journey through the page. The "travel" effect is directly tied to scroll velocity, so stars only streak when the user is actively scrolling.

## 7. Optimizations

-   **Dynamic Imports:** The `ClientOnly` component (`@/components/ClientOnly.tsx`) is a custom wrapper that defers the rendering of its children to the client side. This is crucial for performance and preventing server-side rendering of heavily interactive or browser-dependent components.
-   **Bundle Analysis:** The project is configured with `next-bundle-analyzer` (`analyze-bundle.mjs`) to help developers inspect and optimize the client-side JavaScript bundle size.
-   **Performant Animations:** For the hero section's complex background, animations were built with performance in mind. The particle system uses the Canvas API, which is more efficient for drawing a large number of elements than DOM or SVG. The 3D wave leverages WebGL via `react-three-fiber` for hardware-accelerated rendering. 