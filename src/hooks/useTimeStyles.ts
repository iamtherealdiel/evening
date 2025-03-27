import { useMemo } from 'react';

export const useTimeStyles = () => {
  const getTimeBasedColors = () => {
    const hours = new Date().getHours();

    // Maximum starlight (12 AM - 5 AM)
    if (hours >= 0 && hours < 5) {
      return {
        cardBg: 'from-indigo-950/30 to-purple-950/30',
        textColor: 'text-white/90',
        borderColor: 'border-white/10',
        iconBg: 'bg-black/40',
        tagBg: 'bg-white/10',
        tagText: 'text-white/80'
      };
    }

    // Early Dawn (5 AM - 6 AM)
    if (hours === 5) {
      return {
        cardBg: 'from-indigo-900/30 to-purple-900/30',
        textColor: 'text-white/90',
        borderColor: 'border-white/10',
        iconBg: 'bg-black/30',
        tagBg: 'bg-white/10',
        tagText: 'text-white/80'
      };
    }

    // Sunrise (6 AM - 7 AM)
    if (hours === 6) {
      return {
        cardBg: 'from-orange-400/20 to-yellow-400/20',
        textColor: 'text-white',
        borderColor: 'border-white/20',
        iconBg: 'bg-black/20',
        tagBg: 'bg-white/20',
        tagText: 'text-white'
      };
    }

    // Day (8 AM - 6 PM)
    if (hours >= 8 && hours < 18) {
      return {
        cardBg: 'from-sky-400/20 to-blue-400/20',
        textColor: 'text-white',
        borderColor: 'border-white/20',
        iconBg: 'bg-black/20',
        tagBg: 'bg-white/20',
        tagText: 'text-white'
      };
    }

    // Evening (6 PM - 7 PM)
    if (hours >= 18 && hours < 19) {
      return {
        cardBg: 'from-orange-600/30 to-purple-600/30',
        textColor: 'text-white',
        borderColor: 'border-white/15',
        iconBg: 'bg-black/30',
        tagBg: 'bg-white/15',
        tagText: 'text-white/90'
      };
    }

    // Evening transition (7 PM - 8 PM)
    if (hours >= 19 && hours < 20) {
      return {
        cardBg: 'from-purple-800/30 to-indigo-800/30',
        textColor: 'text-white/90',
        borderColor: 'border-white/10',
        iconBg: 'bg-black/40',
        tagBg: 'bg-white/10',
        tagText: 'text-white/80'
      };
    }

    // Night (8 PM - 12 AM)
    return {
      cardBg: 'from-indigo-950/30 to-purple-950/30',
      textColor: 'text-white/90',
      borderColor: 'border-white/10',
      iconBg: 'bg-black/40',
      tagBg: 'bg-white/10',
      tagText: 'text-white/80'
    };
  };

  return useMemo(() => getTimeBasedColors(), []);
};