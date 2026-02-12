// All layout constants centralized here
// Page dimensions in inches

export const PAGE = {
  WIDTH: 8.5,
  HEIGHT: 11,
  HALF_HEIGHT: 5.5,
};

export const EXPORT = {
  WIDTH: 2550,
  HEIGHT: 3300,
  DPI: 300, // 2550 / 8.5
};

export const MARGINS = {
  CONNECTOR_TOP: 0.4,
  BOTTOM: 0.5,
  BETWEEN: 0.5,
};

export const ORNAMENT = {
  DIAMETER: 2.5,
  RADIUS: 1.25,
  CAP_WIDTH_RATIO: 0.25,
  CAP_HEIGHT_RATIO: 0.15,
  CAP_CORNER_RATIO: 0.04,
};

export const CONNECTOR = {
  DIAMETER_RATIO: 0.5, // 50% of ornament diameter
};

export const CUT = {
  STROKE_WIDTH: 0.125, // 1/8 inch
};

// Derived values (inches, relative to top-left of each half-page)
const connDiam = ORNAMENT.DIAMETER * CONNECTOR.DIAMETER_RATIO;
const connRadius = connDiam / 2;
const capW = ORNAMENT.DIAMETER * ORNAMENT.CAP_WIDTH_RATIO;
const capH = ORNAMENT.DIAMETER * ORNAMENT.CAP_HEIGHT_RATIO;
const capRx = ORNAMENT.DIAMETER * ORNAMENT.CAP_CORNER_RATIO;
const totalW = 2 * ORNAMENT.DIAMETER + MARGINS.BETWEEN;
const leftOffset = (PAGE.WIDTH - totalW) / 2;

export const COMPUTED = {
  CONNECTOR_DIAMETER: connDiam,
  CONNECTOR_RADIUS: connRadius,
  CAP_WIDTH: capW,
  CAP_HEIGHT: capH,
  CAP_CORNER_RADIUS: capRx,
  CONNECTOR_CENTER_Y: MARGINS.CONNECTOR_TOP + connRadius,
  ORNAMENT_CENTER_Y:
    MARGINS.CONNECTOR_TOP + connDiam + 0.05 + capH - 0.1 + ORNAMENT.RADIUS,
  LEFT_CENTER_X: leftOffset + ORNAMENT.RADIUS,
  RIGHT_CENTER_X: leftOffset + ORNAMENT.DIAMETER + MARGINS.BETWEEN + ORNAMENT.RADIUS,
  TEXT_Y:
    MARGINS.CONNECTOR_TOP +
    connDiam +
    0.05 +
    capH -
    0.1 +
    ORNAMENT.DIAMETER +
    0.4,
};

// SVG coordinate scale: 100 units per inch
export const SVG_SCALE = 100;

// Display constants for the image upload page
export const DISPLAY = {
  VIEW_W: 300,
  VIEW_H: 380,
  CX: 150,
  CY: 210,
  R: 120,
  CAP_WIDTH: 60,
  CAP_HEIGHT: 36,
  CAP_RX: 6,
  CAP_Y: 150 - 120 - 36 + 10, // CY - R - CAP_HEIGHT + 10
};

export type ConnectorPattern =
  | 'solid'
  | 'stripes'
  | 'dots'
  | 'snowflakes'
  | 'plaid'
  | 'stars';

export interface TextTemplate {
  id: string;
  label: string;
  text: string;
  fontFamily: string;
  fontSize: number; // in inches
}

export const TEXT_TEMPLATES: TextTemplate[] = [
  { id: 'none', label: 'None', text: '', fontFamily: 'serif', fontSize: 0 },
  {
    id: 'merry',
    label: 'Merry Christmas',
    text: 'Merry Christmas',
    fontFamily: "'Playfair Display', serif",
    fontSize: 0.35,
  },
  {
    id: 'happy',
    label: 'Happy Holidays',
    text: 'Happy Holidays',
    fontFamily: "'Great Vibes', cursive",
    fontSize: 0.45,
  },
  {
    id: 'joy',
    label: 'Joy to the World',
    text: 'Joy to the World',
    fontFamily: "'Mountains of Christmas', cursive",
    fontSize: 0.4,
  },
  {
    id: 'seasons',
    label: "Season's Greetings",
    text: "Season's Greetings",
    fontFamily: "'Playfair Display', serif",
    fontSize: 0.3,
  },
  {
    id: 'peace',
    label: 'Peace & Love',
    text: 'Peace & Love',
    fontFamily: "'Great Vibes', cursive",
    fontSize: 0.45,
  },
  {
    id: 'feliz',
    label: 'Feliz Navidad',
    text: 'Feliz Navidad',
    fontFamily: "'Mountains of Christmas', cursive",
    fontSize: 0.4,
  },
];

export const CONNECTOR_PATTERNS: { id: ConnectorPattern; label: string }[] = [
  { id: 'solid', label: 'Solid' },
  { id: 'stripes', label: 'Stripes' },
  { id: 'dots', label: 'Dots' },
  { id: 'snowflakes', label: 'Snowflakes' },
  { id: 'plaid', label: 'Plaid' },
  { id: 'stars', label: 'Stars' },
];
