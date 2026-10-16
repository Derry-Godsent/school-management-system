import { useEffect, useRef } from 'react';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';

/* -------------------------------------------------------------------------
   Floating3DParticles, a slow drift of depth-sorted motes on a canvas.

   Particles carry a `z` between 0 and 1 which scales their size, opacity and
   parallax response, so a flat canvas reads as a volume. Density is chosen by
   device tier, the loop pauses off-screen, and only one canvas is ever live.
   ------------------------------------------------------------------------- */
interface Particle {
  x: number;
  y: number;
  z: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
}

export function Floating3DParticles({
  quantity = 120,
  color = '#c9a227',
  className = '',
  /** 0 = flat, 1 = strong depth response */
  depth = 0.8,
  opacity = 0.55,
}: {
  quantity?: number;
  color?: string;
  className?: string;
  depth?: number;
  opacity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !allowed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale density down on phones and weak devices.
    const count = Math.round(
      quantity * (tier.isMobile ? 0.45 : 1) * (tier.lowPower ? 0.5 : 1)
    );

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let running = true;
    let pointer = { x: 0, y: 0 };
    let pointerTarget = { x: 0, y: 0 };

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: count }, () => {
        const z = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          r: 0.4 + z * 1.9,
          vx: (Math.random() - 0.5) * 0.12 * (0.4 + z),
          vy: -(0.06 + Math.random() * 0.22) * (0.4 + z),
          a: (0.18 + z * 0.62) * opacity,
        };
      });
    };

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      // Ease the parallax so the field glides rather than snapping.
      pointer.x += (pointerTarget.x - pointer.x) * 0.05;
      pointer.y += (pointerTarget.y - pointer.y) * 0.05;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around, keeping the field continuous.
        if (p.y < -6) {
          p.y = height + 6;
          p.x = Math.random() * width;
        }
        if (p.x < -6) p.x = width + 6;
        if (p.x > width + 6) p.x = -6;

        const px = p.x + pointer.x * depth * (0.4 + p.z) * 26;
        const py = p.y + pointer.y * depth * (0.4 + p.z) * 26;

        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.a;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerTarget = {
        x: (event.clientX - rect.left) / rect.width - 0.5,
        y: (event.clientY - rect.top) / rect.height - 0.5,
      };
    };

    seed();
    frame = requestAnimationFrame(draw);

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries[0]?.isIntersecting ?? true;
        if (visible && !running) {
          running = true;
          frame = requestAnimationFrame(draw);
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(frame);
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(frame);
      } else if (!running) {
        running = true;
        frame = requestAnimationFrame(draw);
      }
    };

    window.addEventListener('resize', seed);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', seed);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [allowed, quantity, color, depth, opacity, tier.isMobile, tier.lowPower]);

  if (!allowed) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

/* -------------------------------------------------------------------------
   LightRays, soft beams falling from above. Pure CSS transforms on a small
   number of blurred elements, so it costs almost nothing.
   ------------------------------------------------------------------------- */
export function LightRays({ className = '', intensity = 1 }: { className?: string; intensity?: number }) {
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);

  if (!allowed) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity: intensity }}
    >
      {[0, 1, 2, 3].map(i => (
        <span
          key={i}
          className="light-ray"
          style={{
            left: `${12 + i * 22}%`,
            animationDelay: `${i * 1.6}s`,
            animationDuration: `${9 + i * 2.2}s`,
          }}
        />
      ))}
      {/* Warm bloom anchoring the rays */}
      <span className="absolute -top-1/3 left-1/2 h-[70%] w-[70%] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
    </div>
  );
}
