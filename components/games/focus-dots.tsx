"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, MousePointer2 } from "lucide-react";

interface Dot {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
}

const COLORS = [
  "bg-emerald-400/80 border-emerald-500/50",
  "bg-teal-400/80 border-teal-500/50",
  "bg-cyan-400/80 border-cyan-500/50",
  "bg-sky-400/80 border-sky-500/50",
];

export const FocusDots = () => {
  const [dots, setDots] = useState<Dot[]>([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [missed, setMissed] = useState(0);

  const startGame = () => {
    setDots([]);
    setScore(0);
    setMissed(0);
    setIsPlaying(true);
  };

  const stopGame = () => {
    setIsPlaying(false);
    setDots([]);
  };

  const createDot = useCallback(() => {
    const id = Date.now() + Math.random();
    const size = Math.random() * 30 + 40; // 40-70px
    const x = Math.random() * 80 + 10; // 10-90%
    const y = Math.random() * 80 + 10; // 10-90%
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const duration = Math.random() * 1.5 + 2; // 2-3.5s lifetime

    return { id, x, y, size, color, duration };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 4) return prev; // Max 4 dots to keep it calm
        return [...prev, createDot()];
      });
    }, 1200); // Spawn every 1.2s

    return () => clearInterval(interval);
  }, [isPlaying, createDot]);

  const handleDotClick = (id: number) => {
    setDots((prev) => prev.filter((d) => d.id !== id));
    setScore((s) => s + 1);
    playClickSound();
  };

  const handleDotTimeout = (id: number) => {
    setDots((prev) => {
      const exists = prev.find((d) => d.id === id);
      if (exists) {
        setMissed((m) => m + 1);
        return prev.filter((d) => d.id !== id);
      }
      return prev;
    });
  };

  const playClickSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // ignore audio errors
    }
  };

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900 border border-border flex flex-col items-center justify-center">
      {!isPlaying ? (
        <div className="text-center space-y-4 z-10 p-6">
          <div className="p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <MousePointer2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Mindful Focus</h3>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Gently click the dots as they appear. Maintain your attention and rhythm.
          </p>
          <Button onClick={startGame} size="lg" className="gap-2">
            <Play className="w-4 h-4" /> Start Session
          </Button>
        </div>
      ) : (
        <>
          <div className="absolute top-4 left-4 z-10 flex gap-4">
            <div className="bg-background/80 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm border border-border/50">
              <span className="font-semibold text-primary">Focus: {score}</span>
            </div>
            <div className="bg-background/80 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm border border-border/50">
              <span className="font-semibold text-muted-foreground">Missed: {missed}</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={stopGame}
            className="absolute top-4 right-4 z-10 rounded-full bg-background/80 backdrop-blur-sm"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <AnimatePresence>
            {dots.map((dot) => (
              <DotItem 
                key={dot.id} 
                dot={dot} 
                onClick={() => handleDotClick(dot.id)} 
                onTimeout={() => handleDotTimeout(dot.id)} 
              />
            ))}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

const DotItem = ({ 
  dot, 
  onClick, 
  onTimeout 
}: { 
  dot: Dot; 
  onClick: () => void; 
  onTimeout: () => void; 
}) => {
  useEffect(() => {
    const timer = setTimeout(onTimeout, dot.duration * 1000);
    return () => clearTimeout(timer);
  }, [dot.duration, onTimeout]);

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className={`absolute rounded-full cursor-pointer shadow-sm backdrop-blur-[1px] border ${dot.color} hover:brightness-110 active:scale-95`}
      style={{
        left: `${dot.x}%`,
        top: `${dot.y}%`,
        width: dot.size,
        height: dot.size,
      }}
    >
      <div className="absolute inset-2 bg-white/20 rounded-full blur-[2px]" />
    </motion.button>
  );
};
