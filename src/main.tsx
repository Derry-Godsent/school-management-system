import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import Lenis from "lenis";
import "./index.css";
import App from "./App.tsx";

// ============================================================================
// LENIS SMOOTH SCROLL SETUP
// Initializes smooth scrolling with mobile/touch device detection.
// On touch devices, we use native scroll to prevent jank.
// ============================================================================

function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Detect touch/mobile devices
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // Skip Lenis on touch/mobile devices to prevent scroll jank
    if (isTouchDevice || isMobileUA) {
      // Use native smooth scroll as fallback
      document.documentElement.style.scrollBehavior = 'smooth';
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.documentElement.style.scrollBehavior = 'auto';
      return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Store reference on window for access from components
    (window as any).__lenis = lenis;

    // Dispatch custom event so components can listen
    window.dispatchEvent(new CustomEvent('lenis-initialized'));

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle hash link clicks for smooth scroll to anchors
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          const element = document.querySelector(href) as HTMLElement | null;
          if (element) {
            e.preventDefault();
            lenis.scrollTo(element, { offset: 0, duration: 1.5 });
          }
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    // Cleanup
    return () => {
      lenis.destroy();
      delete (window as any).__lenis;
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return <>{children}</>;
}

// ============================================================================
// APP ROOT
// ============================================================================

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SmoothScrollProvider>
      <App />
    </SmoothScrollProvider>
  </React.StrictMode>
);
