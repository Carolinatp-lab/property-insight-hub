import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createManagementRecord,
  availablePartners,
  partnerSnapshot,
  exampleTemplates,
} from "../src/data/management.ts";

test("Avtalsmallar anpassas till respektive modul", () => {
  const owner = exampleTemplates("owner");
  const brf = exampleTemplates("brf");
  assert.equal(owner.length, 5);
  assert.equal(brf.length, 5);
  assert.ok(owner.some((t) => t.name === "Hyresavtal – bostad"));
  assert.ok(brf.some((t) => t.name === "Entreprenadavtal"));
  assert.ok(!brf.some((t) => t.name === "Hyresavtal – bostad"));
  assert.ok(
    owner.every((t) => !/förening|styrelsen|årsavgift|bostadsrätt/i.test(t.text + t.description)),
  );
});

test("Leverantörsval respekterar fastighet, yrke och prioritering utan att ändra registret", () => {
  const { partners } = createManagementRecord("owner", [{ id: "a", address: "A" }]);
  partners[0]!.propertyIds = ["b"];
  const original = partners.map((p) => p.id);
  const available = availablePartners(partners, "a");
  assert.ok(!available.some((p) => p.id === partners[0]!.id));
  assert.ok(available[0]!.preferred);
  assert.deepEqual(
    availablePartners(partners, "a", "VVS").map((p) => p.trade),
    ["VVS"],
  );
  assert.deepEqual(
    partners.map((p) => p.id),
    original,
  );
});

test("Utförarens historik bevaras när leverantörens uppgifter ändras", () => {
  const record = createManagementRecord("brf", [{ id: "brf", address: "BRF" }]);
  const partner = record.partners[0]!;
  const snapshot = partnerSnapshot(partner);
  const name = snapshot.name;
  partner.name = "Nytt namn";
  partner.trade = "El";
  assert.equal(snapshot.name, name);
  assert.equal(snapshot.trade, "Snöröjning");
  assert.equal(snapshot.id, partner.id);
});
