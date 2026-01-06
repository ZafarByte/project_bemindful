
export const getRecommendations = (
  moodScore: number,
  baselineAnswers: Record<string, number>
): { tips: string[], needsProfessionalHelp: boolean } => {
  const recommendations: string[] = [];
  let needsProfessionalHelp = false;

  // --- Category 1: Very Low Mood (High Distress) ---
  // Mood Score Range: 0 - 25
  if (moodScore <= 25) {
    recommendations.push(
      "Your mood score indicates high distress. Please consider consulting a mental health professional or psychiatrist for personalized support."
    );
     recommendations.push(
      "Reach out to a trusted friend or family member to share how you're feeling."
    );
    needsProfessionalHelp = true;
    
    return { tips: recommendations, needsProfessionalHelp };
  }

  // --- Category 2: Low to Average Mood (Moderate Stress / Neutral) ---
  // Mood Score Range: 26 - 65
  // Focus on improvement tips based on baseline data.
  if (moodScore <= 65) {
      if (!baselineAnswers) {
          recommendations.push("Your mood is in the average range. Establishing a consistent daily routine can help improve your well-being.");
          return { tips: recommendations, needsProfessionalHelp };
      }

      // 1. Sleep Hygiene
      const sleepDuration = baselineAnswers["sleepDuration"];
      if (sleepDuration !== undefined && sleepDuration <= 5) { // 5 hours or less
          recommendations.push("You reported low sleep duration. Aim for 7-9 hours of restful sleep to naturally boost your mood and resilience.");
      }

      // 2. Screen Time
      const screenTime = baselineAnswers["screenTime"]; 
      // 4 represents "6-8 hours", 5 represents "> 8 hours"
      if (screenTime !== undefined && screenTime >= 4) {
          recommendations.push("High screen time is linked to increased stress. Try a 'digital detox' 1 hour before bed.");
      }

      // 3. Physical Activity
      const physicalActivity = baselineAnswers["physicalActivity"];
      if (physicalActivity !== undefined && physicalActivity <= 1) { // 0-2 days
          recommendations.push("Regular movement is a powerful antidepressant. Try a 15-minute walk today to clear your mind.");
      }

       // 4. Diet Quality
      const dietQuality = baselineAnswers["dietQuality"];
      if (dietQuality !== undefined && dietQuality <= 2) { // Unhealthy
          recommendations.push("Nutrition affects how we feel. Consider adding more whole foods and staying hydrated to support your energy.");
      }

      // 5. Age-Specific Suggestions
      const age = Number(baselineAnswers["age"]);
      if (!isNaN(age)) {
          if (age < 25) {
              recommendations.push("At this stage of life, academic or early career pressure can be intense. Remember to balance ambition with meaningful downtime.");
          } else if (age >= 25 && age < 50) {
               recommendations.push("Balancing work, family, and personal time is challenging. Try 'micro-breaks'—just 2 minutes of focus on breathing every few hours.");
          } else if (age >= 50) {
               recommendations.push("Physical well-being is closely tied to mood. Gentle low-impact exercises like walking or yoga can be very beneficial.");
          }
      }

      // Generic fallback if no specific baseline issues found but mood is average
      if (recommendations.length === 0) {
          recommendations.push("Your mood is stable. To improve it, try practicing mindfulness or gratitude journaling.");
      }
      
      return { tips: recommendations, needsProfessionalHelp };
  }

  // --- Category 3: High Mood (Positive / Flourishing) ---
  // Mood Score Range: 66 - 100
  recommendations.push("You're doing great! Keep up your positive habits.");
  
  // Optional: Still gently nudge if something is critical (like extreme sleep deprivation), 
  // but phrase it as maintenance.
  if (baselineAnswers) {
       const sleepDuration = baselineAnswers["sleepDuration"];
       if (sleepDuration !== undefined && sleepDuration <= 4) {
           recommendations.push("Note: Even when feeling good, ensuring adequate sleep helps maintain this positive state long-term.");
       }
  }

  return { tips: recommendations, needsProfessionalHelp };
};
