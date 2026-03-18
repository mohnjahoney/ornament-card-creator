// All layout constants centralized here
// Page dimensions in inches

export const PAGE = {
  WIDTH: 7,
  HEIGHT: 10,
  HALF_HEIGHT: 5,
};

export const EXPORT = {
  WIDTH: 2550,
  HEIGHT: 3300,
  DPI: 300, // 2550 / 8.5
};

export const MARGINS = {
  CONNECTOR_TOP: 0.5,
  BOTTOM: 0.5,
  BETWEEN: 0.5,
};

export const ORNAMENT = {
  RADIUS: 1.5,
  CAP_WIDTH_RATIO: 0.25,
  CAP_HEIGHT_RATIO: 0.2,
  CAP_CORNER_RATIO: 0.04,
};

export const CONNECTOR = {
  // Connector radius relative to ornament radius.
  // (This matches the old behavior where connRadius = ORNAMENT.RADIUS * DIAMETER_RATIO.)
  RADIUS_RATIO: 0.5,

  // Distance from top of each half-page to the TOP of the connector circle,
  // expressed in ornament radii.
  //
  // With the current ORNAMENT.RADIUS=1.25, TOP_OFFSET_R=0.32 preserves the prior
  // absolute 0.4in margin: 0.32 * 1.25 = 0.4.
  TOP_OFFSET_R: 0.32,
};

export const CUT = {
  STROKE_WIDTH: 0.05, // 1/8 inch
};

// Derived values (inches, relative to top-left of each half-page)
const connectorTop = CONNECTOR.TOP_OFFSET_R * ORNAMENT.RADIUS;
const connRadius = ORNAMENT.RADIUS * CONNECTOR.RADIUS_RATIO;
const connDiam = 2 * connRadius;
const capW = 2 * ORNAMENT.RADIUS * ORNAMENT.CAP_WIDTH_RATIO;
const capH = 2 * ORNAMENT.RADIUS * ORNAMENT.CAP_HEIGHT_RATIO;
const capRx = 2 * ORNAMENT.RADIUS * ORNAMENT.CAP_CORNER_RATIO;
const totalW = 4 * ORNAMENT.RADIUS + MARGINS.BETWEEN;
const leftOffset = (PAGE.WIDTH - totalW) / 2;

export const COMPUTED = {
  CONNECTOR_DIAMETER: connDiam,
  CONNECTOR_RADIUS: connRadius,
  CAP_WIDTH: capW,
  CAP_HEIGHT: capH,
  CAP_CORNER_RADIUS: capRx,
  CONNECTOR_CENTER_Y: connectorTop + connRadius,
  ORNAMENT_CENTER_Y:
    connectorTop + connDiam + 0.05 + capH - 0.1 + ORNAMENT.RADIUS,
  LEFT_CENTER_X: leftOffset + ORNAMENT.RADIUS,
  RIGHT_CENTER_X: PAGE.WIDTH - leftOffset - ORNAMENT.RADIUS,
  TEXT_Y:
    connectorTop +
    connDiam +
    0.05 +
    capH -
    0.1 +
    2 * ORNAMENT.RADIUS +
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
