export type SliderOption = { value: number | string; label: string };
export type SliderItem = {
  id: string;
  label: string;
  type?: "slider" | "number" | "select";
  reverse?: boolean;
  options?: SliderOption[]; // optional explicit scale; defaults to 0-4
  placeholder?: string;
};

export const baselineItems: SliderItem[] = [
  {
    id: "age",
    label: "What is your age?",
    type: "number",
    placeholder: "Enter your age",
  },
  {
    id: "gender",
    label: "What is your gender?",
    type: "select",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "non-binary", label: "Non-binary" },
      { value: "prefer-not-to-say", label: "Prefer not to say" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "sleepDuration",
    label: "On average, how many hours do you sleep per night?",
    reverse: true,
    options: Array.from({ length: 8 }, (_, i) => ({
      value: i + 1,
      label: `${i + 1}h`,
    })),
  },
  {
    id: "sleepQuality",
    label: "How would you rate the quality of your sleep?",
    reverse: true,
    options: [
      { value: 1, label: "Very poor" },
      { value: 2, label: "Poor" },
      { value: 3, label: "Average" },
      { value: 4, label: "Good" },
      { value: 5, label: "Very good" },
    ],
  },
  {
    id: "sleepRegularity",
    label: "How regular is your sleep schedule?",
    reverse: true,
    options: [
      { value: 1, label: "Very irregular" },
      { value: 2, label: "Slightly irregular" },
      { value: 3, label: "Somewhat regular" },
      { value: 4, label: "Mostly regular" },
      { value: 5, label: "Very regular" },
    ],
  },
  {
    id: "physicalActivity",
    label: "How many days per week do you exercise?",
    reverse: true,
    options: [
      { value: 0, label: "0 days" },
      { value: 1, label: "1–2 days" },
      { value: 3, label: "3–4 days" },
      { value: 5, label: "5–6 days" },
      { value: 7, label: "Every day" },
    ],
  },
  {
    id: "physicalHealth",
    label: "How would you describe your overall physical health?",
    reverse: true,
    options: [
      { value: 1, label: "Very poor" },
      { value: 2, label: "Poor" },
      { value: 3, label: "Average" },
      { value: 4, label: "Good" },
      { value: 5, label: "Excellent" },
    ],
  },
  {
    id: "workStress",
    label: "How stressful is your work, study, or daily responsibility?",
    options: [
      { value: 1, label: "Not stressful" },
      { value: 2, label: "Slightly stressful" },
      { value: 3, label: "Moderately stressful" },
      { value: 4, label: "Very stressful" },
      { value: 5, label: "Extremely stressful" },
    ],
  },
  {
    id: "commuteTime",
    label: "On a typical day, how long is your total commute time?",
    options: [
      { value: 1, label: "< 15 min" },
      { value: 2, label: "15–30 min" },
      { value: 3, label: "30–60 min" },
      { value: 4, label: "1–2 hours" },
      { value: 5, label: "> 2 hours" },
    ],
  },
  {
    id: "screenTime",
    label: "How many hours per day do you spend on screens?",
    options: [
      { value: 1, label: "< 2 hours" },
      { value: 2, label: "2–4 hours" },
      { value: 3, label: "4–6 hours" },
      { value: 4, label: "6–8 hours" },
      { value: 5, label: "> 8 hours" },
    ],
  },
  {
    id: "dietQuality",
    label: "How balanced would you say your daily diet is?",
    reverse: true,
    options: [
      { value: 1, label: "Very unhealthy" },
      { value: 2, label: "Unhealthy" },
      { value: 3, label: "Average" },
      { value: 4, label: "Healthy" },
      { value: 5, label: "Very healthy" },
    ],
  },
  {
    id: "substanceUse",
    label: "How often do you consume alcohol, cigarettes, or similar substances?",
    options: [
      { value: 1, label: "Never" },
      { value: 2, label: "Rarely" },
      { value: 3, label: "Occasionally" },
      { value: 4, label: "Frequently" },
    ],
  },
  {
    id: "socialInteraction",
    label: "How often do you interact socially with others?",
    reverse: true,
    options: [
      { value: 1, label: "Very rarely" },
      { value: 2, label: "Rarely" },
      { value: 3, label: "Sometimes" },
      { value: 4, label: "Often" },
      { value: 5, label: "Very often" },
    ],
  },
  {
    id: "socialSupport",
    label: "How supported do you feel by people around you?",
    reverse: true,
    options: [
      { value: 1, label: "Not supported at all" },
      { value: 2, label: "Slightly supported" },
      { value: 3, label: "Moderately supported" },
      { value: 4, label: "Well supported" },
      { value: 5, label: "Very well supported" },
    ],
  },
  {
    id: "lifeSatisfaction",
    label: "How satisfied are you with your life overall?",
    reverse: true,
    options: [
      { value: 1, label: "Very dissatisfied" },
      { value: 2, label: "Dissatisfied" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Satisfied" },
      { value: 5, label: "Very satisfied" },
    ],
  },
  {
    id: "overwhelmed",
    label: "How often do you feel overwhelmed by daily responsibilities?",
    options: [
      { value: 1, label: "Never" },
      { value: 2, label: "Rarely" },
      { value: 3, label: "Sometimes" },
      { value: 4, label: "Often" },
      { value: 5, label: "Very often" },
    ],
  },
  {
    id: "healthCondition",
    label: "Do you have any long-term physical or mental health condition?",
    options: [
      { value: 1, label: "No" },
      { value: 2, label: "Yes, mild" },
      { value: 3, label: "Yes, moderate" },
      { value: 4, label: "Yes, significant" },
    ],
  },
];

export const dailyItems: SliderItem[] = [
  {
    id: "stress",
    label: "How stressed did you feel today?",
    options: [
      { value: 0, label: "Not stressed at all" },
      { value: 1, label: "Slightly stressed" },
      { value: 2, label: "Moderately stressed" },
      { value: 3, label: "Very stressed" },
      { value: 4, label: "Extremely stressed" },
    ],
  },
  {
    id: "anxiety",
    label: "How anxious or worried did you feel today?",
    options: [
      { value: 0, label: "Not anxious" },
      { value: 1, label: "Slightly anxious" },
      { value: 2, label: "Moderately anxious" },
      { value: 3, label: "Very anxious" },
      { value: 4, label: "Extremely anxious" },
    ],
  },
  {
    id: "mood",
    label: "How positive or happy was your mood today?",
    reverse: true,
    options: [
      { value: 0, label: "Very low" },
      { value: 1, label: "Low" },
      { value: 2, label: "Neutral" },
      { value: 3, label: "High" },
      { value: 4, label: "Very high" },
    ],
  },
  {
    id: "energy",
    label: "How energetic did you feel throughout the day?",
    reverse: true,
    options: [
      { value: 0, label: "Very low energy" },
      { value: 1, label: "Low energy" },
      { value: 2, label: "Moderate energy" },
      { value: 3, label: "High energy" },
      { value: 4, label: "Very high energy" },
    ],
  },
  {
    id: "motivation",
    label: "How motivated did you feel to complete your daily tasks today?",
    reverse: true,
    options: [
      { value: 0, label: "Not motivated" },
      { value: 1, label: "Slightly motivated" },
      { value: 2, label: "Moderately motivated" },
      { value: 3, label: "Highly motivated" },
      { value: 4, label: "Extremely motivated" },
    ],
  },
  {
    id: "emotional_control",
    label: "How well were you able to manage your emotions today?",
    reverse: true,
    options: [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Slightly" },
      { value: 2, label: "Moderately" },
      { value: 3, label: "Well" },
      { value: 4, label: "Very well" },
    ],
  },
];

const getRange = (item: SliderItem) => {
  if (item.options && item.options.length > 0) {
    const values = item.options.map((o) => o.value);
    return { min: Math.min(...values), max: Math.max(...values) };
  }
  return { min: 0, max: 4 };
};

export const normalize = (v: number) => v / 4;
export const flip = (v: number) => 1 - normalize(v);

const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

export const scoreBaseline = (answers: Record<string, number>) => {
  const values = baselineItems.map((item) => {
    const { min, max } = getRange(item);
    const raw = answers[item.id];
    const normalized = (raw - min) / (max - min || 1);
    return item.reverse ? 1 - normalized : normalized;
  });
  return avg(values);
};

export const scoreDaily = (answers: Record<string, number>) => {
  const values = dailyItems.map((item) => {
    const { min, max } = getRange(item);
    const raw = answers[item.id];
    const normalized = (raw - min) / (max - min || 1);
    if (item.id === "stress" || item.id === "anxiety") return 1 - normalized;
    return item.reverse ? 1 - normalized : normalized;
  });
  return avg(values);
};

export const combinedScore = (baseline: number, daily: number, alpha = 0.7) =>
  alpha * daily + (1 - alpha) * baseline;

export const labelScore = (v: number) => {
  if (v < 0.3) return "High stress / Low mood";
  if (v < 0.5) return "Moderate stress";
  if (v < 0.7) return "Mild stress / Neutral mood";
  return "Low stress / Good mood";
};

