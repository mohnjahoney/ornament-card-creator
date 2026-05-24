import { useWizard } from '@/context/WizardContext';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { mountSplashAnimation } from '@/titleAnimation/mountSplashAnimation';
import splashTreeMockup from '@/assets/splash-tree-mockup.png';

export default function SplashPage() {
  const { dispatch } = useWizard();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [showTreeMockup, setShowTreeMockup] = useState(false);

  useEffect(() => {
    const containerEl = mountRef.current;
    if (!containerEl) return;

    let cancelled = false;
    let treeMockupFrame: number | null = null;
    setShowControls(false);
    setShowTreeMockup(false);
    treeMockupFrame = requestAnimationFrame(() => {
      if (!cancelled) setShowTreeMockup(true);
    });

    const mounted = mountSplashAnimation(containerEl, {
      showUI: false,
      timeScale: 0.5,
      onNearlyFinished: () => {
        if (cancelled) return;
        setShowControls(true);
      },
    });

    return () => {
      cancelled = true;
      if (treeMockupFrame != null) cancelAnimationFrame(treeMockupFrame);
      mounted.unmount();
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <div
        className={[
          'pointer-events-none absolute inset-0 z-0 overflow-hidden',
          'transition-opacity ease-out',
          showTreeMockup ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        style={{
          transitionDuration: '1600ms',
        }}
      >
        <img
          src={splashTreeMockup}
          alt=""
          className="h-full w-full object-cover"
          style={{
            transform: 'translate(-15%, -15%) scale(1.18)',
            transformOrigin: 'top left',
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,7,6,0.12),rgba(6,7,6,0.34))]" />
      </div>

      <div ref={mountRef} className="absolute inset-0 z-[1]" style={{ background: 'transparent' }} />
      
      <div className="relative z-10 min-h-screen flex items-end justify-center pb-20 px-8 p-8 text-center">
      {/* <div className="relative z-10 min-h-screen flex items-end justify-center p-8 text-center"> */}
        <div
          className={[
            'max-w-md',
            'transition-all duration-700 ease-out',
            showControls ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none',
          ].join(' ')}
        >
          <p className="text-lg text-muted-foreground mb-2">
            {/* Create beautiful printable Christmas ornament cards with your favorite photos. */}
            Last year your Xmas card went on their fridge.
            This year it can hang on their tree!
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            {/* Upload 4 photos, customize your design, and download a ready-to-print PDF that turns into a hanging
            ornament! */}
            Create a card your loved ones can turn into a custom photo ornament.
          </p>

          <Button
            size="lg"
            className="text-lg px-10 py-6 rounded-full shadow-lg"
            onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}
          >
            ✨ Start Creating
          </Button>
        </div>
      </div>
    </div>
  );
}
