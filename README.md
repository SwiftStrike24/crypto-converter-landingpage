# CryptoVertX Landing Page

A modern, responsive landing page for CryptoVertX - a desktop app that converts between cryptocurrencies with real-time price updates.

## Features

- **Modern Design**: Dark mode with purple accents
- **Responsive**: Mobile-first approach with responsive design for all screen sizes
- **Interactive**: 3D animations and interactive elements
- **Optimized**: Fast loading and performance optimized
- **SEO Ready**: Proper metadata and structured data
- **Dynamic Downloads**: Integrated with Cloudflare R2 for file downloads

## Tech Stack

- **Next.js 15**: Latest version with App Router
- **React 19**: Latest React features
- **TypeScript**: Type safety
- **Tailwind CSS 4**: Utility-first CSS framework
- **ShadCN UI**: High-quality UI components
- **Geist Font**: Modern typography
- **Cloudflare R2**: Object storage for app downloads

## Performance Optimizations

The project includes several optimizations for Cloudflare Pages deployment:

1. **Webpack Chunk Splitting**: Configured to stay under Cloudflare's 25MB file size limit
2. **Dynamic Imports**: Lazy-loading of heavy components like Framer Motion
3. **CSS Optimization**: PostCSS with cssnano for production
4. **Bundle Analysis**: Tools to analyze and optimize bundle size
5. **Custom Carousel**: Lightweight implementation without external dependencies

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- pnpm 8.0.0 or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SwiftStrike24/crypto-converter-landingpage.git
cd crypto-converter-landingpage
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   - Edit the `.env.local` file with your Cloudflare R2 credentials:
   ```
   # Cloudflare R2 credentials
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key_id
   R2_SECRET_ACCESS_KEY=your_secret_access_key
   R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
   R2_PUBLIC_URL=https://pub-your_account_id.r2.dev
   NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-your_account_id.r2.dev
   ```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build and Analyze

### Production Build

```bash
pnpm build
```

### Bundle Analysis

To analyze the bundle size:

```bash
pnpm analyze
```

Or on Windows:

```bash
analyze.bat
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx             # Main landing page
│   ├── layout.tsx           # Root layout with dark mode
│   ├── globals.css          # Global styles
│   ├── api/                 # API routes
│   │   ├── download/        # File download API
│   │   ├── files/           # File metadata API
├── components/              # Reusable components
│   ├── ui/                  # ShadCN UI components
│   ├── sections/            # Page sections
│   │   ├── Hero.tsx         # Main hero section
│   │   ├── Features.tsx     # Features showcase
│   │   ├── HowItWorks.tsx   # How it works section
│   │   ├── Download.tsx     # Download section
│   │   ├── FAQ.tsx          # FAQ section
│   ├── layout/              # Layout components
│   │   ├── Header.tsx       # Navigation component
│   │   ├── Footer.tsx       # Site footer
│   ├── DynamicImports.tsx   # Dynamic imports for optimization
├── lib/                     # Utility functions
│   ├── animations.ts        # Animation utilities
│   ├── api.ts               # API utilities
│   ├── r2.ts                # Cloudflare R2 utilities
│   ├── env.ts               # Environment configuration
│   ├── theme.ts             # Theme configuration
│   ├── utils.ts             # General utilities
├── public/                  # Static assets
    ├── images/              # Images and icons
```

## Cloudflare R2 Setup

The landing page uses Cloudflare R2 for storing and serving application downloads. The setup includes:

1. A bucket named `cryptovertx-downloads` with the following structure:
   - `latest/CryptoVertX-Installer-v1.7.2.msi` - Latest Windows installer (`.msi` or `.exe`)
   - `versions/1.7.2/CryptoVertX-Installer-v1.7.2.msi` - Versioned Windows installer
   - `latest/CryptoVertX-Mac-1.0.0.dmg` - Latest macOS installer (`.dmg` or `.pkg`)
   - `versions/1.0.0/CryptoVertX-Mac-1.0.0.dmg` - Versioned macOS installer

   **Note on Naming:** For the automatic detection to work, Windows installers in the `latest/` directory should have filenames containing either **"Setup"** or **"Installer"**.

2. API routes for:
   - Fetching file metadata (`/api/files`)
   - Downloading files (`/api/download`)

### Setting Up R2 Credentials

To set up your R2 credentials:

1. Create a Cloudflare R2 bucket named `cryptovertx-downloads`
2. Create an API token with the following permissions:
   - Object Read (required for listing and downloading files)
   - Object Write (optional, only needed if you plan to upload files)
   - Bucket Read (required for listing buckets and checking CORS)
   - Bucket Write (optional, only needed if you plan to modify bucket settings)
3. Add your credentials to the `.env.local` file

### CORS Configuration

To allow direct downloads from the R2 bucket, you need to configure CORS. Use the provided `cors.json` file:

```bash
# Install Cloudflare Wrangler CLI
pnpm add -g wrangler

# Login to Cloudflare
wrangler login

# Apply CORS configuration
wrangler r2 bucket cors put cryptovertx-downloads --config cors.json
```

## Deployment

This project is optimized for deployment on Cloudflare Pages:

1. Push your code to GitHub
2. Import the repository in Cloudflare Pages
3. Set up the environment variables in Cloudflare Pages
4. Deploy

## License

MIT
