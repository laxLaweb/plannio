# GDPR — udestående opgaver

Manuelle opgaver efter GDPR-implementeringen (juli 2026). Slet punkterne, eller flyt dem
til "Færdigt", efterhånden som de bliver lavet.

## Skal laves

- [ ] **Opret mailadressen `privacy@plannio.eu`**
  Adressen bruges som kontakt i privatlivspolitikken (`/privacy`), vilkårene (`/terms`)
  og i `docs/gdpr-fortegnelse.md`. Henvendelser om indsigt/sletning skal besvares inden
  for en måned (GDPR art. 12(3)).

- [ ] **Arkivér Herokus (Salesforce) databehandleraftale**
  Hent/gem en kopi af DPA'en fra
  <https://www.salesforce.com/company/legal/agreements/> sammen med den øvrige
  GDPR-dokumentation.

- [ ] **Håndhæv CSP efter test i produktion**
  `Content-Security-Policy-Report-Only` er sat i `server/index.js`. Efter deploy:
  test Discord- og Slack-login/webhook-popup-flowene, kig efter CSP-violations i
  browserkonsollen, og skift derefter headeren til `Content-Security-Policy`
  (håndhævet). Overvej COOP-headeren i samme omgang.

- [ ] **Deploy + migration i produktion**
  `git push heroku main` — `release`-fasen i `Procfile` kører selv migration
  `015_privacy.sql` (dropper `votes.voter_email`, tilføjer `polls.hide_voter_names`).
  Verificér bagefter at retention-jobbet logger uden fejl (`heroku logs --tail`,
  kig efter "Retention:").

- [ ] **Hvis analytics aktiveres:** vælg en EU-hostet, cookieless udbyder (fx Plausible
  EU eller selvhostet Umami), indgå/arkivér databehandleraftale, og tilføj udbyderen
  i privatlivspolitikken og i fortegnelsen — FØR `VITE_ANALYTICS_SCRIPT` sættes.

## Løbende

- [ ] Besvar henvendelser om sletning af anonyme stemmer manuelt — SQL-opskriften står
  i `docs/gdpr-fortegnelse.md`, afsnit 4.
- [ ] Gennemgå `docs/gdpr-fortegnelse.md` og `/privacy` årligt, og hold
  opbevaringsperioden i sync med `server/polls/retention.js` (pt. 12 måneder).
- [ ] Ved sikkerhedsbrud: følg proceduren i `docs/gdpr-fortegnelse.md`, afsnit 3
  (anmeldelse til Datatilsynet inden 72 timer).

## Færdigt

- [x] **EU-region bekræftet** — appen og Postgres kører i Herokus EU-region
  (bekræftet 10. juli 2026).
