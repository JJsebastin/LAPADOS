# Lapdos

Lapdos is an educational platform built with Django, featuring user accounts, learning modules, and a blogging system.

## Features

- **Module Management**: Organize and interact with learning modules and quizzes.
- **Blogging System**: Create, edit, and read blog posts.
- **User Accounts**: Profile management, authentication, and a personalized dashboard.
- **Modern UI**: A sleek, responsive dashboard design.

## Tech Stack

- **Backend**: Django (Python)
- **Frontend**: HTML, CSS (Custom styling), JavaScript
- **Database**: SQLite (Development)

## Project Structure

- `apps/accounts/` - User authentication and profile logic
- `apps/moduloz/` - Learning module management
- `apps/blogs/` - Blog posting and viewing
- `config/` - Core Django project configuration
- `templates/` - Global HTML templates
- `static/` - Global static assets (CSS, JS, images)

--------------

## updates

- Integrated 3D effects
- and changed the UI design of all templates and pages





## Setup Instructions

1. **Clone the repository** (if applicable):
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
   Create a `.env` file in the root directory (alongside `manage.py`) to store your environment variables (e.g., secret keys, database credentials, API keys).

5. **Run Database Migrations**:
   ```bash
   python manage.py migrate
   ```

6. **Start the Development Server**:
   ```bash
   python manage.py runserver
   ```
   Navigate to `http://127.0.0.1:8000/` in your browser.
