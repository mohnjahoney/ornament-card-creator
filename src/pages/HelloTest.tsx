// import { useRef } from "react";
// import { OrnamentTest } from "../OrnamentTest.tsx";

// export default function HelloTest() {
//   const oRef = useRef<HTMLSpanElement | null>(null);

//   return (
//     <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50">
//       <h1 className="text-[120px] font-bold tracking-tight text-zinc-900">
//         HELL<span ref={oRef}>O</span>
//       </h1>

//       <OrnamentTest oTargetRef={oRef} />
//       {/* <OrnamentTest /> */}
//     </div>
//   );
// }

import { useRef } from "react";
// import OrnamentOverlayTest from "../components/OrnamentOverlayTest.jsx";
import OrnamentOverlayTest from "../components/OrnamentOverlayTest2.jsx";

export default function HelloTest() {
  const oRef = useRef<HTMLSpanElement | null>(null);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <h1 className="text-[120px] font-bold tracking-tight text-zinc-900">
          HELL<span ref={oRef}>O</span>
        </h1>

        <OrnamentOverlayTest targetRef={oRef} />
      </div>
    </div>
  );
}