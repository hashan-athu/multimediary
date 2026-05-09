---
sidebar_position: 5
---

# Authentication

## Strategy

Admin authentication uses **Devise + devise-jwt**. JWTs are issued on login
and must be sent on every subsequent request as a `Bearer` token in the
`Authorization` header.

## Single-session enforcement

Only one active session per user is allowed at a time. The current JWT is
stored in `users.active_token`. A second login attempt while a valid token
exists returns `403 Forbidden`. Logout clears `active_token` and adds the
token to `JwtDenylist` for revocation.

## Login

```http
POST /api/v1/admin/login
Content-Type: application/json

{
  "user": {
    "email": "admin@example.com",
    "password": "yourpassword"
  }
}
```

**Response:** `200 OK`. The JWT is in the `Authorization: Bearer <token>` response header.
The frontend must read this header and store the token (e.g. `localStorage` or a secure cookie).

The `Authorization` header is exposed via CORS (`expose: ["Authorization"]`), so the
browser can read it cross-origin.

## Using the token

Send the token in the `Authorization` header on every admin request:

```http
GET /api/v1/admin/movies
Authorization: Bearer eyJhbGci...
```

## Logout

```http
DELETE /api/v1/admin/logout
Authorization: Bearer eyJhbGci...
```

This adds the token to `JwtDenylist` (permanent revocation) and clears `active_token`.

## Session reset (super_admin only)

```http
POST /api/v1/admin/sessions/reset_all
Authorization: Bearer <super_admin_token>
```

Revokes every active session across all users. Use in a security emergency.

## Token expiry

JWT expiry is configured in `backend/config/initializers/devise.rb`
via `jwt_expiration_time`. Expired tokens return `401 Unauthorized`.

## Rate limiting

Login attempts are throttled at **5 per minute per IP** by `rack-attack`.
Exceeding the limit returns `429 Too Many Requests` with a JSON body.
