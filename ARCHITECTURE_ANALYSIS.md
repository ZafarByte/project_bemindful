# BeMindful - Complete Architecture Analysis & Diagram Details

## Executive Summary
**BeMindful** is a comprehensive **AI-powered mental health and wellness platform** designed specifically for the Indian context. It combines real-time mood tracking, AI-driven therapeutic chat, activity logging, stress management, and personalized recommendations with a modern web architecture.

---

## 1. SYSTEM OVERVIEW

### Project Type
- **Final Year Project** - Educational Full-Stack Application
- **Domain**: Mental Health Tech / Digital Wellness
- **Target Users**: Individuals seeking mental health support and wellness tracking

### Core Value Proposition
1. Real-time mood tracking with AI predictions
2. Culturally-aware AI therapist (Gemini-based)
3. Personalized wellness recommendations
4. Activity and stress monitoring
5. Comprehensive dashboard with insights

---

## 2. HIGH-LEVEL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│                     (Browser / Web App)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Next.js 15.5 Frontend (SSR/CSR)               │  │
│  │  - React 19 + TypeScript                               │  │
│  │  - Tailwind CSS + Shadcn/UI Components                 │  │
│  │  - Framer Motion (Animations)                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────┬─────────────────────────────────┬──────────────┘
                 │                                 │
        HTTP/REST│ (Token in Header)        HTTP/REST│
                 │                                 │
┌────────────────▼──────────────────────────────────▼──────────────┐
│                  API GATEWAY / BACKEND LAYER                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        Express.js Server (Node.js Runtime)              │   │
│  │  - Port: 3001                                           │   │
│  │  - Security: Helmet, CORS, Morgan Logging              │   │
│  │  - Auth Middleware: JWT Verification                    │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────┬──────────────────────┬────────────────┬────────┘
                 │                      │                │
         HTTP/REST│              HTTP/REST│        HTTP/REST│
                 │                      │                │
        ┌────────▼───────┐    ┌────────▼──────┐  ┌─────▼──────┐
        │ REST API Routes│    │ Event Queue    │  │ ML Service │
        │                │    │ (Inngest)      │  │ (FastAPI)  │
        └────────────────┘    └────────────────┘  └────────────┘
                 │
         MongoDB │ Connection String
                 │
        ┌────────▼──────────────────┐
        │  MongoDB Atlas (Cloud DB)   │
        │  - Production Database      │
        │  - Connection Pool          │
        └─────────────────────────────┘
```

---

## 3. SYSTEM COMPONENTS & ARCHITECTURE LAYERS

### 3.1 Frontend Layer (Next.js)

#### Technology Stack
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Next.js | 15.5.5 |
| UI Library | React | 19.1.0 |
| Language | TypeScript | 5.0+ |
| Styling | Tailwind CSS + Shadcn/UI | 4.0 |
| Animations | Framer Motion | 12.23.24 |
| HTTP Client | Fetch API (Browser native) | - |
| State Management | React Context (SessionContext) | - |
| Theme | next-themes | 0.4.6 |
| PDF Export | jsPDF + jsPDF AutoTable | 3.0.4 |

#### Frontend Pages & Routes

```
src/app/
├── page.tsx                    # Home / Landing Page
│   ├── Mood Slider Widget
│   ├── Feature Showcase
│   ├── Call-to-Action
│   └── User Authentication Logic
│
├── login/
│   └── page.tsx               # User Login
│
├── signup/
│   └── page.tsx               # User Registration
│
├── dashboard/
│   └── page.tsx               # Main Dashboard (Protected)
│       ├── Mood Trend Chart
│       ├── Consistency Heatmap
│       ├── Recommendation Cards
│       ├── Todo List
│       ├── Activity Summary
│       └── Wellness Resources
│
├── features/
│   └── page.tsx               # Features Overview
│
├── about/
│   └── page.tsx               # About Page
│
├── chat/
│   └── sessions/
│       ├── page.tsx           # Chat Sessions List
│       └── [sessionid]/        # Individual Chat Session (Dynamic Route)
│           └── page.tsx       # Chat Interface
│               ├── Message History
│               ├── AI Response Generation
│               └── Wellness Recommendations
│
└── therapy/
    └── [sessionid]/            # Therapy Session Details
        └── page.tsx
```

#### Frontend Components

```
components/
├── header.tsx                 # Navigation Header
├── footer.tsx                 # Footer
├── providers.tsx              # Context Providers Setup
├── theme-provider.tsx         # Dark/Light Mode Setup
├── theme-toggle.tsx           # Theme Switcher Button
│
├── auth/
│   └── sign-in-button.tsx     # OAuth/Login Button
│
├── mood/
│   └── mood-form.tsx          # Mood Entry Form
│
├── dashboard/
│   ├── recommendation-card.tsx
│   ├── wellness-resources.tsx
│   └── psychiatrist-list-modal.tsx
│
├── games/                     # Mindfulness Games
│   ├── zen-garden.tsx
│   ├── breathing-game.tsx
│   ├── bubble-burst.tsx
│   ├── focus-dots.tsx
│   ├── forest-game.tsx
│   ├── ocean-waves.tsx
│   ├── thought-clouds.tsx
│   └── anxiety-games.tsx
│
├── mood/
│   ├── mood-trend.tsx
│   └── consistency-heatmap.tsx
│
└── ui/                        # Shadcn UI Components
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    ├── label.tsx
    ├── progress.tsx
    ├── alert.tsx
    ├── checkbox.tsx
    └── [other UI components]
```

#### Frontend State Management

```
Session Context (lib/context/session-context.tsx)
├── User Data
│   ├── _id (MongoDB ObjectId)
│   ├── name
│   ├── email
│   └── authentication token
│
├── Authentication State
│   ├── isAuthenticated (boolean)
│   ├── loading (boolean)
│   └── token (JWT)
│
└── Methods
    ├── checkSession() - Verify user on app load
    ├── logout() - Clear session
    └── refresh() - Update token
```

#### Frontend API Clients (lib/api/)

```
Centralized API Communication Layer:

auth.ts
├── registerUser(name, email, password)
└── loginUser(email, password)

mood.ts
├── trackMood(data: MoodEntry)
├── getMoodHistory(params?: {limit, startDate, endDate})
└── getLatestRecommendations()

chat.ts
├── createSession()
├── getSessions()
├── getHistory(sessionId)
├── sendMessage(sessionId, message)
└── deleteSession(sessionId)

activity.ts
├── logActivity(type, name, description, duration)
└── getActivities(filters?)

todo.ts
├── getTodos()
├── createTodo(title, source)
├── updateTodo(id, updates)
└── deleteTodo(id)

stress.ts
├── getStressQuestions()
├── submitStressAssessment(answers)
└── getStressHistory()
```

---

### 3.2 Backend API Layer (Express.js)

#### Server Configuration
- **Framework**: Express.js 5.2.1
- **Port**: 3001 (default, configurable via .env)
- **Runtime**: Node.js
- **Process Manager**: Nodemon (development)

#### Backend Project Structure

```
backend/src/
├── index.ts                   # Server Entry Point & Setup
│
├── controllers/               # Business Logic Layer
│   ├── authController.ts      # Auth operations (register, login, logout)
│   ├── moodController.ts      # Mood tracking & recommendations
│   ├── chat.ts                # AI chat operations
│   ├── activityController.ts  # Activity logging
│   ├── todoController.ts      # Todo management
│   └── stressController.ts    # Stress assessment
│
├── routes/                    # API Endpoint Definitions
│   ├── auth.ts                # /api/auth/* routes
│   ├── mood.ts                # /api/mood/* routes
│   ├── chat.ts                # /api/chat/* routes
│   ├── activity.ts            # /api/activity/* routes
│   ├── todo.ts                # /api/todo/* routes
│   └── stress.ts              # /api/stress/* routes
│
├── models/                    # MongoDB Schemas & Data Models
│   ├── User.ts                # User account data
│   ├── ChatSession.ts         # Chat conversation history
│   ├── Mood.ts                # Individual mood entries
│   ├── Activity.ts            # Activity logs
│   ├── Todo.ts                # Todo items
│   ├── DailyCheckin.ts        # Daily wellness survey
│   ├── BaselineSurvey.ts      # Initial health assessment
│   └── Session.ts             # Active user sessions
│
├── middleware/                # Express Middleware
│   ├── auth.ts                # JWT token verification
│   ├── errorHandler.ts        # Global error handling
│   └── index.ts               # Middleware exports
│
├── utils/                     # Utility Functions
│   ├── db.ts                  # MongoDB connection management
│   ├── encryption.ts          # Data encryption (AES-256-CBC)
│   ├── logger.ts              # Winston logger configuration
│   ├── moodModelClient.ts     # ML model API client
│   └── recommendations.ts     # Recommendation engine logic
│
├── inngest/                   # Background Job Queue
│   ├── client.ts              # Inngest client initialization
│   ├── functions.ts           # Event-driven functions
│   └── index.ts               # Inngest exports
│
└── types/
    └── inngest.ts             # Inngest type definitions
```

#### API Routes & Endpoints

```
AUTHENTICATION ROUTES:
POST   /api/auth/register              Register new user
POST   /api/auth/login                 User login
POST   /api/auth/logout                User logout (Protected)
GET    /api/auth/me                    Get current user info (Protected)

MOOD TRACKING ROUTES:
GET    /api/mood/                      Get mood history (Protected)
GET    /api/mood/recommendations/latest Get latest recommendations (Protected)

CHAT ROUTES:
POST   /api/chat/sessions              Create new chat session (Protected)
GET    /api/chat/sessions              List user's chat sessions (Protected)
GET    /api/chat/sessions/:sessionId/history    Get chat history (Protected)
POST   /api/chat/sessions/:sessionId/messages   Send message (Protected)
DELETE /api/chat/sessions/:sessionId   Delete session (Protected)

ACTIVITY ROUTES:
GET    /api/activity/                  Get user activities (Protected)
POST   /api/activity/                  Log new activity (Protected)

TODO ROUTES:
GET    /api/todo/                      Get todos (Protected)
POST   /api/todo/                      Create todo (Protected)
PATCH  /api/todo/:id                   Update todo (Protected)
DELETE /api/todo/:id                   Delete todo (Protected)

STRESS ROUTES:
GET    /api/stress/                    Get stress history (Protected)
POST   /api/stress/                    Submit stress assessment (Protected)

BACKGROUND JOBS:
/api/inngest                            Inngest webhook endpoint
```

#### Middleware Stack

```
Express Middleware Pipeline:

1. express.json()              - Parse JSON request bodies
2. helmet()                    - Security headers (XSS, CSRF protection)
3. cors()                      - Cross-origin resource sharing
4. morgan("dev")               - HTTP request logging
5. auth (on protected routes)  - JWT token verification
6. errorHandler()              - Global error catching & formatting
```

#### Authentication Flow

```
User Registration / Login Flow:

1. Client sends credentials to POST /api/auth/register or /api/auth/login
2. Backend validates input
3. Password hashing with bcryptjs (10 salt rounds)
4. JWT token generated:
   - Payload: { userId: user._id }
   - Secret: process.env.JWT_SECRET
   - Expiry: 24 hours
5. Session record created in MongoDB with:
   - userId, token, expiresAt, deviceInfo
6. Token returned to client
7. Client stores token in localStorage
8. Token sent in Authorization header for subsequent requests
9. Middleware verifies token on protected endpoints

Token Structure:
Header.Payload.Signature (base64 encoded)
```

---

### 3.3 Database Layer (MongoDB Atlas)

#### Database Information
- **Type**: NoSQL - MongoDB
- **Hosting**: MongoDB Atlas (Cloud)
- **Connection**: Connection string in environment variable
- **Connection Pool**: Mongoose managed

#### Database Schema

```
COLLECTIONS:

1. Users
   ├── _id (ObjectId)
   ├── name (String)
   ├── email (String, unique)
   ├── password (String, bcrypt hashed)
   ├── createdAt (Timestamp)
   └── updatedAt (Timestamp)

2. ChatSessions
   ├── _id (ObjectId)
   ├── userId (ObjectId, ref: User)
   ├── messages (Array of Message objects)
   │   ├── role ("user" | "assistant" | "system")
   │   ├── content (String)
   │   ├── timestamp (Date)
   │   └── metadata (Object)
   │       ├── technique (String)
   │       ├── goal (String)
   │       ├── analysis (Object)
   │       │   ├── emotionalState
   │       │   ├── themes (Array)
   │       │   ├── riskLevel (Number)
   │       │   ├── recommendedApproach
   │       │   └── progressIndicators
   │       └── progress (Array)
   ├── metadata (Object)
   │   ├── summary (String)
   │   ├── goals (Array)
   │   └── activeTechnique (String)
   ├── createdAt (Timestamp)
   └── updatedAt (Timestamp)

3. Mood
   ├── _id (ObjectId)
   ├── userId (ObjectId, ref: User)
   ├── score (Number 0-100)
   ├── moodType (String: "High Distress", "Moderate Stress", "Neutral", "Positive", "Flourishing")
   ├── note (String)
   ├── predictionSource ("model" | "manual")
   ├── timestamp (Date)
   ├── createdAt (Timestamp)
   └── updatedAt (Timestamp)

4. Activities
   ├── _id (ObjectId)
   ├── userId (ObjectId, ref: User)
   ├── type (String: "meditation", "exercise", "walking", "reading", "journaling", "therapy")
   ├── name (String)
   ├── description (String, encrypted if journaling)
   ├── duration (Number, in minutes)
   ├── timestamp (Date)
   ├── createdAt (Timestamp)
   └── updatedAt (Timestamp)

5. Todos
   ├── _id (ObjectId)
   ├── userId (ObjectId, ref: User)
   ├── title (String)
   ├── isCompleted (Boolean)
   ├── source ("recommendation" | "manual")
   ├── createdAt (Timestamp)
   └── updatedAt (Timestamp)

6. DailyCheckins
   ├── _id (ObjectId)
   ├── userId (ObjectId, ref: User)
   ├── answers (Object with answer key-value pairs)
   ├── dailyScore (Number 0-1)
   ├── combinedScore (Number 0-1)
   ├── label (String)
   ├── moodScore (Number 0-100)
   ├── moodType (String)
   ├── createdAt (Timestamp)
   └── updatedAt (Timestamp)

7. BaselineSurveys
   ├── _id (ObjectId)
   ├── userId (ObjectId, ref: User, unique)
   ├── answers (Object - Survey responses)
   │   ├── age
   │   ├── sleepDuration
   │   ├── screenTime
   │   ├── physicalActivity
   │   ├── dietQuality
   │   └── [other baseline questions]
   ├── score (Number 0-1)
   ├── completedAt (Date)
   ├── createdAt (Timestamp)
   └── updatedAt (Timestamp)

8. Sessions
   ├── _id (ObjectId)
   ├── userId (ObjectId, ref: User)
   ├── token (String, unique)
   ├── expiresAt (Date)
   ├── deviceInfo (String, user-agent)
   ├── lastActive (Date)
   ├── createdAt (Timestamp)
   └── updatedAt (Timestamp)
   └── TTL Index on expiresAt (auto-delete expired)
```

#### Data Relationships

```
User
├──── 1-to-Many ──── ChatSessions
├──── 1-to-Many ──── Mood entries
├──── 1-to-Many ──── Activities
├──── 1-to-Many ──── Todos
├──── 1-to-Many ──── DailyCheckins
├──── 1-to-One  ──── BaselineSurvey
└──── 1-to-Many ──── Sessions
```

---

### 3.4 AI/ML Layer

#### 3.4.1 AI Chatbot Service (Google Generative AI)

**Technology**: Google Gemini API
**Model**: gemini-2.5-flash
**Type**: Real-time conversational AI

```
AI Therapist Configuration:

Model: gemini-2.5-flash
System Prompt: Culturally-aware mental health companion
- Name: "Mindful Companion"
- Context: Indian cultural sensitivity
- Language: English + Hinglish support
- Crisis: Indian crisis hotline numbers included

Features:
├── Active listening & empathy
├── Indian family dynamics awareness
├── Stress management techniques
├── Yoga & meditation recommendations
├── Therapy techniques:
│   ├── CBT (Cognitive Behavioral Therapy)
│   ├── Mindfulness
│   ├── Breathing exercises
│   └── Positive psychology
└── Crisis intervention & resources
```

**Integration Flow**:
```
Frontend sends message
    ↓
Backend route: POST /api/chat/sessions/:sessionId/messages
    ↓
Save user message to ChatSession
    ↓
Retrieve chat history (for context)
    ↓
Call Google Generative AI API with:
    - System prompt (therapeutic guidelines)
    - Chat history (for context)
    - New user message
    ↓
Parse AI response
    ↓
Save AI response to ChatSession
    ↓
Return to frontend
    ↓
Display in chat interface
```

#### 3.4.2 Mood Prediction Model (Python FastAPI)

**Technology**: Python FastAPI
**Model**: Scikit-learn trained model (joblib)
**Purpose**: Predict mood score from behavioral features

```
Mood Model Service (api.py):

Components:
├── FastAPI Application
├── Pre-trained model (mood_model.pkl)
├── Input: 21 behavioral features
└── Output: Mood score (0-100) + mood type

Endpoint: POST /predict
Input: { "data": [feature1, feature2, ..., feature21] }
Output: {
    "mood_score": float,
    "mood_type": "High Distress" | "Moderate Stress" | "Neutral" | "Positive" | "Flourishing"
}

Mood Score Mapping:
├── 0-25:   High Distress
├── 26-45:  Moderate Stress
├── 46-65:  Neutral
├── 66-85:  Positive
└── 86-100: Flourishing

Integration:
- Backend calls: http://localhost:8000/predict
- Used for: Optional ML-based mood prediction
- Alternative: Manual mood entry (user-reported)
```

---

### 3.5 Background Jobs & Event Queue (Inngest)

**Purpose**: Event-driven architecture for asynchronous tasks

```
Inngest Setup:

Client: inngest/client.ts
├── Initialized with Inngest SDK
└── Provides event-driven functions

Functions: inngest/functions.ts
├── Currently empty but extensible
└── Future capabilities:
    ├── Daily reminder notifications
    ├── Weekly mood summary emails
    ├── Stress trend analysis
    ├── Recommendation generation (periodic)
    └── Data cleanup & maintenance

Webhook: /api/inngest
├── Receives events from frontend
├── Triggers background functions
└── Provides event management
```

---

### 3.6 Security & Encryption

#### 3.6.1 Authentication

```
JWT Token-Based Authentication:

Token Generation:
├── Created on successful login/register
├── Payload: { userId: ObjectId }
├── Secret: process.env.JWT_SECRET
└── Expiry: 24 hours

Token Verification:
├── Middleware: /middleware/auth.ts
├── Checks Authorization header
├── Verifies signature & expiry
└── Attaches user to request object

Protected Endpoints:
├── All /api/* routes (except /auth/register, /auth/login)
├── Requires valid JWT in Authorization header
└── Format: Authorization: Bearer <token>
```

#### 3.6.2 Data Encryption

```
Encryption for Sensitive Data:

Algorithm: AES-256-CBC
Library: Node.js crypto module

Implementation:
├── File: backend/src/utils/encryption.ts
├── Key: process.env.ENCRYPTION_KEY (hashed with SHA-256)
├── IV: Random 16 bytes per encryption

Usage:
├── Journaling entries encrypted before storage
├── Automatically decrypted on retrieval
└── Pre-save hook on Activity model

Example:
const encrypted = encrypt("My private journal entry")
// Stored as: "iv_hex:encrypted_hex"

const decrypted = decrypt(encrypted)
// Returns: "My private journal entry"
```

#### 3.6.3 Password Security

```
Password Hashing:

Library: bcryptjs
Algorithm: bcrypt
Salt Rounds: 10

Flow:
1. User registers/updates password
2. Password hashed with bcrypt
3. Hashed password stored in MongoDB
4. Never store plaintext passwords
5. On login: bcrypt.compare(inputPassword, hashedPassword)
```

---

### 3.7 Utilities & Helper Services

#### 3.7.1 Database Connection Management

```
File: backend/src/utils/db.ts

Function: connectDB()
├── Connects to MongoDB Atlas
├── Uses Mongoose
├── Connection string from environment
├── Error handling with logger
├── Called on server startup
└── Retries on connection failure
```

#### 3.7.2 Logging Service

```
File: backend/src/utils/logger.ts

Library: Winston
Configuration:
├── Level: info
├── Format: JSON + timestamp
├── Transports:
│   ├── File: error.log (errors only)
│   ├── File: combined.log (all levels)
│   └── Console: Development mode only
└── Rotating logs with timestamps
```

#### 3.7.3 Recommendations Engine

```
File: backend/src/utils/recommendations.ts

Function: getRecommendations(moodScore, baselineAnswers)

Logic:
├── Mood Score 0-25 (High Distress)
│   ├── Flag: needsProfessionalHelp = true
│   └── Recommend: Crisis resources, therapist consultation
│
├── Mood Score 26-65 (Moderate Stress / Neutral)
│   ├── Analyze baseline survey answers
│   └── Recommend by category:
│       ├── Sleep (if < 5 hours): "Aim for 7-9 hours"
│       ├── Screen time (if > 6 hrs): "Digital detox 1 hr before bed"
│       ├── Exercise (if < 2 days/week): "15-min walk or Surya Namaskar"
│       ├── Diet (if unhealthy): "Home-cooked meals & water"
│       └── Age-specific tips:
│           ├── < 25: Academic/career stress advice
│           ├── 25-50: Work-life balance
│           └── > 50: Physical wellness focus
│
└── Mood Score 66-100 (Positive / Flourishing)
    ├── Affirm positive state
    └── Maintenance tips: Continue good habits, ensure sleep

Output: { tips: string[], needsProfessionalHelp: boolean }
```

#### 3.7.4 Mood Model Client

```
File: backend/src/utils/moodModelClient.ts

Function: predictMoodFromModel(features: number[])

Purpose: Call Python ML model for mood prediction

Process:
1. Validate 21 features array
2. POST to MOOD_MODEL_URL (default: http://localhost:8000/predict)
3. Parse response
4. Clamp score between 0-100
5. Return: { moodScore, moodType, source: "model" }

Error Handling:
├── Network errors → throw error
├── Invalid response → throw error
└── Logging: Full model response

Integration Points:
├── Called from moodController (optional)
└── Can be used for ML-based predictions vs manual entry
```

---

## 4. DATA FLOW DIAGRAMS

### 4.1 User Authentication Flow

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ 1. User submits login/register
       │    (email, password, name)
       ▼
┌──────────────────────────────┐
│ Frontend (Next.js)           │
│ - Form validation            │
│ - POST /api/auth/register    │
│   or /api/auth/login         │
└──────┬───────────────────────┘
       │ 2. HTTP POST
       ▼
┌──────────────────────────────┐
│ Express Backend              │
│ - Route: /api/auth/*         │
│ - Controller: authController │
└──────┬───────────────────────┘
       │ 3. Validate input
       │ 4. Check email exists (register)
       │ 5. Hash password (bcryptjs)
       ▼
┌──────────────────────────────┐
│ MongoDB Atlas                │
│ - Save User document         │
│ - Create Session document    │
└──────┬───────────────────────┘
       │ 6. Generate JWT token
       │    Payload: {userId}
       │    Secret: JWT_SECRET
       │    Expires: 24h
       ▼
┌──────────────────────────────┐
│ Express Backend (Response)   │
│ - Return JWT token           │
│ - User info (minus password) │
└──────┬───────────────────────┘
       │ 7. HTTP Response 200/201
       ▼
┌──────────────────────────────┐
│ Frontend (Next.js)           │
│ - Store token in localStorage│
│ - Update session context     │
│ - Redirect to /dashboard     │
└──────────────────────────────┘
```

### 4.2 Mood Tracking & Recommendation Flow

```
┌──────────────┐
│   User       │
│   on App     │
└──────┬───────┘
       │ 1. Enter mood (0-100) + optional note
       │ 2. Click "Save Mood"
       ▼
┌──────────────────────────────┐
│ Frontend (Mood Component)    │
│ POST /api/mood               │
│ Headers: Authorization header│
│ Body: { score, note, ... }   │
└──────┬───────────────────────┘
       │ 3. HTTP POST (with JWT)
       ▼
┌──────────────────────────────┐
│ Express Backend              │
│ - auth middleware validates  │
│ - Route: POST /api/mood      │
│ - Controller: moodController │
└──────┬───────────────────────┘
       │ 4. Save Mood document to DB
       ├─────────────┬──────────────┐
       │             │              │
       ▼             ▼              ▼
  ┌─────────┐   ┌──────────┐   ┌──────────────┐
  │ MongoDB │   │Optional: │   │Optional:     │
  │ Mood    │   │Call ML   │   │Generate Tips │
  │Entry    │   │Model     │   │immediately   │
  └─────────┘   │(api.py)  │   └──────────────┘
                └────┬─────┘
                     │ 5. Return prediction
                     │    (mood_score, mood_type)
                     ▼
┌──────────────────────────────┐
│ Backend Response             │
│ { success: true, data: ... } │
└──────┬───────────────────────┘
       │ 6. Update frontend state
       │ 7. Show confirmation
       ▼
┌──────────────────────────────┐
│ Frontend Dashboard           │
│ - Refresh mood chart         │
│ - Display mood trend         │
│ - Show recommendations       │
└──────────────────────────────┘

Recommendation Generation (on-demand):
┌──────────────────────────────┐
│ GET /api/mood/recommendations│
│ /latest (with JWT)           │
└──────┬───────────────────────┘
       │ Fetch latest mood entry
       │ Fetch baseline survey answers
       ▼
┌──────────────────────────────┐
│ recommendations.ts engine    │
│ analyzeUserProfile()         │
│ generateTips()               │
└──────┬───────────────────────┘
       │ Apply business logic
       │ Check mood ranges
       │ Match with baseline data
       ▼
┌──────────────────────────────┐
│ Return: {                    │
│   tips: string[],            │
│   needsProfessionalHelp: bool│
│ }                            │
└──────────────────────────────┘
```

### 4.3 AI Chat Conversation Flow

```
┌──────────────┐
│   User       │
│ Types message│
└──────┬───────┘
       │ 1. Message in chat input
       │ 2. Click send
       ▼
┌──────────────────────────────┐
│ Frontend (Chat Component)    │
│ POST /api/chat/sessions/     │
│     :sessionId/messages      │
│ Headers: Authorization       │
│ Body: { message: "..." }     │
└──────┬───────────────────────┘
       │ 3. HTTP POST (with JWT)
       ▼
┌──────────────────────────────┐
│ Express Backend              │
│ - auth middleware validates  │
│ - Route: POST /api/chat/...  │
│ - Controller: chat.ts        │
└──────┬───────────────────────┘
       │ 4. Retrieve ChatSession from DB
       │ 5. Append user message to history
       ▼
┌──────────────────────────────┐
│ Google Generative AI (Gemini)│
│ - Send chat history          │
│ - Send system prompt         │
│ - Send new user message      │
│ - Model: gemini-2.5-flash    │
│ - Role: "Mindful Companion"  │
└──────┬───────────────────────┘
       │ 6. Process conversation
       │ 7. Generate response
       ▼
┌──────────────────────────────┐
│ Backend (Process Response)   │
│ - Parse AI output            │
│ - Extract metadata (if any)  │
│ - Append to messages array   │
└──────┬───────────────────────┘
       │ 8. Save updated ChatSession
       │    to MongoDB
       ▼
┌──────────────────────────────┐
│ MongoDB                      │
│ - Update ChatSession.messages│
│ - Record timestamp           │
└──────┬───────────────────────┘
       │ 9. Return to backend
       │ 10. HTTP Response with AI response
       ▼
┌──────────────────────────────┐
│ Frontend (Chat Component)    │
│ - Display AI message         │
│ - Update chat history        │
│ - Clear input field          │
│ - Show animations            │
└──────────────────────────────┘
```

### 4.4 Activity Logging Flow

```
User logs activity (exercise, meditation, journaling, etc.)
                 ↓
POST /api/activity/
(with JWT token)
                 ↓
Backend validates user authentication
                 ↓
Create Activity document:
├── userId
├── type (meditation, exercise, walking, etc.)
├── name
├── description (encrypted if journaling)
├── duration
└── timestamp
                 ↓
Save to MongoDB Activities collection
                 ↓
Return success response with activity ID
                 ↓
Frontend updates activity list/dashboard
```

---

## 5. SYSTEM INTERACTIONS & COMPONENT RELATIONSHIPS

### 5.1 Request/Response Protocol

```
All communication: HTTP/REST with JSON payloads

Request Format:
{
  method: "GET|POST|PUT|PATCH|DELETE",
  url: "http://backend:3001/api/[route]",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer <jwt_token>"  // Protected routes
  },
  body: { ... }
}

Response Format:
Success (2xx):
{
  success: true,
  data: { ... },
  message: "Operation completed"
}

Error (4xx/5xx):
{
  status: "fail|error",
  message: "Detailed error description"
}
```

### 5.2 Component Dependencies

```
Frontend Dependencies:
├── Session Context
│   └─ Provides: user, isAuthenticated, token
│
├── API Clients (lib/api/)
│   ├── auth.ts → Uses localStorage for token
│   ├── mood.ts → Uses Session context for token
│   ├── chat.ts → Uses Session context for token
│   ├── activity.ts → Uses Session context for token
│   └── todo.ts → Uses Session context for token
│
├── Components
│   ├── Dashboard → Uses mood.ts, activity.ts clients
│   ├── Chat Interface → Uses chat.ts client
│   ├── Mood Form → Uses mood.ts client
│   ├── Game Components → Standalone (no backend calls)
│   └── Recommendation Cards → Uses mood recommendations
│
└── Pages → Route to components based on auth state

Backend Dependencies:
├── Express App
│   ├── Middleware → Helmet, CORS, Morgan, Auth
│   ├── Routes → Mounted on app
│   ├── Controllers → Business logic
│   ├── Models → Mongoose schemas
│   └── Utils → Helper functions
│
├── Database Connection
│   ├── Mongoose → Connects to MongoDB Atlas
│   ├── Connection pooling
│   └── Event listeners for connection
│
├── External Services
│   ├── Google Generative AI → For chat responses
│   ├── Python FastAPI (local) → For mood predictions
│   └── Inngest → For event queue
│
└── Security
    ├── JWT verification
    ├── Password hashing
    ├── Data encryption
    └── Error handling
```

---

## 6. TECHNOLOGY STACK SUMMARY

### Frontend Stack
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 15.5.5 | SSR/CSR React app |
| **UI Library** | React 19 | Component framework |
| **Language** | TypeScript 5 | Type safety |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Components** | Shadcn/UI | Pre-built accessible UI |
| **Animations** | Framer Motion 12 | Smooth animations |
| **HTTP Client** | Fetch API | REST API calls |
| **State** | React Context | Session management |
| **Theme** | next-themes | Dark/Light mode |
| **PDF** | jsPDF | Report generation |
| **Icons** | Lucide React | Icon library |
| **Markdown** | react-markdown | Render markdown |

### Backend Stack
| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Express.js 5.2 | Web server |
| **Runtime** | Node.js | JavaScript execution |
| **Language** | TypeScript 5 | Type safety |
| **Database** | MongoDB Atlas | NoSQL database |
| **ORM** | Mongoose 9 | Schema & validation |
| **Auth** | JWT / bcryptjs | Authentication |
| **Security** | Helmet 8 | Security headers |
| **CORS** | cors 2.8 | Cross-origin support |
| **Logging** | Morgan 1.10 | Request logging |
| **Logger** | Winston 3.18 | Application logging |
| **Encryption** | Node crypto | Data encryption |
| **Task Queue** | Inngest 3.47 | Background jobs |
| **AI** | Google Gemini | Chat AI |
| **ML** | FastAPI (Python) | Mood prediction |

### Infrastructure & Deployment
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Database** | MongoDB Atlas | Cloud database |
| **Frontend Hosting** | TBD | Next.js deployment |
| **Backend Hosting** | TBD | Express server |
| **ML Model** | Python FastAPI | ML inference |
| **Version Control** | Git | Code management |

---

## 7. DEPLOYMENT ARCHITECTURE

### Development Environment

```
Local Development Setup:

┌─────────────────────────────────────────────────┐
│ Developer Machine                               │
│                                                 │
│ Frontend:                                       │
│ ├── npm run dev (Next.js on port 3000)         │
│ ├── Hot reload enabled                         │
│ └── Connects to: http://localhost:3001         │
│                                                 │
│ Backend:                                        │
│ ├── npm run dev (Nodemon on port 3001)         │
│ ├── Watch mode for .ts files                   │
│ └── Connects to: MongoDB Atlas                 │
│                                                 │
│ ML Model:                                       │
│ ├── python api.py (FastAPI on port 8000)      │
│ └── Loads: mood_model.pkl                      │
│                                                 │
│ Environment:                                    │
│ ├── .env.local (Frontend config)               │
│ └── .env (Backend config)                      │
└─────────────────────────────────────────────────┘
```

### Production Environment (Proposed)

```
Production Deployment:

┌──────────────────────────────────────────────────────┐
│ Internet / CDN                                       │
└────────────┬─────────────────────────────────────────┘
             │
    ┌────────▼──────────────┐
    │ Domain / DNS          │
    │ (bemindful.com, etc)  │
    └────────┬──────────────┘
             │
    ┌────────▼──────────────────────────────────────┐
    │ Frontend Deployment                           │
    │ ├── Vercel / Netlify / AWS S3 + CloudFront  │
    │ ├── Next.js optimized build                  │
    │ ├── Static files CDN cached                  │
    │ └── API calls to: https://api.bemindful.com │
    └────────┬──────────────────────────────────────┘
             │ HTTPS
    ┌────────▼──────────────────────────────────────┐
    │ Backend API Server                            │
    │ ├── Docker container                         │
    │ ├── Express.js on port 3001                  │
    │ ├── Node.js process manager (PM2, etc)      │
    │ ├── Environment variables from secrets mgmt  │
    │ └── Connects to: MongoDB Atlas               │
    └────────┬──────────────────────────────────────┘
             │
    ┌────────▼──────────────┐
    │ MongoDB Atlas         │
    │ ├── Production cluster│
    │ ├── Replication       │
    │ ├── Backups           │
    │ └── Connection pool   │
    └───────────────────────┘

ML Model Deployment:
├── Python FastAPI on separate server
├── Model loaded at startup
├── Can be scaled separately
└── Called via: https://api-ml.bemindful.com
```

---

## 8. SECURITY ARCHITECTURE

### Security Layers

```
Layer 1: Network Security
├── HTTPS/TLS encryption in transit
├── CORS policy enforcement
├── Rate limiting (can be added)
└── DDoS protection (CDN)

Layer 2: Application Security
├── Helmet.js (security headers)
├── Input validation & sanitization
├── SQL injection prevention (Mongoose)
├── XSS protection
└── CSRF tokens (if needed)

Layer 3: Authentication
├── JWT token-based
├── Token expiry (24 hours)
├── Secure token storage (localStorage)
├── Token refresh mechanism

Layer 4: Authorization
├── Protected routes middleware
├── User ID verification
├── Role-based access (can be added)
└── Data isolation per user

Layer 5: Data Security
├── Password hashing (bcryptjs, 10 rounds)
├── Sensitive data encryption (AES-256-CBC)
├── Encryption for journaling entries
├── Secure database connection string
└── Environment variables for secrets

Layer 6: API Security
├── Error messages don't leak info
├── Rate limiting (future)
├── Request validation
├── Timeout handling
└── Logging of suspicious activities

Layer 7: Data Privacy
├── User data isolation
├── No data sharing between users
├── Encryption at rest (MongoDB)
├── Regular backups
└── GDPR considerations
```

---

## 9. SCALABILITY CONSIDERATIONS

### Current Architecture Limitations & Future Improvements

```
Current Setup:
├── Single Express server (can handle ~1000 concurrent users)
├── MongoDB Atlas handles scaling automatically
├── All logic in single backend process
└── No load balancing

Scalability Challenges:
├── WebSocket for real-time chat (future)
├── Horizontal scaling of Express servers
├── Caching layer (Redis)
├── Database connection pooling optimization
└── Static asset optimization

Recommended Improvements:
├── Load Balancer
│   ├── Nginx / AWS ELB
│   └── Route traffic across servers
│
├── Caching Layer
│   ├── Redis for session cache
│   ├── Mood recommendations cache
│   └── ChatSession cache
│
├── Database Optimization
│   ├── Indexing strategies
│   ├── Query optimization
│   ├── Read replicas for analytics
│   └── Connection pooling
│
├── API Gateway
│   ├── Rate limiting
│   ├── Request throttling
│   ├── API versioning
│   └── Request/response compression
│
├── Microservices (Future)
│   ├── Chat service
│   ├── Mood service
│   ├── Recommendation service
│   ├── Activity service
│   └── User service
│
├── Message Queue
│   ├── Better than Inngest for scale
│   ├── RabbitMQ / Kafka
│   └── Event-driven architecture
│
└── Monitoring & Observability
    ├── Prometheus for metrics
    ├── ELK stack for logs
    ├── Jaeger for tracing
    └── AlertManager for alerts
```

---

## 10. ARCHITECTURE COMPONENTS NODE LIST (For Diagram)

### Nodes/Boxes for Architecture Diagram

```
FRONTEND LAYER:
1. Next.js App (Browser)
2. React Components
3. Session Context
4. API Client Layer

NETWORK:
5. HTTP/REST (Protocol)
6. JWT Authorization

BACKEND API LAYER:
7. Express Server
8. Auth Routes
9. Mood Routes
10. Chat Routes
11. Activity Routes
12. Todo Routes
13. Stress Routes
14. Middleware Stack
15. Error Handler

BUSINESS LOGIC LAYER:
16. Auth Controller
17. Mood Controller
18. Chat Controller
19. Activity Controller
20. Todo Controller
21. Stress Controller
22. Recommendations Engine

DATA LAYER:
23. Mongoose ORM
24. MongoDB Atlas Database

AI/ML SERVICES:
25. Google Generative AI (Gemini)
26. Python FastAPI Server
27. Mood Prediction Model

BACKGROUND JOBS:
28. Inngest Event Queue

UTILITIES:
29. Encryption Service
30. Logger Service
31. JWT Service
32. Database Connection Manager

SECURITY:
33. Authentication Middleware
34. Authorization Checks
35. Password Hashing
36. Data Encryption
```

---

## 11. CONNECTIONS & DATA FLOWS (For Diagram)

### Key Connections

```
FRONTEND → BACKEND:
1. Browser → Express Server
   Protocol: HTTP/REST
   Headers: Content-Type: application/json, Authorization: Bearer <JWT>
   
2. API Clients → REST Routes
   - /api/auth/*
   - /api/mood/*
   - /api/chat/*
   - /api/activity/*
   - /api/todo/*
   - /api/stress/*

BACKEND → DATABASE:
3. Controllers → Mongoose ORM → MongoDB Atlas
   Queries: CRUD operations
   Transactions: User authentication, data persistence

BACKEND → AI SERVICES:
4. Chat Controller → Google Generative AI
   Protocol: HTTPS/JSON-RPC
   Payload: Chat history + new message
   Response: AI-generated response

5. Mood Controller → Python FastAPI
   Protocol: HTTP/REST
   Endpoint: POST /predict
   Input: 21 behavioral features
   Output: Mood score + type

BACKGROUND PROCESSING:
6. Express → Inngest Client → Event Queue
   Events: Async tasks, notifications, periodic jobs

INTERNAL CONNECTIONS:
7. Controllers ← Utilities
   - Recommendations Engine (mood recommendations)
   - Encryption Service (sensitive data)
   - Logger Service (logging)
   - Mood Model Client (ML calls)

8. Middleware → Controllers
   - Auth validation → Protected routes
   - Error handling → All routes
   - Logging → Request/response
```

---

## 12. DATA PERSISTENCE & BACKUP STRATEGY

```
MongoDB Atlas Features:
├── Automatic backups every 6 hours
├── 30-day backup retention
├── Point-in-time recovery
├── Encrypted backups
├── Replication set (High Availability)
├── 3-node replica set minimum
├── Automatic failover
└── Sharding support for scale

Backup Strategy:
├── Daily backups (recommended)
├── Monthly full backup snapshots
├── Test restore procedures quarterly
├── Backup encryption enabled
└── Disaster recovery plan in place
```

---

## 13. MONITORING & LOGGING STRATEGY

```
Application Logging:
├── Winston logger
├── Log levels: error, warn, info, debug
├── Log files:
│   ├── error.log (errors only)
│   └── combined.log (all levels)
├── Timestamp on every log
└── JSON format for parsing

Request Logging:
├── Morgan middleware
├── HTTP method, URL, status code
├── Response time
└── User agent info

Frontend Error Tracking:
├── Console errors in browser
├── Can integrate: Sentry, LogRocket
└── Stack traces for debugging

Backend Metrics (Future):
├── Response times
├── Error rates
├── API endpoint usage
├── Database query performance
├── Server resource utilization
└── User session metrics
```

---

## 14. ENVIRONMENT CONFIGURATION

### Environment Variables

```
Frontend (.env.local):
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=xxx (optional)

Backend (.env):
PORT=3001
NODE_ENV=development

DATABASE:
MONGODB_URI=mongodb+srv://user:pass@cluster...

AUTHENTICATION:
JWT_SECRET=your-secret-key-min-32-chars

ENCRYPTION:
ENCRYPTION_KEY=your-encryption-key

EXTERNAL SERVICES:
GOOGLE_GENAI_API_KEY=xxxx (Google AI Studio key)

ML MODEL:
MOOD_MODEL_URL=http://localhost:8000/predict

INNGEST:
INNGEST_EVENT_KEY=xxxx (if hosted)
INNGEST_SIGNING_KEY=xxxx

LOGGING:
LOG_LEVEL=info
```

---

## 15. SUMMARY TABLE

| Aspect | Technology | Details |
|--------|-----------|---------|
| **Frontend Framework** | Next.js 15.5 | React-based SSR/CSR app |
| **UI Library** | React 19 + Shadcn/UI | Component-driven development |
| **Backend Framework** | Express.js 5.2 | RESTful API server |
| **Database** | MongoDB Atlas | Cloud NoSQL database |
| **Authentication** | JWT + bcryptjs | Secure token-based auth |
| **AI Chat** | Google Gemini API | Conversational AI |
| **ML Model** | Scikit-learn + FastAPI | Mood prediction |
| **Background Jobs** | Inngest | Event-driven tasks |
| **Encryption** | AES-256-CBC | Data protection |
| **Logging** | Winston | Application logging |
| **Security** | Helmet + CORS | Web security headers |
| **Hosting** | TBD | Frontend + Backend |
| **Version Control** | Git | Code management |

---

## 16. ARCHITECTURE DIAGRAM SPECIFICATION

For creating an architecture diagram (using Mermaid, Draw.io, or similar):

### Recommended Diagram Structure

```
LAYER 1 - PRESENTATION LAYER:
┌─────────────────────────────────────┐
│ User Browser / Web Client           │
│ ├── Next.js Application (Port 3000) │
│ ├── React Components                │
│ ├── Tailwind CSS Styled             │
│ └── Session Context (Auth)          │
└─────────────────────────────────────┘

LAYER 2 - NETWORK LAYER:
┌─────────────────────────────────────┐
│ HTTP/REST + JWT Token               │
│ HTTPS for Production                │
└─────────────────────────────────────┘

LAYER 3 - API GATEWAY / BACKEND LAYER:
┌─────────────────────────────────────┐
│ Express.js Server (Port 3001)       │
│ ├── Middleware Stack                │
│ ├── 6 Route Modules                 │
│ ├── 6 Controllers                   │
│ ├── 8 Data Models                   │
│ └── Utility Services                │
└─────────────────────────────────────┘

LAYER 4 - DATABASE LAYER:
┌─────────────────────────────────────┐
│ MongoDB Atlas (Cloud)               │
│ ├── User Collection                 │
│ ├── ChatSession Collection          │
│ ├── Mood Collection                 │
│ ├── Activity Collection             │
│ ├── Todo Collection                 │
│ ├── DailyCheckin Collection         │
│ ├── BaselineSurvey Collection       │
│ └── Session Collection              │
└─────────────────────────────────────┘

LAYER 5 - EXTERNAL SERVICES:
┌────────────────────┐  ┌──────────────────┐  ┌──────────────┐
│ Google Generative  │  │ Python FastAPI   │  │ Inngest      │
│ AI (Gemini)        │  │ (Mood Model)     │  │ (Job Queue)  │
└────────────────────┘  └──────────────────┘  └──────────────┘

CONNECTIONS:
Frontend ←HTTP/REST→ Backend ←MongoDB Drive→ Database
Backend ←HTTPS→ Google Gemini
Backend ←HTTP→ FastAPI (ML Model)
Backend ←Event API→ Inngest
```

---

This comprehensive architecture analysis provides all the details needed to create a professional architecture diagram for your Final Year Project. The system demonstrates a modern full-stack architecture with clear separation of concerns, security considerations, and scalability potential.

