import { useLayoutEffect, useRef, useState } from "react";

type Props = {
  oTargetRef: React.RefObject<HTMLElement | null>;
};

export function OrnamentTest({ oTargetRef }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [vb, setVb] = useState({ w: 800, h: 600 });
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 100, y: 100 });

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const oEl = oTargetRef.current;
    if (!svg || !oEl) return;

    const compute = () => {
      const svgRect = svg.getBoundingClientRect();
      const w = Math.max(1, Math.round(svgRect.width));
      const h = Math.max(1, Math.round(svgRect.height));
      setVb({ w, h });

      const rect = oEl.getBoundingClientRect();
      const clientX = rect.left + rect.width * 0.52;
      const clientY = rect.top + rect.height * 0.58;

      const x = clientX - svgRect.left;
      const y = clientY - svgRect.top;

      // overshoot amount (pixels)
      const ox = 10;
      const oy = 10;

      // Make sure we animate (even if compute runs immediately on mount)
      requestAnimationFrame(() => {
        // Step 1: overshoot (fast)
        setPos({ x: x + ox, y: y + oy });

        // Step 2: settle (slower, within total 0.5s)
        window.setTimeout(() => {
          setPos({ x, y });
        }, 220);
      });
    };

    compute();

    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, { passive: true });

    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute as any);
    };
  }, [oTargetRef]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${vb.w} ${vb.h}`}
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {/* We move this group with CSS transforms */}
      <g
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          transition: "transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)", // easeOutCubic-ish
          willChange: "transform",
        }}
      >
        {/* Circle is centered at origin */}
        <circle cx={0} cy={0} r={50} fill="red" />
      </g>
    </svg>
  );
}



// import { useLayoutEffect, useRef, useState } from "react";

// type Props = {
//   oTargetRef: React.RefObject<HTMLElement | null>;
// };

// export function OrnamentTest({ oTargetRef }: Props) {
//   const svgRef = useRef<SVGSVGElement | null>(null);

//   const [vb, setVb] = useState({ w: 800, h: 600 });
//   const [pos, setPos] = useState<{ x: number; y: number }>({ x: 500, y: 500 });

//   useLayoutEffect(() => {
//     const svg = svgRef.current;
//     const oEl = oTargetRef.current;
//     if (!svg || !oEl) return;

//     const compute = () => {
//       const svgRect = svg.getBoundingClientRect();
//       const w = Math.max(1, Math.round(svgRect.width));
//       const h = Math.max(1, Math.round(svgRect.height));
//       setVb({ w, h });

//       const rect = oEl.getBoundingClientRect();

//       const clientX = rect.left + rect.width * 0.52;
//       const clientY = rect.top + rect.height * 0.52;

//       const x = clientX - svgRect.left;
//       const y = clientY - svgRect.top;

//       // Small timeout ensures transition actually animates
//       requestAnimationFrame(() => {
//         setPos({ x, y });
//       });
//     };

//     compute();

//     window.addEventListener("resize", compute);
//     window.addEventListener("scroll", compute, { passive: true });

//     return () => {
//       window.removeEventListener("resize", compute);
//       window.removeEventListener("scroll", compute as any);
//     };
//   }, [oTargetRef]);

//   return (
//     <svg
//       ref={svgRef}
//       viewBox={`0 0 ${vb.w} ${vb.h}`}
//       preserveAspectRatio="none"
//       className="pointer-events-none absolute inset-0 h-full w-full"
//     >
//       <circle
//         cx={pos.x}
//         cy={pos.y}
//         r={50}
//         fill="red"
//         style={{
//           transition: "cx 1.5s ease-out, cy 1.5s ease-out",
//         }}
//       />
//     </svg>
//   );
// }



// import { useLayoutEffect, useRef, useState } from "react";

// type Props = {
//   oTargetRef: React.RefObject<HTMLElement | null>;
// };

// export function OrnamentTest({ oTargetRef }: Props) {
//   const svgRef = useRef<SVGSVGElement | null>(null);

//   const [vb, setVb] = useState({ w: 800, h: 600 });
//   const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

//   useLayoutEffect(() => {
//     const svg = svgRef.current;
//     const oEl = oTargetRef.current;
//     if (!svg || !oEl) return;

//     const compute = () => {
//       // 1) Update viewBox to match CSS pixel size (so 1 svg unit == 1 px)
//       const svgRect = svg.getBoundingClientRect();
//       const w = Math.max(1, Math.round(svgRect.width));
//       const h = Math.max(1, Math.round(svgRect.height));
//       setVb({ w, h });

//       // 2) Compute the target point in CSS pixels
//       const rect = oEl.getBoundingClientRect();

//       // Optical center tweak (adjust as desired)
//       const clientX = rect.left + rect.width * 0.52;
//       const clientY = rect.top + rect.height * 0.52;

//       // 3) Convert client coords to SVG coords in *pixel space*
//       const x = clientX - svgRect.left;
//       const y = clientY - svgRect.top;

//       setPos({ x, y });
//     };

//     compute();
//     window.addEventListener("resize", compute);
//     window.addEventListener("scroll", compute, { passive: true });

//     const fonts = (document as any).fonts;
//     if (fonts?.ready?.then) {
//       fonts.ready.then(() => compute()).catch(() => {});
//     }

//     return () => {
//       window.removeEventListener("resize", compute);
//       window.removeEventListener("scroll", compute as any);
//     };
//   }, [oTargetRef]);

//   return (
//     <svg
//       ref={svgRef}
//       viewBox={`0 0 ${vb.w} ${vb.h}`}
//       preserveAspectRatio="none"
//       className="pointer-events-none absolute inset-0 h-full w-full"
//       style={{ overflow: "visible" }}
//     >
//       <circle
//         cx={pos ? pos.x : vb.w / 2}
//         cy={pos ? pos.y : vb.h / 2}
//         r={50}               // <-- stays 50px on screen now
//         fill="red"
//         opacity="0.9"
//       />
//     </svg>
//   );
// }


// import { useLayoutEffect, useRef, useState } from "react";

// type Props = {
//   oTargetRef: React.RefObject<HTMLElement | null>;
// };

// function domPointToSvg(svgEl: SVGSVGElement, clientX: number, clientY: number) {
//   const pt = new DOMPoint(clientX, clientY);
//   const ctm = svgEl.getScreenCTM();
//   if (!ctm) return null;
//   const svgPt = pt.matrixTransform(ctm.inverse());
//   return { x: svgPt.x, y: svgPt.y };
// }

// export function OrnamentTest({ oTargetRef }: Props) {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

//   useLayoutEffect(() => {
//     const svg = svgRef.current;
//     const oEl = oTargetRef.current;
//     if (!svg || !oEl) return;

//     const compute = () => {
//       const rect = oEl.getBoundingClientRect();

//       // Optical-center tweak: push slightly right and down.
//       const clientX = rect.left + rect.width * 0.52; // was 0.50
//       const clientY = rect.top + rect.height * 0.52; // was 0.50

//       const p = domPointToSvg(svg, clientX, clientY);
//       if (p) setPos(p);
//     };

//     compute();

//     // Keep aligned on layout changes
//     window.addEventListener("resize", compute);
//     window.addEventListener("scroll", compute, { passive: true });

//     // If fonts load after first paint, the glyph can shift.
//     const fonts = (document as any).fonts;
//     if (fonts?.ready?.then) {
//       fonts.ready.then(() => compute()).catch(() => {});
//     }

//     return () => {
//       window.removeEventListener("resize", compute);
//       window.removeEventListener("scroll", compute as any);
//     };
//   }, [oTargetRef]);

//   return (
//     <svg
//       ref={svgRef}
//       viewBox="0 0 800 600"
//       className="pointer-events-none absolute inset-0 h-full w-full"
//       style={{ overflow: "visible" }}
//     >
//       <circle
//         cx={pos ? pos.x : 400}
//         cy={pos ? pos.y : 300}
//         r="50"
//         fill="red"
//         opacity="0.9"
//       />
//     </svg>
//   );
// }



// import { useLayoutEffect, useRef, useState } from "react";

// type Props = {
//   oTargetRef: React.RefObject<HTMLElement | null>;
// };

// function domPointToSvg(svgEl: SVGSVGElement, clientX: number, clientY: number) {
//   const pt = new DOMPoint(clientX, clientY);
//   const ctm = svgEl.getScreenCTM();
//   if (!ctm) return null;
//   const svgPt = pt.matrixTransform(ctm.inverse());
//   return { x: svgPt.x, y: svgPt.y };
// }

// export function OrnamentTest({ oTargetRef }: Props) {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

//   useLayoutEffect(() => {
//     const svg = svgRef.current;
//     const oEl = oTargetRef.current;
//     if (!svg || !oEl) return;

//     const rect = oEl.getBoundingClientRect();
//     const clientX = rect.left + rect.width / 2;
//     const clientY = rect.top + rect.height / 2;

//     const p = domPointToSvg(svg, clientX, clientY);
//     if (!p) return;

//     setPos(p);
//   }, [oTargetRef]);

//   return (
//     <svg
//       ref={svgRef}
//       viewBox="0 0 800 600"
//       className="pointer-events-none absolute inset-0 h-full w-full"
//       style={{ overflow: "visible" }}
//     >
//       <circle
//         cx={pos ? pos.x : 400}
//         cy={pos ? pos.y : 300}
//         r="50"
//         fill="red"
//         opacity="0.9"
//       />
//     </svg>
//   );
// }



// import { useEffect } from "react";

// type Props = {
//   oTargetRef: React.RefObject<HTMLElement | null>;
// };

// export function OrnamentTest({ oTargetRef }: Props) {
//   useEffect(() => {
//     const el = oTargetRef.current;
//     if (!el) return;
//     console.log("O rect:", el.getBoundingClientRect());
//   }, [oTargetRef]);

//   return (
//     <svg
//       viewBox="0 0 800 600"
//       className="pointer-events-none absolute inset-0 h-full w-full"
//     >
//       <circle cx="400" cy="300" r="80" fill="red" />
//     </svg>
//   );
// }



// export function OrnamentTest() {
//   return (
//     <svg
//       viewBox="0 0 800 600"
//       className="pointer-events-none absolute inset-0 h-full w-full"
//     >
//       <circle cx="400" cy="300" r="80" fill="red" />
//     </svg>
//   );
// }



// import { useLayoutEffect, useRef } from "react";
// // import anime from "animejs";
// import * as anime from "animejs";

// const a = anime.default ?? anime;

// function domPointToSvg(svgEl, clientX, clientY) {
//   const pt = svgEl.createSVGPoint();
//   pt.x = clientX;
//   pt.y = clientY;
//   const ctm = svgEl.getScreenCTM();
//   if (!ctm) return { x: 0, y: 0 };
//   const svgPt = pt.matrixTransform(ctm.inverse());
//   return { x: svgPt.x, y: svgPt.y };
// }

// export function OrnamentTest({ oTargetRef }) {
//   const svgRef = useRef(null);
//   const pieceARef = useRef(null);
//   const pieceBRef = useRef(null);
//   const capRef = useRef(null);

//   useLayoutEffect(() => {
//     const svg = svgRef.current;
//     const oEl = oTargetRef.current;

//     if (!svg || !oEl) return;

//     const rect = oEl.getBoundingClientRect();
//     const center = domPointToSvg(
//       svg,
//       rect.left + rect.width / 2,
//       rect.top + rect.height / 2
//     );

//     const startX = 150;
//     const startY = 300;

//     const dx = center.x - startX;
//     const dy = center.y - startY;

//     const tl = a.timeline({
//       easing: "easeInOutCubic",
//     });

//     // place all pieces initially
//     a.set([pieceARef.current, pieceBRef.current, capRef.current], {
//       translateX: 0,
//       translateY: 0,
//       rotateX: 0,
//       rotateY: 0,
//       rotateZ: 0,
//     });

//     // A moves to O
//     tl.add({
//       targets: pieceARef.current,
//       translateX: dx,
//       translateY: dy,
//       duration: 1000,
//     });

//     // B approaches from above, A rotates
//     tl.add(
//       {
//         targets: pieceBRef.current,
//         translateX: dx,
//         translateY: dy - 80,
//         duration: 900,
//       },
//       "-=700"
//     ).add(
//       {
//         targets: pieceARef.current,
//         rotateY: 80,
//         duration: 900,
//       },
//       "-=900"
//     );

//     // B slides into place + rotates
//     tl.add({
//       targets: pieceBRef.current,
//       translateY: dy,
//       rotateX: 85,
//       duration: 600,
//     });

//     // Cap flies in
//     tl.add({
//       targets: capRef.current,
//       translateX: dx,
//       translateY: dy - 120,
//       rotateX: 85,
//       duration: 700,
//     });

//     tl.add({
//       targets: capRef.current,
//       translateY: dy - 80,
//       duration: 400,
//       easing: "easeOutBack",
//     });

//     // Cheerful spin
//     tl.add({
//       targets: [pieceARef.current, pieceBRef.current, capRef.current],
//       rotateZ: "+=360",
//       duration: 1000,
//     });

//   }, [oTargetRef]);

//   return (
//     <svg
//       ref={svgRef}
//       viewBox="0 0 800 600"
//       className="pointer-events-none absolute inset-0 h-full w-full"
//       style={{ overflow: "visible" }}
//     >
//       <defs>
//         <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
//           <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.2" />
//         </filter>
//       </defs>

//       {/* Main Piece A */}
//       <g
//         ref={pieceARef}
//         style={{
//           transformOrigin: "150px 300px",
//           transformBox: "fill-box",
//         }}
//       >
//         <ellipse
//           cx="150"
//           cy="300"
//           rx="60"
//           ry="70"
//           fill="#c0392b"
//           filter="url(#shadow)"
//         />
//       </g>

//       {/* Main Piece B */}
//       <g
//         ref={pieceBRef}
//         style={{
//           transformOrigin: "150px 300px",
//           transformBox: "fill-box",
//         }}
//       >
//         <ellipse
//           cx="150"
//           cy="300"
//           rx="60"
//           ry="70"
//           fill="#2980b9"
//           filter="url(#shadow)"
//         />
//       </g>

//       {/* Cap */}
//       <g
//         ref={capRef}
//         style={{
//           transformOrigin: "150px 220px",
//           transformBox: "fill-box",
//         }}
//       >
//         <rect
//           x="125"
//           y="220"
//           width="50"
//           height="30"
//           rx="6"
//           fill="#f4d03f"
//           filter="url(#shadow)"
//         />
//       </g>
//     </svg>
//   );
// }




// import { useLayoutEffect, useRef } from "react";
// import anime from "animejs/lib/anime.es.js";

// type Props = {
//   oTargetRef: React.RefObject<HTMLElement | null>;
// };

// function domPointToSvg(svgEl: SVGSVGElement, clientX: number, clientY: number) {
//   // More robust than createSVGPoint (which can be quirky across environments)
//   const pt = new DOMPoint(clientX, clientY);
//   const ctm = svgEl.getScreenCTM();
//   if (!ctm) return { x: 0, y: 0 };
//   const svgPt = pt.matrixTransform(ctm.inverse());
//   return { x: svgPt.x, y: svgPt.y };
// }

// export function OrnamentTest({ oTargetRef }: Props) {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const pieceARef = useRef<SVGGElement | null>(null);
//   const pieceBRef = useRef<SVGGElement | null>(null);
//   const capRef = useRef<SVGGElement | null>(null);

//   useLayoutEffect(() => {
//     const svg = svgRef.current;
//     const oEl = oTargetRef.current;

//     // Hard guards: if anything isn’t ready, don’t animate
//     if (!svg || !oEl) return;
//     if (!pieceARef.current || !pieceBRef.current || !capRef.current) return;

//     const rect = oEl.getBoundingClientRect();
//     const center = domPointToSvg(
//       svg,
//       rect.left + rect.width / 2,
//       rect.top + rect.height / 2
//     );

//     const startX = 150;
//     const startY = 300;

//     const dx = center.x - startX;
//     const dy = center.y - startY;

//     // Reset (important because React StrictMode runs effects twice in dev)
//     anime.set([pieceARef.current, pieceBRef.current, capRef.current], {
//       translateX: 0,
//       translateY: 0,
//       rotateX: 0,
//       rotateY: 0,
//       rotateZ: 0,
//       opacity: 1,
//     });

//     const tl = anime.timeline({
//       easing: "easeInOutCubic",
//       autoplay: true,
//     });

//     // A moves to O
//     tl.add({
//       targets: pieceARef.current,
//       translateX: dx,
//       translateY: dy,
//       duration: 900,
//     });

//     // B approaches from above; A rotates
//     tl.add(
//       {
//         targets: pieceBRef.current,
//         translateX: dx,
//         translateY: dy - 80,
//         duration: 850,
//       },
//       "-=650"
//     );

//     tl.add(
//       {
//         targets: pieceARef.current,
//         rotateY: 80,
//         duration: 850,
//         easing: "easeInOutSine",
//       },
//       "-=850"
//     );

//     // B slides into place + rotates to perpendicular
//     tl.add({
//       targets: pieceBRef.current,
//       translateY: dy,
//       rotateX: 85,
//       duration: 600,
//       easing: "easeInOutSine",
//     });

//     // Cap flies in above, rotates to horizontal
//     tl.add({
//       targets: capRef.current,
//       translateX: dx,
//       translateY: dy - 120,
//       rotateX: 85,
//       duration: 650,
//       easing: "easeInOutCubic",
//     });

//     // Cap drops onto ornament
//     tl.add({
//       targets: capRef.current,
//       translateY: dy - 80,
//       duration: 380,
//       easing: "easeOutBack",
//     });

//     // Cheerful spin
//     tl.add({
//       targets: [pieceARef.current, pieceBRef.current, capRef.current],
//       rotateZ: "+=360",
//       duration: 900,
//       easing: "easeInOutCubic",
//     });

//     return () => {
//       tl.pause();
//     };
//   }, [oTargetRef]);

//   return (
//     <svg
//       ref={svgRef}
//       viewBox="0 0 800 600"
//       className="pointer-events-none absolute inset-0 h-full w-full"
//       style={{ overflow: "visible" }}
//     >
//       <defs>
//         <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
//           <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.2" />
//         </filter>
//       </defs>

//       <g
//         ref={pieceARef}
//         style={{
//           transformOrigin: "150px 300px",
//           transformBox: "fill-box",
//           willChange: "transform",
//         }}
//       >
//         <ellipse cx="150" cy="300" rx="60" ry="70" fill="#c0392b" filter="url(#shadow)" />
//       </g>

//       <g
//         ref={pieceBRef}
//         style={{
//           transformOrigin: "150px 300px",
//           transformBox: "fill-box",
//           willChange: "transform",
//         }}
//       >
//         <ellipse cx="150" cy="300" rx="60" ry="70" fill="#2980b9" filter="url(#shadow)" />
//       </g>

//       <g
//         ref={capRef}
//         style={{
//           transformOrigin: "150px 220px",
//           transformBox: "fill-box",
//           willChange: "transform",
//         }}
//       >
//         <rect x="125" y="220" width="50" height="30" rx="6" fill="#f4d03f" filter="url(#shadow)" />
//       </g>
//     </svg>
//   );
// }