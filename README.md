# BRF Insight Hub

Jag vill bygga första sidan i en prototyp för ett nytt digitalt förvaltningsverktyg för bostadsrättsföreningar (BRF).

VIKTIGT:

Detta är en prototyp. Bygg INTE ett komplett ekonomisystem.

Fokusera enbart på startsidan/översikten enligt instruktionen nedan.

SYFTE

Användaren är i första hand en styrelseledamot i en bostadsrättsförening, inte en ekonom eller fastighetstekniker.

Startsidan ska därför på några sekunder ge svar på:

1. Hur mår vår förening?

2. Hur mår vår fastighet?

3. Har något förändrats?

4. Finns det något vi bör vara uppmärksamma på?

5. Finns det något styrelsen behöver besluta om?

Designen ska göra komplex ekonomisk och teknisk information mycket enkel att förstå.

-----------------------------------

ÖVERGRIPANDE DESIGN

-----------------------------------

Skapa en modern, exklusiv och mycket ren skandinavisk SaaS-design.

Den ska kännas professionell och förtroendeingivande snarare än "techig".

Använd:

- vit eller mycket ljust varmgrå bakgrund

- tydliga kort/paneler

- mycket luft

- mjuka hörn

- diskreta skuggor

- modern sans-serif typography

- mörk text

- sparsamt med färg

Använd statusfärger:

Grön = normalt/bra

Gul = bör bevakas

Röd = kräver uppmärksamhet

Använd inte för många färger.

Undvik:

- plottriga dashboards

- stora mängder siffror

- bokföringskänsla

- Excel-känsla

- onödiga diagram

- tekniska systemvyer

Vi vill att även en styrelseledamot utan ekonomisk eller teknisk utbildning omedelbart ska förstå informationen.

-----------------------------------

SIDHUVUD

-----------------------------------

Överst:

BRF Exempel

Under namnet:

"Översikt över föreningens ekonomi och fastighet"

Till höger:

"Senast uppdaterad: idag"

Navigation:

Översikt

Ekonomi

Fastigheten

Underhåll

Styrelsemöte

Översikt ska vara markerad som aktiv.

De övriga sidorna behöver INTE byggas ännu.

-----------------------------------

SEKTION 1 – FÖRENINGEN I KORTHET

-----------------------------------

Rubrik:

"Föreningen i korthet"

Visa sex tydliga KPI-kort på en rad på desktop, responsivt på mindre skärmar.

KORT 1

Rubrik: Belåning

Värde: 5 220 kr/m²

Jämförelse: ↓ från 5 591 kr/m²

Status: grön

KORT 2

Rubrik: Sparande

Värde: 122 kr/m²

Jämförelse: ↓ från 134 kr/m²

Status: gul

KORT 3

Rubrik: Årsavgift

Värde: 777 kr/m²

Jämförelse: ↑ från 772 kr/m²

Status: neutral

KORT 4

Rubrik: Soliditet

Värde: 75,2 %

Jämförelse: ↑ från 73,1 %

Status: grön

KORT 5

Rubrik: Likvida medel

Värde: 4,5 Mkr

Jämförelse: ↑ från 3,2 Mkr

Status: grön

KORT 6

Rubrik: Energikostnad

Värde: 186 kr/m²

Jämförelse: ↓ från 191 kr/m²

Status: grön

VIKTIGT:

Status ska inte visas som stora färgade kort.

Använd färg mycket diskret, exempelvis en liten statusindikator eller markering.

-----------------------------------

SEKTION 2 – FASTIGHETEN

-----------------------------------

Detta ska vara startsidans visuella huvuddel.

Rubrik:

"Så mår fastigheten"

Undertext:

"Se ekonomi, status och utveckling för fastighetens olika delar."

Visa en stilren illustration av ett flerbostadshus/BRF-fastighet.

Fastigheten ska vara central och relativt stor.

Runt eller direkt på fastigheten ska följande områden visas:

Tak & fasad

Värme

El

VA

Hiss

Tvättstuga

Gemensamma utrymmen

Varje område ska ha en liten statusindikator.

Exempel:

Tak & fasad – gul

Värme – grön

El – grön

VA – gul

Hiss – gul

Tvättstuga – röd

Gemensamma utrymmen – grön

Dessa områden ska se klickbara ut.

Vid hover ska området markeras diskret.

Vid klick i denna första prototyp kan en enkel sidopanel öppnas med:

- namn på området

- status

- senaste kostnad

- kort kommentar

- knapp "Visa detaljer"

Vi bygger inte detaljsidorna ännu.

Fastighetsillustrationen är mycket viktig.

Den ska göra att användaren upplever att ekonomin är kopplad till den fysiska fastigheten.

Detta ska INTE kännas som ett vanligt ekonomisystem.

-----------------------------------

SEKTION 3 – AI-ANALYS

-----------------------------------

Placera en tydlig men lugn panel bredvid eller under fastigheten.

Rubrik:

"Det här bör styrelsen känna till"

Lägg gärna till en liten diskret AI-symbol, men skriv inte stora budskap om artificiell intelligens.

Visa tre insikter:

1.

GRÖN STATUS

"Belåningen fortsätter nedåt"

Text:

"Föreningens lån har minskat från cirka 19,3 Mkr år 2020 till cirka 14,9 Mkr år 2025."

2.

GUL STATUS

"Sparandet har minskat"

Text:

"Sparandet är 122 kr/m² jämfört med 304 kr/m² år 2023. Utvecklingen bör analyseras tillsammans med kommande underhåll."

3.

GRÖN STATUS

"Energikostnaden har minskat"

Text:

"Energikostnaden är 186 kr/m² jämfört med 217 kr/m² år 2023."

VIKTIG PRINCIP:

Systemet får inte låtsas veta orsaken till en förändring om data inte visar orsaken.

Skillnaden mellan fakta, analys och rekommendation ska vara tydlig.

-----------------------------------

SEKTION 4 – INFÖR NÄSTA STYRELSEMÖTE

-----------------------------------

Skapa en panel med rubriken:

"Inför nästa styrelsemöte"

Undertext:

"Frågor som kan behöva styrelsens uppmärksamhet."

Dela upp innehållet i tre kategorier:

INFORMATION

BEVAKA

BESLUT KRÄVS

Visa exempel:

INFORMATION

"Belåningen fortsätter minska."

BEVAKA

"Sparandet per m² har minskat och bör följas i relation till planerat underhåll."

BESLUT KRÄVS

"Tvättstuga – återkommande reparationskostnader. Utred om offert för utbyte bör tas in."

Gör "Beslut krävs" visuellt tydligast, men utan aggressiv röd varningsdesign.

-----------------------------------

SEKTION 5 – FRÅGA FÖRENINGEN

-----------------------------------

Längst ned ska det finnas ett enkelt AI-frågefält.

Rubrik:

"Fråga om föreningen"

Textfält med placeholder:

"Exempel: Varför har våra kostnader ökat?"

Lägg under fältet tre klickbara exempel:

"Vad driver våra energikostnader?"

"Vilka större underhållsåtgärder kommer de närmaste tre åren?"

"Hur har föreningens ekonomi utvecklats?"

Det behöver INTE finnas riktig AI bakom funktionen ännu.

När användaren skickar en fråga kan prototypen visa ett exempel på ett AI-svar.

-----------------------------------

VIKTIG PRODUKTPRINCIP

-----------------------------------

Hela sidan ska bygga på principen:

DATA → FÖRSTÅELSE → UPPMÄRKSAMHET → ÅTGÄRD → BESLUT

Vi ska inte bara presentera siffror.

Systemet ska hjälpa en BRF-styrelse att förstå:

"Vad betyder detta för oss?"

Fastigheten ska vara den visuella navet mellan ekonomi och teknik.

-----------------------------------

TEKNISKT FÖR PROTOTYPEN

-----------------------------------

Använd mock data för tillfället.

Bygg komponenterna så att data senare enkelt kan ersättas med riktig data från API/databas.

Separera därför data från UI-komponenterna.

Gör sidan fullt responsiv.

Skapa inga autentiseringsflöden, databaser, betalningar eller externa integrationer i detta steg.

Skapa inte de övriga navigationssidorna ännu.

Fokusera på att få Översikt visuellt och funktionellt mycket bra.

-----------------------------------

SLUTRESULTAT

-----------------------------------

När startsidan öppnas ska en BRF-styrelseledamot inom ungefär 10 sekunder kunna förstå:

- föreningens ekonomiska läge

- fastighetens övergripande status

- vilka områden som avviker

- vad som bör bevakas

- vad styrelsen kan behöva besluta om

Prioritera enkelhet och begriplighet framför mängden information.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/863e1631-eab3-4966-ab8a-9d608d39b88d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
