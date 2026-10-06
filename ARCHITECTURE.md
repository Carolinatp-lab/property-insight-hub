# Arkitekturprincip

Plattformen är **oberoende av vilket ekonomisystem** föreningen använder.
Ekonomisystemet är en datakälla – inte kärnan i produkten.

```text
EKONOMISYSTEM A ─┐
EKONOMISYSTEM B ─┤
EKONOMISYSTEM C ─┤
SIE / FILIMPORT ─┤
FAKTURADATA ─────┘
        ↓
GEMENSAM INTERN DATAMODELL
        ↓
FASTIGHET + KOMPONENTER
        ↓
ANALYS
        ↓
ÖVERSIKT / EKONOMI / FASTIGHETEN / UNDERHÅLL / STYRELSEMÖTE
```

## Lager

| Lager | Plats | Regel |
| --- | --- | --- |
| 1. Extern rådata | `src/domain/sources.ts` | Sparas oförändrad. Får aldrig importeras av UI. |
| 2. Normaliserad intern data | `src/domain/model.ts` + `src/domain/adapters.ts` | Enda kontrakt som resten av appen känner till. |
| 3. Analys | `src/domain/analysis.ts` | Läser endast normaliserad data. |
| 4. Presentation / UI | `src/components`, `src/routes` | Läser analys eller mockdata i `src/data`. Aldrig källsystemformat. |

## Behåll originaldata

Varje normaliserad händelse (`LedgerEvent`) bär med sig `source` med källsystem,
originalkonto, verifikationsnummer, fakturanummer, leverantör, originalbeskrivning,
originalbelopp och originaldatum – samtidigt som den klassificeras enligt vår
egen struktur (ekonomisk kategori, fastighet, fastighetsdel, komponent,
händelsetyp, underhållsåtgärd).

Exempel:

```text
Extern bokföring        Intern klassificering
Konto: 5170             Kostnadstyp: Reparation
Belopp: 9 400 kr        Fastighetsdel: Tvättstuga
Leverantör: Exempel AB  Komponent: Tvättmaskin 2
                        Händelsetyp: Felavhjälpande underhåll
```

## Byte av ekonomisystem

Att lägga till Fortnox, Oqto, Visma, Björn Lundén, SIE-import eller CSV innebär
**endast en ny adapter** som uppfyller `EconomySourceAdapter`. Ingen ändring i
analys, fastighetsmodell eller användargränssnitt.

## Status i prototypen

Prototypen använder fortfarande mockdata i `src/data/*`. Inga API-integrationer,
SIE-import, databas, autentisering eller datasynkronisering är byggda. Domänlagret
är ett kontrakt som framtida funktionalitet ska följa.
