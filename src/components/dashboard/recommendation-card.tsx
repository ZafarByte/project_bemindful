import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, AlertCircle, Sparkles, Stethoscope, PlusCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PsychiatristListModal } from "./psychiatrist-list-modal";
import { createTodo } from "@/lib/api/todo";

interface RecommendationCardProps {
  recommendations: string[];
  className?: string;
  needsProfessionalHelp?: boolean;
  onTodoAdded?: () => void;
}

export function RecommendationCard({ recommendations, className, needsProfessionalHelp, onTodoAdded }: RecommendationCardProps) {
  const [showPsychiatristModal, setShowPsychiatristModal] = useState(false);
  const [addedRecs, setAddedRecs] = useState<Set<number>>(new Set());

  const handleAddToTodo = async (rec: string, index: number) => {
    try {
        await createTodo(rec, "recommendation");
        setAddedRecs(prev => new Set(Array.from(prev).concat(index)));
        if (onTodoAdded) onTodoAdded();
    } catch (error) {
        console.error("Failed to add todo", error);
    }
  };

  return (
    <>
      <Card className={cn(className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {needsProfessionalHelp ? (
                <div className="p-2 bg-red-100 rounded-full dark:bg-red-900/20">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
              ) : (
                <div className="p-2 bg-primary/10 rounded-full">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
              )}
              <div>
                <CardTitle>{needsProfessionalHelp ? "Priority Care" : "Daily Recommendations"}</CardTitle>
                <CardDescription>
                  {needsProfessionalHelp 
                    ? "Based on your check-in, we recommend professional support." 
                    : "Personalized suggestions for your well-being."}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <ScrollArea className="h-[250px] pr-4">
            {recommendations && recommendations.length > 0 ? (
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded-lg border bg-card/50 group relative">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground/90 leading-relaxed flex-1 pr-6">{rec}</p>
                    
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2"
                        title={addedRecs.has(index) ? "Added to plan" : "Add to Action Plan"}
                        disabled={addedRecs.has(index)}
                        onClick={() => handleAddToTodo(rec, index)}
                    >
                        {addedRecs.has(index) ? (
                            <Check className="w-4 h-4 text-green-500" />
                        ) : (
                            <PlusCircle className="w-4 h-4 text-primary" />
                        )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                <Sparkles className="w-8 h-8 text-muted-foreground/50 mb-2" />
                <p>No recommendations available yet.</p>
                <p className="text-xs mt-1">Complete a daily check-in to get started.</p>
              </div>
            )}
          </ScrollArea>

          {needsProfessionalHelp && (
            <div className="mt-4 pt-4 border-t">
              <Button 
                className="w-full" 
                variant="destructive"
                onClick={() => setShowPsychiatristModal(true)}
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                Connect with a Specialist
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <PsychiatristListModal 
        open={showPsychiatristModal} 
        onOpenChange={setShowPsychiatristModal} 
      />
    </>
  );
}
