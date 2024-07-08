# RecruitCRM Assignment

# Project Structure

- `main` - This folder contains the core service responsible for handling user
authentication and authorization using JWT.

- `microservice` - The microservice folder provides a public API key that can be used to access main service routes without needing to login with credentials. (With the help of api key).

Both of the folder contains `Dockerfile` that are used to containerize the  application so that they can run with all required dependencies in a controlled environment.

The project is contains a `docker-compose.yml` file that will properly setup the entire environment for the project along with the `env` variables required to run each service.

`database_dump.sql` contains test data that was used for testing the project. 
## Running the program
The program supports running the program in both docker containers and using node directly.

However its recommended to use [Docker](https://www.docker.com/) along with [Docker Compose](https://docs.docker.com/compose/) to run the application as it'll properly setup the project and its environment.
### Using Docker & Docker Compose

Both of the projects `main` & `microservice` contains a `Dockerfile` which will properly setup the required environments.

```bash
$ pwd
~/Desktop/recruitcrm
$ docker compose up -d --build
# The service will automatically startup
...
$ docker compose down # Use this command to shutdown the service
```

The above commands will properly setup the environment for microservice and core service along with the postgresql database.

**NOTE**: The `main` service will start at `localhost:3000` by default unless a `PORT` environment variable is provided and the `microservice` will start at `localhost:3030`

### Manually Running the Application
Both folders contain an `.env.example` file which mentions the required environment variables without which the application will crash so make sure to provide those environment variables by either using a `.env` file or setting a system-wide `env` variable.
#### Main Service

This service will start at the port defined in `PORT` env variable which defaults to `3000` and can be accessed as `localhost:3000/`. This service requires C++ node-gyp bindings for compiling bcrypt so make sure you have C++ build tools that are accessible by nodejs.

```bash
$ cd main
$ npm install
$ npm run build
$ node .
```

#### Microservice
This service will start at the port defined in `PORT` env variable which defaults to `3030` and can be accessed as `localhost:3030/`.
```bash
$ cd microservice
$ npm install
$ npm run build
$ node .
```