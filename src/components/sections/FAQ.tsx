'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// FAQ data
const faqItems = [
  {
    id: 'what-is',
    question: 'What is CryptoVertX?',
    answer: 'CryptoVertX is a sleek and powerful desktop application that lets you convert between cryptocurrencies in real-time. It features a modern, easy-to-use interface with smooth animations.',
  },
  {
    id: 'platforms',
    question: 'Which platforms is CryptoVertX available on?',
    answer: 'CryptoVertX is available for Windows and macOS computers, providing the same great experience on both platforms.',
  },
  {
    id: 'cryptocurrencies',
    question: 'How many cryptocurrencies does it support?',
    answer: 'CryptoVertX supports multiple popular cryptocurrencies with real-time price updates. You can easily search and add new cryptocurrencies to track based on your interests.',
  },
  {
    id: 'features',
    question: 'What can I do with CryptoVertX?',
    answer: 'With CryptoVertX, you can convert between cryptocurrencies in real-time, view detailed price charts, track multiple currencies at once, and quickly access the app with a keyboard shortcut. The app stays out of your way when minimized but is always ready when you need it.',
  },
  {
    id: 'ease-of-use',
    question: 'Is CryptoVertX easy to use?',
    answer: 'Absolutely! CryptoVertX is designed to be intuitive and user-friendly. The clean interface makes it easy to convert currencies, view charts, and track your favorite cryptocurrencies without any technical knowledge.',
  },
  {
    id: 'shortcuts',
    question: 'Are there any shortcuts to access the app quickly?',
    answer: 'Yes! You can press the backtick key (` or ~) on your keyboard to instantly bring up the app from anywhere. When you\'re done, the app minimizes to your system tray so it\'s never in the way but always available.',
  },
  {
    id: 'data-privacy',
    question: 'How does CryptoVertX handle my data?',
    answer: 'Your privacy is important to us. CryptoVertX stores all your data locally on your device. We don\'t collect or store any personal information on our servers. The app only connects to cryptocurrency services to fetch the latest price data.',
  },
  {
    id: 'api-source',
    question: 'Where does the price data come from?',
    answer: 'CryptoVertX uses data from trusted cryptocurrency services to ensure you always have accurate and up-to-date price information for making informed decisions.',
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-24 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-noise-pattern opacity-[0.03]"></div>
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-radial from-primary/10 to-transparent opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-secondary/10 to-transparent opacity-20 blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-primary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            className="text-text-secondary max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Everything you need to know about CryptoVertX
          </motion.p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <AccordionItem 
                  value={item.id}
                  className="border border-gray-800/50 rounded-xl overflow-hidden bg-background-card/30 backdrop-blur-sm"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-background-darker/20 transition-all duration-200 text-left">
                    <span className="text-lg font-medium text-text-primary">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 text-text-secondary border-t border-gray-800/30">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <p>{item.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
} 