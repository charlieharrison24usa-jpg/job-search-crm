# Job Search CRM

A local-first React + Vite CRM for tracking target companies, contacts, and outreach.

## Run Locally

```bash
npm install
npm run dev
```

## AI Message Editing

This app now includes an in-app AI Message Editor per contact.

### Required environment variable

Set this on your deployment platform:

- `OPENAI_API_KEY`

### Local development note

The AI endpoint is implemented as a serverless function at `api/generate-message.js`.
When using plain `npm run dev` (Vite only), that `/api` route is not served.

To test AI generation locally, use a platform runtime that supports serverless routes (for example, Vercel dev), or deploy to Vercel and test there.

## Deploy (Vercel)

1. Push your repo to GitHub.
2. Import the repo in Vercel.
3. Add environment variable `OPENAI_API_KEY` in Vercel project settings.
4. Deploy.

