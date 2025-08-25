'use client';
import { useRef } from 'react';
import { useScroll, useVelocity } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import Download from '@/components/sections/Download';
import FAQ from '@/components/sections/FAQ';

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroScrollYVelocity = useVelocity(heroScrollYProgress);

  const featuresRef = useRef(null);
  const { scrollYProgress: featuresScrollYProgress } = useScroll({
    target: featuresRef,
    offset: ['start start', 'end start'],
  });
  const featuresScrollYVelocity = useVelocity(featuresScrollYProgress);

  const howItWorksRef = useRef(null);
  const { scrollYProgress: howItWorksScrollYProgress } = useScroll({
    target: howItWorksRef,
    offset: ['start start', 'end start'],
  });
  const howItWorksScrollYVelocity = useVelocity(howItWorksScrollYProgress);

  const downloadRef = useRef(null);
  const { scrollYProgress: downloadScrollYProgress } = useScroll({
    target: downloadRef,
    offset: ['start start', 'end start'],
  });
  const downloadScrollYVelocity = useVelocity(downloadScrollYProgress);

  const faqRef = useRef(null);
  const { scrollYProgress: faqScrollYProgress } = useScroll({
    target: faqRef,
    offset: ['start start', 'end start'],
  });
  const faqScrollYVelocity = useVelocity(faqScrollYProgress);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <div ref={heroRef}>
          <Hero scrollYProgress={heroScrollYProgress} scrollYVelocity={heroScrollYVelocity} />
        </div>
        <div ref={featuresRef} className="relative z-10 md:-mt-48 -mt-32">
          <Features
            heroScrollYProgress={heroScrollYProgress}
            featuresScrollYProgress={featuresScrollYProgress}
            featuresScrollYVelocity={featuresScrollYVelocity}
          />
        </div>
        <div ref={howItWorksRef} className="relative z-20 -mt-32">
          <HowItWorks
            featuresScrollYProgress={featuresScrollYProgress}
            howItWorksScrollYProgress={howItWorksScrollYProgress}
            howItWorksScrollYVelocity={howItWorksScrollYVelocity}
          />
        </div>
        <div ref={downloadRef} className="relative z-30 -mt-32">
          <Download
            howItWorksScrollYProgress={howItWorksScrollYProgress}
            downloadScrollYProgress={downloadScrollYProgress}
            downloadScrollYVelocity={downloadScrollYVelocity}
          />
        </div>
        <div ref={faqRef} className="relative z-40 -mt-32">
          <FAQ
            downloadScrollYProgress={downloadScrollYProgress}
            faqScrollYProgress={faqScrollYProgress}
            faqScrollYVelocity={faqScrollYVelocity}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
