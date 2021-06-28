## About
I wanted to create this project for when I wanted to start a nodejs project from scratch.

You will find a basic configuration with :
- NodeJS, 
- Sequelize (ORM Postgres, MySQL, MariaDB, SQLite...), 
- typescript, 
- Express, 
- Docker
- Winston
- Eslint
- Prettier
- CI/CD (CircleCi, Github action and deployment to AWS)

You will also find a sample api for signup, signin (with cookie and access token), logout and a user api.

## Table of contents

* [Structure](#structure)
* [Installing dependencies](#installing-dependencies)
* [Docker and postgresql](#Docker-and-postgresql)
* [Sequelize](#sequelize)
  * [Development](#development)
  * [Production](#production)
* [Running the application](#Running-the-application)
* [CI/CD](#CI-CD)
  * [Circle CI](#circle-ci)
  * [Github Action and AWS](#github-action-aws)
* [Testing](#CI-CD)
* [Bonus](#bonus)

## Structure

For large projects I use a structure in the form of components/modules which is easier to maintain than by Group your files by technical role.

[The example with the users module](https://github.com/jeaneay/startup-nodejs-large-structure/tree/master/src/modules/users)

In a module you will find :
- The model(s)
- The controllers
- Routes
- Tests (Not required)

And all other information about this module

## Installing dependencies

To install the dependencies run

```
npm install
```

### Docker and postgresql

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
Username: testing
Password: testing
```

## Sequelize

To create the connection between the Postgresql database and my nodejs app I use the Sequelize ORM which also works with MySQL, MariaDB, SQLite databases...
[The documentation](https://sequelize.org/)

The use of sequelize in development is not the same as in production because in production you have to use the [migration](https://sequelize.org/master/manual/migrations.html) for performance reasons.

### Development

For this project I use the synchronization for all models, to do this I created 2 files :

A file [load-model](https://github.com/jeaneay/startup-nodejs-large-structure/blob/master/src/config/database.ts) which allows to sync and create associations between models in the database.

And the file [create-model](https://github.com/jeaneay/startup-nodejs-large-structure/blob/master/src/config/database.ts) which is particular because for the synchronization of the models. 

Most of the time you will find the load-model file in the same folder where all models are stored but with a component/module structure the models are separated.

So I had to create a file that retrieves all the models automatically in each component/module to do this in each component/module you must have a folder named models where you store your models and it will create the model from the example file name:

```
forum-category.js -> ForumCategory 
```

The model will be named ForumCategory in the database if you want to change the name of the model in the database you can make the change in the file create-model


### Production

In production you must use the [migration](https://sequelize.org/master/manual/migrations.html) for performance reasons.

Please read the [documentation](https://sequelize.org/master/manual/migrations.html) to understand how it works.

To create tables or add data from a migration I added 3 commands in the package.json file.
```
"migrations:all": "npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all",
"migrations:table": "npx sequelize-cli db:migrate",
"migrations:seeds": "npx sequelize-cli db:seed:all",
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

## Testing

For the test part I use chai and mocha you will find an example in the /tests folder with unit tests.

```
"test": "tsc && cross-env NODE_ENV=test node_modules/.bin/mocha tests/**/**.test.js --timeout 60000",
"test:coverage": "tsc && cross-env NODE_ENV=test node_modules/.bin/nyc node_modules/.bin/mocha tests/**/**.test.js --timeout 60000"
```

The test command allows you to run tests without coverage and the test:coverage command allows you to run tests with Istanbul Code Coverage.

(Test e2e in progress with api user and authentication)


## Bonus

### Naming of new branch:

There are 3 types of naming for the branch :

- feature: Add new feature
- release: New release
- hotfix: Fix crtical bug
- bugfix: Fix bug
- chore: Clean code

Exemple : 
```
git checkout feature/new-api-tag/issue_id staging
git checkout hotfix/profile-page-error/621 staging
```
issue_id corresponds to issue id 

3) Source for github branch
[successful-git-branching-model](https://nvie.com/posts/a-successful-git-branching-model/)

## Commit

### Naming of new commit

1) There are several types of naming for the commit :

- feat:Add new feature
- fix: Fix bug
- ci: change for continous integration Circleci or codecov
- docs: Add change on the doc README...
- perf: Improve performance
- refactor: Change code, variable, delete code...
- test: Add or edit test
- revert: cancel previous commit
- chore: other change

2) We can add a scope (directory) :

- module name
- controller
- route
- middleware
- config
- service

3) And add subject :

- The subject be less than 50 characters
- Verb in infinitive (add, update, change, remove, etc.)
- The first letter should not be capitalized;
- The subject must not end with a period.

4) In description : 

We can add the link of issue if is github or notion ticket

Exemple:
```
feat(controller): add post's controller
fix(controller): use the correct HTTP code
refactor(repository): remove deprecated method
```
