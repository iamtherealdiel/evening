import React, { useEffect, useRef } from 'react';

// Interfaces
interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  maxOpacity: number;
  phase: number;
  amplitude: number;
}

interface ShootingStar {
  x: number;
  y: number;
  tailX: number;
  tailY: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  width: number;
  pixelSize: number;
  trail: Array<{x: number, y: number, opacity: number, size: number}>;
  tailFadeSpeed: number;
  color: string;
}

interface StarlightBackgroundProps {
  density?: number; // Number of stars per 1000px²
  shootingStarFrequency?: number; // 0-1 probability per frame
  backgroundColor?: string;
  starsOpacity?: number; // Control overall star opacity
}

export default function StarlightBackground({
  density = 0.2,
  shootingStarFrequency = 0.005,
  backgroundColor = 'transparent',
  starsOpacity = 1
}: StarlightBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animationFrameRef = useRef<number>();
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fpsInterval = useRef<number>(1000 / 60); // Target 60 FPS
  const then = useRef<number>(0);
  const lastTimeRef = useRef<number>(0); // Added this line to properly define lastTimeRef
  const startTimeRef = useRef<number>(performance.now());
  const isVisibleRef = useRef<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
    if (!ctx) return;
    
    // Optimize canvas
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Resize canvas and reinitialize stars with debouncing
    const resizeCanvas = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      // Debounce resize to avoid multiple quick resizes causing performance issues
      resizeTimeoutRef.current = setTimeout(() => {
        const pixelRatio = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        ctx.scale(pixelRatio, pixelRatio);
        
        initStars();
      }, 200);
    };
    
    // Initialize stars based on canvas size and density
    const initStars = () => {
      const stars: Star[] = [];
      const area = canvas.width * canvas.height / (window.devicePixelRatio * window.devicePixelRatio);
      const starCount = Math.floor(area * density / 800); // Increased density
      
      for (let i = 0; i < starCount; i++) {
        // More natural twinkling effect
        const twinkleSpeed = (0.001 + Math.random() * 0.002) * (Math.random() > 0.5 ? 1 : -1);
        
        stars.push({
          x: Math.random() * canvas.width / window.devicePixelRatio,
          y: Math.random() * canvas.height / window.devicePixelRatio,
          size: 0.2 + Math.random() * 1.4, // Slightly smaller stars for more realism
          opacity: Math.random(),
          twinkleSpeed: twinkleSpeed,
          maxOpacity: 0.7 + Math.random() * 0.3, // More consistent max opacity
          phase: Math.random() * Math.PI * 2, // Random starting phase
          amplitude: 0.3 + Math.random() * 0.2 // Controls twinkle intensity
        });
      }
      
      starsRef.current = stars;
    };
    
    // Create a shooting star with realistic properties
    const createShootingStar = () => {
      const canvasWidth = canvas.width / window.devicePixelRatio;
      const canvasHeight = canvas.height / window.devicePixelRatio;
      const pixelSize = 1.2 + Math.random() * 0.3; // Smaller, more consistent size
      
      let startX, startY, angle;
      
      // Determine if shooting star starts from top or sides
      if (Math.random() < 0.7) {
        // From top portion (more common)
        startX = Math.random() * canvasWidth;
        startY = Math.random() * (canvasHeight * 0.3); // Top 30% of screen
        angle = (Math.PI / 4) + (Math.random() * Math.PI / 2); // 45-135 degrees
      } else {
        // From sides (less common)
        if (Math.random() < 0.5) {
          // From left side
          startX = Math.random() * (canvasWidth * 0.2); // Left 20% of screen
          startY = Math.random() * (canvasHeight * 0.6); // Top 60% of screen
          angle = (Math.PI / 6) + (Math.random() * Math.PI / 3); // 30-90 degrees
        } else {
          // From right side
          startX = canvasWidth - (Math.random() * (canvasWidth * 0.2)); // Right 20% of screen
          startY = Math.random() * (canvasHeight * 0.6); // Top 60% of screen
          angle = (Math.PI / 2) + (Math.random() * Math.PI / 3); // 90-150 degrees
        }
      }
      
      // Calculate tail position based on angle and length
      const tailLength = 80 + Math.random() * 120;
      const tailX = startX - Math.cos(angle) * tailLength;
      const tailY = startY - Math.sin(angle) * tailLength;
      
      // More natural color - slightly warmer stars occasionally
      const colorBase = 220 + Math.floor(Math.random() * 35);
      const blueValue = colorBase - Math.floor(Math.random() * 20); // Occasionally warmer
      const color = Math.random() < 0.9 
        ? `rgb(${colorBase}, ${colorBase}, ${colorBase})` // White-ish (90%)
        : `rgb(${colorBase}, ${colorBase - 10}, ${blueValue})`; // Slightly warmer (10%)

      const star: ShootingStar = {
        x: startX,
        y: startY,
        tailX: tailX,
        tailY: tailY,
        length: tailLength,
        angle: angle,
        speed: 4 + Math.random() * 3, // More consistent speed
        opacity: 0.7 + Math.random() * 0.3,
        width: 0.6 + Math.random() * 0.4, // Thinner trails
        pixelSize: pixelSize,
        trail: [],
        tailFadeSpeed: 0.006 + Math.random() * 0.01,
        color: color
      };
      
      shootingStarsRef.current.push(star);
    };
    
    // Draw a star with a slight glow effect
    const drawStar = (star: Star) => {
      const adjustedOpacity = star.opacity * starsOpacity;
      if (adjustedOpacity <= 0) return;
      
      const now = new Date();
      const isMidnight = now.getHours() === 0;
      const pulseEffect = isMidnight ? Math.sin(performance.now() / 1000) * 0.2 + 1 : 1;
      
      const glow = ctx!.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.size * (isMidnight ? 3 : 2.5)
      );
      
      glow.addColorStop(0, `rgba(255, 255, 255, ${adjustedOpacity * pulseEffect})`);
      glow.addColorStop(0.5, `rgba(200, 220, 255, ${adjustedOpacity * 0.5 * pulseEffect})`);
      glow.addColorStop(1, `rgba(200, 220, 255, 0)`);
      
      ctx!.beginPath();
      ctx!.arc(star.x, star.y, star.size * (isMidnight ? 3 : 2.5), 0, Math.PI * 2);
      ctx!.fillStyle = glow;
      ctx!.fill();
      
      ctx!.beginPath();
      ctx!.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(255, 255, 255, ${Math.min(1, adjustedOpacity * (isMidnight ? 2 : 1.8))})`;
      ctx!.fill();
      
      // Add sparkle effect at midnight
      if (isMidnight && Math.random() < 0.1) {
        const sparkleSize = star.size * (Math.random() * 0.5 + 0.5);
        ctx!.beginPath();
        for (let i = 0; i < 4; i++) {
          const angle = (Math.PI / 2) * i;
          ctx!.moveTo(star.x, star.y);
          ctx!.lineTo(
            star.x + Math.cos(angle) * sparkleSize * 2,
            star.y + Math.sin(angle) * sparkleSize * 2
          );
        }
        ctx!.strokeStyle = `rgba(255, 255, 255, ${adjustedOpacity * 0.3})`;
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
      }
    };
    
    // Draw a small star shape
    const drawStarShape = (x: number, y: number, size: number, opacity: number, color: string) => {
      if (opacity <= 0.05) return; // Skip drawing nearly invisible stars
      
      const spikes = 5;
      const outerRadius = size;
      const innerRadius = size / 2.5;
      
      ctx!.save();
      ctx!.beginPath();
      ctx!.translate(x, y);
      ctx!.rotate(Math.PI / 2);
      
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI * 2 * i) / (spikes * 2);
        const pointX = Math.cos(angle) * radius;
        const pointY = Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx!.moveTo(pointX, pointY);
        } else {
          ctx!.lineTo(pointX, pointY);
        }
      }
      
      ctx!.closePath();
      ctx!.fillStyle = color.replace('rgb', 'rgba').replace(')', `, ${opacity * starsOpacity})`);
      ctx!.fill();
      ctx!.restore();
    };
    
    // Draw a pixelated shooting star with trail
    const drawShootingStar = (star: ShootingStar) => {
      if (star.opacity <= 0.05) return; // Skip drawing nearly invisible stars
      
      ctx!.save();
      
      if (star.opacity > 0.1) {
        const dx = star.tailX - star.x;
        const dy = star.tailY - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // Limit number of pixels to prevent performance issues
        const maxPixels = 50; 
        const pixelSize = Math.max(star.pixelSize, distance / maxPixels);
        const numberOfPixels = Math.min(Math.floor(distance / pixelSize), maxPixels);
        
        star.trail = [];
        
        for (let i = 0; i < numberOfPixels; i++) {
          const ratio = i / numberOfPixels;
          // Less jitter for smaller stars, more for larger ones
          const jitterMultiplier = 0.5 + (star.pixelSize / 3);
          const jitterX = (Math.random() - 0.5) * star.pixelSize * jitterMultiplier;
          const jitterY = (Math.random() - 0.5) * star.pixelSize * jitterMultiplier;
          
          const x = star.x + dx * ratio + jitterX;
          const y = star.y + dy * ratio + jitterY;
          // Make trail fade more gracefully
          const opacityFactor = Math.pow(1 - ratio, 1.2);
          const opacity = star.opacity * opacityFactor;
          const size = star.pixelSize * (0.7 + Math.random() * 0.3);
          
          star.trail.push({ x, y, opacity, size });
        }
      }
      
      // Draw trail from tail to head for better layering
      [...star.trail].reverse().forEach(pixel => {
        if (pixel.opacity * starsOpacity > 0.05) { // Efficiency: only draw visible pixels
          ctx!.fillStyle = star.color.replace('rgb', 'rgba').replace(')', `, ${pixel.opacity * starsOpacity})`);
          ctx!.fillRect(
            pixel.x - pixel.size / 2,
            pixel.y - pixel.size / 2,
            pixel.size,
            pixel.size
          );
        }
      });
      
      const headGlow = ctx!.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.width * 2
      );
      
      headGlow.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * starsOpacity})`);
      headGlow.addColorStop(0.5, star.color.replace('rgb', 'rgba').replace(')', `, ${star.opacity * 0.6 * starsOpacity})`));
      headGlow.addColorStop(1, `rgba(200, 220, 255, 0)`);
      
      ctx!.beginPath();
      ctx!.arc(star.x, star.y, star.width * 1.5, 0, Math.PI * 2);
      ctx!.fillStyle = headGlow;
      ctx!.fill();
      
      // Only draw tail star shape for larger shooting stars
      if (star.trail.length > 0 && star.pixelSize > 2) {
        drawStarShape(
          star.tailX + (Math.random() - 0.5) * 2, 
          star.tailY + (Math.random() - 0.5) * 2, 
          star.pixelSize * 1.8, 
          star.opacity * 0.7,
          star.color
        );
      }
      
      ctx!.restore();
    };
    
    // Handle visibility changes to pause animation when tab is not visible
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
      if (isVisibleRef.current) {
        // Reset timing references when becoming visible again
        then.current = performance.now();
        lastTimeRef.current = performance.now();
        if (!animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      } else if (animationFrameRef.current) {
        // Cancel animation when becoming invisible
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };
    
    // Animation loop with time-based updates and performance optimizations
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      
      // Calculate time elapsed since last frame
      const elapsed = timestamp - then.current;
      
      // Only update if enough time has passed
      if (elapsed > fpsInterval.current) {
        then.current = timestamp - (elapsed % fpsInterval.current);
        // Cap delta time to prevent large jumps if browser throttles or tab was in background
        const deltaTime = Math.min(elapsed, 32);
        
        lastTimeRef.current = timestamp;
        
        // Clear only the area that will be used
        ctx!.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
        
        // Update stars with smoother tweening
        starsRef.current.forEach(star => {
          // Smoother twinkle transitions with time-based animation
          star.phase += star.twinkleSpeed * deltaTime;
          
          // Smooth sinusoidal twinkling
          const twinkleEffect = Math.sin(star.phase) * star.amplitude;
          star.opacity = star.maxOpacity * (0.5 + twinkleEffect);
          
          // Occasionally change twinkling parameters for variety
          if (Math.random() < 0.0001) {
            star.twinkleSpeed = (0.001 + Math.random() * 0.002) * (Math.random() > 0.5 ? 1 : -1);
            star.amplitude = 0.3 + Math.random() * 0.2;
          }
          
          drawStar(star);
        });
        
        // Use batch processing for shooting stars
        shootingStarsRef.current = shootingStarsRef.current.filter(star => {
          // Smoother movement with consistent speed
          const dx = Math.cos(star.angle) * star.speed * (deltaTime / 16);
          const dy = Math.sin(star.angle) * star.speed * (deltaTime / 16);
          
          star.x += dx;
          star.y += dy;
          star.tailX += dx;
          star.tailY += dy;
          
          // More gradual opacity reduction for smoother fading
          star.opacity -= star.tailFadeSpeed * (deltaTime / 16);
          
          // Screen boundary check with padding
          const padding = 50;
          const canvasWidth = canvas.width / window.devicePixelRatio;
          const canvasHeight = canvas.height / window.devicePixelRatio;
          
          if (
            star.x < -padding ||
            star.x > canvasWidth + padding ||
            star.y < -padding ||
            star.y > canvasHeight + padding ||
            star.opacity <= 0
          ) {
            return false;
          }
          
          drawShootingStar(star);
          return true;
        });
        
        // Adjusted shooting star frequency with smoother timing
        const timeElapsed = (timestamp - startTimeRef.current) / 1000; // Time in seconds
        const frequencyWave = Math.sin(timeElapsed / 10) * 0.2 + 1; // Gentle wave pattern (0.8-1.2)
        
        if (Math.random() < shootingStarFrequency * frequencyWave * (deltaTime / 16) * starsOpacity) {
          // Limit maximum number of concurrent shooting stars to prevent performance issues
          if (shootingStarsRef.current.length < 5) {
            createShootingStar();
          }
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Initialize time references
    then.current = performance.now();
    lastTimeRef.current = performance.now();
    startTimeRef.current = performance.now();
    
    // Set up event listeners
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Start animation
    resizeCanvas();
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [density, shootingStarFrequency, backgroundColor, starsOpacity]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        background: backgroundColor,
        willChange: 'contents', // Optimization hint for browsers
      }}
    />
  );
}