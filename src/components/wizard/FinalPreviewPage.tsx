import { useRef, useState } from 'react';
import { useWizard } from '@/context/WizardContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import CardRenderer from './CardRenderer';
import ExportModal from './ExportModal';
import { exportToPdf } from './PdfExporter';

export default function FinalPreviewPage() {
  const { state, dispatch } = useWizard();
  const svgRef = useRef<SVGSVGElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!svgRef.current) return;
    setExporting(true);
    try {
      await exportToPdf(svgRef.current);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: 'SET_STEP', step: 5 })}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "'Mountains of Christmas', cursive" }}
          >
            Final Preview
          </h2>
          <div className="ml-auto">
            <Button onClick={handleExport} size="lg">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="bg-muted rounded-xl p-4">
          <CardRenderer
            ref={svgRef}
            images={state.images}
            design={state.design}
          />
        </div>
      </div>

      <ExportModal open={exporting} />
    </div>
  );
}
