export type ManagementMode = "owner" | "brf";
export type ManagedProperty = { id: string; address: string };
export const trades = [
  "Snöröjning",
  "Plåtslageri",
  "Drift",
  "VVS",
  "El",
  "Bygg & renovering",
] as const;
export type Trade = (typeof trades)[number];
export type Partner = {
  id: string;
  name: string;
  trade: Trade;
  contact: string;
  phone: string;
  email: string;
  emergencyPhone: string;
  area: string;
  propertyIds: string[];
  preferred: boolean;
  contractEnd: string;
  notes: string;
};
export type PartnerSnapshot = Pick<Partner, "id" | "name" | "trade">;
export type ContractTemplate = {
  id: string;
  name: string;
  category: string;
  version: string;
  updated: string;
  description: string;
  fileName: string;
  text: string;
  fileData: string;
};
export type Assignment = {
  title: string;
  propertyId: string;
  supplier: PartnerSnapshot | null;
  completedAt: string | null;
};
export type ManagementRecord = {
  partners: Partner[];
  templates: ContractTemplate[];
  assignments: Record<string, Assignment>;
};
export function partnerSnapshot(partner: Partner): PartnerSnapshot {
  return { id: partner.id, name: partner.name, trade: partner.trade };
}
export function availablePartners(partners: Partner[], propertyId: string, trade?: string) {
  return partners
    .filter(
      (p) => p.propertyIds.includes(propertyId) && (!trade || trade === "all" || p.trade === trade),
    )
    .sort(
      (a, b) => Number(b.preferred) - Number(a.preferred) || a.name.localeCompare(b.name, "sv"),
    );
}
export function exampleTemplates(mode: ManagementMode): ContractTemplate[] {
  const names =
    mode === "owner"
      ? [
          "Hyresavtal – bostad",
          "Hyresavtal – lokal",
          "Garageavtal",
          "Serviceavtal",
          "Underhållsavtal",
        ]
      : [
          "Hyresavtal – lokal",
          "Garageavtal",
          "Serviceavtal",
          "Underhållsavtal",
          "Entreprenadavtal",
        ];
  const party = mode === "owner" ? "Fastighetsägare" : "Bostadsrättsförening";
  return names.map((name, i) => ({
    id: `${mode}-template-${i}`,
    name,
    category: name.startsWith("Hyres") || name === "Garageavtal" ? "Uthyrning" : "Förvaltning",
    version: "Exempel 1.0",
    updated: "2026-10-07",
    description: `${name} för ${mode === "owner" ? "fastighetsägaren" : "BRF"}. Ersätt exempelunderlaget med er egen avtalsmall.`,
    fileName: `avtalsmall-${mode}-${i + 1}.txt`,
    fileData: "",
    text: `${name.toUpperCase()}\nExempelunderlag · version 1.0 · 2026-10-07\n\n1. Parter\n${party}: [namn och organisationsnummer]\nMotpart: [namn och organisationsnummer/personnummer]\nKontaktpersoner: [namn, telefon och e-post]\n\n2. Fastighet och objekt\nFastighet/adress: [adress]\nObjekt eller omfattning: [lägenhet, lokal, garageplats eller uppdrag]\n\n3. Avtalstid\nStartdatum: [datum]\nSlutdatum/avtalstid: [datum eller överenskommen period]\nUppsägning och förlängning: [villkor]\n\n4. Ersättning och betalning\nHyra eller avtalat pris: [belopp och vad som ingår]\nMoms och fakturering: [villkor]\nPrisjustering: [villkor]\n\n5. Ansvar och utförande\nParternas ansvar: [beskrivning]\nUnderhåll, service och dokumentation: [beskrivning]\nKontakt och uppföljning: [ansvarig och tidpunkt]\n\n6. Bilagor\n[Objektsbeskrivning, omfattning, prislista och övriga bilagor]\n\n7. Underskrifter\nOrt och datum: [fyll i]\n${party}: [namn och underskrift]\nMotpart: [namn och underskrift]\n\nDetta är ett exempelunderlag i prototypen. Ladda upp er beslutade avtalsmall i biblioteket.`,
  }));
}
export function createManagementRecord(
  mode: ManagementMode,
  properties: ManagedProperty[],
): ManagementRecord {
  const names = [
    "Vinterservice Exempel AB",
    "Tak & Plåt Exempel AB",
    "Driftpartner Exempel AB",
    "Vatten & Värme Exempel AB",
    "Elservice Exempel AB",
    "Byggpartner Exempel AB",
  ];
  return {
    templates: exampleTemplates(mode),
    assignments: {},
    partners: trades.map((trade, i) => ({
      id: `${mode}-partner-${i}`,
      name: names[i]!,
      trade,
      contact: "Kontaktperson Exempel",
      phone: `070-000 00 ${String(i + 10)}`,
      email: `partner${i + 1}@example.se`,
      emergencyPhone: i === 2 || i === 3 || i === 4 ? `070-000 10 ${String(i + 10)}` : "",
      area: "Lokalt verksamhetsområde",
      propertyIds: properties.map((p) => p.id),
      preferred: [0, 2, 3].includes(i),
      contractEnd: "2027-12-31",
      notes: "Exempelleverantör. Ersätt med företagets egna kontaktuppgifter.",
    })),
  };
}
