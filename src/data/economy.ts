// Mock-data för Ekonomi-sidan i prototypen. Byts senare enkelt mot API/databas.
import type { Status } from "./overview";

export const mockNote = "Exempeldata i prototypen.";

export const economyIntro = {
  heading: "Ekonomi",
  subtitle: "Fastighetsägarens ekonomiska läge, utveckling och prognos.",
};

export type EconomyKpi = {
  id: string;
  label: string;
  value: string;
  comparison?: string;
  direction?: "up" | "down";
  status: Status;
  statusLabel?: string;
  mock?: boolean;
};

export const economyKpis: EconomyKpi[] = [
  {
    id: "likvida",
    label: "Likvida medel",
    value: "4,5 Mkr",
    comparison: "från 3,2 Mkr",
    direction: "up",
    status: "neutral",
  },
  {
    id: "sparande",
    label: "Sparande",
    value: "122 kr/m²",
    comparison: "från 134 kr/m²",
    direction: "down",
    status: "watch",
    statusLabel: "Bevaka",
  },
  {
    id: "belaning",
    label: "Belåning",
    value: "5 220 kr/m²",
    comparison: "från 5 591 kr/m²",
    direction: "down",
    status: "neutral",
  },
  {
    id: "hyresintakt",
    label: "Hyresintäkt",
    value: "777 kr/m²",
    comparison: "från 772 kr/m²",
    direction: "up",
    status: "neutral",
  },
  {
    id: "soliditet",
    label: "Soliditet",
    value: "75,2 %",
    comparison: "från 73,1 %",
    direction: "up",
    status: "neutral",
  },
  {
    id: "budget",
    label: "Resultat mot budget",
    value: "+120 tkr",
    comparison: "mot budget hittills i år",
    direction: "up",
    status: "neutral",
    mock: true,
  },
];

export type EconomyChange = {
  id: string;
  title: string;
  metrics: { label?: string; value: string }[];
  explanation: string;
  action?: { label: string; path?: "/fastigheten" | "/styrelsemote" };
  details?: string;
  mock?: boolean;
};

export const economyChanges: EconomyChange[] = [
  {
    id: "varme",
    title: "Värmekostnad",
    metrics: [
      { label: "Kostnad", value: "+8 %" },
      { label: "Förbrukning", value: "+1 %" },
    ],
    explanation:
      "Kostnaden har ökat med 8 % samtidigt som förbrukningen bara ökat med 1 %. Huvuddelen av förändringen är därför prisdriven, inte förbrukningsdriven.",
    details:
      "Fasta effektavgifter har ökat med 12 % mot föregående period. Förbrukningen ligger nära föregående år, vilket talar för att förändringen främst är prisdriven.",
    action: { label: "Visa Värme & ventilation", path: "/fastigheten" },
  },
  {
    id: "sparande",
    title: "Sparande",
    metrics: [
      { value: "122 kr/m²" },
      { label: "Förändring", value: "↓ från 134 kr/m²" },
      { label: "Jämförelse", value: "304 kr/m² år 2023" },
    ],
    explanation:
      "Sparandet har minskat från 134 kr/m² till 122 kr/m², och är betydligt lägre än 304 kr/m² år 2023. Nedgången påverkar fastighetsägarens möjlighet att finansiera kommande underhåll.",
    details:
      "Sparandet har minskat successivt sedan 2023, främst genom högre energi- och reparationskostnader. Nivån behöver ställas mot planerat underhåll de kommande fem åren innan slutsats dras.",
  },
  {
    id: "reparationer",
    title: "Reparationer",
    metrics: [{ value: "Reparationskostnader +122 tkr" }],
    explanation:
      "Reparationskostnaderna har ökat med 122 tkr. Ökningen är kopplad till återkommande reparationer i tvättstugan.",
    details:
      "Reparationskostnaderna uppgår till 418 tkr senaste 12 månaderna, att jämföra med 296 tkr föregående period. Tvättstugan står för 31 800 kr av kostnaden, fördelat på fyra reparationer av Tvättmaskin 2.",
    action: { label: "Visa Tvättstuga", path: "/fastigheten" },
    mock: true,
  },
];

export type BudgetRow = {
  id: string;
  area: string;
  budget: string;
  actual: string;
  deviation: string;
  status: Status;
  detail: string;
};

export const budgetRows: BudgetRow[] = [
  {
    id: "hyresintakter",
    area: "Hyresintäkter",
    budget: "4 240 tkr",
    actual: "4 248 tkr",
    deviation: "+8 tkr",
    status: "neutral",
    detail: "Hyresintäkterna följer budget. Ingen vakans under perioden.",
  },
  {
    id: "varme",
    area: "Värme",
    budget: "612 tkr",
    actual: "661 tkr",
    deviation: "+49 tkr",
    status: "watch",
    detail:
      "Avvikelsen förklaras främst av högre energipris och fasta avgifter, inte av ökad förbrukning.",
  },
  {
    id: "el",
    area: "El",
    budget: "288 tkr",
    actual: "301 tkr",
    deviation: "+13 tkr",
    status: "watch",
    detail: "Elanvändningen har ökat med 14 %. Utvecklingen bör kontrolleras innan slutsats dras.",
  },
  {
    id: "vatten",
    area: "Vatten",
    budget: "196 tkr",
    actual: "188 tkr",
    deviation: "−8 tkr",
    status: "neutral",
    detail: "Vattenförbrukningen följs upp under sommaren enligt tidigare förvaltningsbeslut.",
  },
  {
    id: "reparationer",
    area: "Reparationer",
    budget: "350 tkr",
    actual: "418 tkr",
    deviation: "+68 tkr",
    status: "watch",
    detail: "Återkommande reparationer i tvättstugan utgör en del av avvikelsen.",
  },
  {
    id: "administration",
    area: "Administration",
    budget: "410 tkr",
    actual: "382 tkr",
    deviation: "−28 tkr",
    status: "neutral",
    detail: "Lägre kostnader för förvaltning och konsultstöd än budgeterat.",
  },
];

export const forecast = {
  heading: "Prognos året ut",
  note: "Prognos, inte faktiskt utfall. " + mockNote,
  rows: [
    { label: "Budget helår", value: "−145 tkr" },
    { label: "Prognos helår", value: "−98 tkr" },
    { label: "Förväntad avvikelse", value: "+47 tkr" },
  ],
  explanation:
    "Med nuvarande utveckling väntas fastighetsägaren avsluta året nära budget. Högre värmekostnader motverkas delvis av lägre kostnader inom andra områden.",
};

export type EconomyTrendKey =
  "sparande" | "belaning" | "hyresintakt" | "likvida" | "soliditet" | "energi";

export type TrendPoint = { year: string; value: number; display: string };

export const economyTrends: Record<
  EconomyTrendKey,
  { label: string; unit: string; points: TrendPoint[] }
> = {
  sparande: {
    label: "Sparande kr/m²",
    unit: "kr/m²",
    points: [
      { year: "2017", value: 268, display: "268" },
      { year: "2018", value: 281, display: "281" },
      { year: "2019", value: 294, display: "294" },
      { year: "2020", value: 302, display: "302" },
      { year: "2021", value: 288, display: "288" },
      { year: "2022", value: 316, display: "316" },
      { year: "2023", value: 304, display: "304" },
      { year: "2024", value: 168, display: "168" },
      { year: "2025", value: 134, display: "134" },
      { year: "2026", value: 122, display: "122" },
    ],
  },
  belaning: {
    label: "Belåning kr/m²",
    unit: "kr/m²",
    points: [
      { year: "2017", value: 7120, display: "7 120" },
      { year: "2018", value: 6940, display: "6 940" },
      { year: "2019", value: 6710, display: "6 710" },
      { year: "2020", value: 6480, display: "6 480" },
      { year: "2021", value: 6260, display: "6 260" },
      { year: "2022", value: 6040, display: "6 040" },
      { year: "2023", value: 5860, display: "5 860" },
      { year: "2024", value: 5702, display: "5 702" },
      { year: "2025", value: 5591, display: "5 591" },
      { year: "2026", value: 5220, display: "5 220" },
    ],
  },
  hyresintakt: {
    label: "Hyresintäkt kr/m²",
    unit: "kr/m²",
    points: [
      { year: "2017", value: 702, display: "702" },
      { year: "2018", value: 712, display: "712" },
      { year: "2019", value: 726, display: "726" },
      { year: "2020", value: 738, display: "738" },
      { year: "2021", value: 745, display: "745" },
      { year: "2022", value: 752, display: "752" },
      { year: "2023", value: 760, display: "760" },
      { year: "2024", value: 766, display: "766" },
      { year: "2025", value: 772, display: "772" },
      { year: "2026", value: 777, display: "777" },
    ],
  },
  likvida: {
    label: "Likvida medel",
    unit: "Mkr",
    points: [
      { year: "2017", value: 2.1, display: "2,1" },
      { year: "2018", value: 2.4, display: "2,4" },
      { year: "2019", value: 2.6, display: "2,6" },
      { year: "2020", value: 2.8, display: "2,8" },
      { year: "2021", value: 3.0, display: "3,0" },
      { year: "2022", value: 3.4, display: "3,4" },
      { year: "2023", value: 3.6, display: "3,6" },
      { year: "2024", value: 3.4, display: "3,4" },
      { year: "2025", value: 3.2, display: "3,2" },
      { year: "2026", value: 4.5, display: "4,5" },
    ],
  },
  soliditet: {
    label: "Soliditet",
    unit: "%",
    points: [
      { year: "2017", value: 64.2, display: "64,2" },
      { year: "2018", value: 65.8, display: "65,8" },
      { year: "2019", value: 67.1, display: "67,1" },
      { year: "2020", value: 68.6, display: "68,6" },
      { year: "2021", value: 70.0, display: "70,0" },
      { year: "2022", value: 71.2, display: "71,2" },
      { year: "2023", value: 72.0, display: "72,0" },
      { year: "2024", value: 72.6, display: "72,6" },
      { year: "2025", value: 73.1, display: "73,1" },
      { year: "2026", value: 75.2, display: "75,2" },
    ],
  },
  energi: {
    label: "Energikostnad kr/m²",
    unit: "kr/m²",
    points: [
      { year: "2017", value: 118, display: "118" },
      { year: "2018", value: 121, display: "121" },
      { year: "2019", value: 124, display: "124" },
      { year: "2020", value: 119, display: "119" },
      { year: "2021", value: 128, display: "128" },
      { year: "2022", value: 142, display: "142" },
      { year: "2023", value: 151, display: "151" },
      { year: "2024", value: 156, display: "156" },
      { year: "2025", value: 162, display: "162" },
      { year: "2026", value: 175, display: "175" },
    ],
  },
};

export const trendPeriods = [
  { id: "3", label: "3 år", years: 3 },
  { id: "5", label: "5 år", years: 5 },
  { id: "10", label: "10 år", years: 10 },
] as const;

export const loans = {
  facts: [
    { label: "Total skuld", value: "38,2 Mkr", mock: true },
    { label: "Belåning", value: "5 220 kr/m²" },
    { label: "Genomsnittsränta", value: "2,84 %", mock: true },
    { label: "Räntekostnad", value: "1 085 tkr/år", mock: true },
  ],
  maturities: [
    { year: "2026", value: 6.4, display: "6,4 Mkr" },
    { year: "2027", value: 11.2, display: "11,2 Mkr" },
    { year: "2028", value: 8.6, display: "8,6 Mkr" },
    { year: "2029+", value: 12.0, display: "12,0 Mkr" },
  ],
  sensitivity:
    "Om fastighetsägarens genomsnittliga ränta ökar med 1 procentenhet innebär det cirka 382 000 kr högre årlig räntekostnad.",
};

export const maintenanceCapacity = {
  heading: "Har vi ekonomi för kommande underhåll?",
  basis: [
    { label: "Likvida medel", value: "4,5 Mkr" },
    { label: "Sparande", value: "122 kr/m²" },
    { label: "Total skuld", value: "38,2 Mkr", mock: true },
  ],
  years: [
    { year: "2027", value: 0.8, display: "0,8 Mkr", note: "Fönster – etappvis målning" },
    { year: "2028", value: 2.1, display: "2,1 Mkr", note: "Tvättstuga och ventilation" },
    { year: "2029", value: 0.6, display: "0,6 Mkr", note: "Dränering, mindre åtgärder" },
    { year: "2030", value: 3.2, display: "3,2 Mkr", note: "Fasad och balkonger" },
    { year: "2031", value: 1.0, display: "1,0 Mkr", note: "Hiss – planerad modernisering" },
  ],
  assessment:
    "Planerade underhållskostnader ökar tydligt 2030. Med dagens antaganden bör finansieringen analyseras i god tid.",
};

export type EconomyInsight = {
  id: string;
  status: Status;
  title: string;
  analysis: string;
};

export const economyInsights: EconomyInsight[] = [
  {
    id: "belaning",
    status: "good",
    title: "Belåningen fortsätter minska.",
    analysis:
      "Belåningen har minskat varje år sedan 2017 och ligger nu på 5 220 kr/m². Amorteringstakten har varit stabil.",
  },
  {
    id: "sparande",
    status: "watch",
    title: "Sparandet har minskat.",
    analysis:
      "Sparandet är 122 kr/m² mot 304 kr/m² år 2023. Nivån bör bedömas tillsammans med kommande planerat underhåll.",
  },
  {
    id: "underhall",
    status: "watch",
    title: "Större underhåll väntar inom fem år.",
    analysis:
      "Planerat underhåll uppgår till cirka 7,7 Mkr under perioden 2027–2031, med tydlig topp 2030.",
  },
];

export const economyReports = [
  "Resultatrapport",
  "Balansrapport",
  "Budget",
  "Leverantörskostnader",
  "Lån",
  "Transaktioner",
];

export const economyQuestions = [
  "Varför ligger vi över budget?",
  "Vilka kostnader har ökat mest?",
  "Hur har sparandet utvecklats?",
  "Har vi råd med planerat underhåll?",
  "Vad händer om räntan stiger med 1 %?",
  "Vilka leverantörer kostar mest?",
];

export const economyAnswer = {
  fact: "Utfallet ligger 120 tkr bättre än budget hittills i år. Värme (+49 tkr) och reparationer (+68 tkr) avviker negativt, medan administration (−28 tkr) och vatten (−8 tkr) avviker positivt.",
  analysis:
    "Avvikelserna är delvis prisdrivna och delvis kopplade till återkommande reparationer i tvättstugan.",
  recommendation:
    "Följ värmekostnaden och reparationerna under hösten innan budgeten för nästa år fastställs.",
};

// ---------------------------------------------------------------------------
// Nivå 1: överblick (10 sekunder → 1 minut). Samma data, enklare hierarki.
// ---------------------------------------------------------------------------

export const economyHealth = {
  heading: "Så mår ekonomin",
  status: "good" as Status,
  statusLabel: "Stabil ekonomi",
  summary:
    "Fastighetsägaren har god likviditet och belåningen minskar. Sparandet har däremot minskat och bör följas inför kommande underhåll.",
};

export type OverviewKpi = {
  id: string;
  label: string;
  value: string;
  comparison?: string;
  direction?: "up" | "down";
  status: Status;
  statusLabel: string;
  trendKey?: EconomyTrendKey;
};

export const overviewKpis: OverviewKpi[] = [
  {
    id: "likvida",
    label: "Likvida medel",
    value: "4,5 Mkr",
    comparison: "från 3,2 Mkr",
    direction: "up",
    status: "good",
    statusLabel: "Bra",
    trendKey: "likvida",
  },
  {
    id: "belaning",
    label: "Belåning",
    value: "5 220 kr/m²",
    comparison: "från 5 591 kr/m²",
    direction: "down",
    status: "good",
    statusLabel: "Bra",
    trendKey: "belaning",
  },
  {
    id: "sparande",
    label: "Sparande",
    value: "122 kr/m²",
    comparison: "från 134 kr/m²",
    direction: "down",
    status: "watch",
    statusLabel: "Bevaka",
    trendKey: "sparande",
  },
  {
    id: "budget",
    label: "Budget",
    value: "I nivå",
    status: "good",
    statusLabel: "Bra",
  },
];

export const kpiDetails: Record<
  string,
  {
    title: string;
    value: string;
    rows: { label: string; value: string }[];
    trendKey?: EconomyTrendKey;
    meaning: string;
    changed: string;
  }
> = {
  likvida: {
    title: "Likvida medel",
    value: "4,5 Mkr",
    rows: [
      { label: "Föregående år", value: "3,2 Mkr" },
      { label: "2023", value: "3,6 Mkr" },
    ],
    trendKey: "likvida",
    meaning:
      "Likvida medel är de pengar fastighetsägaren har tillgängliga på konto. De används för löpande kostnader och för att kunna betala underhåll utan att låna.",
    changed:
      "Likviditeten har ökat med 1,3 Mkr sedan föregående år, främst genom lägre underhållskostnader under perioden.",
  },
  belaning: {
    title: "Belåning",
    value: "5 220 kr/m²",
    rows: [
      { label: "Föregående år", value: "5 591 kr/m²" },
      { label: "2023", value: "5 860 kr/m²" },
    ],
    trendKey: "belaning",
    meaning:
      "Belåning visar fastighetsägarens lån per kvadratmeter bostadsyta. Måttet gör det möjligt att jämföra skuldsättning mellan fastigheter av olika storlek.",
    changed:
      "Belåningen har minskat varje år sedan 2017. Amorteringstakten har varit stabil och ligger kvar på samma nivå som föregående år.",
  },
  sparande: {
    title: "Sparande",
    value: "122 kr/m²",
    rows: [
      { label: "Föregående år", value: "134 kr/m²" },
      { label: "2023", value: "304 kr/m²" },
    ],
    trendKey: "sparande",
    meaning:
      "Sparande är det som blir kvar av hyresintäkterna efter löpande kostnader och räntor, per kvadratmeter. Det är de medel fastighetsägaren kan använda till framtida underhåll.",
    changed:
      "Sparandet har minskat successivt sedan 2023, främst genom högre energi- och reparationskostnader. Nivån bör bedömas mot planerat underhåll de kommande fem åren.",
  },
  budget: {
    title: "Budget",
    value: "I nivå",
    rows: [
      { label: "Utfall mot budget", value: "+120 tkr" },
      { label: "Prognos helår", value: "−98 tkr" },
      { label: "Budget helår", value: "−145 tkr" },
    ],
    meaning:
      "Utfall mot budget visar om fastighetsägarens kostnader och intäkter följer det förvaltningen beslutade inför året.",
    changed:
      "Utfallet ligger 120 tkr bättre än budget. Värme och reparationer avviker negativt, medan administration och vatten avviker positivt.",
  },
};

export const outlook = {
  heading: "Framåt",
  years: [
    {
      year: "2027",
      status: "good" as Status,
      statusLabel: "Bra",
      note: "Normalt planerat underhåll",
    },
    {
      year: "2028",
      status: "good" as Status,
      statusLabel: "Bra",
      note: "Större underhåll planerat",
    },
    {
      year: "2029",
      status: "good" as Status,
      statusLabel: "Bra",
      note: "Normalt planerat underhåll",
    },
    {
      year: "2030",
      status: "watch" as Status,
      statusLabel: "Bevaka",
      note: "Större underhåll väntar",
    },
    {
      year: "2031",
      status: "good" as Status,
      statusLabel: "Bra",
      note: "Normalt planerat underhåll",
    },
  ],
  summary:
    "Planerade underhållskostnader ökar tydligt 2030. Finansieringen bör analyseras i god tid.",
};

// Korta slutsatser för den kompakta versionen av "Det här har förändrats".
export const changeConclusions: Record<string, string> = {
  varme: "Kostnaden har ökat betydligt mer än förbrukningen.",
  sparande: "Sparandet har minskat och är lägre än 2023.",
  reparationer: "Reparationskostnaderna har ökat med 122 tkr.",
};

export const boardAttention = [
  {
    id: "sparande",
    status: "watch" as Status,
    title: "Analysera sparandet inför kommande underhåll",
    note: "Sparandet har minskat samtidigt som större underhåll väntar.",
  },
  {
    id: "underhall2030",
    status: "watch" as Status,
    title: "Planera finansieringen inför 2030",
    note: "Underhållsbehovet blir betydligt större detta år.",
  },
  {
    id: "varme",
    status: "watch" as Status,
    title: "Följ värmekostnaden inför nästa budget",
    note: "Kostnaden utvecklas snabbare än förbrukningen.",
  },
];

export const overviewQuestions = [
  "Varför är sparandet lägre?",
  "Har vi råd med kommande underhåll?",
  "Varför har värmekostnaden ökat?",
  "Hur har belåningen utvecklats?",
];

// ---------------------------------------------------------------------------
// Intäktsbedömning. Systemet beskriver konsekvenser – förvaltningen fattar beslutet.
// ---------------------------------------------------------------------------

export const feeAssessment = {
  heading: "Intäktsbedömning",
  currentLabel: "Nuvarande hyresintäkt",
  current: "777 kr/m²",
  status: "good" as Status,
  statusLabel: "Nuvarande hyresintäkt bedöms vara tillräcklig året ut",
  explanation:
    "Med nuvarande prognos väntas ekonomin ligga nära budget och likviditeten är fortsatt god.",
  forwardStatus: "watch" as Status,
  forwardLabel: "Bevaka inför nästa budget",
  forwardNote: "Sparandet har minskat och större underhåll väntar längre fram.",
  action: "Visa intäktsanalys",
};

/** Prognos med oförändrad hyresintäkt. Mockdata i prototypen. */
export const feeForecast = {
  heading: "Prognos med oförändrad hyresintäkt",
  rows: [
    { label: "Hyresintäkter", value: "4 248 tkr/år" },
    { label: "Driftkostnader", value: "3 010 tkr/år" },
    { label: "Räntekostnader", value: "1 085 tkr/år" },
    { label: "Sparande", value: "122 kr/m²" },
    { label: "Likviditet vid årets slut", value: "4,4 Mkr" },
    { label: "Större planerat underhåll", value: "2028: 2,1 Mkr · 2030: 3,2 Mkr" },
  ],
};

export const feeReasoning: { label: string; lines: string[] }[] = [
  {
    label: "Fakta",
    lines: [
      "Hyresintäkten är 777 kr/m², en ökning från 772 kr/m² föregående år.",
      "Utfallet ligger 120 tkr bättre än budget hittills i år och likvida medel är 4,5 Mkr.",
      "Sparandet är 122 kr/m² mot 304 kr/m² år 2023.",
    ],
  },
  {
    label: "Analys",
    lines: [
      "Kostnadsökningarna är främst prisdrivna, med värme som största enskilda post.",
      "Sparandet täcker normalt planerat underhåll men inte toppåren 2028 och 2030 utan annan finansiering.",
    ],
  },
  {
    label: "Antaganden",
    lines: [
      "Inflation och energipriser antas ligga kvar på dagens nivå.",
      "Genomsnittsräntan antas vara 2,84 % under perioden.",
      "Underhållsplanen genomförs enligt nuvarande tidplan.",
    ],
  },
  {
    label: "Bedömning",
    lines: [
      "Nuvarande prognos indikerar ett framtida finansieringsgap kring 2030 om sparandet ligger kvar på dagens nivå.",
      "Hyresnivån bör analyseras inför nästa budget. Underlaget räcker inte för att slå fast en viss hyresnivå.",
    ],
  },
];

export type FeeScenario = {
  id: string;
  label: string;
  income: string;
  saving: string;
  liquidity2030: string;
  financingNeed: string;
  maintenance: string;
  effectPerYear: { year: string; value: number; display: string }[];
};

export const feeScenarios: FeeScenario[] = [
  {
    id: "oforandrad",
    label: "Oförändrad",
    income: "4 248 tkr/år",
    saving: "122 kr/m²",
    liquidity2030: "1,1 Mkr",
    financingNeed: "Cirka 2,1 Mkr kring 2030",
    maintenance: "Planerat underhåll 2030 kan inte finansieras med eget sparande.",
    effectPerYear: [
      { year: "2027", value: 4248, display: "4 248 tkr" },
      { year: "2028", value: 4248, display: "4 248 tkr" },
      { year: "2029", value: 4248, display: "4 248 tkr" },
      { year: "2030", value: 4248, display: "4 248 tkr" },
      { year: "2031", value: 4248, display: "4 248 tkr" },
    ],
  },
  {
    id: "plus3",
    label: "+3 %",
    income: "4 375 tkr/år",
    saving: "145 kr/m²",
    liquidity2030: "1,7 Mkr",
    financingNeed: "Cirka 1,5 Mkr kring 2030",
    maintenance: "Del av underhållet 2030 kan finansieras med eget sparande.",
    effectPerYear: [
      { year: "2027", value: 4375, display: "4 375 tkr" },
      { year: "2028", value: 4375, display: "4 375 tkr" },
      { year: "2029", value: 4375, display: "4 375 tkr" },
      { year: "2030", value: 4375, display: "4 375 tkr" },
      { year: "2031", value: 4375, display: "4 375 tkr" },
    ],
  },
  {
    id: "plus5",
    label: "+5 %",
    income: "4 460 tkr/år",
    saving: "160 kr/m²",
    liquidity2030: "2,2 Mkr",
    financingNeed: "Cirka 1,0 Mkr kring 2030",
    maintenance: "Större del av underhållet 2030 kan finansieras med eget sparande.",
    effectPerYear: [
      { year: "2027", value: 4460, display: "4 460 tkr" },
      { year: "2028", value: 4460, display: "4 460 tkr" },
      { year: "2029", value: 4460, display: "4 460 tkr" },
      { year: "2030", value: 4460, display: "4 460 tkr" },
      { year: "2031", value: 4460, display: "4 460 tkr" },
    ],
  },
  {
    id: "plus10",
    label: "+10 %",
    income: "4 673 tkr/år",
    saving: "198 kr/m²",
    liquidity2030: "3,4 Mkr",
    financingNeed: "Inget beräknat gap med dagens antaganden",
    maintenance: "Underhållet 2030 bedöms kunna finansieras utan ny upplåning.",
    effectPerYear: [
      { year: "2027", value: 4673, display: "4 673 tkr" },
      { year: "2028", value: 4673, display: "4 673 tkr" },
      { year: "2029", value: 4673, display: "4 673 tkr" },
      { year: "2030", value: 4673, display: "4 673 tkr" },
      { year: "2031", value: 4673, display: "4 673 tkr" },
    ],
  },
];

export const feeComparisons: {
  id: string;
  label: string;
  rows: { year: string; a: string; b: string }[];
  aLabel: string;
  bLabel: string;
  note: string;
}[] = [
  {
    id: "trappa-vs-engang",
    label: "3 % per år i tre år mot 10 % från nästa år",
    aLabel: "3 % per år i tre år",
    bLabel: "10 % från nästa år",
    rows: [
      { year: "2027", a: "4 375 tkr", b: "4 673 tkr" },
      { year: "2028", a: "4 506 tkr", b: "4 673 tkr" },
      { year: "2029", a: "4 641 tkr", b: "4 673 tkr" },
      { year: "2030", a: "4 641 tkr", b: "4 673 tkr" },
      { year: "2031", a: "4 641 tkr", b: "4 673 tkr" },
    ],
    note: "En stegvis höjning ger lägre intäkter de första åren men når nästan samma nivå 2029. En höjning på en gång bygger upp likviditet tidigare inför 2030.",
  },
];

export const feePrinciple =
  "Prototypen visar konsekvenser av olika hyresnivåer. Den tar inte ställning till vilken nivå som är rätt – det beslutet fattas av förvaltningen.";
