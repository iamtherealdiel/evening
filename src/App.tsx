import React from 'react';
import { motion } from 'framer-motion';
import TimeBackground from './components/TimeBackground';
import Hero from './components/Hero';
import ExchangeSection from './components/ExchangeSection';
import ServiceCards from './components/ServiceCards';

function App() {
  return (
    <TimeBackground>
      <div className="relative min-h-screen">
        <ServiceCards />
        <Hero />
        <ExchangeSection />
        <motion.h1 
          className="text-4xl font-bold text-white text-center w-full px-4 py-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            animate={{ 
              opacity: [1, 0.7, 1],
              textShadow: [
                "0 0 20px rgba(255,255,255,0.5)",
                "0 0 30px rgba(255,255,255,0.8)",
                "0 0 20px rgba(255,255,255,0.5)"
              ]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            EVENING© 
            2025 All Rights Reserved
          </motion.span>
        </motion.h1>
      </div>
    </TimeBackground>
  );
}

export default App;