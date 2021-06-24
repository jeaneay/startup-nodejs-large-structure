# omedema-backend
Startup NodeJs Large Structure



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
Username: omedema
Password: omedema
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
