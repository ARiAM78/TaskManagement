# Task Management API

## Project Description
This project provides a task management system built using React for the front-end and ASP.NET Core for the back-end. The front-end allows users to manage tasks (add, edit, delete, and view tasks) while the back-end handles API requests and interacts with a SQLite database.

## Technologies Used
- **Frontend**: React, CSS
- **Backend**: ASP.NET Core, SQLite
- **Database**: SQLite

## Features
- Add, edit, delete, and view tasks.
- Task details include title, description, due date, and status (pending/completed).
- RESTful API to interact with tasks.

## Setup Instructions

### Frontend (React)
1. Open a terminal in the `TaskManagementFrontend` directory.
2. Install dependencies by running:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:7086`.

### Backend (ASP.NET Core)
1. Open a terminal in the `TaskManagementBackend` directory.
2. Ensure that you have .NET 6 or higher installed.
3. Run the following command to restore dependencies:
   ```bash
   dotnet restore
   ```
4. Start the backend server:
   ```bash
   dotnet run
   ```
   The backend will be available at `http://localhost:5106`.

### Database
The backend uses SQLite for storage, and the `TaskContext` is configured to use `tasks.db` as the database. The database will be created automatically upon the first run of the backend.

## File Structure
- `TaskManagementFrontend/`: Frontend application directory containing the React code.
- `TaskManagementBackend/`: Backend application directory containing the ASP.NET Core API code.
- `tasks.db`: SQLite database file.
- `README.md`: Project documentation.

## Testing

### Frontend Tests
Frontend tests are located in the `TaskManagementFrontend/src` directory. To run the tests:
```bash
npm test
```

### Backend Tests
Backend tests can be added in the `TaskManagementBackend` directory. To run the tests:
```bash
dotnet test
```

## Contributors
- Aryam Alshahrani
