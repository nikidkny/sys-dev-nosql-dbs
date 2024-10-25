# README for Docker Containerization

## Introduction

This document provides the steps to reproduce the containerization process and how to use the Docker-Compose file to run the application.

## Prerequisites

- Docker installed on your machine
- Docker-Compose installed on your machine

## Steps to Reproduce the Containerization Process

1. **Create a Dockerfile**

   - Create a file named `Dockerfile` in the root directory of your project.
   - Example content:
     ```Dockerfile
     FROM node:18
     WORKDIR /usr/src/app
     COPY package*.json ./
     RUN npm install
     COPY . .
     EXPOSE 8080
     CMD ["npm", "run", "dev"]
     ```
     - Use a Node.js base image that matches your local environment
     - Expose the port your app runs on

2. **Create a Docker-Compose File**

   - Create a file named `docker-compose.yml` in the root directory of your project.
   - Example content:

     ```yml
     services:
       mongo:
         image: mongo:6.0
         ports:
           - '27017:27017'
         volumes:
           - mongo-data:/data/db
         environment:
           MONGO_INITDB_DATABASE: ${DATABASE_NAME}
         networks:
           - app-network

       backend:
         build: .
         ports:
           - '8080:8080'
         environment:
           DATABASE_CONNECTION_STRING: ${DATABASE_CONNECTION_STRING}
           DATABASE_NAME: ${DATABASE_NAME}
           PORT: 8080
         depends_on:
           - mongo
         networks:
           - app-network
         volumes:
           - .:/usr/src/app

     volumes:
       mongo-data:
         driver: local

     networks:
       app-network:
         driver: bridge
     ```

## Running the Application

1. **Build and Start the Containers**

   - Run the following command to build and start the containers:
     ```sh
     docker-compose up --build
     ```

2. **Access the Application**

   - The application should now be running and accessible at:
     - Backend: `http://localhost:8080`
       - e.g.: `http://localhost:8080/api/v1/topic`
     - MongoDB: `mongodb://localhost:27017`
     - Frontend: `http://localhost:3000`

3. **Stopping the Containers**
   - To stop the containers, run:
     ```sh
     docker-compose down
     ```

## Environment Variables

Ensure you have a `.env` file in the root directory of your project with the following variables:

- DATABASE_CONNECTION_STRING=<your-mongodb-connection-string>
- DATABASE_NAME=<your-database-name>
- SECRET_KEY=<your-secret-key>

## Additional Notes

- The `docker-compose` file defines three services: `mongo`, `backend`, and `web`.
- The `mongo` service uses the official MongoDB image and exposes port `27017`.
- The `backend` service builds the backend application using the `Dockerfile` and exposes port `8080`.
- The `web` service exposes port `3000` and represents the frontend application.
- The `volumes` section ensures that MongoDB data is persisted across container restarts.
- The `networks` section defines a shared network for the services to communicate.
