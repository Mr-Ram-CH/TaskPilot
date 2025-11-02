# TaskPilot

TaskPilot is a simple and modern Task Management web application designed for Project Managers (PMs) and Users to manage tasks effectively.

## Features

### Project Manager (PM)
- **Login**: A simple login system to access the PM dashboard.
- **Add Task**: Create new tasks with a title, description, deadline, and assign them to a user.
- **AI-Powered Descriptions**: Get AI-generated suggestions for task descriptions based on the title.
- **Edit & Delete Task**: Modify or remove any existing task.
- **Overdue Task Notifications**: Get automatically notified of tasks that have passed their deadline.
- **Weekly Summary**: Generate an AI-powered summary of the team's progress for the week.

### User
- **Login**: A simple login system to access the User dashboard.
- **View Assigned Tasks**: See a clear list of all tasks assigned to you.
- **Update Task Status**: Change the status of your tasks between 'Pending', 'In Progress', and 'Done'.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **AI Integration**: [Google Genkit](https://firebase.google.com/docs/genkit)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  **Open your browser:**
    Navigate to [http://localhost:9002](http://localhost:9002) to see the application running.

### How to Use

- On the login page, you can choose to log in as a 'Project Manager' or a 'User' from the dropdown.
- **Project Manager**: Has full control to create, read, update, and delete all tasks.
- **User**: Can only view their assigned tasks and update their status.

**Note**: This application uses a dummy login system and an in-memory data store (`src/lib/data.ts`) for demonstration purposes. The data will reset every time the server restarts.
