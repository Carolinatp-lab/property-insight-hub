import { test } from "node:test";
import assert from "node:assert/strict";
import { properties, summarizeProperties } from "../src/data/portfolio.ts";

test("Beståndets summering och vakans viktas efter antal hyresobjekt", () => {
  const result = summarizeProperties(properties);
  assert.equal(result.count, 3);
  assert.equal(result.apartments, 42);
  assert.equal(result.premises, 8);
  assert.equal(result.garages, 40);
  assert.equal(result.rent, 9960000);
  assert.equal(result.net, 6010000);
  assert.equal(result.maintenance, 565000);
  assert.equal(result.vacancy, 4);
});

test("En enskild fastighet summeras utan data från övriga beståndet", () => {
  const park = properties.find((p) => p.id === "parkvagen-8")!;
  assert.equal(summarizeProperties([park]).rent, 2160000);
  assert.equal(summarizeProperties([park]).vacancy, 0);
  assert.equal(summarizeProperties([park]).maintenance, 65000);
  const industry = properties.find((p) => p.id === "industrigatan-4")!;
  assert.ok(Math.abs(summarizeProperties([industry]).vacancy - 100 / 6) < 1e-10);
});

test("Tomt bestånd ger nollvärden och fastighets-ID är unika", () => {
  assert.equal(summarizeProperties([]).vacancy, 0);
  assert.equal(summarizeProperties([]).net, 0);
  assert.equal(new Set(properties.map((p) => p.id)).size, properties.length);
});
