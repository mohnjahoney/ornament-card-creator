import { useRef } from "react";
import { OrnamentTest } from "./OrnamentTest.js";

export default function App() {
  const oRef = useRef(null);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 overflow-hidden">
      <h1 className="text-[120px] font-bold tracking-tight text-zinc-900">
        HELL<span ref={oRef}>O</span>
      </h1>

      <OrnamentTest oTargetRef={oRef} />
    </div>
  );
}