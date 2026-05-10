# BeMindful - Architecture Diagram (Mermaid)

## Complete System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        USER["👤 End User<br/>Desktop/Mobile Browser"]
        FRONTEND["Next.js Frontend App<br/>React 19 + TypeScript<br/>Tailwind CSS + Shadcn/UI<br/>Port: 3000"]
        SESSIONCTX["Session Context<br/>- User State<br/>- Auth Token<br/>- User Info"]
    end

    subgraph "Network Layer"
        HTTP["HTTP/REST + JWT<br/>Protocol: HTTPS<br/>Content-Type: JSON<br/>Authorization: Bearer Token"]
    end

    subgraph "Backend API Layer"
        EXPRESS["Express.js Server<br/>Node.js Runtime<br/>Port: 3001"]
        MIDDLEWARE["Middleware Stack<br/>- Helmet (Security)<br/>- CORS<br/>- Morgan (Logging)<br/>- Auth (JWT)<br/>- Error Handler"]
        
        subgraph "Route Handlers"
            AUTH_ROUTE["Auth Routes<br/>POST /register<br/>POST /login<br/>POST /logout<br/>GET /me"]
            MOOD_ROUTE["Mood Routes<br/>GET /<br/>GET /recommendations"]
            CHAT_ROUTE["Chat Routes<br/>POST /sessions<br/>GET /sessions<br/>GET /history<br/>POST /messages"]
            ACTIVITY_ROUTE["Activity Routes<br/>GET /<br/>POST /"]
            TODO_ROUTE["Todo Routes<br/>GET /<br/>POST /<br/>PATCH /:id<br/>DELETE /:id"]
            STRESS_ROUTE["Stress Routes<br/>GET /<br/>POST /"]
        end
        
        subgraph "Controllers"
            AUTH_CTRL["Auth Controller<br/>- register()<br/>- login()<br/>- logout()"]
            MOOD_CTRL["Mood Controller<br/>- getMoodHistory()<br/>- getRecommendations()"]
            CHAT_CTRL["Chat Controller<br/>- createSession()<br/>- sendMessage()<br/>- getHistory()"]
            ACTIVITY_CTRL["Activity Controller<br/>- logActivity()<br/>- getActivities()"]
            TODO_CTRL["Todo Controller<br/>- getTodos()<br/>- createTodo()<br/>- updateTodo()"]
        end
    end

    subgraph "Business Logic Layer"
        REC_ENGINE["Recommendations Engine<br/>- Analyze mood score<br/>- Check baseline answers<br/>- Generate tips<br/>- Flag professional help"]
        
        UTILS["Utilities & Services<br/>- Encryption (AES-256)<br/>- Logger (Winston)<br/>- JWT verification<br/>- Mood model client"]
    end

    subgraph "Database Layer"
        MONGOOSE["Mongoose ORM<br/>Schema validation<br/>Connection pooling"]
        MONGODB["MongoDB Atlas<br/>Cloud Database<br/>Connection String"]
        
        subgraph "Collections"
            USERS["Users<br/>- _id<br/>- name<br/>- email<br/>- password (hashed)"]
            MOODS["Moods<br/>- userId<br/>- score (0-100)<br/>- type<br/>- timestamp"]
            CHATS["ChatSessions<br/>- userId<br/>- messages[]<br/>- metadata"]
            ACTIVITIES["Activities<br/>- userId<br/>- type<br/>- description<br/>- duration"]
            TODOS["Todos<br/>- userId<br/>- title<br/>- isCompleted"]
            SURVEYS["Surveys<br/>- BaselineSurvey<br/>- DailyCheckin"]
        end
    end

    subgraph "AI & ML Services"
        GEMINI["Google Generative AI<br/>Model: Gemini-2.5-flash<br/>Role: Mindful Companion<br/>- Chat responses<br/>- Therapeutic guidance"]
        
        ML["Python FastAPI<br/>Mood Prediction<br/>- Model: mood_model.pkl<br/>- Input: 21 features<br/>- Output: Score + Type<br/>Port: 8000"]
    end

    subgraph "Background Processing"
        INNGEST["Inngest Event Queue<br/>- Event-driven tasks<br/>- Future capabilities:<br/>  - Daily reminders<br/>  - Weekly summaries<br/>  - Email notifications"]
    end

    subgraph "Security Layer"
        SEC["Security Mechanisms<br/>- JWT Authentication<br/>- bcryptjs Password Hashing<br/>- AES-256 Encryption<br/>- Error Handling<br/>- Input Validation"]
    end

    %% Frontend connections
    USER -->|Interacts with| FRONTEND
    FRONTEND -->|Uses| SESSIONCTX
    FRONTEND -->|Stores token| SESSIONCTX
    SESSIONCTX -->|Provides auth| FRONTEND

    %% Frontend to Backend
    FRONTEND -->|HTTP Requests<br/>with JWT Token| HTTP
    HTTP -->|Routes to| EXPRESS

    %% Express architecture
    EXPRESS -->|Uses| MIDDLEWARE
    MIDDLEWARE -->|Validates auth| EXPRESS
    EXPRESS -->|Routes traffic to| AUTH_ROUTE
    EXPRESS -->|Routes traffic to| MOOD_ROUTE
    EXPRESS -->|Routes traffic to| CHAT_ROUTE
    EXPRESS -->|Routes traffic to| ACTIVITY_ROUTE
    EXPRESS -->|Routes traffic to| TODO_ROUTE
    EXPRESS -->|Routes traffic to| STRESS_ROUTE

    %% Routes to Controllers
    AUTH_ROUTE -->|Invokes| AUTH_CTRL
    MOOD_ROUTE -->|Invokes| MOOD_CTRL
    CHAT_ROUTE -->|Invokes| CHAT_CTRL
    ACTIVITY_ROUTE -->|Invokes| ACTIVITY_CTRL
    TODO_ROUTE -->|Invokes| TODO_CTRL

    %% Business Logic
    MOOD_CTRL -->|Uses| REC_ENGINE
    MOOD_CTRL -->|Uses| UTILS
    CHAT_CTRL -->|Uses| UTILS
    AUTH_CTRL -->|Uses| UTILS

    %% Database connections
    AUTH_CTRL -->|CRUD| MONGOOSE
    MOOD_CTRL -->|CRUD| MONGOOSE
    CHAT_CTRL -->|CRUD| MONGOOSE
    ACTIVITY_CTRL -->|CRUD| MONGOOSE
    TODO_CTRL -->|CRUD| MONGOOSE

    MONGOOSE -->|Connection| MONGODB
    MONGODB -->|Stores| USERS
    MONGODB -->|Stores| MOODS
    MONGODB -->|Stores| CHATS
    MONGODB -->|Stores| ACTIVITIES
    MONGODB -->|Stores| TODOS
    MONGODB -->|Stores| SURVEYS

    %% AI Services
    CHAT_CTRL -->|Sends message<br/>with history| GEMINI
    GEMINI -->|Returns<br/>AI response| CHAT_CTRL

    MOOD_CTRL -->|POST /predict<br/>21 features| ML
    ML -->|Returns score<br/>& mood type| MOOD_CTRL

    %% Background jobs
    EXPRESS -->|Events| INNGEST

    %% Security
    SEC -->|Protects| MIDDLEWARE
    SEC -->|Protects| UTILS
    SEC -->|Protects| MONGODB

    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef database fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    classDef ai fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef network fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    classDef security fill:#ede7f6,stroke:#311b92,stroke-width:2px

    class USER,FRONTEND,SESSIONCTX frontend
    class EXPRESS,MIDDLEWARE,AUTH_ROUTE,MOOD_ROUTE,CHAT_ROUTE,ACTIVITY_ROUTE,TODO_ROUTE,STRESS_ROUTE,AUTH_CTRL,MOOD_CTRL,CHAT_CTRL,ACTIVITY_CTRL,TODO_CTRL,REC_ENGINE,UTILS backend
    class MONGOOSE,MONGODB,USERS,MOODS,CHATS,ACTIVITIES,TODOS,SURVEYS database
    class GEMINI,ML ai
    class HTTP network
    class SEC security
```

---

## Data Flow Diagram - User Authentication

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant Frontend as Next.js Frontend
    participant Backend as Express Backend
    participant DB as MongoDB
    participant Crypto as bcrypt/JWT

    User->>Frontend: 1. Submit credentials
    Frontend->>Backend: 2. POST /api/auth/register
    Backend->>Backend: 3. Validate input
    Backend->>Crypto: 4. Hash password
    Crypto-->>Backend: 5. Hashed password
    Backend->>DB: 6. Save User + Session
    DB-->>Backend: 7. Document created
    Backend->>Crypto: 8. Generate JWT token
    Crypto-->>Backend: 9. Token (userId payload)
    Backend-->>Frontend: 10. Return token + user info
    Frontend->>Frontend: 11. Store token in localStorage
    Frontend->>Frontend: 12. Update SessionContext
    Frontend-->>User: 13. Redirect to dashboard
```

---

## Data Flow Diagram - Mood Tracking & Recommendations

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant Frontend as Mood Component
    participant Backend as Express Backend
    participant DB as MongoDB
    participant REC as Recommendation Engine
    participant ML as ML Model (FastAPI)

    User->>Frontend: 1. Enter mood score (0-100)
    Frontend->>Backend: 2. POST /api/mood (with JWT)
    Backend->>DB: 3. Save Mood entry
    DB-->>Backend: 4. Mood saved
    Backend->>REC: 5. Generate recommendations
    REC->>DB: 6. Get baseline survey
    DB-->>REC: 7. Baseline data
    REC->>REC: 8. Analyze mood + baseline
    REC-->>Backend: 9. Return tips & professional help flag
    Backend-->>Frontend: 10. Return success + recommendations
    Frontend->>Frontend: 11. Update dashboard
    Frontend-->>User: 12. Display mood chart + tips

    opt ML Prediction (Optional)
        Backend->>ML: 6b. POST /predict (21 features)
        ML-->>Backend: 6b. Mood score + type
    end
```

---

## Data Flow Diagram - AI Chat Conversation

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant Chat as Chat Component
    participant Backend as Express Backend
    participant DB as MongoDB
    participant Gemini as Google Gemini API

    User->>Chat: 1. Type message
    Chat->>Backend: 2. POST /api/chat/sessions/:id/messages
    Backend->>DB: 3. Get ChatSession + history
    DB-->>Backend: 4. Return messages
    Backend->>Backend: 5. Append user message
    Backend->>Gemini: 6. Send chat + context + prompt
    Gemini->>Gemini: 7. Generate response (culturally aware)
    Gemini-->>Backend: 8. Return AI response
    Backend->>Backend: 9. Append AI message to session
    Backend->>DB: 10. Save updated ChatSession
    DB-->>Backend: 11. Saved
    Backend-->>Chat: 12. Return AI response
    Chat->>Chat: 13. Display message + animation
    Chat-->>User: 14. Show conversation
```

---

## Component Interaction Diagram

```mermaid
graph LR
    subgraph Frontend
        SF["Session Context"]
        AC["API Clients"]
        MOD["Components"]
    end

    subgraph Backend
        MID["Middleware"]
        CTR["Controllers"]
        UTL["Utils"]
    end

    subgraph External
        EX1["Google Gemini"]
        EX2["FastAPI ML"]
        EX3["MongoDB"]
    end

    SF -->|Token| AC
    AC -->|HTTP + JWT| MID
    MID -->|Verified| CTR
    CTR -->|Business Logic| UTL
    UTL -->|Encrypt/Hash| CTR
    CTR -->|CRUD| EX3
    CTR -->|Chat Messages| EX1
    CTR -->|Mood Features| EX2
    MOD -->|Uses| AC
    MOD -->|Reads from| SF
```

---

## Data Model Relationships

```mermaid
erDiagram
    USER ||--o{ CHATSESSION : creates
    USER ||--o{ MOOD : logs
    USER ||--o{ ACTIVITY : performs
    USER ||--o{ TODO : manages
    USER ||--o{ DAILYCHECKIN : completes
    USER ||--|| BASELINESURVEY : completes
    USER ||--o{ SESSION : has

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        timestamp createdAt
    }

    CHATSESSION {
        ObjectId _id PK
        ObjectId userId FK
        Message[] messages
        Object metadata
        timestamp createdAt
    }

    MOOD {
        ObjectId _id PK
        ObjectId userId FK
        number score 0-100
        string moodType
        string note
        date timestamp
        timestamp createdAt
    }

    ACTIVITY {
        ObjectId _id PK
        ObjectId userId FK
        string type
        string name
        string description
        number duration
        date timestamp
        timestamp createdAt
    }

    TODO {
        ObjectId _id PK
        ObjectId userId FK
        string title
        boolean isCompleted
        string source
        timestamp createdAt
    }

    DAILYCHECKIN {
        ObjectId _id PK
        ObjectId userId FK
        Object answers
        number score 0-1
        string label
        timestamp createdAt
    }

    BASELINESURVEY {
        ObjectId _id PK
        ObjectId userId FK
        Object answers
        number score 0-1
        timestamp createdAt
    }

    SESSION {
        ObjectId _id PK
        ObjectId userId FK
        string token UK
        date expiresAt
        string deviceInfo
        timestamp createdAt
    }
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph Internet["Internet / CDN"]
        CDN["CDN / Static Assets"]
    end

    subgraph Production["Production Environment"]
        DNS["Domain + DNS<br/>bemindful.com"]
        
        subgraph Frontend_Prod["Frontend Tier"]
            NEXT_PROD["Next.js App<br/>Vercel / Netlify<br/>SSR + Static"]
        end

        subgraph API_Tier["API Tier"]
            LOAD["Load Balancer<br/>Nginx / AWS ELB"]
            EXP1["Express Server 1<br/>Port 3001"]
            EXP2["Express Server 2<br/>Port 3001"]
            EXP3["Express Server N<br/>Port 3001"]
        end

        subgraph Data_Tier["Data Tier"]
            MONGO_PROD["MongoDB Atlas<br/>Production Cluster<br/>Replication<br/>Backups"]
        end

        subgraph ML_Tier["ML Tier"]
            ML_PROD["FastAPI Server<br/>Port 8000<br/>mood_model.pkl"]
        end
    end

    Internet -->|HTTPS| DNS
    DNS -->|Routes to| NEXT_PROD
    DNS -->|Routes to| LOAD
    
    NEXT_PROD -->|API calls| LOAD
    
    LOAD -->|Distributes| EXP1
    LOAD -->|Distributes| EXP2
    LOAD -->|Distributes| EXP3
    
    EXP1 -->|Query| MONGO_PROD
    EXP2 -->|Query| MONGO_PROD
    EXP3 -->|Query| MONGO_PROD
    
    EXP1 -->|ML calls| ML_PROD
    EXP2 -->|ML calls| ML_PROD
    EXP3 -->|ML calls| ML_PROD
    
    MONGO_PROD -->|Replication| MONGO_PROD
```

---

## API Endpoint Tree

```mermaid
graph TD
    API["🔌 API Gateway<br/>http://localhost:3001"]
    
    API -->|POST| AUTH_REG["/api/auth/register"]
    API -->|POST| AUTH_LOG["/api/auth/login"]
    API -->|POST| AUTH_OUT["/api/auth/logout"]
    API -->|GET| AUTH_ME["/api/auth/me"]
    
    API -->|GET| MOOD_HIST["/api/mood/"]
    API -->|GET| MOOD_REC["/api/mood/recommendations/latest"]
    
    API -->|POST| CHAT_SESS["/api/chat/sessions"]
    API -->|GET| CHAT_LIST["/api/chat/sessions"]
    API -->|GET| CHAT_HIST["/api/chat/sessions/:id/history"]
    API -->|POST| CHAT_MSG["/api/chat/sessions/:id/messages"]
    API -->|DELETE| CHAT_DEL["/api/chat/sessions/:id"]
    
    API -->|GET| ACT_GET["/api/activity/"]
    API -->|POST| ACT_POST["/api/activity/"]
    
    API -->|GET| TODO_GET["/api/todo/"]
    API -->|POST| TODO_POST["/api/todo/"]
    API -->|PATCH| TODO_UPD["/api/todo/:id"]
    API -->|DELETE| TODO_DEL["/api/todo/:id"]
    
    API -->|GET| STR_GET["/api/stress/"]
    API -->|POST| STR_POST["/api/stress/"]
    
    API -->|WEBHOOK| INNGEST["/api/inngest"]

    style AUTH_REG fill:#e3f2fd
    style AUTH_LOG fill:#e3f2fd
    style AUTH_OUT fill:#e3f2fd
    style AUTH_ME fill:#e3f2fd
    
    style MOOD_HIST fill:#f3e5f5
    style MOOD_REC fill:#f3e5f5
    
    style CHAT_SESS fill:#fff3e0
    style CHAT_LIST fill:#fff3e0
    style CHAT_HIST fill:#fff3e0
    style CHAT_MSG fill:#fff3e0
    style CHAT_DEL fill:#fff3e0
```

---

## Technology Stack Overview

```mermaid
graph TB
    subgraph Frontend_Stack["Frontend Stack"]
        LANG1["TypeScript"]
        FRAME["Next.js 15.5"]
        UI["React 19"]
        STYLE["Tailwind CSS"]
        COMP["Shadcn/UI"]
        ANIM["Framer Motion"]
    end

    subgraph Backend_Stack["Backend Stack"]
        LANG2["TypeScript"]
        FRAME2["Express.js"]
        RUNTIME["Node.js"]
        VALID["Mongoose"]
        AUTH["JWT + bcryptjs"]
    end

    subgraph DB_Stack["Database Stack"]
        DB["MongoDB Atlas"]
        ORM["Mongoose ORM"]
    end

    subgraph AI_Stack["AI/ML Stack"]
        AI["Google Gemini"]
        ML["Scikit-learn"]
        FAST["FastAPI"]
    end

    FRAME -.->|uses| UI
    UI -.->|styled with| STYLE
    COMP -.->|uses| STYLE
    FRAME -.->|animates with| ANIM
    FRAME -.->|typed with| LANG1

    FRAME2 -.->|typed with| LANG2
    FRAME2 -.->|runs on| RUNTIME
    FRAME2 -.->|validates with| VALID
    FRAME2 -.->|secures with| AUTH

    VALID -.->|connects to| DB
    ORM -.->|manages| VALID

    FRAME2 -->|calls| AI
    FRAME2 -->|calls| FAST
    FAST -->|uses| ML
```

