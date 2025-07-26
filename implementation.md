# CryptoVertX Landing Page Implementation

This document outlines the technical implementation details of the CryptoVertX landing page. It serves as the source of truth for all features, logic, and data flows.

## 1. Project Overview

CryptoVertX is a modern, responsive landing page for a desktop cryptocurrency conversion application. It is built with Next.js 15 (App Router) and features a dark, futuristic aesthetic with interactive animations. The page is designed to be performant, SEO-friendly, and easily maintainable.

### 1.1. Core Technologies

-   **Framework:** Next.js 15
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS 4, ShadCN UI, PostCSS
-   **Animation:** Framer Motion, Canvas API
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
    -   **Enhanced Interactive Animations:**
        -   **`ParticleWave`**: Canvas-based particle system with neon glow effects, trailing tails, jitter motion, gravitational drift, and scroll-linked speed changes. Particles react to mouse hover with ripple-like repulsion.
        -   **`WavyBackground`**: Canvas-rendered waves with multiple layers, neon glow edges, scroll-linked amplitude changes, and interactive ripple effects on mouse movement/click.
        -   **`AnimationProvider`**: Shared context providing scroll progress and mouse position to sync animations across components.
    -   **`FloatingCryptoIcon`** components feature physics-based floating animations and react to mouse-over events for a 3D parallax effect.
    -   **Converter Demo:** Embeds the interactive `ConverterDemo.tsx` component, allowing users to try the app's core functionality directly on the page.
    -   **Parallax Scroll:** The title, subtitle, and app preview move at different rates during page scroll to add depth.
-   **Performance Optimizations:** 
    -   Automatic performance detection disables heavy effects (tails, extra particles, glow) on low-end devices.
    -   FPS monitoring with degradation to maintain smooth experience.
    -   Canvas rendering for better performance vs SVG with hundreds of elements.
    -   `ClientOnly` wrapper prevents hydration errors and ensures animations only run client-side.

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

#### 4.2.4. Download Section (`Download.tsx`)

-   **Objective:** Provide a platform-specific download link for the application.
-   **Key Features:**
    -   **Dynamic File Fetching:** Connects to the `/api/files` backend endpoint to get metadata for the latest application installer from Cloudflare R2.
    -   **Platform Selector:** Allows users to select their operating system (currently Windows, with macOS as "Coming Soon").
    -   **Robust Error Handling:** If the API fails to fetch file data, it displays a user-friendly error message and a retry button.
    -   **Automatic Updates:** Periodically re-fetches metadata to check for new versions and displays a "New!" badge if a new version is detected.
    -   **Embedded Demo:** Includes another instance of the `ConverterDemo` for user engagement.

#### 4.2.5. FAQ Section (`FAQ.tsx`)

-   **Objective:** Answer common user questions.
-   **Key Features:**
    -   Uses the `Accordion` component from ShadCN UI to present questions and answers in a compact, expandable format.
    -   Content is hardcoded within the component.

### 4.3. Interactive Demo (`ConverterDemo.tsx`)

-   **Objective:** Simulate the core functionality of the desktop app.
-   **Key Features:**
    -   Fetches a list of available cryptocurrencies from the CoinGecko API.
    -   Allows users to select "from" and "to" currencies and input an amount.
    -   Performs a simulated conversion using live price data.
    -   Includes a "Technical Analysis" widget from TradingView to show market sentiment.
    -   Features a detailed, mock price chart that visualizes historical data.

### 4.4. Enhanced Animation System

#### 4.4.1. Animation Context (`AnimationProvider.tsx` & `lib/animations.ts`)

-   **Purpose:** Provides shared animation state across components for synchronized effects.
-   **Features:**
    -   Tracks scroll progress (0-1) using Framer Motion's `useScroll`.
    -   Tracks mouse position globally.
    -   Detects device performance capabilities.
    -   Provides FPS counter utility for performance monitoring.

#### 4.4.2. ParticleWave Component

-   **Rendering:** Canvas-based for optimal performance with 100+ particles.
-   **Particle Types:**
    -   Regular particles: Smaller, interactive, form connections.
    -   Ambient particles: Larger, slower, background depth effect.
-   **Behaviors:**
    -   **Jitter:** Random micro-movements for organic feel.
    -   **Gravitational Drift:** Subtle downward pull.
    -   **Shimmer/Glow:** Pulsing neon glow with radial gradients.
    -   **Trailing Tails:** Motion trails that fade over time (high-perf only).
-   **Interactivity:**
    -   **Scroll-Linked:** Particle speed increases with scroll progress.
    -   **Mouse Ripples:** Particles repel from cursor within interaction radius.
    -   **Wave Motion:** Sine-wave vertical displacement synced across particles.
-   **Performance:**
    -   Adaptive particle count based on device (60-120 regular, 10-20 ambient).
    -   FPS monitoring with automatic degradation.
    -   Boundary wrapping for seamless infinite motion.

#### 4.4.3. WavyBackground Component

-   **Rendering:** Multi-layer canvas waves with composite blending.
-   **Wave Features:**
    -   **Multiple Layers:** 2-4 wave layers with different frequencies/amplitudes.
    -   **Neon Glow:** Glowing edges on wave crests (high-perf only).
    -   **Organic Motion:** Primary + secondary sine waves for natural flow.
-   **Interactivity:**
    -   **Scroll-Linked:** Wave amplitude and speed increase with scroll.
    -   **Click Ripples:** Strong ripple effects on click.
    -   **Hover Ripples:** Subtle ripples on mouse move in lower screen area.
-   **Visual Effects:**
    -   Screen blend mode for luminous overlapping.
    -   Gradient fills with decreasing opacity per layer.
    -   Alternating colors (purple/mint) between layers.

## 5. Backend API

### 5.1. `/api/files`

-   **Purpose:** Fetches metadata for the latest available application installer from Cloudflare R2.
-   **Logic:**
    1.  Receives a `platform` query parameter (`windows` or `mac`).
    2.  Lists objects in the `cryptovertx-downloads` R2 bucket under the `latest/` prefix.
    3.  Filters the list to find the correct installer file based on keywords ("Setup", "Installer") and file extensions (`.msi`, `.exe`).
    4.  Sorts the results by modification date to find the newest file.
    5.  Extracts version, size, and release date.
    6.  Returns the metadata as a JSON response.
    7.  Returns fallback data if an error occurs or no file is found.

### 5.2. `/api/download`

-   **Purpose:** Securely streams a file from R2 to the user.
-   **Logic:**
    1.  Receives a `key` query parameter corresponding to the R2 object key.
    2.  Uses the AWS SDK to fetch the object from R2.
    3.  Streams the file body directly in the `NextResponse` with appropriate `Content-Disposition` headers to trigger a browser download.

## 6. Styling & Animations

-   **Theme:** A custom dark theme is defined in `tailwind.config.js` with specific colors for background, text, and primary/secondary accents. Neon purple/cyan/magenta palette for futuristic feel.
-   **UI Components:** Leverages `shadcn/ui` for primitives like buttons, accordions, and tooltips, which are then custom-styled.
-   **Animations:** 
    -   `framer-motion` for declarative animations and scroll tracking.
    -   Canvas API for performance-critical particle and wave animations.
    -   CSS filters for contrast/brightness enhancement on canvas elements.

## 7. Performance Optimizations

-   **Dynamic Imports:** The `ClientOnly` component defers rendering to client-side for browser-dependent features.
-   **Canvas Rendering:** Particle and wave animations use Canvas API instead of SVG/DOM for 60fps with hundreds of elements.
-   **Adaptive Quality:** 
    -   Device detection reduces particle count and disables effects on mobile/low-spec.
    -   FPS monitoring triggers degradation if performance drops below 30fps.
    -   Separate settings for regular vs ambient particles.
-   **Animation Throttling:** 
    -   Mouse ripples throttled to 100ms intervals.
    -   Resize events debounced.
    -   RequestAnimationFrame for smooth 60fps rendering.
-   **Bundle Analysis:** Configured with `next-bundle-analyzer` to monitor JavaScript bundle size.

## 8. Edge Cases & Error Handling

-   **Animation Fallbacks:**
    -   No WebGL required - pure Canvas 2D for compatibility.
    -   Graceful degradation on low-end devices.
    -   Console logging for performance debugging.
-   **Mouse Interaction Boundaries:**
    -   Ripples only trigger in valid screen areas.
    -   Particle repulsion capped to prevent extreme movements.
    -   Proper cleanup of event listeners.
-   **Memory Management:**
    -   Old ripples cleaned up after 2 seconds.
    -   Particle tail arrays capped at 5 positions.
    -   Canvas dimensions update on resize without memory leaks. 