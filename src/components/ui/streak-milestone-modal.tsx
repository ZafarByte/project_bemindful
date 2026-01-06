"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Flame, Star } from "lucide-react";
import { motion } from "framer-motion";

interface StreakMilestoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  streak: number;
}

export function StreakMilestoneModal({ open, onOpenChange, streak }: StreakMilestoneModalProps) {
  const getMilestoneData = (days: number) => {
    if (days >= 30) return {
      title: "Incredible Dedication!",
      message: "30 days of mindfulness. You've built a powerful habit that's transforming your life.",
      icon: Trophy,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10"
    };
    if (days >= 15) return {
      title: "Halfway to a Month!",
      message: "15 days strong. Your consistency is truly inspiring. Keep this momentum going!",
      icon: Star,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    };
    return {
      title: "One Week Streak!",
      message: "7 days of showing up for yourself. You're building a solid foundation for mental wellness.",
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    };
  };

  const { title, message, icon: Icon, color, bg } = getMilestoneData(streak);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center overflow-hidden border-none shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-0" />
        
        {/* Decorative background elements */}
        <div className={`absolute top-0 left-0 w-full h-32 ${bg} blur-3xl opacity-50 -z-10`} />
        
        <div className="relative z-10 flex flex-col items-center pt-6 pb-2">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.1 }}
            className={`p-6 rounded-full ${bg} mb-6 relative`}
          >
            <Icon className={`w-12 h-12 ${color}`} />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-current opacity-20"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              {title}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-[80%] mx-auto">
              {message}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <Button 
              onClick={() => onOpenChange(false)} 
              className="w-full rounded-full font-semibold text-lg h-12"
            >
              Continue Journey
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
