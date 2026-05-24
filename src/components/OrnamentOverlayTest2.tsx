import { useLayoutEffect, useRef } from "react";
import { createTimeline, utils } from "animejs";

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
  const redWrapRef = useRef<HTMLDivElement | null>(null);
  const redSpinRef = useRef<HTMLDivElement | null>(null);

  const blueWrapRef = useRef<HTMLDivElement | null>(null);

  const playedRef = useRef(false);

  useLayoutEffect(() => {
    const redWrap = redWrapRef.current;
    const redSpin = redSpinRef.current;
    const blueWrap = blueWrapRef.current;
    const targetEl = targetRef.current;

    if (!redWrap || !redSpin || !blueWrap || !targetEl) return;

    const SIZE = 100;

    const targetXY = () => {
      const t = centerOf(targetEl);
      return { x: t.x - SIZE / 2, y: t.y - SIZE / 2 };
    };

    const placeInstant = (el: HTMLElement, x: number, y: number) => {
      utils.set(el, { x, y });
    };

    let tl: any = null;

    const play = () => {
      const target = targetXY();

      // Start positions
      const redStart = { x: 80, y: 120 };
      const blueStart = { x: 80, y: 420 };

      placeInstant(redWrap, redStart.x, redStart.y);
      placeInstant(blueWrap, blueStart.x, blueStart.y);

      // Reset spin (important if React remounts)
    //   redSpin.style.transform = "rotateY(0deg)";
      utils.set(redSpin, { rotateY: 0 });

      const spin = { ry: 0 };

      tl = createTimeline()
      .add(redWrap, {
        x: target.x,
        y: target.y,
        duration: 500,
        ease: "outBack",
      })
      .add(redSpin, {
        rotateY: 360,
        duration: 1400,
        ease: "linear",
      })
      .add(blueWrap, {
        x: target.x,
        y: target.y,
        duration: 500,
        ease: "outBack",
      });
    //   tl = createTimeline()
    //     // 1) Red moves to O
    //     .add(redWrap, {
    //       x: target.x,
    //       y: target.y,
    //       duration: 1000,
    //       ease: "outBack",
    //     })
    //     // 2) Red rotates around vertical axis (face -> edge at 90 -> back -> face)
    //     .add(spin, {
    //       ry: 360,
    //       duration: 1000,
    //       ease: "linear",
    //       update: () => {
    //         // coin-like flip: rotate around vertical axis
    //         redSpin.style.transform = `rotateY(${spin.ry}deg)`;
    //       },
    //     })
    //     // 3) Blue moves to O
    //     .add(blueWrap, {
    //       x: target.x,
    //       y: target.y,
    //       duration: 1000,
    //       ease: "outBack",
    //     });

      playedRef.current = true;
    };

    const syncToTargetOnResize = () => {
      if (!playedRef.current) return;
      const target = targetXY();
      placeInstant(redWrap, target.x, target.y);
      placeInstant(blueWrap, target.x, target.y);
    };

    requestAnimationFrame(play);

    window.addEventListener("resize", syncToTargetOnResize);
    window.addEventListener("scroll", syncToTargetOnResize, { passive: true });

    const fonts: any = (document as any).fonts;
    if (fonts?.ready?.then) fonts.ready.then(syncToTargetOnResize).catch(() => {});

    return () => {
      window.removeEventListener("resize", syncToTargetOnResize);
      window.removeEventListener("scroll", syncToTargetOnResize as any);
      try {
        tl?.pause?.();
      } catch {}
    };
  }, [targetRef]);

  return (
    // Perspective must be on an ancestor of the element being rotated in 3D
    <div className="pointer-events-none fixed inset-0 z-50" style={{ perspective: 900 }}>
      {/* Red piece wrapper (moves in 2D) */}
      <div
        ref={redWrapRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 100,
          height: 100,
          willChange: "transform",
        }}
      >
        {/* Red spin container (rotates in 3D) */}
        <div
          ref={redSpinRef}
          style={{
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            backfaceVisibility: "visible",
            willChange: "transform",
          }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="red" />
          </svg>
        </div>
      </div>

      {/* Blue piece wrapper (moves in 2D) */}
      <div
        ref={blueWrapRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 100,
          height: 100,
          willChange: "transform",
        }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="#2563eb" />
        </svg>
      </div>
    </div>
  );
}




// import { useLayoutEffect, useRef } from "react";
// import { createTimeline, utils } from "animejs";

// type Props = {
//   targetRef: React.RefObject<HTMLElement | null>;
// };

// function centerOf(el: HTMLElement, tweak = { x: 0.52, y: 0.58 }) {
//   const r = el.getBoundingClientRect();
//   return {
//     x: r.left + r.width * tweak.x,
//     y: r.top + r.height * tweak.y,
//   };
// }

// export default function OrnamentOverlayTest({ targetRef }: Props) {
//   const redRef = useRef<HTMLDivElement | null>(null);
//   const blueRef = useRef<HTMLDivElement | null>(null);
//   const playedRef = useRef(false);

//   useLayoutEffect(() => {
//     const red = redRef.current;
//     const blue = blueRef.current;
//     const targetEl = targetRef.current;
//     if (!red || !blue || !targetEl) return;

//     const SIZE = 100;

//     const targetXY = () => {
//       const t = centerOf(targetEl);
//       return { x: t.x - SIZE / 2, y: t.y - SIZE / 2 };
//     };

//     const placeInstant = (el: HTMLElement, x: number, y: number) => {
//       utils.set(el, { x, y });
//     };

//     let tl: any = null;

//     const play = () => {
//       const target = targetXY();

//       // Start positions
//       const redStart = { x: 80, y: 120 };
//       const blueStart = { x: 80, y: 420 };

//       placeInstant(red, redStart.x, redStart.y);
//       placeInstant(blue, blueStart.x, blueStart.y);

//       // Timeline = real sequencing (no delays)
//       tl = createTimeline()
//         .add(red, {
//           x: target.x,
//           y: target.y,
//           duration: 1000,
//           ease: "outBack",
//         })
//         .add(blue, {
//           x: target.x,
//           y: target.y,
//           duration: 1000,
//           ease: "outBack",
//         });

//       playedRef.current = true;
//     };

//     const syncToTargetOnResize = () => {
//       if (!playedRef.current) return;
//       const target = targetXY();
//       placeInstant(red, target.x, target.y);
//       placeInstant(blue, target.x, target.y);
//     };

//     // Wait a frame so initial placement is visible before the animation kicks off
//     requestAnimationFrame(play);

//     window.addEventListener("resize", syncToTargetOnResize);
//     window.addEventListener("scroll", syncToTargetOnResize, { passive: true });

//     const fonts: any = (document as any).fonts;
//     if (fonts?.ready?.then) fonts.ready.then(syncToTargetOnResize).catch(() => {});

//     return () => {
//       window.removeEventListener("resize", syncToTargetOnResize);
//       window.removeEventListener("scroll", syncToTargetOnResize as any);
//       try {
//         tl?.pause?.();
//       } catch {}
//     };
//   }, [targetRef]);

//   return (
//     <div className="pointer-events-none fixed inset-0 z-50">
//       <div
//         ref={redRef}
//         style={{
//           position: "fixed",
//           left: 0,
//           top: 0,
//           width: 100,
//           height: 100,
//           willChange: "transform",
//         }}
//       >
//         <svg width="100" height="100" viewBox="0 0 100 100">
//           <circle cx="50" cy="50" r="45" fill="red" />
//         </svg>
//       </div>

//       <div
//         ref={blueRef}
//         style={{
//           position: "fixed",
//           left: 0,
//           top: 0,
//           width: 100,
//           height: 100,
//           willChange: "transform",
//         }}
//       >
//         <svg width="100" height="100" viewBox="0 0 100 100">
//           <circle cx="50" cy="50" r="45" fill="#2563eb" />
//         </svg>
//       </div>
//     </div>
//   );
// }






// import { useLayoutEffect, useRef } from "react";
// // import { animate, utils } from "animejs";
// import { createTimeline, utils } from "animejs";

// type Props = {
//   targetRef: React.RefObject<HTMLElement | null>;
// };

// function centerOf(el: HTMLElement, tweak = { x: 0.52, y: 0.58 }) {
//   const r = el.getBoundingClientRect();
//   return {
//     x: r.left + r.width * tweak.x,
//     y: r.top + r.height * tweak.y,
//   };
// }

// export default function OrnamentOverlayTest({ targetRef }: Props) {
//   const redRef = useRef<HTMLDivElement | null>(null);
//   const blueRef = useRef<HTMLDivElement | null>(null);
//   const playedRef = useRef(false);

//   useLayoutEffect(() => {
//     const red = redRef.current;
//     const blue = blueRef.current;
//     const targetEl = targetRef.current;
//     if (!red || !blue || !targetEl) return;

//     const SIZE = 100;

//     const targetXY = () => {
//       const t = centerOf(targetEl);
//       return { x: t.x - SIZE / 2, y: t.y - SIZE / 2 };
//     };

//     const placeInstant = (el: HTMLElement, x: number, y: number) => {
//       utils.set(el, { x, y });
//     };

//     const play = () => {
//       const target = targetXY();

//       // Start positions
//       const redStart = { x: 80, y: 120 };
//       const blueStart = { x: 80, y: 420 };

//       placeInstant(red, redStart.x, redStart.y);
//       placeInstant(blue, blueStart.x, blueStart.y);

//       // Red goes first
//       animate(red, {
//         x: target.x,
//         y: target.y,
//         duration: 500,
//         ease: "outBack",
//       });

//       // Blue waits, then follows
//       animate(blue, {
//         x: target.x,
//         y: target.y,
//         duration: 500,
//         delay: 520, // wait until red is basically done
//         ease: "outBack",
//       });

//       playedRef.current = true;
//     };

//     const syncToTargetOnResize = () => {
//       if (!playedRef.current) return;
//       const target = targetXY();
//       placeInstant(red, target.x, target.y);
//       placeInstant(blue, target.x, target.y);
//     };

//     requestAnimationFrame(() => play());

//     window.addEventListener("resize", syncToTargetOnResize);
//     window.addEventListener("scroll", syncToTargetOnResize, { passive: true });

//     const fonts: any = (document as any).fonts;
//     if (fonts?.ready?.then) fonts.ready.then(syncToTargetOnResize).catch(() => {});

//     return () => {
//       window.removeEventListener("resize", syncToTargetOnResize);
//       window.removeEventListener("scroll", syncToTargetOnResize as any);
//     };
//   }, [targetRef]);

//   return (
//     <div className="pointer-events-none fixed inset-0 z-50">
//       {/* Red */}
//       <div
//         ref={redRef}
//         style={{
//           position: "fixed",
//           left: 0,
//           top: 0,
//           width: 100,
//           height: 100,
//           willChange: "transform",
//         }}
//       >
//         <svg width="100" height="100" viewBox="0 0 100 100">
//           <circle cx="50" cy="50" r="45" fill="red" />
//         </svg>
//       </div>

//       {/* Blue */}
//       <div
//         ref={blueRef}
//         style={{
//           position: "fixed",
//           left: 0,
//           top: 0,
//           width: 100,
//           height: 100,
//           willChange: "transform",
//         }}
//       >
//         <svg width="100" height="100" viewBox="0 0 100 100">
//           <circle cx="50" cy="50" r="45" fill="#2563eb" />
//         </svg>
//       </div>
//     </div>
//   );
// }