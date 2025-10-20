# Italo Connection

A Nuxt-based marketplace application for listings and rentals in Italy.

## Quick Links

- 📖 [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction)
- 🔐 [Admin Setup](./scripts/README.md) - Create admin users
- ☁️ [S3 Setup](./S3_SETUP.md) - Configure AWS S3 for image uploads

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Utility Scripts

The `/scripts` directory contains utility scripts for managing the application:

### Create Admin User

```bash
npx tsx scripts/create-admin.ts
```

Interactively creates a new admin user or upgrades an existing user to admin role. See [scripts/README.md](./scripts/README.md) for full documentation.

## Environment Variables

Required environment variables (see `.env.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `AWS_ACCESS_KEY_ID` - AWS access key for S3
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for S3
- `AWS_REGION` - AWS region (e.g., eu-north-1)
- `AWS_S3_BUCKET` - S3 bucket name
