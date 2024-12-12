# Lite.Space

This is the codebase behind [Lite.Space](https://Lite.Space).

## Getting started

The website is a simple [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). To run it locally you'll need Node.js 14.6.0 or newer. After cloning repository try following 3 commands in terminal:

- `npm run dev` for running a development instance with hot-reloading, file watching and task re-running
- `npm run build` for compiling the project.
- `npm start` for starting your app in production mode

If you start the website (either in development or production mode), you can access it on http://localhost:3000

## Codebase organization

- `data/projects` hosts Markdown files for all the projects listed on the Lite.Space website
- `data/tweets.json` hosts the tweets for all projects
- `utils` folder contains utility functions; `md.ts` is used for rending markdown content into pages using `/pages/projects/[slug].tsx`
  - `[slug].tsx` works by leveraging [getStaticPaths](https://nextjs.org/docs/basic-features/data-fetching/get-static-paths) and [getStaticProps](https://nextjs.org/docs/basic-features/data-fetching/get-static-props) functions
- the rest of the folders are standard for Next.js
  - `pages` contains files that correspond to individual pages on the website
  - `components` has common UI components used across the project
- all calls that work with secrets (talking to BTCPay and Stripe) are isolated in server side APIs
  - take a look at `pages/api/btcpay.ts` as an example

## Contributing to the project

PRs are welcome! Fork the repository on your GitHub account, push changes to new feature branch and then open a new pull request on [github.com/OpenSats/website/pulls](github.com/OpenSats/website/pulls).

Thanks for supporting OpenSats!

## Clear community twitter image cache

search and uncomment //&clearCache=true

## Start prisma

npx prisma studio

### Remove matched donation

Open prisma studio
Go to the matching donation log table
Update matchedAmount for the donation to 0

### Github

Token Expires on Sat, Dec 13 2025.
lite-space/applicants
