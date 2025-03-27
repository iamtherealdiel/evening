import React from 'react';
import { Mail, User, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTimeStyles } from '../hooks/useTimeStyles';

const Hero = () => {
  const timeStyles = useTimeStyles();

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`w-full max-w-2xl mx-auto overflow-hidden rounded-2xl bg-gradient-to-br ${timeStyles.cardBg} backdrop-blur-xl ${timeStyles.borderColor} p-8`}
      >
        <div className="flex items-start justify-between mb-6">
          <div className={`p-3 rounded-xl ${timeStyles.iconBg} ${timeStyles.textColor}`}>
            <User className="w-6 h-6" />
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${timeStyles.tagBg} ${timeStyles.tagText}`}>
            About
          </span>
        </div>

        <motion.h2 
          className={`text-3xl font-bold mb-4 ${timeStyles.textColor}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Hi, I'm Dee
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className={`space-y-4 text-base ${timeStyles.textColor}`}
        >
          <p className="leading-relaxed">
            I'm from the US. I like to create things.
            <br />I'm a pretty simple guy.
          </p>

          <p className="leading-relaxed">
            If you want to work together, shoot me an email.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="pt-4 flex gap-4"
          >
            <a
              href="mailto:dee@evening.info"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              <span>dee@evening.info</span>
            </a>
            <a
              href="https://www.linkedin.com/in/diellee/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all duration-300"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
          </motion.div>
        </motion.div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
};

export default Hero;