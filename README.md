# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

Create a .dev.vars file in your project. It should look like this:-

ACCOUNT="<ACCOUNT ID>"
API_TOKEN="<API TOKEN>"

See Deploy section on where to get these values

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open

# Should only need to run once. This will create the DB in cloudflare. It will also print out the database_id which you need to copy the value of and paste into 
# the wrangler.json file under d1_database[0].database_id
npx wrangler d1 create gallery-db  

npx wrangler d1 execute "gallery-db" --local --file=./db/createdb.sql && npx wrangler d1 execute "gallery-db" --local --file=./db/testData.sql
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Deploy
You will need to run the following once:-

```bash
npx wrangler d1 execute "gallery-db" --remote --file=./db/createdb.sql
```

Next, you will need to run the following command, replacing items as required (use crypto.randomUUID() in the browser console to generate the UUID):-

```bash
npx wrangler d1 execute "gallery-db" --remote --command "INSERT INTO gallery VALUES ('e24a71a6-e832-461a-b151-a6eba449bb88', 'Playground Gallery', '2024-01-01', '2024-05-28', 'Australia/Sydney');"
```

Log into the cloudflare dashboard and go into:-
Compute (Workers) -> Workers and Pages -> cloudflare-hosted-gallery-app -> Settings

Add the following secrets:-

API_TOKEN 
ACCOUNT_ID

To see this, you will need to go to the cloudflare dashboard and go to Images -> Overview

NOTE: This may not be available until you pay for a subscription

Finally, after running build (see above) you will need to run:-

```bash
npx wrangler pages deploy .svelte-kit/cloudflare
```