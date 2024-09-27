# Task Management App

## Introduction

The Task Management App is a backend-only application designed to help users manage their tasks effectively. It allows users to create, update, delete, and view tasks while supporting features like comments, user authentication, and file uploads. The app utilizes Multer for handling task file uploads and Cloudinary for hosting user photos.

## Features

- User registration and login with JWT authentication.
- Create, read, update, and delete tasks.
- File uploads for tasks using Multer.
- Commenting on tasks to facilitate discussions.
- User photo upload functionality using Cloudinary.
- Error handling and input validation.
- Organized folder structure for easy maintenance.

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- Multer for task file uploads
- Cloudinary for photo uploads
- JSON Web Tokens (JWT) for authentication
- Express-validator for input validation
- AsyncHandler for handling asynchronous requests

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rami2507/advanced-task-management-app
   cd task-management-app
   ```

2. Install dependencies:
   open your terminal and run: npm start

3. Create a .env file in the root directory and set the following environment variables:
   DB_URI=<your-mongodb-uri>
   PORT=<your-app-port>
   CLOUDINARY_URL=<your-cloudinary-url>
   JWT_SECRET=<your-jwt-secret>
   JWT_EXPIRES_IN=<your-jwt-expires-in>

4. Run the app by using the command below:
   npm run start:prod
