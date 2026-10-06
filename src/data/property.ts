// Mock-data för fastighetssidan. Separerad från UI för att enkelt kunna
// ersättas med data från API/databas.

import type { Status } from "./overview";

export type Transaction = {
  supplier: string;
  invoice: string;
  amount: string;
  accounting: string;
  areaName: string;
  componentName: string;
  date: string;
};

export type TimelineEvent = {
  id: string;
  period: string;
  type: string;
  amount: string;
  transaction?: Transaction;
};

export type MaintenancePlan = {
  action: string;
  year: string;
  estimatedCost: string;
  /** Sekundär i gränssnittet – finns i datamodellen. */
  k3Component: string;
};

export type PropertyComponent = {
  id: string;
  areaId: string;
  name: string;
  status: Status;
  installed: string;
  placement?: string;
  cost12m: string;
  repairs: string;
  plannedReplacement: string;
  timeline?: TimelineEvent[];
  totalCost?: string;
  analysis?: { fact: string; analysis: string; recommendation: string };
  plan?: MaintenancePlan;
};

export type AreaDetail = {
  areaId: string;
  metrics: { label: string; value: string }[];
  components: PropertyComponent[];
};

const washerTimeline: TimelineEvent[] = [
  {
    id: "t1",
    period: "September 2025",
    type: "Reparation",
    amount: "7 200 kr",
    transaction: {
      supplier: "Exempelservice AB",
      invoice: "2025-2210",
      amount: "7 200 kr",
      accounting: "Reparation tvättstuga",
      areaName: "Tvättstuga",
      componentName: "Tvättmaskin 2",
      date: "18 september 2025",
    },
  },
  {
    id: "t2",
    period: "December 2025",
    type: "Reparation",
    amount: "6 800 kr",
    transaction: {
      supplier: "Exempelservice AB",
      invoice: "2025-3104",
      amount: "6 800 kr",
      accounting: "Reparation tvättstuga",
      areaName: "Tvättstuga",
      componentName: "Tvättmaskin 2",
      date: "9 december 2025",
    },
  },
  {
    id: "t3",
    period: "Februari 2026",
    type: "Reparation",
    amount: "8 400 kr",
    transaction: {
      supplier: "Exempelservice AB",
      invoice: "2026-0417",
      amount: "8 400 kr",
      accounting: "Reparation tvättstuga",
      areaName: "Tvättstuga",
      componentName: "Tvättmaskin 2",
      date: "3 februari 2026",
    },
  },
  {
    id: "t4",
    period: "14 maj 2026",
    type: "Reparation",
    amount: "9 400 kr",
    transaction: {
      supplier: "Exempelservice AB",
      invoice: "2026-1048",
      amount: "9 400 kr",
      accounting: "Reparation tvättstuga",
      areaName: "Tvättstuga",
      componentName: "Tvättmaskin 2",
      date: "14 maj 2026",
    },
  },
];

export const areaDetails: Record<string, AreaDetail> = {
  tvattstuga: {
    areaId: "tvattstuga",
    metrics: [
      { label: "Kostnad senaste 12 månaderna", value: "31 800 kr" },
      { label: "Antal fel/reparationer", value: "4" },
      { label: "Senaste åtgärd", value: "14 maj 2026" },
      { label: "Planerat underhåll", value: "2028" },
    ],
    components: [
      {
        id: "tm1",
        areaId: "tvattstuga",
        name: "Tvättmaskin 1",
        status: "good",
        installed: "2017",
        cost12m: "0 kr",
        repairs: "0",
        plannedReplacement: "2028",
      },
      {
        id: "tm2",
        areaId: "tvattstuga",
        name: "Tvättmaskin 2",
        status: "alert",
        installed: "2017",
        placement: "Tvättstuga, källarplan",
        cost12m: "31 800 kr",
        repairs: "4",
        plannedReplacement: "2028",
        timeline: washerTimeline,
        totalCost: "31 800 kr",
        analysis: {
          fact: "Tvättmaskin 2 har reparerats fyra gånger under de senaste 12 månaderna. Den sammanlagda kostnaden är 31 800 kr.",
          analysis:
            "Reparationskostnaderna är koncentrerade till samma maskin och återkommer med relativt korta intervall. Enligt underhållsplanen är byte planerat till 2028 med en bedömd kostnad på 45 000 kr.",
          recommendation:
            "Utred om det är ekonomiskt mer fördelaktigt att tidigarelägga bytet än att fortsätta reparera maskinen.",
        },
        plan: {
          action: "Byte av tvättmaskin",
          year: "2028",
          estimatedCost: "45 000 kr",
          k3Component: "Installationer / maskinutrustning",
        },
      },
      {
        id: "tm3",
        areaId: "tvattstuga",
        name: "Tvättmaskin 3",
        status: "good",
        installed: "2019",
        cost12m: "0 kr",
        repairs: "0",
        plannedReplacement: "2030",
      },
      {
        id: "tt1",
        areaId: "tvattstuga",
        name: "Torktumlare 1",
        status: "good",
        installed: "2019",
        cost12m: "0 kr",
        repairs: "0",
        plannedReplacement: "2030",
      },
      {
        id: "ts1",
        areaId: "tvattstuga",
        name: "Torkskåp",
        status: "watch",
        installed: "2015",
        cost12m: "1 900 kr",
        repairs: "1",
        plannedReplacement: "2027",
      },
    ],
  },
};

/** Mock-beslutspunkt som skapas när en fråga läggs till förvaltningsmötet. */
export const boardDraftItem = {
  title: "Tvättstuga – Tvättmaskin 2",
  background: "Fyra reparationer under de senaste 12 månaderna.",
  costSoFar: "31 800 kr",
  plannedReplacement: "2028",
  estimatedCost: "45 000 kr",
  proposal: "Ta in offert för utbyte och jämför med fortsatt reparationskostnad.",
  question: "Ska fastighetsägaren ta in offert för tidigarelagt byte av Tvättmaskin 2?",
};
