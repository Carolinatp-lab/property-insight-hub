/**
 * LAGER 1 – EXTERN RÅDATA
 *
 * Rådata behålls exakt som källsystemet levererade den. Ingen del av UI:t får
 * importera denna fil. Endast adaptrar (src/domain/adapters.ts) läser den.
 */

import type { IngestMethod, SourceSystem } from "./model";

/** En oförändrad post från ett källsystem, oavsett format. */
export type SourceRecord = {
  sourceSystem: SourceSystem;
  ingestMethod: IngestMethod;
  /** Fritt format – exakt som källan levererade posten. */
  raw: Record<string, unknown>;
  receivedAt: string;
};

/** Exempel: en bokföringsrad från ett ekonomisystem (rådata). */
export type ExternalLedgerRow = {
  account: string;
  accountName?: string;
  amount: number;
  currency?: string;
  date: string;
  supplier?: string;
  invoiceNumber?: string;
  verificationNumber?: string;
  text?: string;
};

/** Exempel på rådata enligt principen i arkitekturbeskrivningen. */
export const exampleExternalRow: SourceRecord = {
  sourceSystem: "mock",
  ingestMethod: "api",
  receivedAt: "2026-05-14T00:00:00.000Z",
  raw: {
    account: "5170",
    accountName: "Reparation och underhåll",
    amount: 9400,
    currency: "SEK",
    date: "2026-05-14",
    supplier: "Exempelservice AB",
    invoiceNumber: "2026-1048",
    text: "Reparation tvättstuga",
  } satisfies ExternalLedgerRow as unknown as Record<string, unknown>,
};
