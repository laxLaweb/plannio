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
heroku config:set APP_URL=https://din-app.herokuapp.com
```

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
| `npm run build` | Bygger React til `client/dist/` |
| `npm run db:migrate` | Kører database-migrationer |
| `npm start` | Starter produktionsserver |

## Heroku deployment

```bash
heroku create plannio-app --region eu
heroku addons:create heroku-postgresql:essential-0
heroku config:set NODE_ENV=production
git push heroku main
```

Heroku kører automatisk `npm install`, `heroku-postbuild` (bygger React) og starter serveren via `Procfile`.
