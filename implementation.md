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
        -   `ParticleWave` and `WavyBackground` provide an animated, ambient backdrop.
        -   `FloatingCryptoIcon` components feature physics-based floating animations and react to mouse-over events for a 3D parallax effect.
    -   **Converter Demo:** Embeds the interactive `ConverterDemo.tsx` component, allowing users to try the app's core functionality directly on the page.
    -   **Parallax Scroll:** The title, subtitle, and app preview move at different rates during page scroll to add depth.
-   **Optimization:** Makes heavy use of the `ClientOnly` wrapper to prevent hydration errors and ensure complex, client-side animations and data fetching do not run on the server.

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

-   **Theme:** A custom dark theme is defined in `tailwind.config.js` with specific colors for background, text, and primary/secondary accents.
-   **UI Components:** Leverages `shadcn/ui` for primitives like buttons, accordions, and tooltips, which are then custom-styled.
-   **Animations:** `framer-motion` is used extensively for both subtle (fade-ins) and complex (physics-based) animations, enhancing user engagement. Global animation styles (e.g., for keyframes) are defined directly within the components that use them via `<style jsx global>`.

## 7. Optimizations

-   **Dynamic Imports:** The `ClientOnly` component (`@/components/ClientOnly.tsx`) is a custom wrapper that defers the rendering of its children to the client side. This is crucial for performance and preventing server-side rendering of heavily interactive or browser-dependent components.
-   **Bundle Analysis:** The project is configured with `next-bundle-analyzer` (`analyze-bundle.mjs`) to help developers inspect and optimize the client-side JavaScript bundle size. 