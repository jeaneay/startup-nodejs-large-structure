### About
Starting a large nodejs structure with NodeJS, Sequelize, typescript, Express, winston...

## Installing dependencies

To install the dependencies run

```
npm install
```

## Running the application locally with local env vars

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

### Active postgresql database with docker:

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

## Branch

### The branches:

We have 2 main branch :

- master : branch for production Server
- staging : branch for development Server

Never merge or pull request on master from another branch than staging
Pull request on staging for test in pre-production and after that pull request on master

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

We create the new branch from staging branch

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
