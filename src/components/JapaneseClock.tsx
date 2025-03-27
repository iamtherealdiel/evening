import React, { useEffect, useRef } from 'react';

interface JapaneseClockProps {
  className?: string;
}

const JapaneseClock: React.FC<JapaneseClockProps> = ({ className = '' }) => {
  const hourHandRef = useRef<SVGGElement>(null);
  const minuteHandRef = useRef<SVGGElement>(null);
  const secondHandRef = useRef<SVGGElement>(null);
  const digitalTimeRef = useRef<HTMLDivElement>(null);
  const hourGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      // Calculate precise positions with millisecond precision
      const secondAngle = (seconds + milliseconds / 1000) * 6;
      const minuteAngle = (minutes + seconds / 60) * 6;
      const hourAngle = ((hours % 12) + minutes / 60) * 30;

      // Update hand rotations
      if (hourHandRef.current) {
        hourHandRef.current.setAttribute('transform', `rotate(${hourAngle}, 50, 50)`);
      }
      if (minuteHandRef.current) {
        minuteHandRef.current.setAttribute('transform', `rotate(${minuteAngle}, 50, 50)`);
      }
      if (secondHandRef.current) {
        secondHandRef.current.setAttribute('transform', `rotate(${secondAngle}, 50, 50)`);
      }

      // Update hour glow effect
      if (hourGlowRef.current) {
        if (hours === 0 || hours === 12) {
          hourGlowRef.current.style.opacity = '0.8';
          hourGlowRef.current.style.background = 'radial-gradient(circle, rgba(255,215,120,0.6) 0%, rgba(255,215,120,0) 70%)';
        } else if (hours === 6 || hours === 18) {
          hourGlowRef.current.style.opacity = '0.5';
          hourGlowRef.current.style.background = 'radial-gradient(circle, rgba(252,180,213,0.4) 0%, rgba(252,180,213,0) 70%)';
        } else {
          hourGlowRef.current.style.opacity = '0';
        }
      }

      // Update digital display with 12-hour format
      if (digitalTimeRef.current) {
        let hours12 = hours % 12;
        if (hours12 === 0) hours12 = 12;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = String(hours12).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        digitalTimeRef.current.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
      }

      requestAnimationFrame(updateClock);
    };

    updateClock();
  }, []);

  return (
    <div className="scene">
      <div className="relative w-[400px] h-[400px]">
        <div className="clock-container relative w-[300px] h-[300px] mx-auto [transform-style:preserve-3d] animate-float">
          <svg className="w-full h-full [filter:drop-shadow(0_10px_20px_rgba(0,0,0,0.2))]" viewBox="0 0 100 100">
            {/* Gradients and filters */}
            <defs>
              <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#fff8e1" />
                <stop offset="85%" stopColor="#fff2cc" />
                <stop offset="100%" stopColor="#ffe0b2" />
              </radialGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Clock face */}
            <circle cx="50" cy="50" r="48" fill="none" stroke="#d7b377" strokeWidth="2" />
            <circle cx="50" cy="50" r="45" fill="url(#bg-gradient)" stroke="#b19259" strokeWidth="1" />
            
            {/* Decorative patterns */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="#d7b377" strokeWidth="0.5" strokeDasharray="1,3" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="#d7b377" strokeWidth="0.5" strokeDasharray="2,4" />

            {/* Hour marks */}
            {[...Array(12)].map((_, i) => (
              <React.Fragment key={i}>
                <line
                  x1="50"
                  y1="10"
                  x2="50"
                  y2={i % 3 === 0 ? "15" : "13"}
                  stroke="#614b2a"
                  strokeWidth={i % 3 === 0 ? "1.5" : "1"}
                  transform={`rotate(${i * 30}, 50, 50)`}
                />
              </React.Fragment>
            ))}

            {/* Japanese numbers */}
            <text x="50" y="24" textAnchor="middle" fontSize="4" fontFamily="sans-serif" fill="#614b2a">十二</text>
            <text x="76" y="52" textAnchor="middle" fontSize="4" fontFamily="sans-serif" fill="#614b2a">三</text>
            <text x="50" y="80" textAnchor="middle" fontSize="4" fontFamily="sans-serif" fill="#614b2a">六</text>
            <text x="24" y="52" textAnchor="middle" fontSize="4" fontFamily="sans-serif" fill="#614b2a">九</text>

            {/* Clock hands */}
            <g ref={hourHandRef} filter="url(#glow)">
              <line x1="50" y1="50" x2="50" y2="30" stroke="#614b2a" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M48.5,30 L50,25 L51.5,30 Z" fill="#614b2a" />
            </g>

            <g ref={minuteHandRef} filter="url(#glow)">
              <line x1="50" y1="50" x2="50" y2="22" stroke="#614b2a" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M49,22 L50,18 L51,22 Z" fill="#614b2a" />
            </g>

            <g ref={secondHandRef} filter="url(#glow)">
              <line x1="50" y1="60" x2="50" y2="17" stroke="#c93545" strokeWidth="1" strokeLinecap="round" />
              <circle cx="50" cy="17" r="1" fill="#c93545" />
            </g>

            {/* Center decoration */}
            <circle cx="50" cy="50" r="3" fill="#614b2a" />
            <circle cx="50" cy="50" r="1.5" fill="#c93545" />
          </svg>
          <div ref={hourGlowRef} className="hour-glow absolute top-1/2 left-1/2 w-[60px] h-[60px] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-500" />
        </div>
        <div ref={digitalTimeRef} className="text-center text-[1.8rem] mt-5 text-[#333] font-['Courier_New',monospace] [text-shadow:2px_2px_4px_rgba(0,0,0,0.1)]">
          00:00:00 AM
        </div>
      </div>
    </div>
  );
};

export default JapaneseClock;