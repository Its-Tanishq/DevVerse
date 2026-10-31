# DevVerse 🚀

An ultimate developer platform combining LeetCode-style problem solving, real-time code execution, developer community & study circles — built solo as a comprehensive full-stack portfolio project.

> [!NOTE]
> **Note**: Some parts of the frontend/UI are vibe coded, but mostly the backend, APIs, and core features were written manually from scratch.

---

## 🚧 Project Status

Phases 1–3 are fully complete! The platform currently supports end-to-end authentication, interactive problem solving with automated judging, and community discussion/study circles. Remaining modules are listed under **Future Scope**.

---

## 🌟 Features

### ✅ Phase 1 — Authentication (Complete)

- JWT login and registration with refresh tokens
- OAuth2 integration — Google & GitHub login
- OTP-based secure password reset flow via email
- User profile management with avatar uploads (Supabase Storage)
- User dashboard with activity heatmaps and performance metrics

### ✅ Phase 2 — Problem Solving & Online Judge (Complete)

- Curated DSA problems categorized by difficulty: Easy, Medium, Hard
- Embedded Monaco Editor (VS Code in browser)
- Multi-language execution support — Java, C++, Python, JavaScript, C
- Sandboxed code execution via Codebox engine
- Automated judge verdicts — AC (Accepted), WA (Wrong Answer), TLE (Time Limit Exceeded), RE (Runtime Error), CE (Compilation Error)
- Test runner (Sample test cases) vs. Full submission evaluation
- Automated Daily Challenge scheduling system
- Filterable problem sets by tags, companies, and difficulty
- User submission history with runtime, memory, and code inspection
- Personal problem notes and workspace bookmarking
- Complete Admin Panel for problem, tag, company, and challenge management

### ✅ Phase 3 — Community & Study Circles (Complete)

- **Doubt Forum**: Ask technical questions, format code snippets, post solutions, and upvote discussions
- **Study Groups**: Create private or public developer circles, generate invite codes, and manage join requests
- **Group Collaboration**: Group feed discussions and real-time group chat
- **Social Connectivity**: Follow and unfollow developers with follower/following explorer modals
- **Public Profiles**: Showcase solved problems, stats, and activity history
- **Admin Management**: User moderation, account suspension, and privilege management

---

### 🔮 Future Scope

- Social feed (posts, likes, comments)
- Code Battle (WebSockets, 1v1, contests)
- AI Integration (hints, code review, interview coach)
- Gamification (XP, levels, badges, streaks)
- Premium Subscription (Razorpay + Stripe)
- Learning Paths & Certifications

---

## 🛠️ Tech Stack

**Backend**
- Spring Boot 3 / 4, Java 21
- Spring Security + JWT + OAuth2
- PostgreSQL (Supabase)
- Codebox (sandboxed code execution engine)
- Thymeleaf (email templates for OTPs & notifications)

**Frontend**
- React 19 + JavaScript + Vite
- Tailwind CSS v4
- Monaco Editor (`@monaco-editor/react`)
- Zustand (state management)
- Axios & React Router v7
- Framer Motion & Lucide Icons

**Infrastructure**
- Supabase (PostgreSQL Database & Storage)
- Docker (Codebox container sandbox)

---

## 📁 Project Structure

```
DevVerse/
├── devverse-frontend/    # React 19 + Vite frontend application
│   ├── src/
│   │   ├── components/   # Modular UI & feature components
│   │   ├── pages/        # Route pages (Auth, Admin, Problems, Community, Profile)
│   │   ├── store/        # Zustand state stores (AuthStore, etc.)
│   │   └── config/       # API & Supabase clients
└── devverse-backend/     # Spring Boot Java backend
    └── src/main/java/com/devverse/
        ├── admin/        # Admin analytics, stats & moderation
        ├── authentication/ # Auth, JWT, OAuth2 & OTP services
        ├── community/    # Doubts, study groups, comments & chat
        └── problem/      # Problems, test cases, code execution & submissions
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 21** or higher
- **Node.js** (v18+) & **npm**
- **Maven**
- **Docker** (for Codebox sandbox)
- A **Supabase** project for the PostgreSQL database and storage bucket

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Its-Tanishq/DevVerse.git
   cd DevVerse
   ```

2. **Backend Setup:**
   ```bash
   cd devverse-backend
   # Configure application.properties or environment variables for DB, OAuth, JWT, etc.
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

3. **Frontend Setup:**
   ```bash
   cd ../devverse-frontend
   npm install
   # Configure .env with VITE_BACKEND_API_URL and Supabase credentials
   npm run dev
   ```

4. **Access the application:**
   - Frontend runs by default at: `http://localhost:5173`
   - Backend APIs run at: `http://localhost:8080`

---

## 🔗 Links

- **GitHub Repository**: [https://github.com/Its-Tanishq/DevVerse](https://github.com/Its-Tanishq/DevVerse)
