import React, { useEffect, useRef } from 'react';

import cn from 'classnames';

import { useTextStyles } from '@rescui/typography';

import './neon-title.css';

const glowRadius = 100;
const introAnimationParams = {
  charDelay: 75,
  duration: 500
};

type NeonHoverTitleProps = {
  text: string;
  className?: string;
  introAnimation?: boolean;
};

const getIntroAnimation = (elapsed: number, index: number) => {
  const progress =
    (elapsed - index * introAnimationParams.charDelay) / introAnimationParams.duration;

  if (progress < 0 || progress > 1) {
    return 0;
  }

  return Math.sin(progress * Math.PI);
};

const NeonHoverTitle = ({ text, className, introAnimation = false }: NeonHoverTitleProps) => {
  const textCn = useTextStyles();

  const titleRef = useRef<HTMLParagraphElement | null>(null);
  const charRefs = useRef<HTMLSpanElement[]>([]);
  const mousePositionRef = useRef({ x: -1000, y: -1000 });
  const animationFrameRef = useRef<number | null>(null);
  const introStartTimeRef = useRef(0);
  const introCompleteRef = useRef(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLParagraphElement>) => {
    if (titleRef.current) {
      const rect = titleRef.current.getBoundingClientRect();
      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handleMouseLeave = () => {
    mousePositionRef.current = { x: -1000, y: -1000 };
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (titleRef.current && typeof window !== 'undefined') {
      const charElements = titleRef.current.querySelectorAll<HTMLSpanElement>('.neon-char');
      charRefs.current = Array.from(charElements);
      introStartTimeRef.current = window.performance.now();
      introCompleteRef.current =
        !introAnimation ||
        (typeof window.matchMedia === 'function' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches);

      const updateAnimation = (currentTime: number) => {
        const { x: mouseX, y: mouseY } = mousePositionRef.current;

        if (titleRef.current) {
          const titleRect = titleRef.current.getBoundingClientRect();
          const introElapsed = currentTime - introStartTimeRef.current;
          const introTotalDuration =
            (charRefs.current.length - 1) * introAnimationParams.charDelay +
            introAnimationParams.duration;

          if (introElapsed > introTotalDuration) {
            introCompleteRef.current = true;
          }

          charRefs.current.forEach((char, index) => {
            const charRect = char.getBoundingClientRect();
            const charX = charRect.left + charRect.width / 2 - titleRect.left;
            const charY = charRect.top + charRect.height / 2 - titleRect.top;

            const distance = Math.sqrt(
              Math.pow(mouseX - charX, 2) + Math.pow(mouseY - charY, 2)
            );

            const hoverOpacity = Math.max(0, 1 - distance / glowRadius);
            const introAnimationOpacity = introCompleteRef.current
              ? 0
              : getIntroAnimation(introElapsed, index);
            const opacity = Math.max(hoverOpacity, introAnimationOpacity).toFixed(3);
            const neonColor = `rgba(255, 255, 255, ${opacity})`;

            char.style.setProperty('--neon-color', neonColor);
          });

          animationFrameRef.current = requestAnimationFrame(updateAnimation);
        }
      };

      animationFrameRef.current = requestAnimationFrame(updateAnimation);

      return () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [introAnimation, text]);

  const words = text.split(' ');
  let charIndex = 0;

  const content = words.map((word, wordIndex) => (
    // eslint-disable-next-line react/no-array-index-key
    <span key={wordIndex} className="neon-word">
      {word.split('').map((char, index) => {
        const currentRef = (el: HTMLSpanElement | null) => {
          if (el) {
            charRefs.current[charIndex] = el;
          }
          charIndex++;
        };
        return (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={`${wordIndex}-${index}`}
            className="neon-char"
            ref={currentRef}
          >
            {char}
          </span>
        );
      })}
      {wordIndex < words.length - 1 && '\u00A0'}
    </span>
  ));

  return (
    <p
      aria-hidden="true"
      className={cn(textCn('rs-middle-hero'), 'neon-title', className)}
      ref={titleRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {content}
    </p>
  );
};

export default NeonHoverTitle;
