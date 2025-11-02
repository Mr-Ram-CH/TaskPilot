# TaskPilot

TaskPilot is a simple and modern Task Management web application designed for Project Managers (PMs) and Users to manage tasks effectively. It's built with Next.js, Tailwind CSS, and uses Firebase for authentication.

## Features

### Project Manager (PM)
- **Firebase Authentication**: Secure login system to access the PM dashboard.
- **Add Task**: Create new tasks with a title, description, deadline, and assign them to a user.
- **AI-Powered Descriptions**: Get AI-generated suggestions for task descriptions based on the title.
- **Edit & Delete Task**: Modify or remove any existing task.
- **Overdue Task Notifications**: Get automatically notified of tasks that have passed their deadline.
- **Weekly Summary**: Generate an AI-powered summary of the team's progress for the week.

### User
- **Firebase Authentication**: Secure login system to access the User dashboard.
- **View Assigned Tasks**: See a clear list of all tasks assigned to you.
- **Update Task Status**: Change the status of your tasks between 'Pending', 'In Progress', and 'Done'.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **AI Integration**: [Google Genkit](https://firebase.google.com/docs/genkit)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later)
- [npm](https://www.npmjs.com/)
- A [Firebase Project](https://console.firebase.google.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd taskpilot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

1.  Create a `.env` file in the root of your project:
    ```bash
    touch .env
    ```

2.  Add your Firebase project configuration to the `.env` file. You can find these credentials in your Firebase project settings.

    ```bash
    NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
    ```

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  **Open your browser:**
    Navigate to [http://localhost:9002](http://localhost:9002) to see the application running.

### How to Use

- On the home page, select your role ('Project Manager' or 'User').
- You will be redirected to a login page where you can use the demo credentials or create a new account.

#### Demo Credentials

**Password for all users:** `password`

- **Project Manager**:
  - **Email**: `pm@example.com`

- **Users**:
  - **Casey Jordan**: `user@example.com`
  - **Taylor Morgan**: `taylor@example.com`
  - **Jamie Bell**: `jamie@example.com`

You can also sign up as a new user. New accounts will automatically be assigned the 'User' role.

**Note**: This application uses an in-memory data store for *tasks* (`src/lib/data.ts`) for demonstration purposes. The task data will reset every time the server restarts. User accounts are persisted via Firebase Authentication.
