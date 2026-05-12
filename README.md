# Manager App

A starter full-stack manager app using Node.js, Express, MongoDB, JWT authentication, and React.

## Structure

- `index.html` - root project landing file
- `server.js` - Express entry point and MongoDB connection
- `.env` - local environment values
- `routes/` - API route definitions
- `controllers/` - route logic
- `models/` - Mongoose schemas
- `middleware/auth.middleware.js` - JWT route protection
- `public/index.html` - React HTML shell
- `src/App.js` - React Router pages
- `src/api.js` - Axios API calls

## Setup

```bash
npm install
npm run dev
```

The backend runs on `http://localhost:5000`.
The React app runs on `http://localhost:3000`.

## Environment

Create or update `.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/manager
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
```

Do not commit `.env` to GitHub.

## GitHub Push

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```
