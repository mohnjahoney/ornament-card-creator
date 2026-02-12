import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Props {
  open: boolean;
}

export default function ExportModal({ open }: Props) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="text-center sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">Creating Your Card…</DialogTitle>
          <DialogDescription className="text-base mt-2">
            I hope this card adds a bit of joy to your family holiday.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-6">
          {/* Spinner */}
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />

          {/* Placeholder QR */}
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="w-28 h-28 bg-muted-foreground/10 rounded flex items-center justify-center text-xs text-muted-foreground text-center leading-tight">
              QR Code
              <br />
              (placeholder)
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
