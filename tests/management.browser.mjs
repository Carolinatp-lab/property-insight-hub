import process from "node:process";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const baseURL = process.env.TEST_BASE_URL ?? "http://127.0.0.1:8083";
const mode = process.env.MANAGEMENT_MODE ?? "owner";
const screenshots = process.env.SCREENSHOT_DIR ?? "work/management-artifacts";
await fs.mkdir(screenshots, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}),
});
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    acceptDownloads: true,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${baseURL}/avtal`);
  await page.getByRole("heading", { name: "Avtalsbibliotek", exact: true }).waitFor();
  assert.equal(await page.getByRole("button", { name: "Visa mall", exact: true }).count(), 5);
  await page.screenshot({ path: path.join(screenshots, "avtalsmallar.png") });
  await page.getByRole("button", { name: "Visa mall", exact: true }).first().click();
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Lägg till avtalsmall", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Mallnamn", { exact: true }).fill("Eget serviceavtal – test");
  await dialog.getByLabel("Version", { exact: true }).fill("2.0");
  await dialog.getByLabel("Versionsdatum").fill("2026-10-07");
  await dialog.getByLabel("Mallfil").setInputFiles({
    name: "serviceavtal.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Eget serviceavtal med åäö"),
  });
  await dialog.getByRole("button", { name: "Spara avtalsmall", exact: true }).click();
  await page.getByRole("heading", { name: "Eget serviceavtal – test", exact: true }).waitFor();
  const downloadEvent = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Ladda ner Eget serviceavtal – test", exact: true })
    .click();
  const download = await downloadEvent;
  assert.equal(await fs.readFile(await download.path(), "utf8"), "Eget serviceavtal med åäö");
  await page.reload();
  await page.getByRole("heading", { name: "Eget serviceavtal – test", exact: true }).waitFor();
  await page.getByRole("tab", { name: "Leverantörer", exact: true }).click();
  await page.getByRole("button", { name: "Lägg till leverantör", exact: true }).click();
  await dialog.getByLabel("Företagsnamn", { exact: true }).fill("Test VVS AB");
  await dialog.getByLabel("Kontaktperson", { exact: true }).fill("Anna Test");
  await dialog.getByLabel("Geografiskt område", { exact: true }).fill("Stockholm");
  await dialog.getByLabel("Yrkesområde", { exact: true }).selectOption("VVS");
  await dialog.getByLabel("Prioriterad leverantör", { exact: true }).check();
  await dialog.getByRole("button", { name: "Spara leverantör", exact: true }).click();
  await page.getByRole("heading", { name: "Test VVS AB", exact: true }).waitFor();
  await page.getByLabel("Yrkesområde", { exact: true }).selectOption("VVS");
  assert.equal(await page.locator("article").count(), 2);
  await page.getByLabel("Sök leverantör").fill("Anna Test");
  assert.equal(await page.locator("article").count(), 1);
  await page.getByLabel("Sök leverantör").fill("");
  await page.getByLabel("Yrkesområde", { exact: true }).selectOption("all");
  await page.screenshot({ path: path.join(screenshots, "leverantorer.png") });
  await page.goto(`${baseURL}/underhall`);
  await page.getByRole("heading", { name: "Leverantörer & uppdrag", exact: true }).waitFor();
  const section = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "Leverantörer & uppdrag", exact: true }) });
  const action = section.getByRole("listitem").first();
  await action.getByLabel("Leverantörens yrkesområde").selectOption("VVS");
  const option = action
    .getByLabel("Ansvarig leverantör (valfritt)")
    .locator("option")
    .filter({ hasText: "Test VVS AB" });
  await option.waitFor({ state: "attached" });
  await action
    .getByLabel("Ansvarig leverantör (valfritt)")
    .selectOption(await option.getAttribute("value"));
  await action.getByRole("button", { name: "Markera uppdrag utfört", exact: true }).click();
  await action.getByText("Utförare: Test VVS AB · VVS", { exact: true }).waitFor();
  await page.reload();
  await page.getByText("Utförare: Test VVS AB · VVS", { exact: true }).waitFor();
  await page.screenshot({ path: path.join(screenshots, "underhall-leverantor.png") });
  await page.goto(`${baseURL}/avtal`);
  await page.getByRole("tab", { name: "Leverantörer", exact: true }).click();
  const partner = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Test VVS AB", exact: true }) });
  assert.match(await partner.innerText(), /Tidigare utförda uppdrag/);
  await partner.getByRole("button", { name: "Redigera Test VVS AB", exact: true }).click();
  await dialog.getByLabel("Företagsnamn", { exact: true }).fill("Test VVS nytt namn AB");
  await dialog.getByRole("button", { name: "Spara leverantör", exact: true }).click();
  await page.getByRole("heading", { name: "Test VVS nytt namn AB", exact: true }).waitFor();
  await page.goto(`${baseURL}/underhall`);
  await page.getByText("Utförare: Test VVS AB · VVS", { exact: true }).waitFor();
  await page.goto(`${baseURL}/avtal`);
  await page.getByRole("heading", { name: "Avtalsbibliotek", exact: true }).waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: path.join(screenshots, "avtal-mobil.png") });
  await page.getByRole("tab", { name: "Leverantörer", exact: true }).click();
  await page.getByRole("button", { name: "Lägg till leverantör", exact: true }).click();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await dialog.getByLabel("Företagsnamn", { exact: true }).fill("Mobiltest");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Lägg till leverantör", exact: true }).waitFor();
  await page.setViewportSize({ width: 1440, height: 1100 });
  // Ett skrivfel får inte stänga formuläret eller tappa inmatningen.
  await page.getByRole("button", { name: "Lägg till leverantör", exact: true }).click();
  await dialog.getByLabel("Företagsnamn", { exact: true }).fill("Sparfel test");
  await dialog.getByLabel("Geografiskt område", { exact: true }).fill("Testområde");
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === "modules") throw new DOMException("Testkvot", "QuotaExceededError");
      return original.apply(this, args);
    };
  });
  await dialog.getByRole("button", { name: "Spara leverantör", exact: true }).click();
  await dialog.getByRole("alert").waitFor();
  assert.equal(
    await dialog.getByLabel("Företagsnamn", { exact: true }).inputValue(),
    "Sparfel test",
  );
  await page.reload();
  await page.getByRole("heading", { name: "Avtalsbibliotek", exact: true }).waitFor();
  if (mode === "owner") {
    await page.goto(`${baseURL}/hyresobjekt`);
    await page.waitForLoadState("networkidle");
    await page
      .getByRole("button", { name: "Öppna Lägenhet 1001 · Storgatan 12", exact: true })
      .click();
    await dialog.getByRole("tab", { name: "Underhåll", exact: true }).click();
    await dialog.getByRole("button", { name: "Planera åtgärd", exact: true }).click();
    await dialog.getByLabel("Åtgärd", { exact: true }).fill("VVS-kontroll – leverantörstest");
    await dialog.getByLabel("Planerat datum").fill("2027-06-15");
    await dialog.getByLabel("Beräknad kostnad (kr)").fill("1500");
    await dialog.getByLabel("Leverantörens yrkesområde").selectOption("VVS");
    const selected = dialog
      .getByLabel("Ansvarig leverantör (valfritt)")
      .locator("option")
      .filter({ hasText: "Test VVS nytt namn AB" });
    await selected.waitFor({ state: "attached" });
    await dialog
      .getByLabel("Ansvarig leverantör (valfritt)")
      .selectOption(await selected.getAttribute("value"));
    await dialog.getByRole("button", { name: "Spara åtgärd", exact: true }).click();
    const task = dialog.getByRole("listitem").filter({ hasText: "VVS-kontroll – leverantörstest" });
    await task.getByText("Leverantör: Test VVS nytt namn AB · VVS", { exact: true }).waitFor();
    await task.getByRole("button", { name: "Markera utförd", exact: true }).click();
    await task.getByText("Utförd", { exact: true }).waitFor();
    await dialog.getByRole("tab", { name: "Förändringslogg", exact: true }).click();
    await dialog.getByText("Utfört av: Test VVS nytt namn AB · VVS", { exact: true }).waitFor();
    await page.reload();
    await page.waitForLoadState("networkidle");
    await page
      .getByRole("button", { name: "Öppna Lägenhet 1001 · Storgatan 12", exact: true })
      .click();
    await dialog.getByRole("tab", { name: "Förändringslogg", exact: true }).click();
    await dialog.getByText("Utfört av: Test VVS nytt namn AB · VVS", { exact: true }).waitFor();
  }
  assert.deepEqual(errors, []);
  console.log(
    `${mode}: uppladdning, nedladdning, register, filter, uppdragshistorik, omladdning och mobilkontroller godkända`,
  );
} finally {
  await browser.close();
}
