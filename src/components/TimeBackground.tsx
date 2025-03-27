import React, { useEffect, useState, useMemo } from 'react';
import StarlightBackground from './StarlightBackground';

interface TimeBackgroundProps {
  children: React.ReactNode;
}

const TimeBackground: React.FC<TimeBackgroundProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeBasedStyles = useMemo(() => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const time = hours * 60 + minutes;

    // Calculate star density based on time
    const getStarDensity = () => {
      // Maximum starlight (12 AM - 5 AM)
      if (hours >= 0 && hours < 5) {
        return 0.4;
      }
      // Reduced starlight (8 PM - 12 AM)
      if (hours >= 20) {
        return 0.2;
      }
      return 0.15; // Base density for other times
    };

    // Maximum starlight (12 AM - 5 AM)
    if (hours >= 0 && hours < 5) {
      return {
        background: 'black',
        showStars: true,
        starsOpacity: 1,
        starDensity: getStarDensity(),
      };
    }

    // Early Dawn (5 AM - 6 AM)
    if (hours === 5) {
      const progress = minutes / 60;
      return {
        background: `linear-gradient(to top, 
          rgb(${Math.min(50 + progress * 100, 150)}, ${Math.min(50 + progress * 50, 100)}, ${Math.min(100 + progress * 50, 150)}),
          rgb(0, 0, ${Math.min(50 + progress * 100, 150)})
        )`,
        showStars: true,
        starsOpacity: 1 - progress,
        starDensity: 0.15,
      };
    }

    // Sunrise (6 AM - 7 AM)
    if (hours === 6) {
      const progress = minutes / 60;
      return {
        background: `linear-gradient(to top, 
          rgb(255, ${Math.min(165 + progress * 90, 255)}, ${Math.min(0 + progress * 100, 100)}),
          rgb(${Math.min(150 + progress * 105, 255)}, ${Math.min(150 + progress * 105, 255)}, ${Math.min(150 + progress * 105, 255)})
        )`,
        showStars: false,
        starsOpacity: 0,
        starDensity: 0.15,
      };
    }

    // Day (8 AM - 6 PM)
    if (hours >= 8 && hours < 18) {
      return {
        background: 'rgb(135, 206, 235)', // Sky blue
        showStars: false,
        starsOpacity: 0,
        starDensity: 0.15,
      };
    }

    // Evening (6 PM - 7 PM)
    if (hours >= 18 && hours < 19) {
      const progress = minutes / 60;
      return {
        background: `linear-gradient(to top,
          rgb(${255 - progress * 100}, ${165 - progress * 100}, ${progress * 150}),
          rgb(${255 - progress * 150}, ${200 - progress * 150}, ${progress * 200})
        )`,
        showStars: false,
        starsOpacity: 0,
        starDensity: 0.15,
      };
    }

    // Evening transition to night (7 PM - 8 PM)
    if (hours >= 19 && hours < 20) {
      const progress = minutes / 60;
      return {
        background: `linear-gradient(to top,
          rgb(${155 - progress * 155}, ${65 - progress * 65}, ${150 + progress * 50}),
          rgb(${105 - progress * 105}, ${50 - progress * 50}, ${200 + progress * 55})
        )`,
        showStars: true,
        starsOpacity: progress,
        starDensity: 0.15 + (progress * 0.05),
      };
    }

    // Reduced starlight (8 PM - 12 AM)
    if (hours >= 20) {
      return {
        background: 'black',
        showStars: true,
        starsOpacity: 1,
        starDensity: getStarDensity(),
      };
    }

    // Default fallback
    return {
      background: 'rgb(135, 206, 235)', // Sky blue
      showStars: false,
      starsOpacity: 0,
      starDensity: 0.15,
    };
  }, [currentTime]);

  return (
    <div
      className="relative min-h-screen transition-all duration-1000"
      style={{ background: getTimeBasedStyles.background }}
    >
      <StarlightBackground
        density={getTimeBasedStyles.starDensity}
        shootingStarFrequency={0.01}
        starsOpacity={getTimeBasedStyles.showStars ? getTimeBasedStyles.starsOpacity : 0}
      />
      {children}
    </div>
  );
};

export default TimeBackground;