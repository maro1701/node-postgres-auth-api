# node-postgres-auth-api

A secure and scalable **Todo REST API** built with **Node.js, Express, PostgreSQL**, and **JWT authentication**.

This project demonstrates solid backend fundamentals, including:

- Authentication & authorization (JWT)
- Secure password hashing with bcrypt
- Protected routes using middleware
- Input validation with Zod schemas
- Cursor-based pagination
- Filtering using PostgreSQL `ILIKE`
- Soft deletes and restore functionality
- Centralized error handling
- Environment-based configuration

> Environment variables are managed using an `.env` file (not committed to the repository).

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT
- bcrypt
- Zod
- pg (node-postgres)

---

## Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/maro1701/node-postgres-auth-api.git
cd node-postgres-auth-api
