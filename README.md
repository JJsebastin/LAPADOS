# LAPDOS: Learning, Awareness, and Educational Platform (Anti-Doping)

Lapdos is a modern, modular educational platform built with Django, featuring user accounts, interactive anti-doping learning modules, an integrated blogging system, live news feeds, and AI-powered assistance.

> **Learn, Quiz, and Discover the truth about anti-doping in sports. Powered by AI.**

## 🚀 Updated Features & Modularity

The platform is designed with a highly modular architecture, allowing each application to function independently while seamlessly integrating into the main platform.
- **Accounts Module (`apps/accounts`)**: Handles authentication, user profiles, and personalized dashboards.
- **Moduloz Module (`apps/moduloz`)**: Core learning management system handling anti-doping topics (WADA/ABP guidelines), modules, and interactive quizzes.
- **Blogs Module (`apps/blogs`)**: Content management system for creating, publishing, and filtering articles, as well as uploading custom editorial content.
- **News Module (`apps/news`)**: Integrates live Google News feeds using SerpAPI, featuring a custom caching service and a tabbed UI for categorized news alongside editorial content.
- **AI Integration**: Features a built-in AI assistant for chat and image analysis.

## 🎨 Advanced UI/UX & Design

Lapdos boasts a state-of-the-art visual identity focusing on modern aesthetics:
- **3D Glassmorphism**: Premium glassmorphic aesthetic applied to components, modals, and a modern 3D toast notification system.
- **Parallax & 3D Elements**: Includes 3D parallax effects on dashboard images and dynamic 3D branding elements (e.g., an extruded, parallax-enabled LAPADOS logo and animated spinning rings).
- **Data Visualization**: Modern, high-impact Chart.js integrations featuring custom gradients, rounded bar styling, and advanced tooltips.

## 🧩 Functions of Different Modules & Webpages

### 1. Accounts
- **Registration/Login**: Secure user authentication.
- **Profile Dashboard (`/accounts/profile/`)**: Displays user progress, learning streak (calculated accurately across quiz attempts and local timezones), module mastery radar chart, and recent activity.

### 2. Moduloz
- **Dashboard (`/moduloz/dashboard/`)**: Overview of learning progress with modern chart UI and parallax effects.
- **Module List (`/moduloz/`)**: Browse available anti-doping learning topics and modules.
- **Module Detail & Quiz (`/moduloz/<slug>/`)**: SPA-like interface to read module content, take interactive quizzes via a bold dedicated interface, and view results immediately via AJAX with high-impact 3D glassmorphic completion modals.

### 3. Blogs
- **Blog List (`/blogs/`)**: Grid layout with dynamic client-side filtering by category (e.g., Tech, Study, General).
- **Blog Detail (`/blogs/<slug>/`)**: Rich text article view with AI Fact-Check features.
- **Blog Creation (`/blogs/create/`)**: Editor to draft and publish new articles with cover images and custom editorial submissions.

### 4. News
- **Live News Feed (`/news/`)**: Displays categorized anti-doping and sports news pulled from SerpAPI.
- **Caching Mechanism**: Optimized API usage via robust backend caching.

## 🔒 Security Features

Lapdos implements robust security measures:
- **CSRF Protection**: All forms and AJAX POST requests (like quiz submissions and AI chats) are protected using Django's built-in CSRF tokens.
- **Authentication & Authorization**: Route protection ensures only authenticated users can access the dashboard, modules, and blog creation features. `@login_required` decorators are heavily utilized.
- **Data Validation**: Both client-side HTML5 validation and server-side Django form validation prevent malicious data entry.
- **Environment Variables**: Sensitive data like `SECRET_KEY` and API keys are stored securely in `.env` files and excluded from version control.

## 🔀 Module Connection & Routing

The platform uses Django's URL routing to connect modules efficiently. The main `config/urls.py` delegates routes to specific apps:
- `/accounts/` -> `apps.accounts.urls`
- `/moduloz/` -> `apps.moduloz.urls`
- `/blogs/` -> `apps.blogs.urls`
- `/news/` -> `apps.news.urls`
- `/ai/` -> Handles AI backend endpoints like `/ai/chat/` and `/ai/analyze/`

Models are cross-referenced carefully. For instance, the `User` model is extended or related to `UserProgress` in Moduloz and acts as the `Author` in the Blogs module.

## 🔑 API Keys & Workflow

1. **Groq/OpenAI & SerpAPI**: The platform relies on external API keys for the AI assistant and live news. Configure your `.env` file with the required keys (e.g., `GROQ_API_KEY=your_key`, `SERPAPI_KEY=your_key`).
2. **Workflow**:
   - User inputs a query in the AI Assistant sidebar.
   - JavaScript `fetch` sends an asynchronous POST request to `/ai/chat/`.
   - The Django view securely retrieves the API key from environment variables, queries the LLM, and returns a JSON response.
   - The UI updates dynamically without page reloads.

## 💻 Tech Stack
- **Backend**: Django (Python)
- **Frontend**: Custom Vanilla CSS (Glassmorphism & Flat UI), JavaScript (ES6), Chart.js, 3D Parallax/Animation libraries.
- **Database**: SQLite (Development)
- **External APIs**: Groq, SerpAPI

## 🛠️ Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Lapdos
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**:
   Create a `.env` file in the root directory:
   ```env
   SECRET_KEY=your_django_secret_key
   DEBUG=True
   GROQ_API_KEY=your_groq_api_key_here
   SERPAPI_KEY=your_serpapi_key_here
   ```

5. **Run Database Migrations & Start Server**:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```
   Navigate to `http://127.0.0.1:8000/`.
