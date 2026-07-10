# GDPR-dokumentation for Plannio

Senest opdateret: 9. juli 2026. Hold dette dokument i sync med `/privacy`-siden og
`server/polls/retention.js` (opbevaringsperiode).

## 1. Fortegnelse over behandlingsaktiviteter (art. 30)

**Dataansvarlig:** Plannio · kontakt: privacy@plannio.app

| # | Aktivitet | Kategorier af registrerede | Kategorier af oplysninger | Formål | Retsgrundlag | Opbevaring | Modtagere |
|---|-----------|---------------------------|---------------------------|--------|--------------|------------|-----------|
| 1 | Brugerkonti | Registrerede brugere | Email, visningsnavn, profilbillede-URL, password-hash (scrypt) | Login og identifikation | Kontrakt, art. 6(1)(b) | Til brugeren sletter kontoen | Heroku (databehandler) |
| 2 | OAuth-identiteter | Registrerede brugere | Discord-/Slack-bruger-ID | Social login og kontosammenkædning | Kontrakt | Til kontosletning | Heroku; Discord/Slack (selvstændigt dataansvarlige) |
| 3 | Afstemninger og stemmer | Brugere og anonyme deltagere | Deltagernavn, valgte datoer | Finde et tidspunkt, der passer gruppen | Kontrakt / legitim interesse, art. 6(1)(f) | 12 mdr. efter seneste aktivitet (automatisk sletning) eller ved manuel sletning | Heroku; alle med poll-linket |
| 4 | Kanal-notifikationer | Deltagere i polls med tilsluttet kanal | Deltagernavn, valgte datoer | Poll-opdateringer i gruppens kanal | Kontrakt; oplyses på afstemningssiden | Ligger herefter hos Discord/Slack | Discord/Slack (selvstændigt dataansvarlige) |
| 5 | Sessioner | Registrerede brugere | Session-ID, bruger-ID | Holde brugeren logget ind | Nødvendig for tjenesten | 30 dage; udløbne sessioner slettes automatisk hver time | Heroku |
| 6 | Analytics (kun hvis aktiveret) | Besøgende | Aggregeret, cookieless trafikdata | Trafikstatistik | Legitim interesse | Iht. udbyderens aftale | Analytics-udbyder (databehandler) |

**Tekniske og organisatoriske foranstaltninger (art. 32):** HTTPS/HSTS, scrypt-hashede
passwords, httpOnly/secure/sameSite session-cookies med regenerering ved login, rate
limiting på login-endpoints, parameteriseret SQL, security headers inkl. CSP
(Report-Only under indfasning), hosting og database i Herokus EU-region, automatisk
sletning af gamle polls og udløbne sessioner.

## 2. Databehandlere og aftaler — tjekliste

- [x] **Heroku EU-region:** Bekræftet — appen og Postgres-add-on'et kører i EU-regionen
      (bekræftet 10. juli 2026).
- [ ] **Heroku (Salesforce) DPA:** Salesforces databehandleraftale accepteres automatisk
      via Master Subscription Agreement — arkivér en kopi fra
      https://www.salesforce.com/company/legal/agreements/
- [ ] **Analytics (hvis det aktiveres):** Vælg en EU-hostet, cookieless udbyder (fx
      Plausible EU eller selvhostet Umami). Indgå/arkivér databehandleraftale før
      `VITE_ANALYTICS_SCRIPT` sættes i produktion.
- [ ] **Discord/Slack:** Ikke databehandlere, men selvstændigt dataansvarlige for data i
      deres kanaler. Kræver ingen aftale, men er oplyst i privatlivspolitikken.

## 3. Procedure ved brud på persondatasikkerheden (art. 33-34)

1. **Opdag og inddæm.** Stop lækagen (rotér `SESSION_SECRET`, OAuth-secrets og
   database-credentials via `heroku config:set`; rul kompromitteret kode tilbage).
2. **Vurdér inden for 24 timer.** Hvilke data er berørt (emails? navne? stemmer?),
   hvor mange registrerede, og hvad er risikoen for dem? Notér alt i en log —
   dokumentationspligten gælder også brud, der ikke anmeldes.
3. **Anmeld til Datatilsynet inden 72 timer** fra kendskab, medmindre det er
   usandsynligt, at bruddet indebærer en risiko for de registrerede.
   Anmeldelse: https://www.datatilsynet.dk (Virk-blanket).
4. **Underret de berørte** uden unødig forsinkelse, hvis der er høj risiko for dem
   (fx lækkede emails + password-hashes).
5. **Evaluér.** Hvad var årsagen, og hvilke foranstaltninger forhindrer gentagelse?

## 4. Håndtering af henvendelser fra registrerede

- **Indsigt/eksport:** Brugeren gør det selv via kontosiden ("Download my data").
- **Sletning af konto:** Brugeren gør det selv via kontosiden ("Delete my account").
- **Sletning af anonyme stemmer:** Kræver manuel håndtering — find stemmen via
  poll-slug og navn og slet den i databasen:
  `DELETE FROM votes WHERE user_id IS NULL AND lower(trim(voter_name)) = lower('<navn>') AND poll_option_id IN (SELECT o.id FROM poll_options o JOIN polls p ON p.id = o.poll_id WHERE p.slug = '<slug>');`
- **Svarfrist:** Senest en måned efter modtagelse (art. 12(3)).
