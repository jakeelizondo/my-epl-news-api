# Gift Closet (Node.js/Express Server)

View the live application at: https://my-epl-news.vercel.app/

Table of Contents:\
\
[Application Summary](#application-summary)\
[API Documentation](#api-documentation)\
[API Endpoints](#endpoints)\
[Developer Contact Info](#contact-developer)

## Application screenshot

![gmy epl news screenshot](https://raw.githubusercontent.com/jakeelizondo/my-epl-news-client/master/src/assets/screenshots/epl-news-screenshot.webp)

### Application Summary

My EPL News is a CRUD application built on Node.js, with Express and Knex as the primary libraries for server and database construction and integration. The application is designed to allow users to view the latest news for their favorite Premier League team, which is fetched 4 times daily from the News.org API. Registered users can also save articles to read later, and manage their list of saved articles, as well as their account information. There is also a graphql middleware with Apollo that allows graphql queries for specific team article content.

### Technology used

This application was built with Node.js, Express, Knex, GraphQL, and many smaller libraries to help with specific functions like security, authorization, etc.

#### To install locally

1. Clone github repo to your machine
2. Run command 'npm install' to install dependencies locally
3. Run command 'npm run dev' to start up server locally

## API Documentation

### Authorization

All API requests to protected endpoints require the use of a bearer token. You can generate a new one by submitting a successful POST request to the /api/login endpoint with a valid username and password.

To authenticate an API request, you should provide your bearer token in the `Authorization` header.

### Responses

Many API endpoints return the JSON representation of the resources created or edited. However, if an invalid request is submitted, or some other error occurs, the application will respond with a JSON response in the following format:

```javascript
{
  "error" : {"message": string}
}
```

The `message` attribute contains a message conveying the nature of the error.

### ENDPOINTS

Table of Contents:\
\
[Users Endpoints](#user-endpoints)\
[Auth Endpoints](#auth-endpoints)\
[Articles Endpoints](#articles-endpoints)\
[GraphQL Endpoints](#graphql-endpoint)\
[Status Codes](#status-codes)

---

#### User endpoints

```http
POST /api/user
```

| Body Key   | Type     | Description                          |
| :--------- | :------- | :----------------------------------- |
| `username` | `string` | **Required**. User desired username  |
| `password` | `string` | **Required**. User desired password  |
| `name`     | `string` | **Required**. User name              |
| `team`     | `string` | **Required**. User favorite EPL team |

\
\
\

```http
PATCH /api/user
```

| Body Key   | Type     | Description            |
| :--------- | :------- | :--------------------- |
| `username` | `string` | User desired username  |
| `password` | `string` | User desired password  |
| `team`     | `string` | User favorite EPL team |



```http
DELETE /api/user
```

Requires user to be logged in with JWT token in window storage.



```http
GET /api/user/articles
```

Returns a JSON response containing all user saved articles from database.



```http
POST /api/user/articles
```

| Body Key     | Type     | Description                                      |
| :----------- | :------- | :----------------------------------------------- |
| `article_id` | `number` | **Required**. Id of article to be saved for user |



```http
DELETE /api/user/articles
```

| Body Key     | Type     | Description                                        |
| :----------- | :------- | :------------------------------------------------- |
| `article_id` | `number` | **Required**. Id of article to be deleted for user |



#### Auth endpoints

```http
POST /api/auth/login
```

| Body Key   | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `username` | `string` | **Required**. User username |
| `password` | `string` | **Required**. User password |



#### Articles Endpoints

```http
GET /api/articles
```

Returns a JSON object containing all Everton articles from the database



```http
GET /api/articles/all
```

Returns a JSON object containing all articles for all teams from the database



```http
GET /api/articles/:teamCode
```

Returns a JSON object containing all articles for specified team from the database. Approved teamCodes can be found in https://github.com/jakeelizondo/my-epl-news-api/blob/master/src/TEAMS.js



#### GraphQL Endpoint

```http
POST /graphql
```

This server uses Apollo middleware to expose two types of GraphQL queries which work with the Articles type:

```graphql
type Articles {
  id: ID!
  team: String
  source: String
  author: String
  title: String
  description: String
  article_url: String
  image_url: String
  published_at: String
  content: String
}
```

## Query Syntax

Query ALL articles

```
query {
    articles {
        id
        team
        content
    }
}
```

This query will respond with a similar response to the following:

```
{
    "data": {
        "articles": [
            {
                "id": "354",
                "team": "LIV",
                "content": "Liverpool’s first-team squad are enjoying a day or two off, but soon it’s off to international duty for some players and a couple of weeks of training for others.\r\nSchalke striker on Reds’ radar\r\nOza… [+3116 chars]"
            },
        ]

    }
}
```



Query SPECIFIC TEAM articles

```
 query {
    teamArticles(team: "ARS") {
        id
        content
        source
    }
}
```

This query will respond with a similar response to the following:

```
{
    "data": {
        "teamArticles": [
            {
                "id": "370",
                "content": "Rangers striker Kemar Roofe says his only concern is winning and not receiving a guard of honour vs. Celtic.",
                "source": "ESPN"
            },
        ]
    }
}
```

---

### Status Codes

This API returns the following status codes:

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 201         | `CREATED`               |
| 400         | `BAD REQUEST`           |
| 404         | `NOT FOUND`             |
| 500         | `INTERNAL SERVER ERROR` |

---

#### Contact Developer

For questions/feedback or to discuss employment/project opportunities, contact the creator via email at jake.elizondo23@gmail.com
