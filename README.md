# Bee Diary API

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)

This is the RESTfull API for the BeeDiary Application. It provides endpoints for managing blogs, posts, comments, user authentication, and more.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Dependencies](#dependencies)
- [License](#license)


## Installation

1. **Clone the repository:**

   ```shell
   git clone https://github.com/SergeyYurch/bee-diary-v1.0.git
   cd bee-diary-v1.0
   ```

2. **Install dependencies:**

   ```shell
   npm install
   ```

3. **Set up your environment variables by creating a `.env` file based on `.env.example`.**

4. **Start the development server:**

   ```shell
   npm run start:dev
   ```
## Features

The API provides various endpoints for interacting with blog posts, comments, user management, and more. Please refer to the API documentation or the code for detailed usage instructions.

You can also follow these general steps to get started:

1. **Authentication:**

    - Register a new user or log in with an existing account to obtain an access token.

2. **Blog and Post Management:**

    - Create, read, update, and delete blogs and posts using the respective API endpoints.

3. **Commenting System:**

    - Interact with posts by adding comments and replies.

4. **User Management:**

    - Manage user accounts, profiles, and preferences.

5. **Apiaries:**

    - Add new apiaries and mobile apiary points.

6. **Bee Families:**

    - Add bee families, and provide detailed descriptions of families.

7. **Work Journal:**

    - Keep track of work carried out in apiaries.

8. **Beekeeping:**

    - Maintain a record of queen bee breeding and management.

9. **Reference:**

    - Access various reference information.


Make sure to handle authentication and authorization properly to secure your API.

For more detailed usage instructions and API endpoints, please refer to the documentation or explore the codebase.

## Dependencies

The backend application relies on various third-party dependencies to operate smoothly. Below is a detailed list of these dependencies:

- **@nestjs/cqrs:** A module for implementing the CQRS pattern in NestJS.

- **@nestjs/jwt:** A module for JSON Web Token (JWT) authentication in NestJS.

- **@nestjs/swagger:** A module for generating Swagger documentation for NestJS APIs.

- **@nestjs/typeorm:** A module for integrating TypeORM with NestJS for database access.

- **argon2:** A library for secure password hashing.

- **bcrypt:** A library for secure password hashing.

- **class-transformer:** A library for transforming class instances and plain objects.

- **class-validator:** A library for object validation based on decorators.

- **cookie-parser:** A middleware for parsing cookies in Express.js.

- **date-fns:** A library for date and time manipulation.

- **ejs:** A template engine for rendering dynamic HTML templates.

- **handlebars:** A template engine for rendering dynamic templates.

- **hash.js:** A library for hashing data.

- **nodemailer:** A library for sending emails.

- **passport:** An authentication middleware for Node.js.

- **passport-google-oauth2:** A Passport.js strategy for Google OAuth 2.0.

- **passport-http:** A Passport.js strategy for HTTP authentication.

- **passport-jwt:** A Passport.js strategy for JWT authentication.

- **passport-local:** A Passport.js strategy for local authentication.

- **passport-oauth2:** A Passport.js strategy for OAuth 2.0.

- **pg:** A library for PostgreSQL database access.

- **pug:** A template engine for rendering dynamic templates.

- **reflect-metadata:** A library for introspecting metadata about classes.

- **rxjs:** A library for reactive programming.

- **typeorm:** An ORM for TypeScript and JavaScript (Node.js).

- **uuid:** A library for generating universally unique identifiers (UUIDs).


These dependencies enable various features and functionality within the application. Make sure to keep them up to date and handle any security updates as necessary.
