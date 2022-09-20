# Now And Me Clone

> <Subtitle>
> Task for SDE - Backend Role at Now&Me

---

## Requirements

- User Authentication
- Create, Read, Delete Thoughts (Anonymous, Non-Anonymous)
- Create, Read, Delete Replies (Anonymous, Non-Anonymous)
- Any other user shouldn't able to identify who posted what anonymously

For the complete list of requirements, visit Now&Me's Github\
 [![DOCS](https://img.shields.io/badge/Now&Me%20GitHub-see%20requirements-black?style=flat-square&logo=github)](https://github.com/nowandme/backend-developer-task)

## Tech Stack

- Node.js
- MongoDB

## API Documentation

- API docs are hosted on Postman\
  [![DOCS](https://img.shields.io/badge/Documentation-see%20docs-green?style=flat-square&logo=postman)](https://documenter.getpostman.com/view/8339014/2s7Z12EP9t)

## Run With Docker

Make sure you have Docker installed.

```
$ git clone https://github.com/RajatSablok/now-and-me-clone.git
$ cd now-and-me-clone
$ docker-compose up -d --build
```

- Follow the API docs with [this base URL](http://localhost:5000/api/v1) to make requests.
- If running without docker, please copy variables from `.env.example` to `.env` file with appropriate values.

## Contributors

- <a href="https://github.com/RajatSablok">Rajat Sablok</a>
