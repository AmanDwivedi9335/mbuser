# Medivault

Production-grade SaaS foundation for a secure, multi-profile family health vault built with Next.js App Router.

## Phase 1 complete

- Next.js App Router + TypeScript + Tailwind CSS baseline
- Feature-based folder architecture under `src/`
- Environment variable template via `.env.example`
- Prisma + MySQL initial schema (`User`, `Household`, `Profile`) with scalable membership model
- Shared Prisma client singleton for server runtime safety

## Project structure

```txt
src/
  app/
    (auth)/
    onboarding/
    dashboard/
    api/
  features/
    auth/
    profiles/
    records/
    medications/
    appointments/
    vitals/
    insurance/
    sharing/
    notifications/
    security/
  lib/
    db/
    firebase/
    drive/
    encryption/
    pdf/
    utils/
    validations/
  components/
    ui/
    shared/
  types/
prisma/
```

## Local setup

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Push the Prisma schema to your database (required before auth routes can write/read users):

```bash
npm run prisma:push
```

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Run the app:

```bash
npm run dev
```
