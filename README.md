# DevVerse 🚀

An ultimate developer platform combining LeetCode-style problem
solving, real-time code battles, AI integration, and developer
community — built solo as a long-term portfolio project.

## 🌟 Features

### ✅ Phase 1 — Authentication (Complete)

- JWT login/register with refresh tokens
- OAuth2 — Google & GitHub login
- OTP-based forgot password system
- Profile system with photo upload (Supabase)
- Dashboard

### ✅ Phase 2 — Problem Solving (Complete)

- DSA Problems with Easy/Medium/Hard difficulty
- Monaco Editor (VS Code in browser)
- Multi-language support — Java, C++, Python, JavaScript, Go
- Code execution via Codebox (sandboxed)
- Auto judge — AC, WA, TLE, MLE, RE verdicts
- Run (sample test cases) vs Submit (all test cases)
- Daily Challenge system
- Problem tags, companies, discussion
- Submission history with runtime and memory stats
- Problem bookmarking and personal workspace
- Full Admin Panel for problem management

### 🔄 Phase 3 — Community (In Progress)

- Social feed, follow/unfollow
- Doubt forum
- Study groups
- Notifications

### ⏳ Upcoming

- Code Battle (WebSockets, 1v1, contests)
- AI Integration (hints, code review, interview coach)
- Gamification (XP, levels, badges, streaks)
- Premium Subscription (Razorpay + Stripe)
- Learning Paths & Certifications

## 🛠️ Tech Stack

**Backend**

- Spring Boot 4, Java 21
- Spring Security + JWT + OAuth2
- PostgreSQL (Supabase)
- Codebox (code execution engine)
- Thymeleaf (email templates)

**Frontend**

- React 19 + JavaScript
- Tailwind CSS v4
- Zustand (state management)
- Monaco Editor
- Axios + React Router v7

**Infrastructure**

- Supabase (PostgreSQL + Storage)
- Docker (Codebox sandbox)

## 📁 Project Structure

This project is organized into two main directories:

- `/devverse-frontend`: React 19 + Vite frontend application, styled with Tailwind CSS v4.
- `/devverse-backend`: Spring Boot 4 Java backend providing RESTful APIs.

## 🚀 Getting Started

### Prerequisites

- **Java 21** or higher
- **Node.js** (v18+)
- **Maven**
- **Docker** (for Codebox sandbox)
- A **Supabase** project for the PostgreSQL database and storage

### Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/devverse.git
   cd devverse
   ```

2. **Backend Setup:**

   ```bash
   cd devverse-backend
   # Configure application.properties or environment variables for Supabase, OAuth, JWT, etc.
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

3. **Frontend Setup:**

   ```bash
   cd ../devverse-frontend
   npm install
   # Configure .env file for backend API URL
   npm run dev
   ```

4. **Access the application:**
   The frontend will run on `http://localhost:5173` (by default with Vite) and the backend on `http://localhost:8080`.

## 🔗 Links

- GitHub: https://github.com/Its-Tanishq/DevVerse
