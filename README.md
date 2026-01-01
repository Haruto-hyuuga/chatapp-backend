# chatapp-backend

A scalable backend for a modern real-time chat application, built with Node.js, TypeScript, Express, and PostgreSQL, with optional Google Gemini AI integration for AI-powered conversations.

This backend is designed with clean architecture, strong database constraints, and production-ready authentication and authorization flows.

# Frontend application
https://github.com/Haruto-hyuuga/chatapp


# API Overview 
| Method | Endpoint                              | Description                |
|--------|---------------------------------------|----------------------------|
| POST   | /auth/register                        | Register user              |
| POST   | /auth/login                           | Login user                 |
| GET    | /auth/validate                        | Validate JWT               |
| GET    | /contacts                             | Fetch contacts             |
| POST   | /contacts                             | Add contact                |
| GET    | /contacts/recent                      | Fetch recent contacts      |
| GET    | /conversations                        | Fetch conversations        |
| POST   | /conversations/check-or-create        | Create conversation        |
| GET    | /messages/:conversationId             | Fetch messages             |
| POST   | /gemini                               | AI chat endpoint           |

# Project Structure
```
src/
├── controllers/    # Request handling logic
├── routes/         # API route definitions
├── middlewares/    # Authentication and validation middleware
├── models/         # Database connection and setup
├── services/       # External services (Gemini, Imgbb, etc.)
├── utils/          # Logger and helpers
└── types/          # Global TypeScript type extensions
```

# INSTALLATION & PAKAGES 
### pakages:
- Node.js
- Express
- TypeScript
- PostgreSQL
- JWT (authentication)
- bcrypt (password hashing)
- Google Gemini AI
- pg (PostgreSQL client)

`npm install express bcrypt jsonwebtoken pg socket.io
`

### Typescript

```
npm install --save-dev \
  typescript \
  @types/node \
  @types/express \
  @types/bcrypt \
  @types/jsonwebtoken \
  @types/pg

```

`npm install -D tsx`

> using tsx instead of ts-node-dev

### TypeScript runtime

`npm install -D tsx`

## Add this in pakage.json

```
 "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
```

---

# Features

- JWT-based authentication (register, login, token validation)
- Secure protected routes using middleware
- One-to-one conversations
- Message storage and retrieval
- Contact management system
- AI chat integration using Google Gemini
- PostgreSQL database with strong relational constraints
- Clean logging system for development and production
- Ready for real-time extensions (Socket.IO)

---


# All Endpoints Controller Working 
### Register
- Hashes password using bcrypt
- Assigns a random default profile picture
- Stores user data in the database

### Login
- Verifies email and password
- Generates a JWT token (10-hour expiry)
- Returns user data along with the token


### Token Validation
- Verifies JWT signature and expiration
- Confirms the user still exists in the database

### Authentication Middleware
- Extracts JWT from the Authorization header
- Verifies token integrity
- Attaches decoded user data to req.user
- Blocks unauthorized requests automatically

### Contacts System
- Add contacts using email
- Prevents self-addition
- Prevents duplicate contacts
- Fetch all contacts
- Fetch recently added contacts

### Conversations
- Check or create a one-to-one conversation between users
- Fetch all conversations for a user
- Includes: Last message, Conversation participants
- Proper ordering by activity

### Messages
- Fetch all messages for a conversation
- Messages ordered by timestamp
- Persist messages in PostgreSQL
- Supports future real-time delivery

### Gemini AI Integration

- Sends user prompts to Google Gemini
- Stores a single interaction ID per user
- Maintains conversation continuity across messages
- Returns clean text-based AI responses
- AI chat behaves like a normal conversation thread

### Profile Pictures
- Random default profile picture assigned during registration
- Fallback image used for deleted or invalid accounts


# Database (PostgreSQL)
> for details read src/db/readme.md

### Tables
- users
- contacts
- conversations
- messages
- Features
- UUID primary keys
- Foreign key constraints
- Cascading deletes
- Indexed columns for performance
- Database-enforced integrity rules


# Logging System
- log()   → Development only
- warn()  → Development only
- error() → Always logged (production-safe)

