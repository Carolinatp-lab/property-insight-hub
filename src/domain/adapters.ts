/**
 * LAGER 2 – NORMALISERING
 *
 * En adapter översätter extern rådata till den gemensamma interna datamodellen.
 * Att byta eller lägga till ekonomisystem ska endast innebära en ny adapter –
 * aldrig ändringar i analys- eller UI-lagret.
 *
 * Ingen riktig integration byggs i prototypen. Endast kontrakt + mock-adapter.
 */

import type {
  CostCategory,
  EventType,
  LedgerEvent,
  NormalizedDataset,
  PropertyRef,
  SourceSystem,
} from "./model";
import { emptyDataset } from "./model";
import type { ExternalLedgerRow, SourceRecord } from "./sources";

/** Kontrakt som alla framtida källor (Fortnox, Oqto, Visma, SIE, CSV …) följer. */
export type EconomySourceAdapter = {
  id: SourceSystem;
  label: string;
  /** Vilka inmatningssätt adaptern stödjer. */
  supports: Array<"api" | "sie" | "file" | "invoice" | "manual">;
  normalize: (records: SourceRecord[]) => NormalizedDataset;
};

/** Regelbaserad kontomappning – ersätts senare av konfigurerbar mappning per fastighetsägare. */
const accountCategory: Record<string, { category: CostCategory; eventType: EventType }> = {
  "5170": { category: "reparation", eventType: "felavhjalpande-underhall" },
  "5020": { category: "el", eventType: "forbrukning" },
  "5030": { category: "varme", eventType: "forbrukning" },
  "5040": { category: "vatten", eventType: "forbrukning" },
  "6310": { category: "forsakring", eventType: "avtalskostnad" },
  "8410": { category: "ranta", eventType: "avtalskostnad" },
};

/**
 * Klassificering mot vår egen fastighetsstruktur.
 * I prototypen en enkel textmatchning; senare regler + AI-förslag med granskning.
 */
function classifyProperty(text: string): { property: PropertyRef; confidence: number } {
  const t = text.toLowerCase();
  if (t.includes("tvättstuga")) {
    return {
      property: { propertyId: "storgatan-12", areaId: "tvattstuga", componentId: "tm2" },
      confidence: 0.8,
    };
  }
  if (t.includes("värme") || t.includes("ventilation")) {
    return { property: { propertyId: "storgatan-12", areaId: "varme" }, confidence: 0.7 };
  }
  return { property: { propertyId: "storgatan-12" }, confidence: 0.3 };
}

/** Mock-adapter som visar hur originaldata behålls samtidigt som den klassificeras. */
export const mockEconomyAdapter: EconomySourceAdapter = {
  id: "mock",
  label: "Mockdata (prototyp)",
  supports: ["api", "file", "manual"],
  normalize: (records) => {
    const events: LedgerEvent[] = records.map((record, index) => {
      const row = record.raw as unknown as ExternalLedgerRow;
      const mapping = accountCategory[row.account] ?? {
        category: "ovrigt" as CostCategory,
        eventType: "ovrigt" as EventType,
      };
      const { property, confidence } = classifyProperty(
        [row.text, row.accountName, row.supplier].filter(Boolean).join(" "),
      );

      return {
        id: `${record.sourceSystem}-${row.verificationNumber ?? row.invoiceNumber ?? index}`,
        date: row.date,
        amountMinor: Math.round(row.amount * 100),
        currency: row.currency ?? "SEK",
        description: row.text ?? row.accountName ?? "",
        category: mapping.category,
        eventType: mapping.eventType,
        property,
        classificationConfidence: confidence,
        needsReview: confidence < 0.6,
        source: {
          sourceSystem: record.sourceSystem,
          ingestMethod: record.ingestMethod,
          originalAccount: row.account,
          originalAccountName: row.accountName,
          verificationNumber: row.verificationNumber,
          invoiceNumber: row.invoiceNumber,
          supplier: row.supplier,
          originalDescription: row.text,
          originalDate: row.date,
          originalAmountMinor: Math.round(row.amount * 100),
          currency: row.currency ?? "SEK",
          importedAt: record.receivedAt,
        },
      };
    });

    return { ...emptyDataset, events };
  },
};

/** Registret som applikationen på sikt väljer källa ifrån. */
export const sourceAdapters: EconomySourceAdapter[] = [mockEconomyAdapter];

export function getAdapter(id: SourceSystem): EconomySourceAdapter | undefined {
  return sourceAdapters.find((adapter) => adapter.id === id);
}
