## About
I wanted to create this project for when I wanted to start a nodejs project from scratch.

You will find a basic configuration with :
- NodeJS, 
- Prisma (ORM Postgres, MySQL, MariaDB, SQLite...), 
- typescript, 
- Express, 
- Docker
- Winston
- Eslint
- Prettier
- CI/CD (CircleCi, Github action and deployment to AWS)

## Table of contents

* [Structure](#structure)
* [Installing dependencies](#installing-dependencies)
* [Docker and Postgresql](#Docker-and-Postgresql)
* [Sequelize](#sequelize)
  * [Development](#development)
  * [Production](#production)
* [Running the application](#Running-the-application)
* [CI/CD](#CI/CD)
  * [Circle CI](#circle-ci)
  * [Github Action and AWS](#Github-Action-and-AWS)
* [Testing](#Testing)
* [Bonus](#bonus)

## Structure

For large projects I use a structure MVC (routes, controllers, services)

## Installing dependencies

To install the dependencies run

```
npm install
```

## Docker and Postgresql

I use docker locally to create the database in postgresql with the file Dockerfile
You need to install docker in your computer after that you can build and run your image with the file Dockerfile.

Buid your image :

Replace name_of_image by your name do you want for your image
(the dot at the end of command it's important !)
```
docker build -t name_of_image .
```
Run your image :
```
docker run -d -p 5432:5432 name_of_image
```
Active your DB with pgAdmin :
if you want to active your docker database with pgAdmin when you need to connect server you have to indicate for :
```
Host name/address : 127.0.0.1
Port : 5432
Maintenance database : postgres
Username: backend
Password: backend
```
## Running the application

Before to run app edit create the file `.env` with this configuration

```

# website
URL_API=http://127.0.0.1:8090

# env
NODE_ENV=development

# Port
LOCAL_APP_PORT=8090

#PASSWORD
SALT_PASSWORD=15

# PostgreSQL
LOCAL_DB_HOST=localhost
LOCAL_DB_NAME=localDB
LOCAL_DB_PORT=5432
LOCAL_DB_PASS=testing
LOCAL_DB_USER=testing

# Winston
FOLDER_ALL_LOG=logs/all/
FOLDER_EXCEPTIONS_LOG=logs/exceptions/
FOLDER_ERRORS_LOG=logs/errors/
FOLDER_HTTP_LOG=logs/http/
DEV_FILENAME_LOG=combined.log
DEV_FILENAME_EXCEPTION_LOG=exceptions.log
PROD_FILENAME_ERROR_LOG=logs/errors/errors.log
PROD_FILENAME_EXCEPTION_LOG=logs/exceptions/exceptions.log
PROD_FILENAME_OTHER_LOG=logs/all/combined.log
PROD_FILENAME_HTTP_LOG=logs/all/http.log

# JWT_TOKEN
JWT_SECRET=wr3r23fwfwefwekwself.2456342.dawqdq
JWT_EXPIRESIN=30m
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRESIN=259200
JWT_RESET_PASSWORD_SECRET=
JWT_RESET_PASSWORD_EXPIRESIN=1800
```

You can run:
```
npm run watch
```

Note that if you change the value of the `.env` file, you need to run `npm run watch` again so that the new env var changes are picked up.

## CI/CD

For continuous integration and continuous deployment I mainly use Circle CI and github action for deployment to AWS.

### Circle CI

For the continuous integration I use Circle CI you will find in the project an example of configuration in the .circleci folder and the config.yml file which allows to launch the tests automatically.

### Github Action and AWS

For the continuous deployment I use github actions with an example of configuration and deployment on an AWS server.
In the configuration file github/workflows/stating.yml you have to change 4 commands:


```
branches: [ name_of_your_branch ]
VERSION_LABEL: name_of_your_label-${{ github.run_id }}
application_name: name_of_your_application_aws
environment_name: name_of_your_environment_aws
```
Don't forget to add your environment variables in github for aws with the following names : 
```
AWS_ACCESS_KEY_ID: name of your access key id aws
AWS_SECRET_ACCESS_KEY : name of your secret access key aws
```
