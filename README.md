# Lapdos: Advanced Educational Platform

Lapdos is a modern, modular educational platform built with Django, featuring user accounts, interactive learning modules, an integrated blogging system, and AI-powered assistance.

## 🚀 Updated Features & Modularity

The platform is designed with a highly modular architecture, allowing each application to function independently while seamlessly integrating into the main platform.
- **Accounts Module (`apps/accounts`)**: Handles authentication, user profiles, and personalized dashboards.
- **Moduloz Module (`apps/moduloz`)**: Core learning management system handling topics, modules, and interactive quizzes.
- **Blogs Module (`apps/blogs`)**: Content management system for creating, publishing, and filtering articles.
- **AI Integration**: Features a built-in AI assistant for chat and image analysis.

## 🧩 Functions of Different Modules & Webpages

### 1. Accounts
- **Registration/Login**: Secure user authentication.
- **Profile Dashboard (`/accounts/profile/`)**: Displays user progress, learning streak, module mastery radar chart, and recent activity.

### 2. Moduloz
- **Dashboard (`/moduloz/dashboard/`)**: Overview of learning progress.
- **Module List (`/moduloz/`)**: Browse available learning topics and modules.
- **Module Detail & Quiz (`/moduloz/<slug>/`)**: SPA-like interface to read module content, take interactive quizzes, and view results immediately via AJAX.

### 3. Blogs
- **Blog List (`/blogs/`)**: Grid layout with dynamic client-side filtering by category (e.g., Tech, Study, General).
- **Blog Detail (`/blogs/<slug>/`)**: Rich text article view with AI Fact-Check features.
- **Blog Creation (`/blogs/create/`)**: Editor to draft and publish new articles with cover images.

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
- `/ai/` -> Handles AI backend endpoints like `/ai/chat/` and `/ai/analyze/`

Models are cross-referenced carefully. For instance, the `User` model is extended or related to `UserProgress` in Moduloz and acts as the `Author` in the Blogs module.

## 🔑 API Keys & Workflow

1. **Groq/OpenAI API (or similar)**: The AI assistant relies on external API keys. Configure your `.env` file with the required key (e.g., `GROQ_API_KEY=your_key`).
2. **Workflow**:
   - User inputs a query in the AI Assistant sidebar.
   - JavaScript `fetch` sends an asynchronous POST request to `/ai/chat/`.
   - The Django view securely retrieves the API key from environment variables, queries the LLM, and returns a JSON response.
   - The UI updates dynamically without page reloads.

## 💻 Tech Stack
- **Backend**: Django (Python)
- **Frontend**: Custom Vanilla CSS (Glassmorphism & Flat UI), JavaScript (ES6)
- **Database**: SQLite (Development)

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
   GROQ_API_KEY=your_api_key_here
   ```

5. **Run Database Migrations & Start Server**:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```
   Navigate to `http://127.0.0.1:8000/`.
