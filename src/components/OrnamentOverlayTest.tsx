import { useLayoutEffect, useRef } from "react";
import { animate, utils } from "animejs";

type Props = {
  targetRef: React.RefObject<HTMLElement | null>;
};

function centerOf(el: HTMLElement, tweak = { x: 0.52, y: 0.58 }) {
  const r = el.getBoundingClientRect();
  return {
    x: r.left + r.width * tweak.x,
    y: r.top + r.height * tweak.y,
  };
}

export default function OrnamentOverlayTest({ targetRef }: Props) {
  const pieceRef = useRef<HTMLDivElement | null>(null);
  const playedRef = useRef(false);

  useLayoutEffect(() => {
    const piece = pieceRef.current;
    const targetEl = targetRef.current;
    if (!piece || !targetEl) return;

    const SIZE = 100;

    const targetXY = () => {
      const t = centerOf(targetEl);
      return { x: t.x - SIZE / 2, y: t.y - SIZE / 2 };
    };

    const placeInstant = (x: number, y: number) => {
      // IMPORTANT: let anime manage transforms
      utils.set(piece, { x, y });
    };

    const play = () => {
      const start = { x: 80, y: 120 };
      const target = targetXY();

      placeInstant(start.x, start.y);

      animate(piece, {
        x: target.x,
        y: target.y,
        duration: 500,
        ease: "outBack",
      });

      playedRef.current = true;
    };

    const syncToTargetOnResize = () => {
      if (!playedRef.current) return;
      const target = targetXY();
      placeInstant(target.x, target.y);
    };

    // Run after first paint so you actually see the transition
    requestAnimationFrame(() => {
      play();
    });

    window.addEventListener("resize", syncToTargetOnResize);
    window.addEventListener("scroll", syncToTargetOnResize, { passive: true });

    const fonts: any = (document as any).fonts;
    if (fonts?.ready?.then) fonts.ready.then(syncToTargetOnResize).catch(() => {});

    return () => {
      window.removeEventListener("resize", syncToTargetOnResize);
      window.removeEventListener("scroll", syncToTargetOnResize as any);
    };
  }, [targetRef]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        ref={pieceRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 100,
          height: 100,
          // Don't set transform here; anime will set it.
          willChange: "transform",
        }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="red" />
        </svg>
      </div>
    </div>
  );
}

// import { useLayoutEffect, useRef } from "react";
// import { animate, utils } from "animejs";

// type Props = {
//     targetRef: React.RefObject<HTMLElement | null>;
// };

// function centerOf(el: HTMLElement, tweak = { x: 0.52, y: 0.58 }) {
//     const r = el.getBoundingClientRect();
//     return {
//         x: r.left + r.width * tweak.x,
//         y: r.top + r.height * tweak.y,
//     };
// }

// export default function OrnamentOverlayTest({ targetRef }: Props) {
//     const pieceRef = useRef<HTMLDivElement | null>(null);
//     const playedRef = useRef(false);

//     useLayoutEffect(() => {
//         const piece = pieceRef.current;
//         const targetEl = targetRef.current;
//         if (!piece || !targetEl) return;

//         let tl: any = null;

//         const placeInstant = (x: number, y: number) => {
//             piece.style.transform = `translate3d(${x}px, ${y}px, 0)`;
//         };

//         const target = centerOf(targetEl);

//         const SIZE = 100; // your piece div is 100x100

//         const targetXY = () => {
//           const t = centerOf(targetEl);
//           return {
//             // move the PIECE CENTER onto the O, not the top-left corner
//             x: t.x - SIZE / 2,
//             y: t.y - SIZE / 2,
//           };
//         };

//         // Start position (pick whatever feels nice)
//         const start = { x: 80, y: 120 };

//         const play = async () => {
//             // Dynamically import to avoid “blank page if import goes sideways”
//             //   const mod: any = await import("animejs/lib/anime.es.js");
//             //   const anime = mod?.default ?? mod;


//             const target = targetXY();

//             const start = { x: 80, y: 120 };

//             placeInstant(start.x, start.y);
          
//             animate(piece, {
//               x: target.x,
//               y: target.y,
//               duration: 500,
//               ease: "outBack", // overshoot
//             });
          
//             playedRef.current = true;
//         };

//         const syncToTargetOnResize = () => {
//             if (!playedRef.current) return; // don’t fight the initial animation
//             const target = centerOf(targetEl);
//             placeInstant(target.x, target.y);
//         };


//         // First run
//         play();
//         // .catch((e: any) => console.error("anime load/anim error:", e));

//         // Keep aligned on resize/scroll (no replay)
//         window.addEventListener("resize", syncToTargetOnResize);
//         window.addEventListener("scroll", syncToTargetOnResize, { passive: true });

//         // If fonts load late and move the glyph, resync
//         const fonts: any = (document as any).fonts;
//         if (fonts?.ready?.then) fonts.ready.then(syncToTargetOnResize).catch(() => { });

//         return () => {
//             window.removeEventListener("resize", syncToTargetOnResize);
//             window.removeEventListener("scroll", syncToTargetOnResize as any);
//             try {
//                 tl?.pause?.();
//             } catch { }
//         };
//     }, [targetRef]);

//     return (
//         <div className="pointer-events-none fixed inset-0 z-50">
//             {/* This is the moving piece. Start transform is set in JS. */}
//             <div
//                 ref={pieceRef}
//                 style={{
//                     position: "fixed",
//                     left: 0,
//                     top: 0,
//                     width: 100,
//                     height: 100,
//                     transform: "translate3d(0px,0px,0)",
//                     willChange: "transform",
//                 }}
//             >
//                 {/* Inline SVG so it stays crisp */}
//                 <svg width="100" height="100" viewBox="0 0 100 100">
//                     <circle cx="50" cy="50" r="45" fill="red" />
//                 </svg>
//             </div>
//         </div>
//     );
// }