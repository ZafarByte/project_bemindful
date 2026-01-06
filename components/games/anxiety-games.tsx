"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Flower2, Wind, TreePine, Waves, Music2, Circle, MousePointer2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BreathingGame } from "./breathing-game";
import { ZenGarden } from "./zen-garden";
import { ForestGame } from "./forest-game";
import { OceanWaves } from "./ocean-waves";
import { BubbleBurst } from "./bubble-burst";
import { FocusDots } from "./focus-dots";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
const games = [
  {
    id: "breathing",
    title: "Breathing Patterns",
    description: "Follow calming breathing exercises with visual guidance",
    icon: Wind,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    duration: "5 mins",
  },
  {
    id: "garden",
    title: "Zen Garden",
    description: "Create and maintain your digital peaceful space",
    icon: Flower2,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    duration: "10 mins",
  },
  {
    id: "forest",
    title: "Mindful Forest",
    description: "Take a peaceful walk through a virtual forest",
    icon: TreePine,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    duration: "15 mins",
  },
  {
    id: "waves",
    title: "Ocean Waves",
    description: "Match your breath with gentle ocean waves",
    icon: Waves,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    duration: "8 mins",
  },
  {
    id: "bubbles",
    title: "Bubble Burst",
    description: "Pop floating bubbles for instant stress relief",
    icon: Circle,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    duration: "Unlimited",
  },
  {
    id: "focus",
    title: "Mindful Focus",
    description: "Gently track and click dots to improve concentration",
    icon: MousePointer2,
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
    duration: "Unlimited",
  },
];

interface AnxietyGamesProps {
  onGamePlayed?: (gameName: string, description: string) => Promise<void>;
}

export const AnxietyGames = ({ onGamePlayed }: AnxietyGamesProps) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showGame, setShowGame] = useState(false);

  const handleGameStart = async (gameId: string) => {
    setSelectedGame(gameId);
    setShowGame(true);

    // Log the activity
    if (onGamePlayed) {
      try {
        await onGamePlayed(
          gameId,
          games.find((g) => g.id === gameId)?.description || ""
        );
      } catch (error) {
        console.error("Error logging game activity:", error);
      }
    }
  };

  const renderGame = () => {
    switch (selectedGame) {
      case "breathing":
        return <BreathingGame />;
      case "garden":
        return <ZenGarden />;
      case "forest":
        return <ForestGame />;
      case "waves":
        return <OceanWaves />;
      case "bubbles":
        return <BubbleBurst />;
      case "focus":
        return <FocusDots />;
      default:
        return null;
    }
  };
  return(
       <>
       <Card className="border-primary/10 shadow-sm" id="anxiety-games">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Gamepad2 className="h-5 w-5 text-primary" />
            </div>
            Anxiety Relief Activities
          </CardTitle>
          <CardDescription>
            Interactive exercises to help reduce stress and anxiety
          </CardDescription>
        </CardHeader>
         <CardContent>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {games.map((game) => (
              <motion.div
                key={game.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`border-primary/10 hover:shadow-md transition-all cursor-pointer h-full group ${
                    selectedGame === game.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleGameStart(game.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl ${game.bgColor} ${game.color} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <game.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-sm">{game.title}</h4>
                            <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground font-medium">
                                {game.duration}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {game.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
             </div>
         </CardContent>
        </Card>

        <Dialog open={showGame} onOpenChange={setShowGame}>
        <DialogContent className="sm:max-w-[800px] min-h-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                {games.find((g) => g.id === selectedGame)?.icon && (
                    <div className={`p-2 rounded-lg ${games.find((g) => g.id === selectedGame)?.bgColor}`}>
                        {(() => {
                            const Icon = games.find((g) => g.id === selectedGame)?.icon;
                            return Icon ? <Icon className={`w-5 h-5 ${games.find((g) => g.id === selectedGame)?.color}`} /> : null;
                        })()}
                    </div>
                )}
              {games.find((g) => g.id === selectedGame)?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center p-4 bg-secondary/10 rounded-lg mt-2">
            {renderGame()}
          </div>
        </DialogContent>
      </Dialog>
       </>
  )
};