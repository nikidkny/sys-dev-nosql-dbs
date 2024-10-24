# Database Course Winter 2024 NoSQL Project

## First time setup:

```bash
git clone https://github.com/Roman-Octavian/sys-dev-nosql-dbs.git
```

```bash
cd sys-dev-nosql-dbs
```

```bash
npm i
```

## Run locally:

```bash
# This will run both client and server concurrently. Both should have HMR enabled
npm run dev
```

## Completing a task

```bash
# making sure you're up to date
git checkout main
git pull origin main
```

```bash
# creating a feature branch
git checkout -b feature/new-task-name-goes-here
```

```bash
# Make your changes: add a new page, etc.
```

```bash
# Stage all your changes. Make sure you're root level
git add .
```

```bash
# Commit your changes, prettier will automatically format your code
git commit -m "commit-message-goes-here"
```

```bash
# Push to a new feature branch remotely
git push origin feature/new-task-name-goes-here
```

```bash
# Go to GitHub and make a new pull request from this branch into main.
# Request review from all 3 others, and wait for approval
# Once approved, click "Squash and merge" on the PR page
# Squash == Compress all commits into one
```

## Starting a new database

Change your `DATABASE_NAME` in your `.env` folder to the name of your new desired database name.

Then run:

```bash
npm run initialize-db
```

The above will use `server/database/schema.js` to populate the new database with predefined tables
and entries
