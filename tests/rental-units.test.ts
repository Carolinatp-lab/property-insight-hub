import { test } from "node:test";
import assert from "node:assert/strict";
import { properties } from "../src/data/portfolio.ts";
import {
  createRentalUnits,
  createUnitRecord,
  recordUnitEvent,
  type UnitEvent,
} from "../src/data/rental-units.ts";
const units = createRentalUnits(properties);

test("Alla lägenheter och lokaler finns i registret och stämmer med fastigheternas vakans", () => {
  assert.equal(units.length, 50);
  assert.equal(new Set(units.map((unit) => unit.id)).size, 50);
  for (const property of properties) {
    const items = units.filter((unit) => unit.propertyId === property.id);
    assert.equal(items.filter((unit) => unit.type === "Hyresrätt").length, property.apartments);
    assert.equal(items.filter((unit) => unit.type === "Lokal").length, property.premises);
    assert.equal(items.filter((unit) => unit.vacant).length, property.vacant);
    assert.equal(new Set(items.map((unit) => unit.number)).size, items.length);
  }
});

test("Ett utbyte uppdaterar rätt utrustning utan att ändra historik eller ett annat objekts journal", () => {
  const first = createUnitRecord(units[0]!);
  const second = createUnitRecord(units[1]!);
  const event: UnitEvent = {
    id: "test",
    category: "Utbyte",
    date: "2026-10-06",
    title: "Ny frys",
    description: "Utbytt",
    equipmentId: "freezer",
    equipmentName: "Frys",
    model: "Ny modell",
    cost: 7000,
  };
  const updated = recordUnitEvent(first, event);
  assert.equal(updated.equipment.find((item) => item.id === "freezer")?.installed, "2026-10-06");
  assert.equal(updated.equipment.find((item) => item.id === "freezer")?.model, "Ny modell");
  assert.deepEqual(
    updated.equipment.find((item) => item.id === "fridge"),
    first.equipment.find((item) => item.id === "fridge"),
  );
  assert.deepEqual(first, second);
  assert.equal(updated.events.length, first.events.length + 1);
  assert.equal(
    first.events.some((item) => item.id === "test"),
    false,
  );
});

test("Ny utrustning kan läggas till, medan äldre och andra händelser inte skriver över senaste utbyte", () => {
  const record = createUnitRecord(units[0]!);
  const event: UnitEvent = {
    id: "test",
    category: "Utbyte",
    date: "2020-01-01",
    title: "Historiskt utbyte",
    description: "",
    equipmentId: "fridge",
    equipmentName: "Kylskåp",
    model: "Gammal modell",
    cost: null,
  };
  assert.deepEqual(recordUnitEvent(record, event).equipment, record.equipment);
  const added = recordUnitEvent(record, {
    ...event,
    equipmentId: "dishwasher",
    equipmentName: "Diskmaskin",
    date: "2026-10-06",
    model: "Bosch",
  });
  assert.equal(added.equipment.length, record.equipment.length + 1);
  assert.equal(added.equipment.find((item) => item.id === "dishwasher")?.name, "Diskmaskin");
  assert.deepEqual(
    recordUnitEvent(record, { ...event, category: "Renovering", date: "2026-10-06" }).equipment,
    record.equipment,
  );
});
