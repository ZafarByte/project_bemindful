
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Lightbulb } from "lucide-react";

interface RecommendationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recommendations: string[];
}

export function RecommendationsModal({
  open,
  onOpenChange,
  recommendations,
}: RecommendationsModalProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle>Personalized Recommendations</DialogTitle>
          </div>
          <DialogDescription>
            Based on your check-in, here are some suggestions to help you feel your best.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card/50"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <p className="text-sm text-card-foreground leading-relaxed">
                {rec}
              </p>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Got it, thanks!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
