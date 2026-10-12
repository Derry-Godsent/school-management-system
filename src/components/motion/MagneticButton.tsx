import { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useReducedMotion, useIsTouchDevice } from '../../lib/motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // How strongly the button follows cursor (default 0.3)
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * MagneticButton - Button wrapper that subtly pulls toward cursor on hover.
 * Uses spring physics for natural movement.
 * Disabled on touch devices and when reduced motion is preferred.
 */
export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  onClick,
  href,
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();
  const isTouchDevice = useIsTouchDevice();

  const xSpring = useSpring(position.x, { stiffness: 150, damping: 15 });
  const ySpring = useSpring(position.y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || isTouchDevice || !ref.current) return;

    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * strength;
    const y = (e.clientY - (top + height / 2)) * strength;

    xSpring.set(x);
    ySpring.set(y);
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    xSpring.set(0);
    ySpring.set(0);
    setPosition({ x: 0, y: 0 });
  };

  // If reduced motion or touch device, render static button
  if (prefersReducedMotion || isTouchDevice) {
    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={className}
          onClick={onClick}
        >
          {children}
        </a>
      );
    }
    return (
      <button className={className} onClick={onClick}>
        {children}
      </button>
    );
  }

  const content = href ? (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      className="inline-block"
    >
      {children}
    </a>
  ) : (
    <button onClick={onClick} className="inline-block">
      {children}
    </button>
  );

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: xSpring,
        y: ySpring,
      }}
    >
      {content}
    </motion.div>
  );
}
