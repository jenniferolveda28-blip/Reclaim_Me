# Reclaim Me

A security and identity-protection platform covering threat detection, auditor access, identity verification and personal-data exposure removal. The repo carries 128+ page-level screens and 36 entities, so it is the largest of the Base44 apps here.

Built as a Base44 app, two-way synced with the Base44 Builder.

## Stack

- React + Vite (JavaScript), Tailwind CSS, shadcn-style components
- Base44 SDK for auth, entities and functions
- ESLint (`npm run lint`, `npm run lint:fix`)

## Run locally

```bash
git clone <repo-url>
cd reclaim-me
npm install
npm install -g base44@latest
base44 dev
