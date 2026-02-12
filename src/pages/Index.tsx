import { WizardProvider, useWizard } from '@/context/WizardContext';
import SplashPage from '@/components/wizard/SplashPage';
import ImageUploadPage from '@/components/wizard/ImageUploadPage';
import DesignOptionsPage from '@/components/wizard/DesignOptionsPage';
import FinalPreviewPage from '@/components/wizard/FinalPreviewPage';

function WizardRouter() {
  const { state } = useWizard();
  switch (state.currentStep) {
    case 0:
      return <SplashPage />;
    case 1:
    case 2:
    case 3:
    case 4:
      return <ImageUploadPage />;
    case 5:
      return <DesignOptionsPage />;
    case 6:
      return <FinalPreviewPage />;
    default:
      return <SplashPage />;
  }
}

export default function Index() {
  return (
    <WizardProvider>
      <div className="min-h-screen bg-background">
        <WizardRouter />
      </div>
    </WizardProvider>
  );
}
