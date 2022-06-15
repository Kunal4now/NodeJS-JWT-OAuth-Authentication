
# NodeJS JWT-OAuth Authentication

A Web Application made using NodeJS and ExpressJS with MongoDB as a database which allows user authentication with email, password and social accounts as well.

## Local Setup

### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT` -> 3000 (or any other port)

`MONGODB_URI` -> MongoDB connecting string

`JWT_SECRET` -> can enter any generated string

`GOOGLE_CLIENT_ID` -> Unique client ID provided by google on creating credentials.

`GOOGLE_LOGIN_URI` -> 'http://localhost:3000/auth/google/login' by default but need to change in production

`GOOGLE_LOGIN_URL`-> 'http://localhost:3000/login' can use this but need to change in production

`NODE_ENV` -> 'development' for local setup

`LOGIN_URL`-> 'http://localhost:3000/auth/login', will change in production

`SIGNUP_URL` -> 'http://localhost:3000/auth/signup', will change in production
