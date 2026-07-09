# Plannio

Node.js API med React frontend – klar til deployment på Heroku.

## Projektstruktur

```
plannio/
├── client/              # React frontend (Vite)
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/              # Express API
│   ├── db/              # PostgreSQL connection + migrationer
│   │   ├── migrations/
│   │   ├── index.js
│   │   └── migrate.js
│   ├── routes/
│   └── index.js
├── environment.yml      # Conda/miniconda environment
├── Procfile             # Heroku process definition
├── package.json         # Root – server + build scripts
└── .env.example
```

## Kom i gang

### 1. Opret conda environment

```bash
conda env create -f environment.yml
conda activate plannio
```

### 2. Installer dependencies

```bash
npm install
```

### 3. Konfigurer miljøvariabler

```bash
cp .env.example .env
```

### 4. Start udvikling

```bash
npm run dev
```

- Frontend: http://localhost:3000
- API: http://localhost:5000/api/health

## Database (Heroku Postgres)

Projektet bruger [Heroku Postgres](https://elements.heroku.com/addons/heroku-postgresql). Add-on'et provisionerer automatisk `DATABASE_URL` – ingen kodeændringer nødvendige.

### Heroku

```bash
heroku create plannio-app --region eu
heroku addons:create heroku-postgresql:essential-0 -a plannio-app
heroku config:get DATABASE_URL -a plannio-app
git push heroku main
```

Ved deploy kører `release`-fasen i `Procfile` migrationer automatisk, før web-dynoen starter.

### Lokal udvikling

Kræver en lokal PostgreSQL-instans. Tilføj connection string i `.env`:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/plannio
npm run db:migrate
```

### Database-tabeller

| Tabel | Formål |
|-------|--------|
| `polls` | Møde-afstemninger |
| `poll_options` | Foreslåede tidspunkter |
| `votes` | Deltager-stemmer |
| `users` | Brugerkonti |
| `user_identities` | OAuth-koblinger (Discord, Google, Apple) |
| `session` | Login-sessioner |
| `schema_migrations` | Migration tracking |

## Login (OAuth)

Plannio understøtter social login via OAuth2 – samme princip som "Log ind med Google/Apple":

| Provider | Status |
|----------|--------|
| **Discord** | Klar |
| **Slack** | Klar |
| Google | Planlagt |
| Apple | Planlagt |

### Discord opsætning

1. Opret en app på [Discord Developer Portal](https://discord.com/developers/applications)
2. Under **OAuth2** → tilføj redirect URL:
   - Lokal: `http://localhost:5000/api/auth/discord/callback`
   - Heroku: `https://din-app.herokuapp.com/api/auth/discord/callback`
3. Kopiér Client ID og Client Secret til `.env`:

```bash
SESSION_SECRET=generer-en-lang-tilfaeldig-streng
DISCORD_CLIENT_ID=din-client-id
DISCORD_CLIENT_SECRET=din-client-secret
DISCORD_REDIRECT_URI=http://localhost:5000/api/auth/discord/callback
APP_URL=http://localhost:3000
```

4. Kør migrationer og start appen:

```bash
npm run db:migrate
npm run dev
```

Login-siden er på http://localhost:3000/login

### Heroku

```bash
heroku config:set SESSION_SECRET=din-hemmelige-streng
heroku config:set DISCORD_CLIENT_ID=din-client-id
heroku config:set DISCORD_CLIENT_SECRET=din-client-secret
heroku config:set DISCORD_REDIRECT_URI=https://din-app.herokuapp.com/api/auth/discord/callback
heroku config:set DISCORD_WEBHOOK_REDIRECT_URI=https://din-app.herokuapp.com/api/integrations/discord/callback
heroku config:set SLACK_CLIENT_ID=din-client-id
heroku config:set SLACK_CLIENT_SECRET=din-client-secret
heroku config:set SLACK_REDIRECT_URI=https://din-app.herokuapp.com/api/auth/slack/callback
heroku config:set SLACK_WEBHOOK_REDIRECT_URI=https://din-app.herokuapp.com/api/integrations/slack/callback
heroku config:set APP_URL=https://din-app.herokuapp.com
```

Husk at tilføje de samme callback-URL'er i Discord Developer Portal og Slack App-indstillingerne. Når du skifter til et custom domain, skal alle URL'er ovenfor opdateres.

## Discord-opdateringer (webhook)

Ud over login kan en poll sende opdateringer direkte til en Discord-kanal. Dette bruger Discords
`webhook.incoming` OAuth-flow – **ingen bot skal inviteres**. Under oprettelsen klikker brugeren
"Forbind Discord-kanal", vælger en kanal i Discords popup, og Plannio får en webhook retur, som
beskeder sendes til.

Opsætning (samme Discord-app som login):

1. Under **OAuth2** → tilføj endnu en redirect URL:
   - Lokal: `http://localhost:5000/api/integrations/discord/callback`
   - Heroku: `https://din-app.herokuapp.com/api/integrations/discord/callback`
2. Sæt `DISCORD_WEBHOOK_REDIRECT_URI` i `.env` (se `.env.example`).

Understøttede hændelser: afstemning oprettet (aktiv nu), ny stemme, tidspunkt låst og påmindelser
(aktiveres når afstemninger kan besvares).

## Scripts

| Script | Beskrivelse |
|--------|-------------|
| `npm run dev` | Starter både server og client med hot reload |
| `npm run dev:server` | Kun Express API |
| `npm run dev:client` | Kun React dev server |
| `npm run build` | Optimerer OG-billede, genererer sitemap/llms.txt, bygger React til `client/dist/` |
| `npm run prerender` | Prerenderer offentlige sider til statisk HTML (kører automatisk på Heroku) |
| `npm run db:migrate` | Kører database-migrationer |
| `npm start` | Starter produktionsserver |

Kræver **Node 20+** (se `engines` i root `package.json`). Sæt `SKIP_PRERENDER=1` for at springe prerender over lokalt.

## SEO og indholdssider

Offentlige marketing-sider (indexeres, prerenderes på deploy):

| Route | Indhold |
|-------|---------|
| `/` | Landing page |
| `/discord-scheduling`, `/slack-scheduling` | Integrationsguider |
| `/use-cases/*` | Use cases (weekend trip, team meetings, game night) |
| `/guides/*` | How-to guides |

Kilde til routes: `scripts/public-routes.mjs` (bruges af sitemap, llms.txt og prerender).

Slack OAuth opsættes som Discord — se `.env.example` for `SLACK_*` variabler.

## Heroku deployment

```bash
heroku create plannio-app --region eu
heroku addons:create heroku-postgresql:essential-0
heroku config:set NODE_ENV=production
git push heroku main
```

Heroku kører automatisk `npm install`, `heroku-postbuild` (bygger React) og starter serveren via `Procfile`.
