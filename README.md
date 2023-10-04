# CheckCredentials

This proxy service is a demonstration for Uitsmijter and it is used for documentation 
reasons. 

> Read the full article "Migrating a monolith application into microservices with 
single sign on" at https://docs.uitsmijter.io/interceptor/migrating_monolith/

This service takes credentials from a [Uitsmijter](https://uitsmijter.io) provider and 
validates it against an existing user database 
from [this](https://github.com/uitsmijter/example-todo-php-application) demonstration ToDo 
application.

## Commands

| command      | description                                           |
|--------------|-------------------------------------------------------|
| yarn install | installs all dependencies                             |
| yarn lint    | Check for dirty code that violates the coding style   |
| yarn test    | Runs all UnitTests                                    |
| yarn serve   | Runs the server locally                               |
| yarn docker  | Builds a docker image                                 | 

## Routes

```
POST **/validate-login**
```
Check if a user with a password is authenticated to log in. 

Request: 
```json
{ "username": "james@example.com", "password": "secret-password" }
```

Response:
```json
{
    "id": "1",
    "name": "James",
    "email": "james@example.com",
    "remember_token": false,
    "email_verified_at": "2023-10-09T12:29:29.244Z",
    "created_at": "2023-10-09T12:27:29.244Z",
    "updated_at": "2023-10-09T12:29:29.244Z"
}

```


```
POST **/validate-user**
```
Check if a user is still valid.

Request:
```json
{ "username": "james@example.com" }
```

Empty response with status code 200.
