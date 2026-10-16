import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { useDeviceTier, useMotionAllowed } from '../../lib/useDeviceTier';

interface DeviceFrameProps {
  children: ReactNode;
  className?: string;
  /** Frame colour. */
  tone?: 'ink' | 'silver';
  /** Slowly drift the screen content upward to suggest a live app. */
  autoScroll?: boolean;
  screenClassName?: string;
}

/**
 * DeviceFrame: a phone shell for showing the portals on a small screen.
 *
 * Used with a real interface inside rather than a video, so what a school owner
 * sees in the frame is the product itself. The optional auto-scroll drifts the
 * inner content to hint at a live app without needing a recording.
 */
export function DeviceFrame({
  children,
  className = '',
  tone = 'ink',
  autoScroll = true,
  screenClassName = '',
}: DeviceFrameProps) {
  const tier = useDeviceTier();
  const allowed = useMotionAllowed(tier);
  const shellRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!allowed || !autoScroll) return;
    const inner = canvasRef.current;
    const shell = shellRef.current;
    if (!inner || !shell) return;

    let raf = 0;
    let progress = 0;
    let direction = 1;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;

      const maxShift = Math.max(inner.scrollHeight - shell.clientHeight, 0);
      if (maxShift <= 4) {
        raf = requestAnimationFrame(step);
        return;
      }

      progress += direction * dt * 0.012;
      // Hold at each end before turning around.
      if (progress > maxShift) {
        progress = maxShift;
        direction = -1;
      } else if (progress < 0) {
        progress = 0;
        direction = 1;
      }

      setOffset(progress);
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [allowed, autoScroll]);

  const shellTone =
    tone === 'silver'
      ? 'bg-gradient-to-b from-[#e9e9ea] to-[#c8c8cc] text-ink'
      : 'bg-gradient-to-b from-[#2a2a2c] to-[#101010] text-paper';

  return (
    <div className={cn('relative mx-auto w-full max-w-[280px]', className)}>
      <div
        ref={shellRef}
        className={cn(
          'relative overflow-hidden rounded-[2.4rem] p-[10px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]',
          shellTone
        )}
      >
        {/* Side buttons */}
        <span className="absolute -left-[2px] top-[18%] h-9 w-[3px] rounded-l bg-gold/40" />
        <span className="absolute -left-[2px] top-[30%] h-14 w-[3px] rounded-l bg-gold/25" />
        <span className="absolute -right-[2px] top-[24%] h-16 w-[3px] rounded-r bg-gold/40" />

        {/* Screen */}
        <div className="relative overflow-hidden rounded-[1.7rem] bg-cream">
          {/* Dynamic-island style cutout */}
          <div className="absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />

          <div
            className={cn('relative h-[440px] overflow-hidden', screenClassName)}
          >
            <div
              ref={canvasRef}
              style={{
                transform: `translateY(-${offset}px)`,
                transition: allowed ? 'none' : undefined,
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Reflection under the device */}
      <div className="mx-auto mt-3 h-6 w-3/4 rounded-full bg-ink/10 blur-md" />
    </div>
  );
}

export default DeviceFrame;
