# cloudify-auth

Full-stack authentication service with **email/password login** and **Google OAuth**. Includes backend (Node.js/Express) and frontend (React) with optional Docker support.

---

## Project Structure
```
cloudify-auth/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── node_modules/
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── my-app/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── key.env
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── start-second.js
│   └── vite.config.js
```
---

## Technologies

- **Backend:** Node.js, Express, JWT, Bcrypt, Passport.js (Google OAuth), MongoDB/PostgreSQL  
- **Frontend:** React, React Router, Axios, @react-oauth/google  
- **Tools:** Docker, Docker Compose, Nodemon  

---

## Setup

### Backend

```bash
cd backend
npm install
nodemon server.js
```

### Frontend

```bash
cd my-app
npm install
npm start
```
---
