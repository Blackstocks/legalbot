# Legalbot: A RAG Chatbot

This project is a King of RAG (Retrieval-Augmented Generation) chatbot with a Next.js frontend and a Python FastAPI backend. It's designed for scalability and ease of use.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. Running the Application](#4-running-the-application)
- [Project Structure](#project-structure)

## Features

- **Interactive Chat Interface:** User-friendly chat interface built with Next.js.
- **Scalable Backend:** Python FastAPI backend for efficient handling of chat requests and future RAG integration.
- **Modular Design:** Separate frontend and backend for better maintainability and scalability.

## Tech Stack

- **Frontend:** Next.js (React, TypeScript, Tailwind CSS)
- **Backend:** Python (FastAPI, Uvicorn)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
- [Python 3.9+](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installation/) (comes with Python)

## Getting Started

Follow these steps to get your Legalbot project up and running.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/legalbot.git # Replace with your repository URL
cd legalbot
```

### 2. Backend Setup

Navigate to the `backend` directory, create a virtual environment, activate it, install dependencies, and set up your OpenAI API key.

```bash
# Navigate to the backend directory
cd backend

# Create a Python virtual environment
python3 -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# .\venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Set up your OpenAI API Key
# Create a .env file in the 'backend' directory
# Add your OpenAI API key to this file in the format:
# OPENAI_API_KEY="your_openai_api_key_here"
# Replace "your_openai_api_key_here" with your actual key.
# IMPORTANT: Do NOT commit this .env file to your Git repository!
```

### 3. Frontend Setup

Navigate to the `frontend` directory and install the Node.js dependencies.

```bash
# Navigate to the frontend directory
cd ../frontend

# Install Node.js dependencies
npm install
```

### 4. Running the Application

To run the full application, you will need two separate terminal windows: one for the backend server and one for the frontend development server.

#### Start Backend Server

In your first terminal window:

```bash
# Navigate to the backend directory
cd backend

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# .\venv\Scripts\activate

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

#### Start Frontend Server

In your second terminal window:

```bash
# Navigate to the frontend directory
cd frontend

# Start the Next.js development server
npm run dev
```

Once both servers are running, open your web browser and go to `http://localhost:3000` to access the Legalbot application.

**Note:** If you don't see the latest UI changes, try clearing your browser's cache.

## Project Structure

```
legalbot/
├── backend/
│   ├── venv/             # Python virtual environment
│   ├── .env              # Environment variables (e.g., OPENAI_API_KEY) - IMPORTANT: DO NOT COMMIT!
│   ├── main.py           # FastAPI application
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── node_modules/     # Node.js dependencies
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx  # Main chat interface
│   │   └── ...           # Other Next.js files
│   ├── .env.local        # Environment variables (optional)
│   ├── package.json      # Node.js dependencies and scripts
│   └── ...               # Other Next.js configuration files
└── README.md             # Project documentation
```