import process from "node:process";
import path from "node:path";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const baseURL = process.env.TEST_BASE_URL ?? "http://127.0.0.1:8083";
const screenshots = process.env.SCREENSHOT_DIR ?? "work/browser-artifacts";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
await fs.mkdir(screenshots, { recursive: true });
const browser = await chromium.launch({
  ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}),
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  acceptDownloads: true,
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(`${baseURL}/hyresobjekt`);
await page.waitForLoadState("networkidle");
const rows = () => page.getByRole("button", { name: /^Öppna (Lägenhet|Lokal)/ });
assert.equal(await rows().count(), 50);
await page.getByLabel("Fastighetsval").selectOption("parkvagen-8");
assert.equal(await rows().count(), 18);
await page.getByLabel("Fastighetsval").selectOption("industrigatan-4");
assert.equal(await rows().count(), 6);
await page.getByLabel("Uthyrningsstatus").selectOption("vacant");
assert.equal(await rows().count(), 1);
await page.getByLabel("Fastighetsval").selectOption("all");
await page.getByLabel("Sök objekt").fill("1001");
assert.equal(await rows().count(), 2);
await page.getByRole("button", { name: "Rensa filter" }).click();
await page.getByLabel("Objekttyp").selectOption("Lokal");
assert.equal(await rows().count(), 8);
await page.getByLabel("Uthyrningsstatus").selectOption("vacant");
assert.equal(await rows().count(), 1);
await page.getByRole("button", { name: "Rensa filter" }).click();
await page.getByLabel("Sök objekt").fill("saknas");
assert.equal(await rows().count(), 0);
await page.getByRole("button", { name: "Rensa filter" }).click();
await page.getByLabel("Fastighetsval").selectOption("storgatan-12");
await page.screenshot({ path: path.join(screenshots, "objektsregister.png"), fullPage: false });
const first = "Öppna Lägenhet 1001 · Storgatan 12";
await page.getByRole("button", { name: first, exact: true }).click();
const dialog = () => page.getByRole("dialog").first();
await dialog().getByRole("heading", { name: "Utrustning och installationer" }).waitFor();
await dialog().evaluate((el) =>
  Promise.all(el.getAnimations().map((animation) => animation.finished)),
);
await page.screenshot({ path: path.join(screenshots, "objektsjournal.png"), fullPage: false });
await dialog().getByRole("tab", { name: "Förändringslogg", exact: true }).click();
await dialog().getByRole("button", { name: "Registrera händelse" }).click();
await page.getByRole("combobox", { name: "Utrustning", exact: true }).selectOption("freezer");
await page.getByLabel("Ny modell / fabrikat").fill("Bosch ny frys");
await page.getByLabel("Rubrik", { exact: true }).fill("Frys bytt – test");
await page.getByLabel("Beskrivning", { exact: true }).fill("Utbytt av förvaltningen.");
await page.getByLabel("Kostnad (kr, valfritt)").fill("7500");
await page.getByRole("button", { name: "Spara händelse", exact: true }).click();
await dialog().getByRole("heading", { name: "Frys bytt – test", exact: true }).waitFor();
await dialog().getByRole("tab", { name: "Utrustning", exact: true }).click();
const freezer = dialog()
  .getByRole("listitem")
  .filter({ has: page.getByRole("heading", { name: "Frys", exact: true }) });
assert.match(await freezer.innerText(), /Bosch ny frys/);
await dialog().getByRole("tab", { name: "Underhåll", exact: true }).click();
await dialog().getByRole("button", { name: "Planera åtgärd" }).click();
await page.getByLabel("Åtgärd", { exact: true }).fill("Byte av tätlist – test");
await page.getByLabel("Planerat datum").fill("2027-06-15");
await page.getByLabel("Beräknad kostnad (kr)").fill("1800");
await page.getByRole("button", { name: "Spara åtgärd" }).click();
const task = dialog().getByRole("listitem").filter({ hasText: "Byte av tätlist – test" });
await task.getByRole("button", { name: "Markera utförd" }).click();
await page.waitForFunction(() =>
  Array.from(document.querySelectorAll('[role="tabpanel"] li')).some(
    (li) => li.textContent.includes("Byte av tätlist – test") && li.textContent.includes("Utförd"),
  ),
);
await dialog().getByRole("tab", { name: "Förändringslogg", exact: true }).click();
await dialog()
  .getByRole("heading", { name: "Utförd: Byte av tätlist – test", exact: true })
  .waitFor();
// Ett lagringsfel ska behålla formuläret och inte påstå att något sparats.
await dialog().getByRole("button", { name: "Registrera händelse" }).click();
await page.getByLabel("Typ av händelse").selectOption("Övrigt");
await page.getByLabel("Rubrik", { exact: true }).fill("Ska inte sparas");
await page.evaluate(() => {
  const original = IDBObjectStore.prototype.put;
  IDBObjectStore.prototype.put = function (...args) {
    IDBObjectStore.prototype.put = original;
    throw new DOMException("Testfel", "QuotaExceededError");
  };
});
await page.getByRole("button", { name: "Spara händelse", exact: true }).click();
await dialog().getByRole("alert").waitFor();
assert.equal(await page.getByLabel("Rubrik", { exact: true }).inputValue(), "Ska inte sparas");
assert.equal(
  await dialog().getByRole("heading", { name: "Ska inte sparas", exact: true }).count(),
  0,
);
await dialog().getByRole("button", { name: "Registrera händelse" }).click();
await dialog().getByRole("tab", { name: "Bilder", exact: true }).click();
await page
  .getByLabel("Bildfiler")
  .setInputFiles({ name: "fel.txt", mimeType: "text/plain", buffer: Buffer.from("invalid") });
await page.getByLabel("Beskrivning av bilden").fill("Testbild");
await page.getByRole("button", { name: "Spara bilder", exact: true }).click();
await page.getByText("Välj en bild i JPEG-, PNG- eller WebP-format.").waitFor();
const png = Buffer.from(
  await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 160;
    const c = canvas.getContext("2d");
    c.fillStyle = "#d5e4da";
    c.fillRect(0, 0, 240, 160);
    c.fillStyle = "#486558";
    c.fillRect(50, 40, 140, 90);
    c.fillStyle = "white";
    c.font = "16px sans-serif";
    c.fillText("Testbild", 82, 92);
    return canvas.toDataURL("image/png").split(",")[1];
  }),
  "base64",
);
await page
  .getByLabel("Bildfiler")
  .setInputFiles({ name: "fore.png", mimeType: "image/png", buffer: png });
await page.getByLabel("Tillfälle").selectOption("Renovering");
await page.getByLabel("Bildtyp").selectOption("Före");
await page
  .getByLabel("Kopplad händelse")
  .selectOption({ label: "2022-08-20 · Hall och vardagsrum målade" });
await page.getByLabel("Beskrivning av bilden").fill("Testbild före renovering");
await page.getByRole("button", { name: "Spara bilder", exact: true }).click();
await dialog().getByRole("img", { name: "Testbild före renovering", exact: true }).waitFor();
await page
  .getByLabel("Bildfiler")
  .setInputFiles({ name: "efter.png", mimeType: "image/png", buffer: png });
await page.getByLabel("Tillfälle").selectOption("Renovering");
await page.getByLabel("Bildtyp").selectOption("Efter");
await page.getByLabel("Beskrivning av bilden").fill("Testbild efter renovering");
await page.getByRole("button", { name: "Spara bilder", exact: true }).click();
await dialog().getByRole("img", { name: "Testbild efter renovering", exact: true }).waitFor();
await dialog()
  .getByRole("button", { name: "Öppna bild: Testbild före renovering", exact: true })
  .click();
await page
  .getByRole("dialog")
  .getByRole("heading", { name: "Testbild före renovering", exact: true })
  .waitFor();
assert.equal(await page.getByRole("dialog", { includeHidden: true }).count(), 2);
await page.keyboard.press("Escape");
assert.equal(await page.getByRole("dialog").count(), 1);
const downloadPromise = page.waitForEvent("download");
await dialog().getByRole("button", { name: "Exportera journal" }).click();
const download = await downloadPromise;
const saved = JSON.parse(await fs.readFile(await download.path(), "utf8"));
assert.equal(saved.unit.id, "storgatan-12-apt-1001");
assert.equal(saved.photos.length, 2);
assert.ok(saved.events.some((e) => e.title === "Frys bytt – test"));
await page.keyboard.press("Escape");
await page.waitForFunction(
  (label) => document.activeElement?.getAttribute("aria-label") === label,
  first,
);
assert.match(
  await page.getByRole("button", { name: first, exact: true }).innerText(),
  /Utförd: Byte av tätlist/,
);
await page.reload();
await page.waitForLoadState("networkidle");
await page.getByRole("button", { name: first, exact: true }).click();
await dialog().getByRole("heading", { name: "Utrustning och installationer" }).waitFor();
assert.match(
  await dialog()
    .getByRole("listitem")
    .filter({ has: page.getByRole("heading", { name: "Frys", exact: true }) })
    .innerText(),
  /Bosch ny frys/,
);
await dialog().getByRole("tab", { name: "Bilder", exact: true }).click();
assert.equal(await dialog().getByRole("img").count(), 2);
await page.keyboard.press("Escape");
await page.getByRole("button", { name: "Öppna Lägenhet 1002 · Storgatan 12", exact: true }).click();
await dialog().getByRole("heading", { name: "Utrustning och installationer" }).waitFor();
assert.doesNotMatch(await dialog().innerText(), /Bosch ny frys/);
await dialog().getByRole("tab", { name: "Bilder", exact: true }).click();
assert.equal(await dialog().getByRole("img").count(), 0);
await page.keyboard.press("Escape");
await page.setViewportSize({ width: 390, height: 844 });
assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
await page.getByRole("button", { name: first, exact: true }).click();
await dialog().getByRole("heading", { name: "Utrustning och installationer" }).waitFor();
assert.ok(await dialog().evaluate((el) => el.scrollWidth <= el.clientWidth));
await dialog().evaluate((el) =>
  Promise.all(el.getAnimations().map((animation) => animation.finished)),
);
await page.screenshot({
  path: path.join(screenshots, "objektsjournal-mobil.png"),
  fullPage: false,
});
await dialog().getByRole("tab", { name: "Bilder", exact: true }).click();
assert.ok(await dialog().evaluate((el) => el.scrollWidth <= el.clientWidth));
await page.keyboard.press("Escape");
// Inga journaler får skrivas när webbläsarens lagring inte går att öppna.
const brokenContext = await browser.newContext();
await brokenContext.addInitScript(() =>
  Object.defineProperty(window, "indexedDB", { value: undefined }),
);
const broken = await brokenContext.newPage();
await broken.goto(`${baseURL}/hyresobjekt`);
await broken.waitForLoadState("networkidle");
await broken.getByRole("button", { name: first, exact: true }).click();
await broken.getByRole("dialog").getByRole("alert").waitFor();
assert.equal(await broken.getByRole("button", { name: "Exportera journal" }).isEnabled(), false);
assert.deepEqual(errors, []);
console.log(
  "Godkänt: 50 objekt, fastighets-/typ-/statusfilter, sökning, utrustningsutbyte, underhåll med historik, bilder före/efter och bildvisare, export, sparande efter omladdning, objektisolering, lagringsfel, fokus och mobilbredd.",
);
await browser.close();
