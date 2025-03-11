# Expense Tracker App

## Overview
A modern expense tracking application built with React 19 and .NET 9. Helps users manage personal finances by tracking expenses, creating budgets, and organizing spending into categories.

This project was developed as coursework for "Dezvoltarea Aplicațiilor Web" (Web Application Development) in the third year of Computer Science faculty.

## Key Features
- Track and categorize expenses
- Create and manage custom budgets
- Organize expenses with custom categories
- View spending patterns through charts
- Secure user authentication

## Tech Stack
- **Frontend**: React 19
- **Backend**: .NET 9
- **Database**: PostgreSQL
- **Caching**: Valkey 
- **Security**: JWT tokens, BCrypt password hashing
- **Deployment**: Docker, Docker Compose

## Getting Started
1. Clone the repository
   ```
   git clone https://github.com/andreialionte/DAW24x-Alionte-Andrei.git
   ```

2. Start the application
   ```
   docker-compose up -d
   ```

3. Access at `http://localhost:4200` (FE) and `http://localhost:5000` (BE)

## Project Structure
- `client/`: React frontend application
- `server/`: .NET backend API
- `docker-compose.yml`: Container orchestration

![home](https://github.com/user-attachments/assets/d7cb9814-ca70-422f-91e6-b42a8a4634d0)
![dashboard](https://github.com/user-attachments/assets/e93ba610-4a97-4972-9df2-56696201eef8)
![user profile](https://github.com/user-attachments/assets/9e0c373b-c0f9-4986-9c36-9f1c4cbfeec4)

