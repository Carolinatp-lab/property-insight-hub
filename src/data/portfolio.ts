import type { Status } from "./overview";

export type Property = {
  id: string;
  address: string;
  type: string;
  apartments: number;
  premises: number;
  garages: number;
  vacant: number;
  vacantGarages: number;
  rent: number;
  operatingCosts: number;
  status: Status;
  statusText: string;
  action: string;
  due: string;
  maintenanceCost: number;
  owner: string;
  followUp: string;
};

/** Årsbelopp i kronor. Vakans avser antal hyreslägenheter och lokaler, exklusive garage. */
export const properties: Property[] = [
  {
    id: "storgatan-12",
    address: "Storgatan 12",
    type: "Bostäder & lokaler",
    apartments: 24,
    premises: 2,
    garages: 12,
    vacant: 1,
    vacantGarages: 1,
    rent: 3600000,
    operatingCosts: 1400000,
    status: "watch",
    statusText: "Underhåll planeras",
    action: "Takbesiktning och offertunderlag",
    due: "2026-11-15",
    maintenanceCost: 180000,
    owner: "Teknisk förvaltning",
    followUp: "Inväntar två offerter för takbesiktning.",
  },
  {
    id: "parkvagen-8",
    address: "Parkvägen 8",
    type: "Bostadsfastighet",
    apartments: 18,
    premises: 0,
    garages: 8,
    vacant: 0,
    vacantGarages: 0,
    rent: 2160000,
    operatingCosts: 850000,
    status: "good",
    statusText: "Stabil drift",
    action: "Service av ventilation",
    due: "2026-12-01",
    maintenanceCost: 65000,
    owner: "Driftansvarig",
    followUp: "Ventilationsservice är bokad med entreprenör.",
  },
  {
    id: "industrigatan-4",
    address: "Industrigatan 4",
    type: "Kommersiell fastighet",
    apartments: 0,
    premises: 6,
    garages: 20,
    vacant: 1,
    vacantGarages: 3,
    rent: 4200000,
    operatingCosts: 1700000,
    status: "alert",
    statusText: "Vakant lokal",
    action: "Anpassning av lokal inför uthyrning",
    due: "2027-01-20",
    maintenanceCost: 320000,
    owner: "Uthyrningsansvarig",
    followUp: "Två visningar planerade för den vakanta lokalen.",
  },
];

export function summarizeProperties(items: Property[]) {
  const sum = (
    key:
      | "apartments"
      | "premises"
      | "garages"
      | "vacant"
      | "vacantGarages"
      | "rent"
      | "operatingCosts"
      | "maintenanceCost",
  ) => items.reduce((total, item) => total + item[key], 0);
  const units = sum("apartments") + sum("premises");
  return {
    count: items.length,
    apartments: sum("apartments"),
    premises: sum("premises"),
    garages: sum("garages"),
    vacant: sum("vacant"),
    vacantGarages: sum("vacantGarages"),
    rent: sum("rent"),
    operatingCosts: sum("operatingCosts"),
    net: sum("rent") - sum("operatingCosts"),
    vacancy: units ? (sum("vacant") / units) * 100 : 0,
    maintenance: sum("maintenanceCost"),
  };
}
export const money = (value: number) =>
  new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(value);
export const percent = (value: number) =>
  new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 1 }).format(value) + " %";
