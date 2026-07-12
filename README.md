# Luxe&Glow

Luxe&Glow is a Next.js storefront for saree browsing, authenticated wishlist usage, cart, and checkout.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and fill in your Firebase and Delhivery values.

3. Start the app:

```bash
npm run dev
```

4. Production validation:

```bash
npm run lint
npm run build
```

## Required Environment Variables

Client Firebase config:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

Server config:

- `DELHIVERY_TOKEN`

## Release Checklist

- Configure Firebase Authentication and Firestore rules for production.
- Add the production domain to Firebase Authentication allowed domains.
- Set all environment variables in your deployment platform.
- Run `npm run lint` and `npm run build` before deploying.
