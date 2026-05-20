import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

import cn from 'classnames';

import { useTextStyles } from '@rescui/typography';

import './neon-title.css';

const NeonHoverTitle = ({ text, className }) => {
  const textCn = useTextStyles();

  const titleRef = useRef(null);
  const charRefs = useRef([]);
  const mousePositionRef = useRef({ x: -1000, y: -1000 });
  const animationFrameRef = useRef(null);
  const glowRadius = 100;

  const handleMouseMove = e => {
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
      const charElements = titleRef.current.querySelectorAll('.neon-char');
      charRefs.current = Array.from(charElements);

      const updateAnimation = () => {
        const { x: mouseX, y: mouseY } = mousePositionRef.current;

        if (titleRef.current) {
          const titleRect = titleRef.current.getBoundingClientRect();

          charRefs.current.forEach(char => {
            const charRect = char.getBoundingClientRect();
            const charX = charRect.left + charRect.width / 2 - titleRect.left;
            const charY = charRect.top + charRect.height / 2 - titleRect.top;

            const distance = Math.sqrt(
              Math.pow(mouseX - charX, 2) + Math.pow(mouseY - charY, 2)
            );

            const opacity = Math.max(0, 1 - distance / glowRadius).toFixed(3);
            const neonColor = `rgba(255, 255, 255, ${opacity})`;

            char.style.setProperty('--neon-color', neonColor);
          });

          animationFrameRef.current = requestAnimationFrame(updateAnimation);
        }
      };

      animationFrameRef.current = requestAnimationFrame(updateAnimation);

      return () => {
        cancelAnimationFrame(animationFrameRef.current);
      };
    }
  }, [text]);

  const words = text.split(' ');
  let charIndex = 0;

  const content = words.map((word, wordIndex) => (
    // eslint-disable-next-line react/no-array-index-key
    <span key={wordIndex} className="neon-word">
      {word.split('').map((char, index) => {
        const currentRef = el => {
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
