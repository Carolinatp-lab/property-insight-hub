/**
 * LAGER 3 – ANALYS
 *
 * Analysen läser endast den gemensamma interna datamodellen. Den vet ingenting
 * om Fortnox, Oqto, Visma, SIE-filer eller fakturaformat.
 *
 * I prototypen används fortfarande mockdata i src/data/*. Dessa funktioner visar
 * vilket kontrakt framtida analys ska följa när riktig data finns.
 */

import type { CostCategory, LedgerEvent } from "./model";

export type CostSummary = {
  areaId?: string | undefined;
  componentId?: string | undefined;
  totalMinor: number;
  eventCount: number;
};

export function sumByComponent(events: LedgerEvent[]): CostSummary[] {
  const map = new Map<string, CostSummary>();
  for (const event of events) {
    const key = `${event.property.areaId ?? "-"}/${event.property.componentId ?? "-"}`;
    const current = map.get(key) ?? {
      areaId: event.property.areaId,
      componentId: event.property.componentId,
      totalMinor: 0,
      eventCount: 0,
    };
    current.totalMinor += event.amountMinor;
    current.eventCount += 1;
    map.set(key, current);
  }
  return [...map.values()].sort((a, b) => b.totalMinor - a.totalMinor);
}

export function sumByCategory(events: LedgerEvent[]): Record<string, number> {
  return events.reduce<Record<string, number>>((acc, event) => {
    acc[event.category] = (acc[event.category] ?? 0) + event.amountMinor;
    return acc;
  }, {});
}

export function filterByCategory(events: LedgerEvent[], category: CostCategory) {
  return events.filter((event) => event.category === category);
}

/** Poster där klassificeringen behöver bekräftas av en människa. */
export function needsHumanReview(events: LedgerEvent[]) {
  return events.filter((event) => event.needsReview);
}
