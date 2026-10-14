# Mack Anthem

Marketing and fleet-management site for the Mack Anthem highway truck. Visitors can browse trucks, genuine parts, service plans and dealer support, and request quotes, test drives or service appointments. Customers sign in to a personal dashboard, and administrators manage incoming requests.

## Features

- Multi-page site: landing page, trucks and MP8 engines, parts catalog with category filters, service and warranty, support with dealer directory, FAQ and contact form
- Quote, contact and test-drive requests stored in Firestore
- Customer dashboard: own quotes and test drives, cost-of-ownership calculator, financing estimator
- Admin console: quotes pipeline, test-drive bookings, live editing of site specifications
- Email/password and Google sign-in (Firebase Authentication)
- Responsive layout with a mobile bottom navigation bar

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4
- Firebase: Authentication, Cloud Firestore, Realtime Database

## Getting started

Requirements: Node.js 20 or newer and a Firebase project.

```bash
npm install
cp .env.example .env.local   # fill in your Firebase web app values
npm run dev
```

The app runs at http://localhost:3000.

### Environment variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | Realtime Database URL |
| `NEXT_PUBLIC_DEMO_ADMIN` | Set to `false` to hide the one-click demo admin login |

Without Firebase credentials the site still renders, using bundled content and browser storage.

## Firebase setup

1. Create a Firebase project and register a web app.
2. Enable the **Google** and **Email/Password** sign-in providers.
3. Create a Firestore database and a Realtime Database.
4. Deploy the security rules:

   ```bash
   firebase deploy --only firestore:rules,database
   ```

5. Optionally seed the site content:

   ```bash
   npm run firebase:seed
   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=... npm run firebase:seed:firestore
   ```

### Access control

- Customers can create requests and read only their own records.
- Administrators can read and manage everything. An administrator is a user whose `users/{uid}` document has `role: 'admin'`, or an email on the allowlist in `src/lib/adminAccess.ts` and `firestore.rules`.
- The one-click demo admin on `/login` and `/admin` is meant for demos. Set `NEXT_PUBLIC_DEMO_ADMIN=false` and remove `admin@macktrucks.com` from the allowlist before production use.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `node scripts/set-admin-role.js <email> <password>` | Grant the admin role to an account |

## Project structure

```
src/
  app/          Routes: /, /trucks, /parts, /service, /support, /login, /register, /dashboard, /admin
  components/   Layout, page content, modals, admin and dashboard panels, UI blocks
  context/      Auth provider
  data/         Static site and catalog content
  lib/          Firebase client, Firestore helpers, admin allowlist
scripts/        Seed and admin utilities
firestore.rules, database.rules.json, firebase.json   Firebase configuration
```
