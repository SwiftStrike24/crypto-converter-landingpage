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

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SwiftStrike24/crypto-converter-landingpage.git
cd crypto-converter-landingpage
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env.local` file with the following variables:
   ```
   # Cloudflare R2 credentials
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key_id
   R2_SECRET_ACCESS_KEY=your_secret_access_key
   R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
   R2_PUBLIC_URL=https://pub-your_account_id.r2.dev
   ```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
├── lib/                     # Utility functions
│   ├── animations.ts        # Animation utilities
│   ├── api.ts               # API utilities
│   ├── r2.ts                # Cloudflare R2 utilities
│   ├── theme.ts             # Theme configuration
│   ├── utils.ts             # General utilities
├── public/                  # Static assets
    ├── images/              # Images and icons
```

## Cloudflare R2 Setup

The landing page uses Cloudflare R2 for storing and serving application downloads. The setup includes:

1. A bucket named `cryptovertx-downloads` with the following structure:
   - `latest/CryptoVertX-Setup-1.0.0.exe` - Latest Windows installer
   - `versions/1.0.0/CryptoVertX-Setup-1.0.0.exe` - Versioned Windows installer
   - `latest/CryptoVertX-Mac-1.0.0.dmg` - Latest macOS installer
   - `versions/1.0.0/CryptoVertX-Mac-1.0.0.dmg` - Versioned macOS installer

2. API routes for:
   - Fetching file metadata (`/api/files`)
   - Downloading files (`/api/download`)

### Setting Up R2 Credentials

To set up your R2 credentials:

```bash
# Generate new R2 credentials
npm run generate-r2-credentials

# Test your R2 connection
npm run test-r2
```

### CORS Configuration

To allow direct downloads from the R2 bucket, you need to configure CORS. Use the provided `cors.json` file:

```bash
# Install Cloudflare Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Apply CORS configuration
wrangler r2 bucket cors put cryptovertx-downloads --config cors.json
```

### Troubleshooting

If you encounter issues with R2, refer to the `R2-TROUBLESHOOTING.md` file for detailed guidance.

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set up the environment variables in Vercel
4. Deploy

## License

MIT
