// Mock-data för fastighetsdelen "Värme & ventilation".
// All data i denna fil är exempeldata i prototypen.

import type { Status } from "./overview";

export const energyKpis: { label: string; value: string; note: string }[] = [
  { label: "Energikostnad", value: "186 kr/m²", note: "↓ från 191 kr/m²" },
  { label: "Total kostnad", value: "1 488 000 kr", note: "Senaste 12 månaderna" },
  { label: "Energiförbrukning", value: "118 kWh/m²", note: "↑ 1 % mot föregående period" },
  { label: "Inomhustemperatur", value: "20,6 °C", note: "Genomsnitt" },
  { label: "Fjärrvärme", value: "40 %", note: "Andel av värmeförsörjningen" },
  { label: "Bergvärme", value: "60 %", note: "Andel av värmeförsörjningen" },
];

export const energySources: {
  id: string;
  name: string;
  share: number;
  steps: string[];
  note: string;
}[] = [
  {
    id: "bergvarme",
    name: "Bergvärme",
    share: 60,
    steps: ["Bergvärme", "Värmepumpar", "Fastigheten"],
    note: "Två bergvärmepumpar försörjer fastigheten med grundvärme.",
  },
  {
    id: "fjarrvarme",
    name: "Fjärrvärme",
    share: 40,
    steps: ["Fjärrvärme", "Undercentral", "Fastigheten"],
    note: "Fjärrvärmen används som komplement vid högre effektbehov.",
  },
];

export const costBreakdown: {
  id: string;
  label: string;
  amount: string;
  share: number;
  detail: string;
}[] = [
  {
    id: "fv-fast",
    label: "Fjärrvärme – fast avgift",
    amount: "268 000 kr",
    share: 18,
    detail:
      "Fast effektavgift som utgår oavsett hur mycket energi som används. Avgiften har ökat med 12 % mot föregående period.",
  },
  {
    id: "fv-rorlig",
    label: "Fjärrvärme – rörlig avgift",
    amount: "402 000 kr",
    share: 27,
    detail:
      "Kostnad kopplad till levererad energi. Volymen är i stort oförändrad medan priset per kWh har ökat.",
  },
  {
    id: "el-bergvarme",
    label: "El till bergvärmepumpar",
    amount: "655 000 kr",
    share: 44,
    detail:
      "Elförbrukning för att driva värmepumparna. Utgör den största enskilda delen av värmekostnaden.",
  },
  {
    id: "service",
    label: "Service och underhåll",
    amount: "119 000 kr",
    share: 8,
    detail:
      "Planerad service av värmepumpar, undercentral och ventilation samt mindre reparationer.",
  },
  {
    id: "ovrigt",
    label: "Övrigt",
    amount: "44 000 kr",
    share: 3,
    detail: "Mätning, abonnemang och övriga mindre poster kopplade till värmeförsörjningen.",
  },
];

export const changeDrivers: { label: string; value: string; direction: "up" | "down" }[] = [
  { label: "Värmekostnad", value: "+8 %", direction: "up" },
  { label: "Energiförbrukning", value: "+1 %", direction: "up" },
  { label: "Genomsnittligt energipris", value: "+6 %", direction: "up" },
  { label: "Fast avgift", value: "+12 %", direction: "up" },
];

export const changeExplanation =
  "Den ökade värmekostnaden beror huvudsakligen på högre priser och fasta avgifter – inte på att fastigheten använder väsentligt mer energi.";

export type TrendKey = "cost" | "usage" | "price";

export const trendSeries: Record<
  TrendKey,
  { label: string; unit: string; points: { year: string; value: number; display: string }[] }
> = {
  cost: {
    label: "Kostnad kr/m²",
    unit: "kr/m²",
    points: [
      { year: "2022", value: 158, display: "158 kr/m²" },
      { year: "2023", value: 172, display: "172 kr/m²" },
      { year: "2024", value: 184, display: "184 kr/m²" },
      { year: "2025", value: 191, display: "191 kr/m²" },
      { year: "2026", value: 186, display: "186 kr/m²" },
    ],
  },
  usage: {
    label: "Förbrukning kWh/m²",
    unit: "kWh/m²",
    points: [
      { year: "2022", value: 126, display: "126 kWh/m²" },
      { year: "2023", value: 124, display: "124 kWh/m²" },
      { year: "2024", value: 121, display: "121 kWh/m²" },
      { year: "2025", value: 117, display: "117 kWh/m²" },
      { year: "2026", value: 118, display: "118 kWh/m²" },
    ],
  },
  price: {
    label: "Energipris kr/kWh",
    unit: "kr/kWh",
    points: [
      { year: "2022", value: 1.25, display: "1,25 kr/kWh" },
      { year: "2023", value: 1.39, display: "1,39 kr/kWh" },
      { year: "2024", value: 1.52, display: "1,52 kr/kWh" },
      { year: "2025", value: 1.63, display: "1,63 kr/kWh" },
      { year: "2026", value: 1.58, display: "1,58 kr/kWh" },
    ],
  },
};

export const technicalReadings: { label: string; value: string }[] = [
  { label: "Genomsnittlig inomhustemperatur", value: "20,6 °C" },
  { label: "Framledningstemperatur", value: "54 °C" },
  { label: "Returtemperatur", value: "38 °C" },
  { label: "Varmvattentemperatur", value: "55 °C" },
];

export const technicalUnits: { label: string; status: Status }[] = [
  { label: "Bergvärmepump 1", status: "good" },
  { label: "Bergvärmepump 2", status: "good" },
  { label: "Undercentral fjärrvärme", status: "good" },
  { label: "Ventilation", status: "watch" },
];

export const technicalEconomy = {
  fact: "Bergvärmepumparnas elanvändning har ökat med 14 %, samtidigt som producerad värme endast har ökat med 2 %.",
  analysis:
    "Förhållandet mellan tillförd el och producerad värme har försämrats jämfört med föregående period.",
  possibleCause:
    "Det kan indikera försämrad effektivitet, men kan också bero på driftinställningar, väderlek eller mätperiodens längd.",
  recommendedCheck:
    "Kontrollera värmepumparnas drift och driftdata innan slutsats dras eller åtgärd beslutas.",
};

export const energyInsights: { id: string; status: Status; title: string; text: string }[] = [
  {
    id: "e1",
    status: "good",
    title: "Inomhustemperaturen är stabil",
    text: "Genomsnittlig temperatur är 20,6 °C och ligger inom föreningens mål.",
  },
  {
    id: "e2",
    status: "watch",
    title: "Värmekostnaden har ökat mer än förbrukningen",
    text: "Kostnadsökningen verkar främst komma från pris och avgiftsförändringar snarare än högre energianvändning.",
  },
  {
    id: "e3",
    status: "watch",
    title: "Värmepumparnas effektivitet bör kontrolleras",
    text: "Elanvändningen har ökat mer än producerad värme. Kontrollera driftdata innan slutsats dras.",
  },
];

export const energyQuestions = [
  "Varför har värmekostnaden ökat?",
  "Använder vi mer energi än förra året?",
  "Vad kostar bergvärmen egentligen?",
  "Är bergvärmen fortfarande lönsam?",
  "Varför är returtemperaturen viktig?",
  "Har vi ovanligt hög energiförbrukning?",
];

export const energyAnswer =
  "Exempelsvar: Värmekostnaden har ökat med 8 % medan energiförbrukningen är i stort oförändrad (+1 %). Ökningen förklaras främst av högre energipris (+6 %) och högre fast avgift (+12 %). Underlaget bör kompletteras innan styrelsen beslutar om åtgärd.";

export const lifecycle: { label: string; value: string }[] = [
  { label: "Bergvärmepumpar installerade", value: "2016" },
  { label: "Ålder", value: "10 år" },
  { label: "Nästa större bedömning", value: "2028" },
  { label: "Planerad reinvestering", value: "Ej beslutad" },
];

export const lifecycleStatus: Status = "watch";

export const energyBoardDraft = {
  area: "Värme & ventilation",
  question: "Utveckling av värmekostnad och energipris",
  background: "Kostnaden har ökat mer än energiförbrukningen.",
  proposal:
    "Följ prisutvecklingen och analysera fast respektive rörlig kostnad innan åtgärd beslutas.",
};
