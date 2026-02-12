

# Ornament Card Maker — Implementation Plan

## Overview
A fully client-side React app where users create printable Christmas card ornaments through a 5-step wizard. Users upload 4 photos, customize colors/patterns/text, then download a high-resolution PDF ready to cut and assemble into hanging ornaments.

---

## Step 1: Core Layout & Wizard Navigation
- **Wizard router** with 5 stages: Splash → Image Upload (×4) → Design Options → Final Preview → Export
- Progress indicator showing current step
- Back/forward navigation with appropriate disabled states
- All layout constants (margins, dimensions, DPI) centralized in a single config file

## Step 2: Splash Page
- Friendly title "Ornament Card Maker" with holiday-themed copy
- Static hero mockup showing what the finished card looks like
- Prominent "Start" button to begin the wizard

## Step 3: Image Upload & Placement (4 pages)
- One ornament per page with drag-and-drop upload zone
- Ornament shape rendered as SVG (circle + rounded-rectangle cap, cap filled white)
- On image upload: auto-fit based on landscape/portrait orientation rules
- Gesture-based editing: drag to pan, pinch/ctrl+wheel to zoom, rotation gestures
- Per-image state tracking (scale, rotation, offsetX, offsetY)
- Coverage detection: sample circle boundary points, adjust outline opacity (100% covered vs 50% uncovered)
- Controls: Next Image (disabled until image uploaded), Back arrow, Trash icon to delete

## Step 4: Design Options Preview Page
- Full-sheet preview showing front (top half) and back (bottom half)
- Customization controls:
  - Card background color picker
  - Ornament outline color picker
  - Ornament cap color picker
  - Connector circle pattern selector (Solid, Stripes, Dots, Snowflakes, Plaid, Stars)
  - Holiday text template selector (5-6 predefined phrases with specific fonts/sizes/positions)
- "Final Preview" button

## Step 5: Card Layout & Rendering
- US Letter page: top half = front, bottom half = back
- 2 ornaments per side with proper margins (0.5" left, right, bottom, between)
- Connector circles (50% of ornament diameter) centered above each ornament
- SVG-based rendering with clipPath/masks for photo masking
- Cut lines: solid strokes at ~1/8" thickness in ornament outline color
- Slot lines: front left center-to-bottom, front right center-to-top; back reversed
- Connector circle with plus sign, same stroke style
- SVG pattern definitions for all 6 connector patterns

## Step 6: Final Preview Page
- Rendered full card preview at screen resolution
- Back arrow to return to design options
- "Download PDF" button

## Step 7: PDF Export & Export Modal
- PDF generation using pdf-lib at 600 DPI (2550×3300 px single US Letter page)
- Export modal shown during generation with message: "I hope this card adds a bit of joy to your family holiday"
- Placeholder QR code image (to be replaced with real Venmo QR later)
- Auto-close modal and trigger file download when complete

## Technical Notes
- Fully client-side, no backend needed
- Static-site deployable
- All assets bundled
- SVG for layout/masking, vector strokes for cut lines
- pdf-lib for PDF generation

