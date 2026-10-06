/**
 * GEMENSAM INTERN DATAMODELL
 *
 * Detta är plattformens kärna. Allt UI och all analys läser endast dessa typer.
 * Externa ekonomisystem (Fortnox, Oqto, Visma, Björn Lundén, SIE, CSV, fakturor)
 * är DATAKÄLLOR och får aldrig läcka sina egna datastrukturer in i UI-lagret.
 *
 * Lagerindelning:
 *   1. extern rådata        -> src/domain/sources (SourceRecord)
 *   2. normaliserad data    -> denna fil (LedgerEvent m.fl.)
 *   3. analys               -> src/domain/analysis
 *   4. presentation/UI      -> src/components, src/routes
 */

/** Källsystem som data kan komma ifrån. Listan kan utökas utan att UI påverkas. */
export type SourceSystem =
  "fortnox" | "oqto" | "visma" | "bjorn-lunden" | "sie" | "csv" | "invoice" | "manual" | "mock";

/** Hur data kom in i plattformen. */
export type IngestMethod = "api" | "sie" | "file" | "invoice" | "manual";

/**
 * Originalinformation från källsystemet. Sparas alltid oförändrad
 * så att spårbarhet mot extern bokföring behålls.
 */
export type SourceRef = {
  sourceSystem: SourceSystem;
  ingestMethod: IngestMethod;
  /** Kontonummer i källsystemet, t.ex. "5170". */
  originalAccount?: string | undefined;
  originalAccountName?: string | undefined;
  verificationNumber?: string | undefined;
  invoiceNumber?: string | undefined;
  supplier?: string | undefined;
  originalDescription?: string | undefined;
  /** Datum enligt källsystemet, ISO-8601. */
  originalDate?: string | undefined;
  /** Belopp i öre enligt källsystemet, för exakt avstämning. */
  originalAmountMinor?: number | undefined;
  currency?: string | undefined;
  importedAt?: string | undefined;
};

/** Vår egen ekonomiska kategorisering – oberoende av kontoplan. */
export type CostCategory =
  | "drift"
  | "reparation"
  | "planerat-underhall"
  | "vatten"
  | "el"
  | "varme"
  | "forsakring"
  | "administration"
  | "ranta"
  | "amortering"
  | "hyresintakt"
  | "ovrigt";

/** Vad händelsen representerar i fastighetens liv. */
export type EventType =
  | "felavhjalpande-underhall"
  | "planerat-underhall"
  | "besiktning"
  | "installation"
  | "utbyte"
  | "forbrukning"
  | "avtalskostnad"
  | "ovrigt";

export type MaintenanceActionRef = {
  /** Id mot underhållsplanen. */
  planItemId: string;
  planYear?: string | undefined;
};

/** Fastighet, fastighetsdel och komponent i vår egen struktur. */
export type PropertyRef = {
  propertyId: string;
  /** T.ex. "tvattstuga", "varme", "tak". */
  areaId?: string | undefined;
  /** T.ex. "tm2" (Tvättmaskin 2). */
  componentId?: string | undefined;
};

/**
 * Normaliserad ekonomisk händelse – plattformens minsta gemensamma nämnare.
 * Både en bokförd kostnad, en faktura och en förbrukningspost blir en LedgerEvent.
 */
export type LedgerEvent = {
  id: string;
  /** Datum i vår modell, ISO-8601. */
  date: string;
  /** Belopp i öre, positivt = kostnad, negativt = intäkt/kreditering. */
  amountMinor: number;
  currency: string;
  description: string;
  category: CostCategory;
  eventType: EventType;
  property: PropertyRef;
  maintenance?: MaintenanceActionRef | undefined;
  /** Originalinformationen finns alltid kvar. */
  source: SourceRef;
  /** Hur säker klassificeringen är (0–1). Låg tillit kan kräva mänsklig granskning. */
  classificationConfidence?: number | undefined;
  /** True om klassificeringen gjorts av regel/AI och inte bekräftats av människa. */
  needsReview?: boolean | undefined;
};

/** Normaliserad mätarförbrukning (värme, el, vatten). */
export type ConsumptionReading = {
  id: string;
  periodStart: string;
  periodEnd: string;
  meterType: "varme" | "el" | "vatten";
  quantity: number;
  unit: "kWh" | "m3";
  property: PropertyRef;
  source: SourceRef;
};

/** Normaliserat lån. */
export type LoanRecord = {
  id: string;
  lender: string;
  principalMinor: number;
  interestRate: number;
  maturityDate: string;
  propertyId: string;
  source: SourceRef;
};

/** Allt som en adapter kan leverera efter normalisering. */
export type NormalizedDataset = {
  events: LedgerEvent[];
  consumption: ConsumptionReading[];
  loans: LoanRecord[];
};

export const emptyDataset: NormalizedDataset = {
  events: [],
  consumption: [],
  loans: [],
};
