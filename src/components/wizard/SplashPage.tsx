import { useWizard } from '@/context/WizardContext';
import { Button } from '@/components/ui/button';

export default function SplashPage() {
  const { dispatch } = useWizard();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      {/* Decorative ornaments */}
      <div className="flex gap-6 mb-8">
        {['hsl(350,65%,40%)', 'hsl(150,35%,30%)', 'hsl(42,75%,50%)'].map(
          (color, i) => (
            <svg key={i} width="80" height="110" viewBox="0 0 80 110">
              <line x1="40" y1="0" x2="40" y2="18" stroke="hsl(20,10%,45%)" strokeWidth="2" />
              <rect x="28" y="14" width="24" height="14" rx="3" fill="hsl(42,75%,50%)" />
              <circle cx="40" cy="65" r="38" fill={color} />
              <ellipse
                cx="30"
                cy="50"
                rx="8"
                ry="14"
                fill="white"
                opacity="0.15"
                transform="rotate(-15 30 50)"
              />
            </svg>
          )
        )}
      </div>

      <h1
        className="text-5xl md:text-6xl font-bold text-foreground mb-4"
        style={{ fontFamily: "'Mountains of Christmas', cursive" }}
      >
        Ornament Card Maker
      </h1>

      <p className="text-lg text-muted-foreground mb-2 max-w-md">
        Create beautiful printable Christmas ornament cards with your favorite
        photos.
      </p>
      <p className="text-sm text-muted-foreground mb-8 max-w-md">
        Upload 4 photos, customize your design, and download a ready-to-print
        PDF that turns into a hanging ornament!
      </p>

      <Button
        size="lg"
        className="text-lg px-10 py-6 rounded-full shadow-lg"
        onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}
      >
        ✨ Start Creating
      </Button>
    </div>
  );
}
