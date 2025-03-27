import React from 'react';
import { motion } from 'framer-motion';
import { Brush, Film, Lock, Music2, Palette, Share2 } from 'lucide-react';
import { useTimeStyles } from '../hooks/useTimeStyles';

interface ServiceCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
  isComingSoon?: boolean;
  imageUrl?: string;
  link?: string;
}

const services: ServiceCard[] = [
  {
    icon: null,
    imageUrl: "https://syokdzcructfsdoyisax.supabase.co/storage/v1/object/public/images//mtiger.png",
    title: "MediaTiger",
    description: "Ultimate Media Hub For Creators",
    tag: "Media",
    link: "https://mediatiger.co"
  },
  {
    icon: <Film size={24} />,
    title: "Video Production",
    description: "Professional video editing and post-production services",
    tag: "Media",
    isComingSoon: true
  },
  {
    icon: <Music2 size={24} />,
    title: "Audio Engineering",
    description: "High-quality audio production and sound design",
    tag: "Audio",
    isComingSoon: true
  },
  {
    icon: <Palette size={24} />,
    title: "Graphic Design",
    description: "Creative visual solutions for your brand and marketing needs",
    tag: "Design",
    isComingSoon: true
  },
  {
    icon: <Share2 size={24} />,
    title: "Social Media",
    description: "Strategic social media management and content creation",
    tag: "Marketing",
    isComingSoon: true
  },
  {
    icon: <Brush size={24} />,
    title: "Digital Art",
    description: "Custom digital artwork and illustrations",
    tag: "Art",
    isComingSoon: true
  }
];

const ServiceCards = () => {
  const timeStyles = useTimeStyles();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const lockVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const handleCardClick = (link?: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex items-center min-h-screen py-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4"
      >
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            variants={cardVariants}
            whileHover={!service.isComingSoon ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${timeStyles.cardBg} backdrop-blur-xl ${timeStyles.borderColor} p-6 group ${service.link ? 'cursor-pointer' : ''}`}
            onClick={() => handleCardClick(service.link)}
          >
            {service.isComingSoon ? (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                <motion.div
                  variants={lockVariants}
                  initial="initial"
                  animate="animate"
                  className="text-white/40"
                >
                  <Lock size={32} />
                </motion.div>
                <motion.p
                  variants={lockVariants}
                  initial="initial"
                  animate="animate"
                  className="mt-4 text-white/40 font-medium text-sm"
                >
                  Coming Soon
                </motion.p>
              </div>
            ) : null}
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${timeStyles.iconBg} ${timeStyles.textColor}`}>
                  {service.imageUrl ? (
                    <img 
                      src={service.imageUrl} 
                      alt={service.title}
                      className="w-6 h-6 object-contain"
                    />
                  ) : service.icon}
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  service.isComingSoon 
                    ? 'bg-white/5 text-white/60' 
                    : `${timeStyles.tagBg} ${timeStyles.tagText}`
                }`}>
                  {service.tag}
                </span>
              </div>
              
              <h3 className={`text-xl font-semibold mb-2 ${
                service.isComingSoon ? 'text-white/20' : timeStyles.textColor
              }`}>
                {service.title}
              </h3>
              
              <p className={`text-sm leading-relaxed ${
                service.isComingSoon ? 'text-white/20' : timeStyles.textColor
              }`}>
                {service.description}
              </p>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ServiceCards;