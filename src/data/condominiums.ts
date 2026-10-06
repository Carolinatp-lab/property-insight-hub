import type { Status } from "@/data/overview";

export type Condominium = {
  id: string;
  unit: string;
  area: string;
  rooms: string;
  status: Status;
  statusLabel: string;
  occupancy: "Bebodd" | "Andrahandsuthyrd" | "Tom";
  subletPeriod?: string;
  subletHistory: string[];
  renovationDocuments: string[];
  latestCase: string;
};

export const condominiumSummary = {
  total: 48,
  sublet: 3,
  vacant: 1,
  openCases: 4,
};

export const condominiums: Condominium[] = [
  {
    id: "br-1102",
    unit: "Lägenhet 1102",
    area: "63 m²",
    rooms: "2 rok",
    status: "good",
    statusLabel: "Inget att följa upp",
    occupancy: "Bebodd",
    subletHistory: ["2021-08-01 – 2022-07-31 · Studier på annan ort"],
    renovationDocuments: ["2024 · Kök · Intyg och produktblad mottagna"],
    latestCase: "Renoveringsunderlag komplett 2024-03-18",
  },
  {
    id: "br-1204",
    unit: "Lägenhet 1204",
    area: "78 m²",
    rooms: "3 rok",
    status: "watch",
    statusLabel: "Tillstånd löper snart ut",
    occupancy: "Andrahandsuthyrd",
    subletPeriod: "2026-02-01 – 2027-01-31",
    subletHistory: [
      "2026-02-01 – 2027-01-31 · Arbete på annan ort",
      "2023-09-01 – 2024-08-31 · Provsamboende",
    ],
    renovationDocuments: ["2022 · Badrum · Våtrumsintyg mottaget"],
    latestCase: "Följ upp återflytt eller ny ansökan senast 2026-11-30",
  },
  {
    id: "br-1301",
    unit: "Lägenhet 1301",
    area: "91 m²",
    rooms: "4 rok",
    status: "alert",
    statusLabel: "Underlag saknas",
    occupancy: "Bebodd",
    subletHistory: [],
    renovationDocuments: ["2025 · Badrum · Ansökan mottagen, kvalitetsdokument saknas"],
    latestCase: "Begär in kvalitetsdokument för badrumsrenovering",
  },
  {
    id: "br-1403",
    unit: "Lägenhet 1403",
    area: "54 m²",
    rooms: "2 rok",
    status: "watch",
    statusLabel: "Kontrollera tillsyn",
    occupancy: "Tom",
    subletHistory: ["2020-01-15 – 2020-12-31 · Tillfälligt arbete utomlands"],
    renovationDocuments: [],
    latestCase: "Uppgift om tomställning registrerad 2026-08-20",
  },
  {
    id: "br-1502",
    unit: "Lägenhet 1502",
    area: "70 m²",
    rooms: "3 rok",
    status: "good",
    statusLabel: "Inget att följa upp",
    occupancy: "Andrahandsuthyrd",
    subletPeriod: "2026-06-01 – 2027-05-31",
    subletHistory: ["2026-06-01 – 2027-05-31 · Studier på annan ort"],
    renovationDocuments: ["2023 · Flytt av kök · Ritning och slutintyg mottagna"],
    latestCase: "Andrahandsuthyrning godkänd 2026-04-12",
  },
];

export const condominiumAttention = [
  {
    status: "watch" as const,
    title: "Tillstånd för lägenhet 1204 löper ut",
    detail: "Be medlemmen bekräfta återflytt eller lämna en ny ansökan före 30 november.",
  },
  {
    status: "alert" as const,
    title: "Kvalitetsdokument saknas för lägenhet 1301",
    detail: "Badrumsrenoveringen är anmäld men styrelsens akt saknar slutligt kvalitetsdokument.",
  },
  {
    status: "watch" as const,
    title: "Lägenhet 1403 är registrerad som tom",
    detail: "Följ upp tillsyn, försäkringsskydd och kontaktväg vid en eventuell vattenskada.",
  },
];

export const condominiumMockNote =
  "Uppgifterna är exempeldata. Begränsa verkliga personuppgifter till det som styrelsen behöver och har rätt att behandla.";
