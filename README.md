<div align="center">
  <img src="public/assets/logo.png" alt="PowerHouse Logo" width="120" />
  <h1>PowerHouse Web</h1>
  <p><strong>A Next-Generation Fitness & Admin Platform</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

---

## 📖 About
**PowerHouse Web** is a comprehensive, modern web application designed to bridge the gap between fitness management and user engagement. It serves as a dual-purpose platform:
1.  **For Users**: A dynamic landing page and potential client-facing features for discovering workouts, nutrition tips, and challenges.
2.  **For Admins**: A powerful, responsive dashboard to manage the entire ecosystem—including users, workouts, foods, recipes, and challenges.

Built with performance and aesthetics in mind, PowerHouse Web leverages the latest web technologies to deliver a premium, app-like experience on the web.

## ✨ Features

### 🎨 User Experience
-   **Modern UI/UX**: Glassmorphism, smooth gradients, and micro-interactions.
-   **Responsive Design**: Fully optimized for desktops, tablets, and mobile devices.
-   **Animations**: Advanced scroll animations and transitions using **GSAP** and **Framer Motion**.
-   **3D Elements**: Integrated **Three.js** components for immersive visuals.

### ⚡ Admin Capabilities
-   **Dashboard Analytics**: Real-time overview of system stats.
-   **User Management**: Complete control over user accounts and profiles.
-   **Content Management Systems (CMS)**:
    -   **Workouts & Exercises**: Create, edit, and organize fitness routines.
    -   **Nutrition**: Manage a database of foods and comprehensive recipes.
    -   **Challenges**: Set up and monitor user challenges.
    -   **Tips & Categories**: Publish health and wellness advice.
-   **Settings & Configuration**: Granular control over platform settings.

## 🛠 Tech Stack

### Core
-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Library**: [React 19](https://react.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)

### Styling & UI
-   **Tailwind CSS 4**: Utility-first CSS framework.
-   **Lucide React**: Beautiful, consistent icons.
-   **Radix UI**: Accessible UI primitives.
-   **Custom CSS**: Advanced gradients and glassmorphism effects (`globals.css`).

### Animation & Graphics
-   **GSAP**: High-performance scrolling and timeline animations.
-   **Framer Motion**: Gesture-based animations and layout transitions.
-   **Three.js**: 3D graphics rendering.

### Data & Backend
-   **Supabase**: Backend-as-a-Service for database, auth, and storage.
-   **Recharts**: Composable charting library for React.

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
-   **Node.js**: v18.17.0 or higher
-   **npm** or **yarn**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/powerhouse-web.git
    cd powerhouse-web
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```bash
src/
├── app/                  # Next.js App Router
│   ├── admin/            # Admin Dashboard routes (protected)
│   ├── about/            # Public About page
│   ├── guide/            # User Guide/Documentation
│   └── page.tsx          # Landing Page
├── components/           # React Components
│   ├── admin/            # Admin-specific UI (Sidebar, Tables, etc.)
│   ├── landing/          # Landing page sections (Hero, Features, etc.)
│   └── ui/               # Shared UI elements
├── lib/                  # Utilities and helper functions
└── styles/               # Global styles and Tailwind config
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

<p align="center">
  Built with ❤️ by the PowerHouse Team
</p>
