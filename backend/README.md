# POST /users/register (short)

Create a user and return a JWT.

Endpoint: POST /users/register
Content-Type: application/json

Request body (JSON):
{
  "fullname": { "firstname": "string", "lastname": "string" },
  "email": "string",
  "password": "string"
}

Quick validation notes: `fullname.firstname` required (route min 3 / model min 5), `email` must be an email, `password` min 6 (route) / 8 (model).

Example (curl):
curl -H "Content-Type: application/json" -X POST http://localhost:4000/users/register \
  -d '{"fullname":{"firstname":"Alice","lastname":"Smith"},"email":"alice@example.com","password":"strongPassword123"}'

Responses (examples):
- 201 Created
  { "user": { "_id": "<id>", "fullname": {"firstname":"Alice"}, "email":"alice@example.com" }, "token": "<jwt>" }
- 400 Bad Request (validation)
  { "errors": [ { "msg": "Invalid email format", "param": "email" } ] }
- 409 Conflict (duplicate email)
  { "error": "Email already in use", "code": 11000, "keyValue": { "email": "alice@example.com" } }

Notes:
- Set env vars: `DB_CONNECT` and `JWT_SECRET` before starting the server.
- Passwords are hashed; controller uses `userModel.hashPassword`.
- Consider aligning route and model validation to avoid unexpected 500s.

Testing: run server and use the curl example above.
