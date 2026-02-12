import { forwardRef } from 'react';
import {
  PAGE,
  ORNAMENT,
  COMPUTED,
  CUT,
  SVG_SCALE,
  TEXT_TEMPLATES,
  DISPLAY,
} from '@/config/cardLayout';
import type { ImageState, DesignOptions } from '@/types/ornament';
import PatternDefs from './PatternDefs';

interface Props {
  images: [ImageState, ImageState, ImageState, ImageState];
  design: DesignOptions;
}

const S = SVG_SCALE;
const W = PAGE.WIDTH * S;
const H = PAGE.HEIGHT * S;
const DISPLAY_R = DISPLAY.R;

const CardRenderer = forwardRef<SVGSVGElement, Props>(
  ({ images, design }, ref) => {
    const textTemplate = TEXT_TEMPLATES.find(
      (t) => t.id === design.textTemplateId
    );

    const renderOrnament = (
      img: ImageState,
      cx: number,
      yOffset: number,
      slotDir: 'top' | 'bottom'
    ) => {
      const r = ORNAMENT.RADIUS * S;
      const cy = COMPUTED.ORNAMENT_CENTER_Y * S + yOffset;
      const capW = COMPUTED.CAP_WIDTH * S;
      const capH = COMPUTED.CAP_HEIGHT * S;
      const capRx = COMPUTED.CAP_CORNER_RADIUS * S;
      const capY = cy - r - capH + 8;
      const connR = COMPUTED.CONNECTOR_RADIUS * S;
      const connCY = COMPUTED.CONNECTOR_CENTER_Y * S + yOffset;
      const strokeW = CUT.STROKE_WIDTH * S;
      const clipId = `card-clip-${cx}-${yOffset}`;
      const offsetScale = r / DISPLAY_R;

      // Image transform
      let imgTransform = '';
      if (img.dataUrl) {
        const isLandscape = img.naturalWidth >= img.naturalHeight;
        const fitScale = isLandscape
          ? (r * 2) / img.naturalHeight
          : (r * 2) / img.naturalWidth;
        const s = fitScale * img.scale;
        imgTransform = `translate(${cx + img.offsetX * offsetScale}, ${cy + img.offsetY * offsetScale}) rotate(${img.rotation}) scale(${s})`;
      }

      return (
        <g key={clipId}>
          <defs>
            <clipPath id={clipId}>
              <circle cx={cx} cy={cy} r={r} />
              <rect
                x={cx - capW / 2}
                y={capY}
                width={capW}
                height={capH}
                rx={capRx}
              />
            </clipPath>
          </defs>

          {/* Image */}
          {img.dataUrl && (
            <g clipPath={`url(#${clipId})`}>
              <image
                href={img.dataUrl}
                x={-img.naturalWidth / 2}
                y={-img.naturalHeight / 2}
                width={img.naturalWidth}
                height={img.naturalHeight}
                transform={imgTransform}
                preserveAspectRatio="none"
              />
            </g>
          )}

          {/* Cap */}
          <rect
            x={cx - capW / 2}
            y={capY}
            width={capW}
            height={capH}
            rx={capRx}
            fill={design.capColor}
            stroke={design.outlineColor}
            strokeWidth={strokeW}
          />

          {/* Circle outline / cut line */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={design.outlineColor}
            strokeWidth={strokeW}
          />

          {/* Slot line */}
          <line
            x1={cx}
            y1={cy}
            x2={cx}
            y2={slotDir === 'bottom' ? cy + r : cy - r}
            stroke={design.outlineColor}
            strokeWidth={strokeW}
          />

          {/* Connector circle */}
          <circle
            cx={cx}
            cy={connCY}
            r={connR}
            fill={`url(#pattern-${design.pattern})`}
            stroke={design.outlineColor}
            strokeWidth={strokeW}
          />

          {/* Plus sign in connector */}
          <line
            x1={cx - capW / 2}
            y1={connCY}
            x2={cx + capW / 2}
            y2={connCY}
            stroke={design.outlineColor}
            strokeWidth={strokeW}
          />
          <line
            x1={cx}
            y1={connCY - capW / 2}
            x2={cx}
            y2={connCY + capW / 2}
            stroke={design.outlineColor}
            strokeWidth={strokeW}
          />
        </g>
      );
    };

    const lcx = COMPUTED.LEFT_CENTER_X * S;
    const rcx = COMPUTED.RIGHT_CENTER_X * S;

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width={W} height={H} fill={design.bgColor} />

        <PatternDefs outlineColor={design.outlineColor} />

        {/* Fold line */}
        <line
          x1={0}
          y1={H / 2}
          x2={W}
          y2={H / 2}
          stroke={design.outlineColor}
          strokeWidth={1}
          strokeDasharray="8 4"
          opacity={0.3}
        />

        {/* Front (top half): left slot=bottom, right slot=top */}
        {renderOrnament(images[0], lcx, 0, 'bottom')}
        {renderOrnament(images[1], rcx, 0, 'top')}

        {/* Front text */}
        {textTemplate && textTemplate.id !== 'none' && (
          <text
            x={W / 2}
            y={COMPUTED.TEXT_Y * S}
            textAnchor="middle"
            fontFamily={textTemplate.fontFamily}
            fontSize={textTemplate.fontSize * S}
            fill={design.outlineColor}
          >
            {textTemplate.text}
          </text>
        )}

        {/* Back (bottom half): left slot=top, right slot=bottom */}
        {renderOrnament(images[2], lcx, H / 2, 'top')}
        {renderOrnament(images[3], rcx, H / 2, 'bottom')}
      </svg>
    );
  }
);

CardRenderer.displayName = 'CardRenderer';
export default CardRenderer;
