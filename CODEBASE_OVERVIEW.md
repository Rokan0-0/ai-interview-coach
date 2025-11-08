# Full-Stack Codebase Overview: Interview Coach

This document provides a detailed analysis of the entire full-stack application, covering both the React frontend (`client`) and the Node.js backend (`server`). The goal is to give a comprehensive understanding of the project's architecture, technology stack, and component structure.

---

## Part 1: Client (Frontend)

This section details the React single-page application located in the `client` directory.

### 1.1. Project Overview

This is a modern React SPA built using Vite. It features a sophisticated, composable UI component library based on Radix UI and styled with Tailwind CSS, a setup characteristic of **shadcn/ui**. The application includes client-side logic for user authentication and is designed to communicate with a backend API.

**Key Characteristics:**
- **Build Tool:** Vite for fast development and optimized builds.
- **Framework:** React with TypeScript.
- **Styling:** Utility-first CSS using Tailwind CSS.
- **UI Components:** A highly composable, accessible component library built from Radix UI primitives.
- **Functionality:** Includes a login page for user authentication.

### 1.2. Technology Stack

Based on `package.json` and component implementations, the core technologies are:

- **Core Framework:**
  - **React (`^18.3.1`):** The primary library for building the user interface.
  - **Vite (`^6.3.5`):** The build tool and development server.
  - **TypeScript:** For static typing.

- **UI & Styling:**
  - **Radix UI (`@radix-ui/*`):** A collection of low-level, unstyled, accessible UI primitives (e.g., `@radix-ui/react-dialog`, `@radix-ui/react-select`).
  - **Tailwind CSS:** A utility-first CSS framework for styling.
  - **`class-variance-authority` (CVA):** Used to create variants of UI components.
  - **`clsx` & `tailwind-merge`:** Utilities for conditionally combining and merging Tailwind CSS classes.
  - **`lucide-react`:** Provides a library of high-quality icons.

- **UI Components (Application-level):**
  - **`sonner`:** For displaying toasts and notifications.
  - **`react-day-picker`:** A flexible date picker component.
  - **`recharts`:** A composable charting library.
  - **`react-resizable-panels`:** For creating resizable panel layouts.

- **State Management & Forms:**
  - **`react-hook-form`:** For managing form state, validation, and submission.

- **Routing:**
  - **`react-router-dom`:** Used for client-side routing (`useNavigate`).

### 1.3. Project Structure

```
interview-coach/client/
├── build/                  # Production build output
├── node_modules/           # Project dependencies
├── src/
│   ├── components/
│   │   └── ui/             # Reusable UI components (Button, Dialog, etc.)
│   └── pages/
│       └── LoginPage.tsx   # A page-level component for user login
├── index.html              # The entry point for the application
├── package.json            # Project metadata and dependencies
└── vite.config.ts          # Vite configuration
```

### 1.4. UI Component Library (`src/components/ui`)

The application features a rich, in-house UI library consistent with the `shadcn/ui` methodology.

- **Foundation:** Components are built on top of Radix UI primitives, ensuring accessibility.
- **Styling:** Components are styled using Tailwind CSS utility classes.
- **Composition:** Components like `Dialog` and `Select` are exported as a collection of sub-components (`Dialog.Trigger`, `Dialog.Content`), allowing for flexible use.
- **Variants:** `class-variance-authority` (CVA) is used to define visual variants (e.g., `variant: 'destructive'`) for components like `Button` and `Badge`.

### 1.5. Application Logic: `LoginPage.tsx`

This file demonstrates how the UI components and application logic are integrated.

- **State Management:** Uses React's `useState` hook to manage form inputs and error messages.
- **API Interaction:**
  - It makes an asynchronous `POST` request to `http://localhost:5000/api/login`.
  - It sends `email` and `password` in the request body.
- **Client-Side Authentication Flow:**
  - **On Success:** It expects a JSON response containing a `token`, saves this token to `localStorage`, and redirects the user to `/dashboard`.
  - **On Failure:** It catches errors, logs them, and displays an error message in the UI.

### 1.6. Build and Development Scripts

- **`npm run dev`:** Starts the Vite development server on `http://localhost:3000`.
- **`npm run build`:** Creates an optimized production build in the `build/` directory.

---

## Part 2: Server (Backend)

**Disclaimer:** The following analysis is based on inference from the client-side code, as the server-side files were not provided. It outlines a likely architecture.

### 2.1. Inferred Architecture & Technology

The backend is running on `http://localhost:5000`, which strongly suggests it is a **Node.js** application. Given its pairing with a React frontend, it is likely built with a framework like **Express.js** or a similar alternative.

- **Likely Technology Stack:**
  - **Runtime:** Node.js
  - **Framework:** Express.js
  - **Authentication:** JSON Web Tokens (JWT) for generating the token sent back to the client.
  - **Database:** A database like MongoDB (making this a MERN stack), PostgreSQL, or MySQL for storing user data.
  - **Middleware:** `cors` for handling cross-origin requests from the client at `localhost:3000`, and `body-parser` (or the built-in `express.json()`) to parse the incoming request body.

### 2.2. Inferred Functionality & API Endpoints

Based on `LoginPage.tsx`, the server must expose at least one API endpoint.

**`POST /api/login`**
- **Purpose:** To authenticate a user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "user_password"
  }
  ```
- **Logic:**
  1.  Receives the email and password.
  2.  Finds the user in the database by email.
  3.  Compares the provided password with the stored (and likely hashed) password.
  4.  If credentials are valid, it generates a JWT (`token`) containing user information (like user ID).
  5.  It sends back a success response with the token.
  - **Success Response (200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  - **Failure Response (401 Unauthorized / 400 Bad Request):**
    ```json
    {
      "error": "Invalid email or password"
    }
    ```

### 2.3. Probable Project Structure

A typical Express.js project structure for this application might look like this:

```
interview-coach/server/
├── node_modules/
├── src/
│   ├── controllers/    # Logic for handling requests (e.g., authController.js)
│   ├── models/         # Database schemas (e.g., userModel.js)
│   ├── routes/         # API route definitions (e.g., authRoutes.js)
│   └── middleware/     # Custom middleware (e.g., for protecting routes)
├── .env                # Environment variables (DB_URI, JWT_SECRET)
├── package.json
└── server.js           # Main server entry point
```

To complete this overview, the files from the `server` directory would be needed.