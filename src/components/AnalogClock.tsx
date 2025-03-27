import React, { useEffect, useRef } from 'react';

interface AnalogClockProps {
  className?: string;
}

const AnalogClock: React.FC<AnalogClockProps> = ({ className = '' }) => {
  const hourHandRef = useRef<SVGLineElement>(null);
  const minuteHandRef = useRef<SVGLineElement>(null);
  const secondHandRef = useRef<SVGLineElement>(null);
  const digitalTimeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      // Calculate precise positions with millisecond precision
      const secondAngle = (seconds + milliseconds / 1000) * 6;
      const minuteAngle = (minutes + seconds / 60) * 6;
      const hourAngle = (hours + minutes / 60) * 30;

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

      // Update digital display
      if (digitalTimeRef.current) {
        const formattedHours = String(now.getHours()).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        digitalTimeRef.current.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
      }

      requestAnimationFrame(updateClock);
    };

    updateClock();
  }, []);

  return (
    <div className={`clock-container ${className}`}>
      <svg className="w-[300px] h-[300px]" viewBox="0 0 100 100">
        {/* Clock face */}
        <circle
          cx="50"
          cy="50"
          r="45"
          className="fill-white/10 stroke-white/20"
          strokeWidth="2"
        />

        {/* Hour marks */}
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="10"
            x2="50"
            y2="15"
            className="stroke-white/60"
            strokeWidth="1.5"
            transform={`rotate(${i * 30}, 50, 50)`}
          />
        ))}

        {/* Hour numbers */}
        <text x="50" y="25" className="fill-white/80 text-[4px]" textAnchor="middle" fontWeight="bold">12</text>
        <text x="75" y="52" className="fill-white/80 text-[4px]" textAnchor="middle" fontWeight="bold">3</text>
        <text x="50" y="80" className="fill-white/80 text-[4px]" textAnchor="middle" fontWeight="bold">6</text>
        <text x="25" y="52" className="fill-white/80 text-[4px]" textAnchor="middle" fontWeight="bold">9</text>

        {/* Clock hands */}
        <line
          ref={hourHandRef}
          x1="50"
          y1="50"
          x2="50"
          y2="30"
          className="stroke-white/90"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          ref={minuteHandRef}
          x1="50"
          y1="50"
          x2="50"
          y2="20"
          className="stroke-white/80"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          ref={secondHandRef}
          x1="50"
          y1="50"
          x2="50"
          y2="15"
          className="stroke-white/70"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Center point */}
        <circle cx="50" cy="50" r="2" className="fill-white/90" />
      </svg>
      <div ref={digitalTimeRef} className="text-center text-2xl mt-5 text-white/90 font-light tracking-wider">
        00:00:00
      </div>
    </div>
  );
};

export default AnalogClock;