import { CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

const OnboardingModal = ({ open, onClose }: OnboardingModalProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </span>
            Welcome to RegripBid
          </DialogTitle>
          <DialogDescription>
            You are viewing a demo dashboard with mock auction data. Use the search and filters to
            explore how live tyre auctions would look in production.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>In a real deployment, this screen would show:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Live WebSocket-powered auction updates</li>
            <li>Dealer-specific pricing and access controls</li>
            <li>Secure, concurrency-safe bid placement</li>
          </ul>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose} className="gap-1.5" size="sm">
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;

