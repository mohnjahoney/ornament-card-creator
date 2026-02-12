interface Props {
  outlineColor: string;
}

export default function PatternDefs({ outlineColor }: Props) {
  return (
    <defs>
      <pattern id="pattern-solid" width="1" height="1">
        <rect width="1" height="1" fill={outlineColor} opacity="0.15" />
      </pattern>

      <pattern
        id="pattern-stripes"
        width="10"
        height="10"
        patternUnits="userSpaceOnUse"
      >
        <rect width="10" height="10" fill="white" />
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="10"
          stroke={outlineColor}
          strokeWidth="3"
          opacity="0.3"
        />
        <line
          x1="5"
          y1="0"
          x2="5"
          y2="10"
          stroke={outlineColor}
          strokeWidth="3"
          opacity="0.3"
        />
      </pattern>

      <pattern
        id="pattern-dots"
        width="12"
        height="12"
        patternUnits="userSpaceOnUse"
      >
        <rect width="12" height="12" fill="white" />
        <circle cx="3" cy="3" r="2" fill={outlineColor} opacity="0.3" />
        <circle cx="9" cy="9" r="2" fill={outlineColor} opacity="0.3" />
      </pattern>

      <pattern
        id="pattern-snowflakes"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <rect width="20" height="20" fill="white" />
        <text
          x="10"
          y="14"
          textAnchor="middle"
          fontSize="12"
          fill={outlineColor}
          opacity="0.4"
        >
          ❄
        </text>
      </pattern>

      <pattern
        id="pattern-plaid"
        width="16"
        height="16"
        patternUnits="userSpaceOnUse"
      >
        <rect width="16" height="16" fill="white" />
        <rect
          x="0"
          y="0"
          width="8"
          height="8"
          fill={outlineColor}
          opacity="0.1"
        />
        <rect
          x="8"
          y="8"
          width="8"
          height="8"
          fill={outlineColor}
          opacity="0.1"
        />
        <line
          x1="0"
          y1="4"
          x2="16"
          y2="4"
          stroke={outlineColor}
          strokeWidth="1"
          opacity="0.2"
        />
        <line
          x1="4"
          y1="0"
          x2="4"
          y2="16"
          stroke={outlineColor}
          strokeWidth="1"
          opacity="0.2"
        />
        <line
          x1="0"
          y1="12"
          x2="16"
          y2="12"
          stroke={outlineColor}
          strokeWidth="1"
          opacity="0.2"
        />
        <line
          x1="12"
          y1="0"
          x2="12"
          y2="16"
          stroke={outlineColor}
          strokeWidth="1"
          opacity="0.2"
        />
      </pattern>

      <pattern
        id="pattern-stars"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <rect width="20" height="20" fill="white" />
        <text
          x="10"
          y="14"
          textAnchor="middle"
          fontSize="12"
          fill={outlineColor}
          opacity="0.4"
        >
          ★
        </text>
      </pattern>
    </defs>
  );
}
