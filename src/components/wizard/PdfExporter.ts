import { PDFDocument } from 'pdf-lib';
import { EXPORT } from '@/config/cardLayout';

export async function exportToPdf(svgElement: SVGSVGElement): Promise<void> {
  // Serialize SVG to string
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const blob = new Blob([svgString], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);

  // Render SVG to a high-res canvas
  const img = new Image();
  img.src = url;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
  });

  const canvas = document.createElement('canvas');
  canvas.width = EXPORT.WIDTH;
  canvas.height = EXPORT.HEIGHT;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, EXPORT.WIDTH, EXPORT.HEIGHT);
  ctx.drawImage(img, 0, 0, EXPORT.WIDTH, EXPORT.HEIGHT);
  URL.revokeObjectURL(url);

  // Create PDF (US Letter = 612 x 792 points)
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);

  const pngDataUrl = canvas.toDataURL('image/png');
  const pngBytes = await fetch(pngDataUrl).then((r) => r.arrayBuffer());
  const pngImage = await pdfDoc.embedPng(pngBytes);

  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: 612,
    height: 792,
  });

  // Trigger download
  const pdfBytes = await pdfDoc.save();
  const pdfBlob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const downloadUrl = URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'ornament-card.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
