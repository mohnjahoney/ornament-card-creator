import { useCallback, useRef, useState, useEffect } from 'react';
import { useWizard } from '@/context/WizardContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Upload } from 'lucide-react';
import { DISPLAY } from '@/config/cardLayout';

const { VIEW_W, VIEW_H, CX, CY, R, CAP_WIDTH, CAP_HEIGHT, CAP_RX, CAP_Y } = DISPLAY;

export default function ImageUploadPage() {
  const { state, dispatch } = useWizard();
  const imgIndex = state.currentStep - 1;
  const img = state.images[imgIndex];
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [covered, setCovered] = useState(true);
  const draggingRef = useRef(false);
  const pointerStartRef = useRef<{
    x: number;
    y: number;
    ox: number;
    oy: number;
  } | null>(null);
  const scaleRef = useRef(img.scale);
  scaleRef.current = img.scale;

  const clipId = `ornament-clip-${imgIndex}`;

  // Coverage detection
  useEffect(() => {
    if (!img.dataUrl) {
      setCovered(true);
      return;
    }
    const isLandscape = img.naturalWidth >= img.naturalHeight;
    const fitScale = isLandscape
      ? (R * 2) / img.naturalHeight
      : (R * 2) / img.naturalWidth;
    const totalScale = fitScale * img.scale;
    let allCovered = true;
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      const px = Math.cos(angle) * R;
      const py = Math.sin(angle) * R;
      const tx = px - img.offsetX;
      const ty = py - img.offsetY;
      const cos = Math.cos((-img.rotation * Math.PI) / 180);
      const sin = Math.sin((-img.rotation * Math.PI) / 180);
      const rx = (tx * cos - ty * sin) / totalScale;
      const ry = (tx * sin + ty * cos) / totalScale;
      if (
        Math.abs(rx) > img.naturalWidth / 2 ||
        Math.abs(ry) > img.naturalHeight / 2
      ) {
        allCovered = false;
        break;
      }
    }
    setCovered(allCovered);
  }, [img]);

  // Non-passive wheel handler
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handler = (e: WheelEvent) => {
      if (!img.dataUrl) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.95 : 1.05;
      const newScale = Math.max(0.2, Math.min(5, scaleRef.current * delta));
      dispatch({
        type: 'SET_IMAGE',
        index: imgIndex,
        data: { scale: newScale },
      });
    };
    svg.addEventListener('wheel', handler, { passive: false });
    return () => svg.removeEventListener('wheel', handler);
  }, [img.dataUrl, imgIndex, dispatch]);

  const handleFile = useCallback(
    (file: File) => {
      if (img.dataUrl) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const image = new Image();
        image.onload = () => {
          dispatch({
            type: 'SET_IMAGE',
            index: imgIndex,
            data: {
              file,
              dataUrl,
              naturalWidth: image.width,
              naturalHeight: image.height,
              scale: 1,
              rotation: 0,
              offsetX: 0,
              offsetY: 0,
            },
          });
        };
        image.src = dataUrl;
      };
      reader.readAsDataURL(file);
    },
    [img.dataUrl, imgIndex, dispatch]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith('image/')) handleFile(file);
    },
    [handleFile]
  );

  const onFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  // Pan gestures
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!img.dataUrl) return;
      e.preventDefault();
      pointerStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        ox: img.offsetX,
        oy: img.offsetY,
      };
      draggingRef.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [img.dataUrl, img.offsetX, img.offsetY]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current || !pointerStartRef.current || !svgRef.current)
        return;
      const rect = svgRef.current.getBoundingClientRect();
      const sx = VIEW_W / rect.width;
      const sy = VIEW_H / rect.height;
      const dx = (e.clientX - pointerStartRef.current.x) * sx;
      const dy = (e.clientY - pointerStartRef.current.y) * sy;
      dispatch({
        type: 'SET_IMAGE',
        index: imgIndex,
        data: {
          offsetX: pointerStartRef.current.ox + dx,
          offsetY: pointerStartRef.current.oy + dy,
        },
      });
    },
    [imgIndex, dispatch]
  );

  const onPointerUp = useCallback(() => {
    draggingRef.current = false;
    pointerStartRef.current = null;
  }, []);

  // Compute image transform
  const getImageTransform = () => {
    if (!img.dataUrl) return undefined;
    const isLandscape = img.naturalWidth >= img.naturalHeight;
    const fitScale = isLandscape
      ? (R * 2) / img.naturalHeight
      : (R * 2) / img.naturalWidth;
    const s = fitScale * img.scale;
    return `translate(${CX + img.offsetX}, ${CY + img.offsetY}) rotate(${img.rotation}) scale(${s})`;
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              dispatch({ type: 'SET_STEP', step: state.currentStep - 1 })
            }
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium">
              Image {imgIndex + 1} of 4
            </p>
            <div className="h-2 bg-muted rounded-full mt-1">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${((imgIndex + 1) / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* SVG ornament area */}
        <div
          className="relative rounded-xl overflow-hidden border border-border bg-card"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="w-full"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{ touchAction: 'none' }}
          >
            <defs>
              <clipPath id={clipId}>
                <circle cx={CX} cy={CY} r={R} />
                <rect
                  x={CX - CAP_WIDTH / 2}
                  y={CAP_Y}
                  width={CAP_WIDTH}
                  height={CAP_HEIGHT}
                  rx={CAP_RX}
                />
              </clipPath>
            </defs>

            {/* Clipped image */}
            {img.dataUrl && (
              <g clipPath={`url(#${clipId})`}>
                <image
                  href={img.dataUrl}
                  x={-img.naturalWidth / 2}
                  y={-img.naturalHeight / 2}
                  width={img.naturalWidth}
                  height={img.naturalHeight}
                  transform={getImageTransform()}
                  preserveAspectRatio="none"
                />
              </g>
            )}

            {/* Cap (white on upload pages) */}
            <rect
              x={CX - CAP_WIDTH / 2}
              y={CAP_Y}
              width={CAP_WIDTH}
              height={CAP_HEIGHT}
              rx={CAP_RX}
              fill="white"
              stroke="hsl(20,10%,70%)"
              strokeWidth="2"
            />

            {/* Circle outline */}
            <circle
              cx={CX}
              cy={CY}
              r={R}
              fill={img.dataUrl ? 'none' : 'hsl(40,15%,92%)'}
              stroke="hsl(350,65%,40%)"
              strokeWidth="3"
              opacity={covered ? 1 : 0.5}
            />

            {/* Drop hint text */}
            {!img.dataUrl && (
              <>
                <text
                  x={CX}
                  y={CY - 12}
                  textAnchor="middle"
                  fill="hsl(20,10%,45%)"
                  fontSize="14"
                >
                  Drag &amp; drop your
                </text>
                <text
                  x={CX}
                  y={CY + 8}
                  textAnchor="middle"
                  fill="hsl(20,10%,45%)"
                  fontSize="14"
                >
                  image here
                </text>
                {/* Upload arrow icon */}
                <path
                  d={`M${CX} ${CY + 48} L${CX} ${CY + 28} M${CX - 8} ${CY + 36} L${CX} ${CY + 28} L${CX + 8} ${CY + 36}`}
                  stroke="hsl(20,10%,45%)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}
          </svg>

          {/* Drag overlay */}
          {isDragOver && (
            <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-xl flex items-center justify-center">
              <p className="text-primary font-medium">Drop image here</p>
            </div>
          )}
        </div>

        {/* File input fallback */}
        {!img.dataUrl && (
          <label className="block mt-4 text-center cursor-pointer">
            <Button variant="outline" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={onFileInput}
                />
              </span>
            </Button>
          </label>
        )}

        {/* Bottom controls */}
        <div className="flex justify-between items-center mt-6">
          <div>
            {img.dataUrl && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() =>
                  dispatch({ type: 'DELETE_IMAGE', index: imgIndex })
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            disabled={!img.dataUrl}
            onClick={() =>
              dispatch({
                type: 'SET_STEP',
                step: state.currentStep < 4 ? state.currentStep + 1 : 5,
              })
            }
          >
            {state.currentStep < 4 ? 'Next Image →' : 'Design Options →'}
          </Button>
        </div>

        {img.dataUrl && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            Drag to reposition · Scroll to zoom
          </p>
        )}
      </div>
    </div>
  );
}
