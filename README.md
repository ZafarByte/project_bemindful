# BeMindful - Your Personal Mental Wellness Companion

BeMindful is a comprehensive web application designed to support your mental well-being. It provides a suite of tools to help you track your mood, manage stress, practice mindfulness, and gain insights into your emotional patterns.

## ✨ Features

- **Mood Tracking:** Log your daily mood and emotions to build self-awareness.
- **Consistency Heatmap:** Visualize your mood logging consistency to stay on track.
- **Mood Trends:** Analyze your mood patterns over time with an interactive trend chart.
- **Stress Management:** Take regular stress surveys to assess and manage your stress levels.
- **Personalized Recommendations:** Receive tailored suggestions for activities and resources based on your mood and stress levels.
- **Todo List:** Organize your tasks and reduce mental clutter with a simple and effective todo list.
- **Activity Logger:** Keep a record of your daily activities to understand their impact on your well-being.
- **Mindfulness Games:** Engage in a variety of calming and focus-enhancing games:
    - Zen Garden
    - Breathing Exercise
    - Bubble Burst
    - Focus Dots
    - Forest Game
    - Ocean Waves
    - Thought Clouds
- **AI-Powered Chat:** (Inferred) An integrated chat feature for support.
- **Journaling:** A dedicated space for your personal thoughts and reflections.
- **Secure Authentication:** User accounts are protected with JWT-based authentication.
- **Dashboard:** A central hub to view your wellness data, recommendations, and resources at a glance.
- **Downloadable Reports:** Generate and download reports of your wellness data.

## 🛠️ Tech Stack

- **Frontend:**
    - [Next.js](https://nextjs.org/) - React Framework
    - [React](https://reactjs.org/) - JavaScript Library
    - [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
    - [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS Framework
    - [Shadcn/UI](https://ui.shadcn.com/) - Re-usable components built using Radix UI and Tailwind CSS.

- **Backend:**
    - [Node.js](https://nodejs.org/) - JavaScript Runtime
    - [Express.js](https://expressjs.com/) - Web Framework for Node.js
    - [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
    - [MongoDB](https://www.mongodb.com/) - NoSQL Database
    - [Mongoose](https://mongoosejs.com/) - MongoDB Object Modeling
    - [JWT](https://jwt.io/) - JSON Web Tokens for Authentication
    - [Inngest](https://www.inngest.com/) - for background jobs and event-driven functions.

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v18 or later recommended)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/en/docs/install/)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running on your local machine or a connection string to a cloud instance.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the `backend` directory and add the following environment variables. Replace the placeholder values with your actual data.
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_strong_jwt_secret
    ```

4.  **Start the backend development server:**
    ```bash
    npm run dev
    ```
    The backend server will be running on `http://localhost:5000` (or the port you configure).

### Frontend Setup

1.  **Navigate to the root project directory** (if you are in the `backend` directory, go back one level).
    ```bash
    cd ..
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env.local` file** in the root project directory and add the following environment variable:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```
    *Note: Make sure this URL matches the address of your running backend server.*

4.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 📂 Project Structure

The project is organized into two main parts: a `backend` directory for the server-side code and a `src` directory for the Next.js frontend.

```
/
├── backend/                # Express.js/Node.js Backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   └── index.ts        # Backend entry point
│   └── ...
├── src/                    # Next.js Frontend
│   ├── app/                # App Router pages and layouts
│   ├── components/         # Shared React components
│   ├── lib/                # Helper functions and utilities
│   └── ...
├── public/                 # Static assets
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

