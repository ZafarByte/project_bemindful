"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cloud, Send, Wind } from "lucide-react";

interface ThoughtCloud {
  id: number;
  text: string;
  y: number;
  speed: number;
}

export const ThoughtClouds = () => {
  const [thought, setThought] = useState("");
  const [clouds, setClouds] = useState<ThoughtCloud[]>([]);

  const addThought = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!thought.trim()) return;

    const newCloud: ThoughtCloud = {
      id: Date.now(),
      text: thought,
      y: Math.random() * 60 + 10, // Random height 10-70%
      speed: Math.random() * 10 + 20, // Duration 20-30s
    };

    setClouds((prev) => [...prev, newCloud]);
    setThought("");
  };

  const removeCloud = (id: number) => {
    setClouds((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-sky-200 to-sky-50 dark:from-sky-900 dark:to-slate-900 border border-border flex flex-col">
      {/* Sky Area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence>
          {clouds.map((cloud) => (
            <motion.div
              key={cloud.id}
              initial={{ x: -200, opacity: 0, scale: 0.8 }}
              animate={{ 
                x: "120%", 
                opacity: [0, 1, 1, 0],
                scale: 1 
              }}
              transition={{ 
                duration: cloud.speed, 
                ease: "linear",
              }}
              onAnimationComplete={() => removeCloud(cloud.id)}
              className="absolute flex items-center justify-center"
              style={{ top: `${cloud.y}%` }}
            >
              <div className="relative">
                <Cloud className="w-32 h-20 text-white/90 dark:text-white/80 fill-white/90 dark:fill-white/10 drop-shadow-md" />
                <span className="absolute inset-0 flex items-center justify-center text-xs text-slate-600 dark:text-slate-200 font-medium px-4 text-center truncate max-w-[100px]">
                  {cloud.text}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {clouds.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-sm">
            The sky is clear...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background/80 backdrop-blur-sm border-t border-border z-10">
        <form onSubmit={addThought} className="flex gap-2">
          <Input
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="Type a thought or worry to release..."
            className="bg-background/50"
          />
          <Button type="submit" size="icon" disabled={!thought.trim()}>
            <Wind className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Acknowledge your thoughts, then watch them drift away.
        </p>
      </div>
    </div>
  );
};
