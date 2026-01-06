"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw, Circle } from "lucide-react";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
}

const COLORS = [
  "bg-primary/20 border-primary/30",
  "bg-primary/15 border-primary/25",
  "bg-primary/25 border-primary/35",
  "bg-primary/10 border-primary/20",
  "bg-primary/30 border-primary/40",
];

export const BubbleBurst = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const createBubble = useCallback(() => {
    const id = Date.now() + Math.random();
    const size = Math.random() * 40 + 40; // 40-80px
    const x = Math.random() * 80 + 10; // 10-90%
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const speed = Math.random() * 2 + 1;

    return { id, x, y: 110, size, color, speed }; // Start below screen
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setBubbles((prev) => {
        if (prev.length > 15) return prev; // Max bubbles
        return [...prev, createBubble()];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, createBubble]);

  useEffect(() => {
    if (!isPlaying) return;

    const moveInterval = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y - b.speed * 0.5 })) // Move up
          .filter((b) => b.y > -20) // Remove if off screen
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [isPlaying]);

  const playPopSound = (size: number) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      
      // Smaller bubbles = higher pitch
      // Size is 40-80. Map to approx 800Hz - 400Hz
      const baseFreq = 1200 - (size * 10); 
      const randomOffset = Math.random() * 100 - 50;
      const startFreq = baseFreq + randomOffset;

      oscillator.frequency.setValueAtTime(startFreq, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.08);

      // Envelope for a "wet" pop sound
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  const popBubble = (id: number) => {
    const bubble = bubbles.find(b => b.id === id);
    if (bubble) {
      playPopSound(bubble.size);
    }
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setScore((s) => s + 1);
  };

  const resetGame = () => {
    setBubbles([]);
    setScore(0);
    setIsPlaying(true);
  };

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-primary/10 to-background border border-border">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
        <div className="bg-background/80 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm border border-border/50">
          <span className="font-semibold text-primary">
            Popped: {score}
          </span>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={resetGame}
          className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {bubbles.length === 0 && isPlaying && (
          <p className="text-muted-foreground text-sm animate-pulse">
            Wait for bubbles...
          </p>
        )}
      </div>

      <AnimatePresence>
        {bubbles.map((bubble) => (
          <motion.button
            key={bubble.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 0.8,
              top: `${bubble.y}%`,
              left: `${bubble.x}%`,
            }}
            exit={{ scale: [1, 1.5, 0], opacity: [1, 0.5, 0] }}
            transition={{ duration: 0.2 }}
            onClick={() => popBubble(bubble.id)}
            className={`absolute rounded-full cursor-pointer shadow-sm backdrop-blur-[2px] border ${bubble.color} hover:brightness-110 active:scale-95`}
            style={{
              width: bubble.size,
              height: bubble.size,
            }}
          >
            <div className="absolute top-[20%] left-[20%] w-[20%] h-[20%] bg-white/40 rounded-full blur-[2px]" />
            <div className="absolute bottom-[20%] right-[20%] w-[10%] h-[10%] bg-white/20 rounded-full blur-[1px]" />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
};
