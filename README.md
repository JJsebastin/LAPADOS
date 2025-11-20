

- Learning and awareness platform for ANTI-DOPING in sports.
- has engaged gamified learning content
- blogs seciton for users to share their experience
- Work is right on !!😁✌️

-------------------------------------------------

📘 LAPDOS — Learning and Awareness Platform for Doping in Sports

A Gamified Learning + AI-Assisted Anti-Doping Awareness Platform

📌 Overview

LAPDOS is a full-stack web platform designed to promote anti-doping awareness among athletes, students, coaches, and fitness enthusiasts.
The system integrates:
- 📚 Moduloz (Learning modules + quizzes)
- 📰 Blogs/Infographics with AI-powered authenticity checks
- 🤖 AI Chatbot for scenario-based anti-doping questions and drug image analysis.

The platform combines React.js, Node.js, Supabase, and a lightweight LLM (Mistral-Instruct / custom fine-tuned model) to deliver an interactive and educational experience.

🚀 Key Features
🧪 1. AI assistant
Users upload an image of a drug/supplement. OR asks scenario based quesitons..
AI model analyzes the image and detects presence of doping agents. 
Returns:
a detailed answer whether to consume it OR not and also whether it should be prescribed before consumption

Stores analysis history for each user.
📚 2. Moduloz — Learning + Quiz System
Structured learning modules:- 
- The WADA Prohibited List
- Supplement Risks & Safety
- Doping Side Effects & LONG-TERM Damage
- ATHLETE BIOLOGICAL PASSPORT (ABP)
- ANTI-DOPING Testing Process

📰 3. Blogs & Infographics Section
Users can submit:
- Articles
- Awareness posts
- Infographics

-------------------------------------------------
Methods & Testing Procedures

Each module includes:
Informative content (text + images)
Mini-quizzes to reinforce learning
Quiz scores are stored for progress tracking.

-------------------------------------------------

🧩 Tech Stack
Frontend
⚛️ React.js
🎨 TailwindCSS
📜 React Router

Axios for API calls

Backend
- Node.js
- Express.js
- MongoDB

User Auth
Modules
Quizzes
Blog posts
Scores
Analysis history
📦 JSON File (optional)


Includes:

-------------------------------------------------

Authentication
CRUD for blogs
Module & quiz management
Image processing
AI chat and verification

-------------------------------------------------

```

📦 Folder Structure

lapdos/
│
├── client/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ │ ├── Analysis/
│ │ │ ├── Moduloz/
│ │ │ ├── Blog/
│ │ │ └── Chatbot/
│ │ ├── pages/
│ │ ├── utils/
│ │ └── App.js
│ └── package.json
│
├── server/ # Node backend
│ ├── routes/
│ │ ├── analysis.js
│ │ ├── blog.js
│ │ ├── quiz.js
│ │ └── chat.js
│ ├── controllers/
│ ├── models/
│ ├── data/
│ │ └── chatHistory.json # optional chat store
│ ├── app.js
│ └── server.js
│
└── README.md

```
