import { useWizard } from '@/context/WizardContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TEXT_TEMPLATES, CONNECTOR_PATTERNS } from '@/config/cardLayout';
import CardRenderer from './CardRenderer';

export default function DesignOptionsPage() {
  const { state, dispatch } = useWizard();
  const { design } = state;

  const setDesign = (data: Partial<typeof design>) =>
    dispatch({ type: 'SET_DESIGN', data });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: 'SET_STEP', step: 4 })}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "'Mountains of Christmas', cursive" }}
          >
            Design Options
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Card preview */}
          <div className="bg-muted rounded-xl p-4 flex items-center justify-center">
            <div className="w-full max-w-lg">
              <CardRenderer images={state.images} design={design} />
            </div>
          </div>

          {/* Controls panel */}
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Card Background
              </label>
              <input
                type="color"
                value={design.bgColor}
                onChange={(e) => setDesign({ bgColor: e.target.value })}
                className="w-full h-10 rounded-md cursor-pointer border border-border"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Ornament Outline
              </label>
              <input
                type="color"
                value={design.outlineColor}
                onChange={(e) => setDesign({ outlineColor: e.target.value })}
                className="w-full h-10 rounded-md cursor-pointer border border-border"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Ornament Cap
              </label>
              <input
                type="color"
                value={design.capColor}
                onChange={(e) => setDesign({ capColor: e.target.value })}
                className="w-full h-10 rounded-md cursor-pointer border border-border"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Connector Pattern
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CONNECTOR_PATTERNS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setDesign({ pattern: p.id })}
                    className={`p-2 text-xs rounded-md border-2 transition-colors ${
                      design.pattern === p.id
                        ? 'border-primary bg-primary/10 font-medium'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Holiday Text
              </label>
              <div className="space-y-1">
                {TEXT_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setDesign({ textTemplateId: t.id })}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      design.textTemplateId === t.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    style={
                      t.id !== 'none' ? { fontFamily: t.fontFamily } : undefined
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => dispatch({ type: 'SET_STEP', step: 6 })}
            >
              Final Preview →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
