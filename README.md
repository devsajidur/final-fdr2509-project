# Mack Anthem

A Next.js website for Mack Trucks commercial fleet customers. Visitors can browse trucks, parts and service pages, and request quotes. Customers sign in to a dashboard, and an admin manages the requests.

## Tech

- Next.js (App Router), React, TypeScript
- Tailwind CSS
- Firebase (Authentication, Realtime Database, Firestore)

## Pages

| Route | What it is |
| --- | --- |
| `/` | Landing page |
| `/trucks`, `/parts`, `/service`, `/support` | Product and support pages |
| `/login`, `/register` | Customer sign in / sign up (email or Google) |
| `/dashboard` | Customer area: quotes, test drives, cost calculator, financing |
| `/admin` | Admin console, only for `admin@macktrucks.com` |

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in your Firebase values
npm run dev
```

Open http://localhost:3000.

## Firebase setup

1. Create a project in the Firebase Console and add a web app. Copy its config into `.env.local`.
2. Authentication → Sign-in method: enable **Google** and **Email/Password**.
3. Create a Realtime Database and a Firestore database.
4. Publish the rules in `database.rules.json` and `firestore.rules`:

   ```bash
   firebase deploy --only database,firestore:rules
   ```

5. Optional: add demo content to the database.

   ```bash
   npm run firebase:seed
   npm run firebase:seed:firestore
   ```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |
