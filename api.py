from pathlib import Path

import joblib
from fastapi import FastAPI
from pydantic import BaseModel

# Load trained model from the repository root by default
MODEL_PATH = Path(__file__).resolve().parent / "mood_model.pkl"
model = joblib.load(MODEL_PATH)

app = FastAPI()

# Input schema (21 features)
class MoodInput(BaseModel):
    data: list  # list of 21 numbers

def get_mood_type(score: float) -> str:
    if score <= 25:
        return "High Distress"
    elif score <= 45:
        return "Moderate Stress"
    elif score <= 65:
        return "Neutral"
    elif score <= 85:
        return "Positive"
    else:
        return "Flourishing"

@app.post("/predict")
def predict_mood(input: MoodInput):
    prediction = model.predict([input.data])[0]

    # Clamp score between 0 and 100
    prediction = max(0, min(100, prediction))

    mood_type = get_mood_type(prediction)

    result = {
        "mood_score": round(prediction, 2),
        "mood_type": mood_type,
    }

    # Log to Python console so you can verify the model output
    print("[AI MODEL] Input features:", input.data)
    print("[AI MODEL] Output:", result)

    return result
