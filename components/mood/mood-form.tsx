"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { useToast } from "../../src/components/ui/use-toast";
import { useSession } from "../../lib/context/session-context";
import { useRouter } from "next/navigation";

interface MoodFormProps {
  onSuccess?: (recommendations?: string[], needsProfessionalHelp?: boolean) => void;
  /**
   * Optional feature vector for the ML mood model. If provided,
   * the backend will use it to predict moodScore and moodType.
   */
  features?: number[];
}


export function MoodForm({ onSuccess, features }: MoodFormProps) {
  const { checkSession } = useSession();
const { user, isAuthenticated, loading } = useSession();
  const [moodScore, setMoodScore] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const emotions = [
    { value: 0, label: "😔", description: "Very Low" },
    { value: 25, label: "😕", description: "Low" },
    { value: 50, label: "😊", description: "Neutral" },
    { value: 75, label: "😃", description: "Good" },
    { value: 100, label: "🤗", description: "Great" },
  ];

  const currentEmotion =
    emotions.find((em) => Math.abs(moodScore - em.value) < 15) || emotions[2];

     const handleSubmit = async () => {
    console.log("MoodForm: Starting submission");
    console.log("MoodForm: Auth state:", { isAuthenticated, loading, user });

    if (!isAuthenticated) {
      console.log("MoodForm: User not authenticated");
      toast({
        title: "Authentication required",
        description: "Please log in to track your mood",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      console.log(
        "MoodForm: Token from localStorage:",
        token ? "exists" : "not found"
      );

      // For testing: always send a feature vector so the AI model is called.
      // If props.features is provided, use that; otherwise generate a dummy
      // 21-length numeric array based on the current moodScore.
      const generatedFeatures = Array.from({ length: 21 }, (_, i) => {
        const base = moodScore / 25; // map 0–100 → roughly 0–4
        return Number((base + i * 0.05).toFixed(2));
      });
      const effectiveFeatures = features?.length ? features : generatedFeatures;

      console.log("MoodForm: Sending features to AI model:", effectiveFeatures);

      const payload: Record<string, unknown> = {
        features: effectiveFeatures,
      };

      const response = await fetch("/api/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("MoodForm: Response status:", response.status);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("MoodForm: Non-JSON response:", text);
        throw new Error("Server returned an invalid response. Make sure the backend is running on port 3001.");
      }

      if (!response.ok) {
        const error = await response.json();
        console.error("MoodForm: Error response:", error);
        throw new Error(error.error || "Failed to track mood");
      }

      const data = await response.json();
      console.log("MoodForm: Success response:", data);

      const mood = data?.data;
      const savedScore = mood?.score ?? moodScore;
      const moodType = mood?.moodType;

      toast({
        title: "Mood saved",
        description: moodType
          ? `Detected: ${moodType} (score ${Math.round(savedScore)})`
          : "Mood tracked successfully!",
        variant: "default",
      });

      // Call onSuccess to close the modal and pass recommendations
      onSuccess?.(data.recommendations, data.needsProfessionalHelp);
    } catch (error) {
      console.error("MoodForm: Error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to track mood",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      {/* Emotion display */}
      <div className="text-center space-y-2">
        <div className="text-4xl">{currentEmotion.label}</div>
        <div className="text-sm text-muted-foreground">
          {currentEmotion.description}
        </div>
      </div>

      {/* Emotion slider */}
      <div className="space-y-4">
        <div className="flex justify-between px-2">
          {emotions.map((em) => (
            <div
              key={em.value}
              className={`cursor-pointer transition-opacity ${Math.abs(moodScore - em.value) < 15
                  ? "opacity-100"
                  : "opacity-50"
                }`}
              onClick={() => setMoodScore(em.value)}
            >
              <div className="text-2xl">{em.label}</div>
            </div>
          ))}
        </div>

        <Slider
          value={[moodScore]}
          onValueChange={(value) => setMoodScore(value[0])}
          min={0}
          max={100}
          step={1}
          className="py-4"
        />
      </div>

      {/* Submit button */}
       <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : isLoading ? (
          "Loading..."
        ) : (
          "Save Mood"
        )}
      </Button>
    </form>
  );
}
