# 💻 WiFi Payment & Employee Attendance Dashboard

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

Modern Frontend Dashboard built with **React**, **TypeScript**, and **Vite** to serve as the user interface for the Field Employee Attendance system and WiFi Subscriber Billing & Invoicing system.

---

## ✨ Features

- **🛡️ Role-Based Interface:** Distinct dashboards and routing for 3 user roles: `Admin` (Business Owner), `Employee` (Field Worker), and `Customer` (WiFi Subscriber).
- **🎨 Beautiful UI:** Fully styled using **Tailwind CSS v4** and the comprehensive **shadcn/ui** component library.
- **⚡ Lightning Fast:** Powered by Vite for instantaneous hot-module replacement (HMR) and optimized production builds.
- **📱 Fully Responsive:** Carefully crafted layouts (including Sidebars, Headers, and Breadcrumbs) that work seamlessly on Desktop and Mobile devices.

## 🚀 Tech Stack

- **Framework:** [React 18+](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Linter:** ESLint / Oxlint

## 📁 Project Structure

The project strictly follows a **Feature-Based Architecture** for maximum scalability:

```text
Frontend-System/
├── src/
│   ├── components/      # Global UI Components (including shadcn/ui)
│   │   ├── layouts/     # Global Layouts (Sidebar, Header, Base App)
│   │   └── ui/          # Standardized UI elements (Buttons, Inputs, Cards)
│   ├── features/        # Business Logic Grouped by Feature
│   │   ├── attendance/  
│   │   ├── auth/        
│   │   ├── billing/     
│   │   └── users/       
│   ├── hooks/           # Custom React Hooks
│   ├── lib/             # Third-party configurations (e.g., Axios setup)
│   ├── pages/           # Role-based Routing (Admin, Employee, Customer)
│   └── utils/           # Helper functions (Formatting, Validation)
└── public/              # Static Assets (Images, Icons)
```

## 🛠️ Quick Start

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun

### 2. Run the Application
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the localhost URL provided in the terminal (usually `http://localhost:5173`).

---
*Built for Modern ISP & Workforce Management.*
