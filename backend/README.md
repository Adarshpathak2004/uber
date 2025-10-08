# API Docs - User Authentication

## Environment
- **DB_CONNECT**: MongoDB URI
- **JWT_SECRET**: JWT secret

## POST /users/register
Creates a user & returns a JWT.

**Request**: POST /users/register
- Content-Type: application/json
- Body:
  ```json
  {
    "fullname": { "firstname": "string", "lastname": "string" },
    "email": "string",
    "password": "string"
  }
  ```
**Validation**: 
- fullname.firstname: required (min 3/5)
- email: valid, unique, min 10 chars
- password: min 6/8 chars

**Example**:
```bash
curl -H "Content-Type: application/json" -X POST http://localhost:4000/users/register \
-d '{"fullname":{"firstname":"Alice","lastname":"Smith"},"email":"alice@example.com","password":"strongPassword123"}'
```

**Responses**:
- **201**: { "user": { "_id": "<id>", "fullname": {"firstname":"Alice"}, "email": "alice@example.com" }, "token": "<jwt>" }
- **400**: { "errors": [{ "msg": "Invalid email format", "param": "email" }] }
- **409**: Duplicate email error

## POST /users/login
Authenticates user & returns a JWT.

**Request**: POST /users/login
- Content-Type: application/json
- Body:
  ```json
  { "email": "string", "password": "string" }
  ```

**Example**:
```bash
curl -H "Content-Type: application/json" -X POST http://localhost:4000/users/login \
-d '{"email":"alice@example.com","password":"strongPassword123"}'
```

**Responses**:
- **200**: { "user": { "_id": "<id>", "email": "alice@example.com" }, "token": "<jwt>" }
- **400/401**: Validation or unauthorized errors

## Notes
- Passwords are hashed before storage.
- Error handling: 409 for duplicate emails, 500 for other errors.
