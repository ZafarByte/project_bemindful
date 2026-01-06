

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lightbulb, CheckCircle2, AlertCircle, Sparkles, ChevronRight, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PsychiatristListModal } from "./psychiatrist-list-modal";

interface RecommendationCardProps {
  recommendations: string[];
  className?: string;
  needsProfessionalHelp?: boolean;
}

export function RecommendationCard({ recommendations, className, needsProfessionalHelp }: RecommendationCardProps) {
  const [showPsychiatristModal, setShowPsychiatristModal] = useState(false);

  // Empty State
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className={cn("border-dashed border-2 border-primary/20 shadow-none bg-primary/5", className)}>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="p-3 bg-background rounded-full shadow-sm">
                <Sparkles className="w-6 h-6 text-primary/60" />
            </div>
            <div>
                <h3 className="font-semibold text-primary/80">Awaiting Insights</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-[200px] mx-auto">
                    Complete your daily check-in to unlock personalized AI wellness tips.
                </p>
            </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={cn(
          "overflow-hidden border transition-all duration-300 group hover:shadow-md",
          needsProfessionalHelp 
            ? "border-rose-200 shadow-rose-100 bg-rose-50/30" 
            : "border-indigo-100 shadow-indigo-100 bg-white",
          className
      )}>
        {/* Dynamic Header */}
        <div className={cn(
            "h-1.5 w-full",
            needsProfessionalHelp 
                ? "bg-gradient-to-r from-rose-400 via-red-500 to-rose-400" 
                : "bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-400"
        )} />
        
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={cn(
                  "p-2 rounded-lg shadow-sm ring-1 ring-inset",
                  needsProfessionalHelp 
                    ? "bg-white text-rose-600 ring-rose-100" 
                    : "bg-white text-indigo-600 ring-indigo-100"
              )}>
                {needsProfessionalHelp ? (
                     <AlertCircle className="w-5 h-5" />
                ) : (
                     <Sparkles className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-0.5">
                  <CardTitle className="text-lg font-bold tracking-tight text-gray-900">
                      {needsProfessionalHelp ? "Priority Care" : "Daily Insights"}
                  </CardTitle>
                  <CardDescription className="text-xs font-medium">
                      {needsProfessionalHelp 
                        ? "Important attention needed" 
                        : "Curated for your well-being"}
                  </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2 pb-5 space-y-4">
          <ScrollArea className="h-[240px] pr-3.5 -mr-2">
            <div className="space-y-3 pl-0.5 pt-0.5 pb-2">
              {recommendations.map((rec, index) => (
                <div 
                    key={index} 
                    className={cn(
                        "relative flex gap-3 p-3.5 rounded-xl border transition-all duration-200",
                        "hover:-translate-y-0.5 hover:shadow-sm group/item",
                        needsProfessionalHelp
                            ? "bg-white border-rose-100 hover:border-rose-200 text-rose-900"
                            : "bg-white border-slate-100 hover:border-indigo-200 text-slate-700"
                    )}
                >
                  <div className={cn(
                      "mt-0.5 shrink-0", 
                      needsProfessionalHelp ? "text-rose-500" : "text-emerald-500"
                  )}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-sm leading-relaxed font-medium opacity-90">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {needsProfessionalHelp && (
              <Button 
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200"
                  size="default"
                  onClick={() => setShowPsychiatristModal(true)}
              >
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Connect with a Specialist
              </Button>
          )}

          {!needsProfessionalHelp && (
             <div className="pt-2 flex items-center justify-center gap-2 opacity-60">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Personalized AI</span>
                <div className="h-px bg-slate-200 flex-1" />
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
