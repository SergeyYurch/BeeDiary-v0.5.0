# Bee Diary App

## Overview

Bee Diary is an application designed for beekeepers, offering two main sections: the Beekeeper's Journal and a social network for apiarists. This application provides a platform for bee enthusiasts to record and share their beekeeping experiences.

## Features

### Beekeeper's Journal

- **Hive Management**: Users can record information about their beehives, including hive location, hive type, and bee colony details. This helps users keep track of their beekeeping operations.

- **Queen Bee Records**: Users can log information about queen bees, including details like the queen's age, breed, and year of introduction. This feature assists beekeepers in monitoring their queen bees' performance.

- **Work Log**: Beekeepers can maintain a work log to record all their activities related to beekeeping. This feature allows users to plan and organize their tasks effectively.

- **Event Planning**: Users can plan future events and tasks related to their beekeeping activities. The app offers tools to help beekeepers manage their schedule and sync events with specific bee colonies.

- **Mating Journal**: Beekeepers can maintain a journal specifically for tracking the mating of queen bees. This is crucial for monitoring breeding progress.

- **Notifications**: The app provides notification alerts for planned events and tasks to help users stay organized.

- **Visual Hive Layout**: Users can create a graphical representation of their apiary's layout, showing the arrangement of bee colonies in different locations.

### Social Network

- **User Authentication**: The app features user authentication using JWT and OAuth 2.0, ensuring secure access to the social network.

- **Post Creation**: Users can create and share posts with the beekeeping community, sharing their experiences, insights, and questions.

- **Commenting**: The social network allows users to comment on posts, fostering discussions and interactions among beekeepers.

- **Following**: Users can follow other beekeepers to stay updated with their posts and activities within the community.

- **Chat**: The app includes a chat feature, enabling direct communication between beekeepers for real-time discussions and knowledge sharing.

## Technology Stack

Bee Diary is built using the following technology stack:

- **Node.js**: The backend of the application is powered by Node.js, providing a scalable and efficient runtime environment.

- **NestJS**: A robust framework for building efficient and scalable server-side applications using TypeScript.

- **TypeORM**: An Object-Relational Mapping (ORM) library for TypeScript and JavaScript, used for database operations with PostgreSQL.

- **PostgreSQL**: A powerful open-source relational database management system, chosen for its reliability and scalability.

- **JWT (JSON Web Tokens)**: Used for secure user authentication and authorization within the application.

- **Jest and Supertest**: These testing frameworks ensure the reliability and correctness of the application's features through unit and integration tests.

## Getting Started

To start using Bee Diary, follow these steps:

1. Clone the repository to your local machine.

2. Install the required dependencies by running:

   ```bash
   npm install
   ```

3. Set up your PostgreSQL database and configure the database connection in the application.

4. Configure authentication methods, including JWT and OAuth 2.0, as per your requirements.

5. Run the application:

   ```bash
   npm start
   ```

6. Access the application through your preferred web browser.

7. Create an account or sign in to start using the Bee Diary app.

## Contributing

We welcome contributions from the beekeeping community and developers interested in improving Bee Diary. Please follow our [contribution guidelines](CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact us at sergey.yurchenko.art@gamil.com.

Happy Beekeeping! 🐝🍯
