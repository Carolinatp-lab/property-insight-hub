import type { Property } from "./portfolio";

export type RentalUnit = {
  id: string;
  propertyId: string;
  number: string;
  type: "Hyresrätt" | "Lokal";
  rooms: number | null;
  area: number;
  floor: string;
  vacant: boolean;
};
export type Equipment = { id: string; name: string; model: string; installed: string };
export type UnitEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  category: "Utbyte" | "Renovering" | "Besiktning" | "Övrigt";
  equipmentId: string;
  equipmentName: string;
  model: string;
  cost: number | null;
};
export type UnitTask = {
  id: string;
  title: string;
  due: string;
  budget: number;
  completed: boolean;
};
export type UnitPhoto = {
  id: string;
  src: string;
  caption: string;
  date: string;
  stage: "Före" | "Efter" | "Dokumentation";
  occasion: "Inflyttning" | "Utflyttning" | "Renovering" | "Övrigt";
  eventId: string;
};
export type UnitRecord = {
  equipment: Equipment[];
  events: UnitEvent[];
  tasks: UnitTask[];
  photos: UnitPhoto[];
};

/** Ett objekt per faktisk hyreslägenhet/lokal i exempelbeståndet. Garage ingår inte. */
export function createRentalUnits(properties: Property[]): RentalUnit[] {
  return properties.flatMap((property) => [
    ...Array.from({ length: property.apartments }, (_, i) => {
      const rooms = (i % 3) + 1;
      const floor = Math.floor(i / 6) + 1;
      const number = `${floor + 9}${String((i % 6) + 1).padStart(2, "0")}`;
      return {
        id: `${property.id}-apt-${number}`,
        propertyId: property.id,
        number,
        type: "Hyresrätt" as const,
        rooms,
        area: 30 + rooms * 14 + (i % 4) * 2,
        floor: `Plan ${floor}`,
        vacant: property.vacant > 0 && i === property.apartments - 1,
      };
    }),
    ...Array.from({ length: property.premises }, (_, i) => ({
      id: `${property.id}-local-${i + 1}`,
      propertyId: property.id,
      number: `L${String(i + 1).padStart(2, "0")}`,
      type: "Lokal" as const,
      rooms: null,
      area: 80 + i * 24,
      floor: "Gatuplan",
      vacant: property.apartments === 0 && i >= property.premises - property.vacant,
    })),
  ]);
}

/** Illustrativa objektjournaler, inga verkliga hyresgäster eller dokument. */
export function createUnitRecord(unit: RentalUnit): UnitRecord {
  const equipment =
    unit.type === "Hyresrätt"
      ? [
          {
            id: "fridge",
            name: "Kylskåp",
            model: "Electrolux · exempelmodell",
            installed: "2023-04-12",
          },
          {
            id: "freezer",
            name: "Frys",
            model: "Electrolux · exempelmodell",
            installed: "2020-06-15",
          },
          { id: "stove", name: "Spis", model: "Bosch · exempelmodell", installed: "2019-09-02" },
          {
            id: "hood",
            name: "Spiskåpa",
            model: "Franke · exempelmodell",
            installed: "2021-02-10",
          },
        ]
      : [
          {
            id: "ventilation",
            name: "Ventilation",
            model: "Systemair · exempelmodell",
            installed: "2021-02-10",
          },
          {
            id: "lighting",
            name: "Belysning",
            model: "LED-armaturer · exempelmodell",
            installed: "2023-04-12",
          },
        ];
  return {
    equipment,
    events: [
      {
        id: "inspection",
        date: "2026-09-01",
        category: "Besiktning",
        title: unit.vacant ? "Utflyttningsbesiktning" : "Inflyttningsbesiktning",
        description: "Ytskikt och utrustning dokumenterade. Exempelanteckning för detta objekt.",
        equipmentId: "",
        equipmentName: "",
        model: "",
        cost: null,
      },
      {
        id: "replacement",
        date: "2023-04-12",
        category: "Utbyte",
        title: unit.type === "Hyresrätt" ? "Kylskåp utbytt" : "Belysning utbytt",
        description: "Den äldre utrustningen ersattes. Installation och funktion kontrollerade.",
        equipmentId: unit.type === "Hyresrätt" ? "fridge" : "lighting",
        equipmentName: unit.type === "Hyresrätt" ? "Kylskåp" : "Belysning",
        model: equipment.find((item) => item.installed === "2023-04-12")!.model,
        cost: 8500,
      },
      {
        id: "renovation",
        date: "2022-08-20",
        category: "Renovering",
        title: unit.type === "Hyresrätt" ? "Hall och vardagsrum målade" : "Ytskikt renoverade",
        description: "Väggar och tak målade. Mindre skador i ytskikten åtgärdade.",
        equipmentId: "",
        equipmentName: "",
        model: "",
        cost: 24000,
      },
    ],
    tasks: [
      {
        id: "service",
        title:
          unit.type === "Hyresrätt" ? "Kontrollera kyl, frys och spis" : "Service av ventilation",
        due: "2026-12-01",
        budget: 1500,
        completed: false,
      },
      {
        id: "surfaces",
        title: "Bedöm ytskikt vid nästa besiktning",
        due: "2027-03-15",
        budget: 3000,
        completed: false,
      },
    ],
    photos: [],
  };
}

export function recordUnitEvent(record: UnitRecord, event: UnitEvent): UnitRecord {
  return {
    ...record,
    events: [event, ...record.events],
    equipment: [
      ...record.equipment,
      ...(event.category === "Utbyte" &&
      event.equipmentId &&
      event.equipmentName &&
      !record.equipment.some((item) => item.id === event.equipmentId)
        ? [
            {
              id: event.equipmentId,
              name: event.equipmentName,
              model: event.model,
              installed: event.date,
            },
          ]
        : []),
    ].map((item) =>
      event.category === "Utbyte" && event.equipmentId === item.id && event.date >= item.installed
        ? { ...item, installed: event.date, model: event.model || item.model }
        : item,
    ),
  };
}
export const unitLabel = (unit: RentalUnit) =>
  unit.type === "Lokal" ? `Lokal ${unit.number}` : `Lägenhet ${unit.number}`;
