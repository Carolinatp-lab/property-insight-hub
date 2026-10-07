# Avtal & leverantörer

Gemensamma komponenter återanvänds i fastighetsägar- och BRF-projekten. Navigationen har en ny sida **Avtal & leverantörer** med två flikar.

- **Avtalsmallar:** fem exempelunderlag anpassade till modulen, visning och nedladdning. Egna PDF-, DOCX- och TXT-mallar upp till 10 MB kan registreras med namn, kategori, version och versionsdatum. Egna dokument laddas ned till dokumentläsaren; prototypen renderar inte PDF eller Word.
- **Leverantörer:** sex exempel på yrkesområden, kontaktuppgifter, jour, geografiskt område, berörda fastigheter, prioritering, avtalstid och anteckningar. Sökning och filter på yrkesområde och prioritering. Egna leverantörer kan läggas till och redigeras.
- **Underhåll:** välj ansvarig leverantör för fastighetens åtgärder och markera uppdrag utfört. Leverantören sparas som en historisk kopia och visas bland tidigare uppdrag i leverantörskortet. Ändrade företagsnamn skriver inte om gamla uppdrag. Fastighetsägarens objektsjournaler kan också koppla leverantör till planerade åtgärder och utförda logghändelser.

Fastighetsvalet i fastighetsägarversionen begränsar leverantörsregistret och underhållsåtgärderna. BRF-versionen använder föreningens exempelfastighet. Exempelunderlagen ersätts med organisationens egna avtalsmallar.

## Lagring

Register, mallfiler och uppdrag sparas i IndexedDB i samma webbläsarprofil och webbplatsadress. Modulnycklarna `owner` och `brf` är separata. Data delas inte mellan enheter eller användare. Rensad webbplatslagring tar bort uppgifterna. Serverlagring, gemensamma behörigheter, säkerhetskopiering, avtalsunderskrift och automatisk bevakning ingår inte i prototypen.

## Verifiering

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

Återanvändbart Chromium-test för uppladdning/nedladdning, register, filter, utförarhistorik, omladdning och mobilbredd:

```sh
PLAYWRIGHT_MODULE=/sokvag/till/playwright/index.mjs \
BROWSER_EXECUTABLE=/sokvag/till/chromium \
TEST_BASE_URL=http://127.0.0.1:8083 \
MANAGEMENT_MODE=owner \
SCREENSHOT_DIR=work/management-artifacts \
node tests/management.browser.mjs
```

För BRF används `MANAGEMENT_MODE=brf` och BRF-serverns port. `playwright` och dess Chromium kan också installeras separat och miljövariablerna för deras sökvägar utelämnas. Testet körs mot en startad utvecklingsserver; produktionsbygget verifieras separat.

Skärmbilder finns i `docs/screenshots/avtalsmallar.png`, `leverantorer.png`, `underhall-leverantor.png` och `avtal-mobil.png`.
