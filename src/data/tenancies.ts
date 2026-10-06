import type { Status } from "@/data/overview";

export type TenancyType = "Lokal" | "Hyresrätt";

export type Tenancy = {
  id: string;
  name: string;
  unit: string;
  type: TenancyType;
  area: string;
  annualRent: string;
  contractEnd: string;
  noticeDate: string;
  status: Status;
  statusLabel: string;
  indexTerms: string;
  deposit: string;
  contact: string;
  latestRenovation: string;
};

export const tenancySummary = {
  totalIncome: "1 428 000 kr",
  totalCosts: "386 000 kr",
  net: "1 042 000 kr",
  margin: "73 %",
};

export const tenancies: Tenancy[] = [
  {
    id: "lokal-01",
    name: "Kvartersbageriet AB",
    unit: "Lokal 01 · Gatuplan",
    type: "Lokal",
    area: "142 m²",
    annualRent: "486 000 kr",
    contractEnd: "2027-09-30",
    noticeDate: "2026-09-30",
    status: "watch",
    statusLabel: "Uppsägning inom 12 mån",
    indexTerms: "KPI, 100 % · oktober",
    deposit: "3 månadshyror",
    contact: "Anna Berg · 070-123 45 67",
    latestRenovation: "Ventilation och fettavskiljare, 2022",
  },
  {
    id: "lokal-02",
    name: "Studio Norr Kontor AB",
    unit: "Lokal 02 · Plan 1",
    type: "Lokal",
    area: "96 m²",
    annualRent: "312 000 kr",
    contractEnd: "2029-03-31",
    noticeDate: "2028-03-31",
    status: "good",
    statusLabel: "Avtal i ordning",
    indexTerms: "KPI, 80 % · januari",
    deposit: "Bankgaranti",
    contact: "Erik Lund · 070-234 56 78",
    latestRenovation: "Ytskikt och el, 2021",
  },
  {
    id: "lagenhet-1201",
    name: "Karin Svensson",
    unit: "Lägenhet 1201 · 3 rok",
    type: "Hyresrätt",
    area: "74 m²",
    annualRent: "168 000 kr",
    contractEnd: "Tillsvidare",
    noticeDate: "3 månaders uppsägning",
    status: "good",
    statusLabel: "Avtal i ordning",
    indexTerms: "Årlig förhandling",
    deposit: "Ej tillämpligt",
    contact: "karin.svensson@example.se",
    latestRenovation: "Badrum och stammar, 2018",
  },
  {
    id: "lagenhet-1302",
    name: "Johan Nilsson",
    unit: "Lägenhet 1302 · 2 rok",
    type: "Hyresrätt",
    area: "58 m²",
    annualRent: "132 000 kr",
    contractEnd: "Tillsvidare",
    noticeDate: "3 månaders uppsägning",
    status: "alert",
    statusLabel: "Besiktning saknas",
    indexTerms: "Årlig förhandling",
    deposit: "Ej tillämpligt",
    contact: "johan.nilsson@example.se",
    latestRenovation: "Kök, 2015",
  },
];

export const costBreakdown = [
  { label: "Drift och media", amount: "178 000 kr", share: 46 },
  { label: "Reparationer", amount: "112 000 kr", share: 29 },
  { label: "Fastighetsskatt", amount: "68 000 kr", share: 18 },
  { label: "Administration", amount: "28 000 kr", share: 7 },
];

export const renovationHistory = [
  {
    year: "2024",
    unit: "Lokal 01",
    title: "Service av ventilation",
    cost: "38 000 kr",
    responsibility: "Fastighetsägaren",
  },
  {
    year: "2023",
    unit: "Lägenhet 1302",
    title: "Byte av vitvaror",
    cost: "24 000 kr",
    responsibility: "Fastighetsägaren",
  },
  {
    year: "2022",
    unit: "Lokal 01",
    title: "Fettavskiljare och kanaldragning",
    cost: "186 000 kr",
    responsibility: "Delad kostnad",
  },
  {
    year: "2021",
    unit: "Lokal 02",
    title: "Anpassning av kontorsyta",
    cost: "94 000 kr",
    responsibility: "Hyresgästen",
  },
];

export const tenancyAttention = [
  {
    status: "watch" as const,
    title: "Förbered omförhandling med Kvartersbageriet",
    detail:
      "Sista uppsägningsdag är 30 september 2026. Ta fram marknadshyra och ansvarsfördelning senast i juni.",
  },
  {
    status: "alert" as const,
    title: "Dokumentera status i lägenhet 1302",
    detail:
      "Inflyttningsbesiktning saknas i arkivet. Boka besiktning och komplettera renoveringshistoriken.",
  },
];

export const tenancyMockNote =
  "Uppgifterna är exempeldata och ersätts senare med fastighetsägarens avtal, bokföring och underhållshistorik.";
