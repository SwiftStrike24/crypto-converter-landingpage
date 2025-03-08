# Crypto Converter Landing Page

A modern, responsive landing page for Crypto Converter - a desktop app that converts between cryptocurrencies with real-time price updates.

## Features

- **Modern Design**: Dark mode with purple accents
- **Responsive**: Mobile-first approach with responsive design for all screen sizes
- **Interactive**: 3D animations and interactive elements
- **Optimized**: Fast loading and performance optimized
- **SEO Ready**: Proper metadata and structured data

## Tech Stack

- **Next.js 15**: Latest version with App Router
- **React 19**: Latest React features
- **TypeScript**: Type safety
- **Tailwind CSS 4**: Utility-first CSS framework
- **ShadCN UI**: High-quality UI components
- **Geist Font**: Modern typography

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/crypto-converter-landingpage.git
cd crypto-converter-landingpage
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx             # Main landing page
│   ├── layout.tsx           # Root layout with dark mode
│   ├── globals.css          # Global styles
├── components/              # Reusable components
│   ├── ui/                  # ShadCN UI components
│   ├── sections/            # Page sections
│   │   ├── Hero.tsx         # Main hero section
│   │   ├── Features.tsx     # Features showcase
│   │   ├── HowItWorks.tsx   # How it works section
│   │   ├── Technologies.tsx # Technologies section
│   │   ├── Testimonials.tsx # Testimonials section
│   │   ├── Download.tsx     # Download section
│   │   ├── FAQ.tsx          # FAQ section
│   ├── layout/              # Layout components
│   │   ├── Header.tsx       # Navigation component
│   │   ├── Footer.tsx       # Site footer
├── lib/                     # Utility functions
│   ├── animations.ts        # Animation utilities
│   ├── api.ts               # API utilities
│   ├── theme.ts             # Theme configuration
│   ├── utils.ts             # General utilities
├── public/                  # Static assets
    ├── images/              # Images and icons
    ├── downloads/           # Download files
```

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy

## License

MIT
