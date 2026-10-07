import { useState, type FormEvent } from "react";
import { Download, FileText, Plus, Star, Phone, Mail, MapPin, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useManagement } from "@/hooks/use-management";
import {
  trades,
  type Partner,
  type ContractTemplate,
  type ManagedProperty,
  type ManagementMode,
} from "@/data/management";
import { downloadTemplate, readTemplateFile } from "@/lib/management-storage";
const box = "rounded-3xl border border-border bg-card p-6 shadow-card sm:p-7";
const select =
  "mt-2 h-10 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring";

/** Gemensam vy. Värdmodulen skickar sin organisationstyp och sina fastigheter. */
export function ContractsAndPartners({
  mode,
  properties,
  selectedPropertyIds,
}: {
  mode: ManagementMode;
  properties: ManagedProperty[];
  selectedPropertyIds: string[];
}) {
  const { record, save, saving, error, notice } = useManagement(mode, properties);
  const [query, setQuery] = useState("");
  const [trade, setTrade] = useState("all");
  const [onlyPreferred, setOnlyPreferred] = useState(false);
  const [partnerForm, setPartnerForm] = useState<Partner | "new" | null>(null);
  const [templateForm, setTemplateForm] = useState(false);
  const [preview, setPreview] = useState<ContractTemplate | null>(null);
  const [fileError, setFileError] = useState("");
  const [reading, setReading] = useState(false);
  async function submitPartner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const propertyIds = data.getAll("propertyIds").map(String);
    const name = String(data.get("name")).trim();
    if (!name || !propertyIds.length) {
      setFileError("Ange företagsnamn och minst en fastighet.");
      return;
    }
    const partner: Partner = {
      id: partnerForm && partnerForm !== "new" ? partnerForm.id : crypto.randomUUID(),
      name,
      trade: String(data.get("trade")) as Partner["trade"],
      contact: String(data.get("contact")).trim(),
      phone: String(data.get("phone")).trim(),
      email: String(data.get("email")).trim(),
      emergencyPhone: String(data.get("emergencyPhone")).trim(),
      area: String(data.get("area")).trim(),
      propertyIds,
      preferred: data.get("preferred") === "on",
      contractEnd: String(data.get("contractEnd")),
      notes: String(data.get("notes")).trim(),
    };
    if (
      await save((current) => ({
        ...current,
        partners: current.partners.some((p) => p.id === partner.id)
          ? current.partners.map((p) => (p.id === partner.id ? partner : p))
          : [...current.partners, partner],
      }))
    ) {
      setPartnerForm(null);
      setFileError("");
    }
  }
  async function submitTemplate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const file = data.get("file") as File;
    setReading(true);
    setFileError("");
    try {
      const fileData = await readTemplateFile(file);
      const template: ContractTemplate = {
        id: crypto.randomUUID(),
        name: String(data.get("name")).trim(),
        category: String(data.get("category")),
        version: String(data.get("version")).trim(),
        updated: String(data.get("updated")),
        description: String(data.get("description")).trim(),
        fileName: file.name,
        text: "",
        fileData,
      };
      if (!template.name || !template.version) {
        setFileError("Ange mallnamn och version.");
        return;
      }
      if (await save((current) => ({ ...current, templates: [...current.templates, template] })))
        setTemplateForm(false);
    } catch (cause) {
      setFileError(cause instanceof Error ? cause.message : "Mallen kunde inte läsas.");
    } finally {
      setReading(false);
    }
  }
  const filtered =
    record?.partners.filter(
      (p) =>
        p.propertyIds.some((id) => selectedPropertyIds.includes(id)) &&
        (trade === "all" || p.trade === trade) &&
        (!onlyPreferred || p.preferred) &&
        `${p.name} ${p.contact} ${p.area} ${p.trade}`
          .toLocaleLowerCase("sv")
          .includes(query.toLocaleLowerCase("sv")),
    ) ?? [];
  const editing = partnerForm && partnerForm !== "new" ? partnerForm : null;
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Avtalsmallar och kontaktvägar till {mode === "owner" ? "fastighetsägarens" : "föreningens"}{" "}
        leverantörer. Egna ändringar och filer sparas i den här webbläsaren och delas inte mellan
        enheter.
      </p>
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/30 bg-card p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      <p role="status" className="text-xs text-primary">
        {notice}
      </p>
      {!record ? (
        <p>Öppnar avtalsbibliotek och leverantörer…</p>
      ) : (
        <Tabs defaultValue="templates">
          <TabsList className="mb-5 grid h-auto w-full grid-cols-2 rounded-xl sm:max-w-md">
            <TabsTrigger value="templates" className="py-2">
              Avtalsmallar
            </TabsTrigger>
            <TabsTrigger value="partners" className="py-2">
              Leverantörer
            </TabsTrigger>
          </TabsList>
          <TabsContent value="templates" className="space-y-5">
            <section className={box}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Avtalsbibliotek</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {record.templates.length} mallar · exempelunderlag och era egna dokument
                  </p>
                </div>
                <Button
                  className="rounded-xl"
                  onClick={() => {
                    setTemplateForm(true);
                    setFileError("");
                  }}
                >
                  <Plus aria-hidden="true" className="size-4" />
                  Lägg till avtalsmall
                </Button>
              </div>
            </section>
            <div className="grid gap-4 md:grid-cols-2">
              {record.templates.map((template) => (
                <article key={template.id} className={box}>
                  <div className="flex items-center justify-between gap-3">
                    <FileText aria-hidden="true" className="size-5 text-primary" />
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs">
                      {template.fileData ? "Egen mall" : "Exempelmall"}
                    </span>
                  </div>
                  <h3 className="mt-4 font-semibold">{template.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{template.description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {template.category} · {template.version} · {template.updated}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => setPreview(template)}
                    >
                      Visa mall
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() =>
                        downloadTemplate(template.fileName, template.text, template.fileData)
                      }
                      aria-label={`Ladda ner ${template.name}`}
                    >
                      <Download aria-hidden="true" className="size-4" />
                      Ladda ner
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="partners" className="space-y-5">
            <section className={box}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Leverantörsregister</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Kontakter, jour och prioriterade samarbetspartner för valt bestånd.
                  </p>
                </div>
                <Button
                  className="rounded-xl"
                  onClick={() => {
                    setPartnerForm("new");
                    setFileError("");
                  }}
                >
                  <Plus aria-hidden="true" className="size-4" />
                  Lägg till leverantör
                </Button>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="partner-search">Sök leverantör</Label>
                  <Input
                    id="partner-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Företag, kontakt eller område"
                    className="mt-2 h-10 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="partner-trade">Yrkesområde</Label>
                  <select
                    id="partner-trade"
                    className={select}
                    value={trade}
                    onChange={(e) => setTrade(e.target.value)}
                  >
                    <option value="all">Alla yrkesområden</option>
                    {trades.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={onlyPreferred}
                  onChange={(e) => setOnlyPreferred(e.target.checked)}
                />
                Visa endast prioriterade leverantörer
              </label>
              <p aria-live="polite" className="mt-3 text-xs text-muted-foreground">
                {filtered.length} leverantörer
              </p>
            </section>
            {!filtered.length && (
              <p className="rounded-xl border border-dashed border-border p-5 text-sm">
                Inga leverantörer matchar filtret eller de valda fastigheterna.
              </p>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              {filtered
                .sort(
                  (a, b) =>
                    Number(b.preferred) - Number(a.preferred) || a.name.localeCompare(b.name, "sv"),
                )
                .map((p) => (
                  <article key={p.id} className={box}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs">{p.trade}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-pressed={p.preferred}
                        disabled={saving}
                        onClick={() =>
                          save((current) => ({
                            ...current,
                            partners: current.partners.map((item) =>
                              item.id === p.id ? { ...item, preferred: !item.preferred } : item,
                            ),
                          }))
                        }
                        aria-label={`${p.preferred ? "Avmarkera" : "Prioritera"} ${p.name}`}
                      >
                        <Star
                          aria-hidden="true"
                          className={`size-4 ${p.preferred ? "fill-primary text-primary" : "text-muted-foreground"}`}
                        />
                        {p.preferred ? "Prioriterad" : "Prioritera"}
                      </Button>
                    </div>
                    <h3 className="mt-3 font-semibold">{p.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.contact}</p>
                    <div className="mt-4 space-y-2 text-sm">
                      {p.phone && (
                        <a
                          className="flex items-center gap-2 underline underline-offset-4"
                          href={`tel:${p.phone.replace(/\s/g, "")}`}
                        >
                          <Phone aria-hidden="true" className="size-4" />
                          {p.phone}
                        </a>
                      )}
                      {p.email && (
                        <a
                          className="flex break-all items-center gap-2 underline underline-offset-4"
                          href={`mailto:${p.email}`}
                        >
                          <Mail aria-hidden="true" className="size-4 shrink-0" />
                          {p.email}
                        </a>
                      )}
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <MapPin aria-hidden="true" className="size-4 shrink-0" />
                        {p.area}
                      </p>
                      {p.emergencyPhone && (
                        <p>
                          Jour:{" "}
                          <a
                            className="underline"
                            href={`tel:${p.emergencyPhone.replace(/\s/g, "")}`}
                          >
                            {p.emergencyPhone}
                          </a>
                        </p>
                      )}
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground">
                      Fastigheter:{" "}
                      {properties
                        .filter((property) => p.propertyIds.includes(property.id))
                        .map((property) => property.address)
                        .join(", ")}
                    </p>
                    {p.contractEnd && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Avtal till: {p.contractEnd}
                      </p>
                    )}
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm text-muted-foreground">
                      {p.notes}
                    </p>
                    {Object.values(record.assignments).some(
                      (a) => a.supplier?.id === p.id && a.completedAt,
                    ) && (
                      <div className="mt-4 border-t border-border pt-3">
                        <h4 className="text-sm font-medium">Tidigare utförda uppdrag</h4>
                        <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
                          {Object.values(record.assignments)
                            .filter((a) => a.supplier?.id === p.id && a.completedAt)
                            .map((a, i) => (
                              <li key={i}>
                                {a.title} · {a.completedAt} ·{" "}
                                {
                                  properties.find((property) => property.id === a.propertyId)
                                    ?.address
                                }
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className="mt-4 rounded-xl"
                      onClick={() => {
                        setPartnerForm(p);
                        setFileError("");
                      }}
                      aria-label={`Redigera ${p.name}`}
                    >
                      <Pencil aria-hidden="true" className="size-4" />
                      Redigera
                    </Button>
                  </article>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
      <Dialog
        open={!!partnerForm}
        onOpenChange={(open) => {
          if (!open && !saving) setPartnerForm(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogTitle>{editing ? "Redigera leverantör" : "Ny leverantör"}</DialogTitle>
          <DialogDescription>
            Kontaktuppgifter och de fastigheter där leverantören används.
          </DialogDescription>
          <form key={editing?.id ?? "new"} onSubmit={submitPartner}>
            <fieldset disabled={saving} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["name", "Företagsnamn"],
                  ["contact", "Kontaktperson"],
                  ["phone", "Telefon"],
                  ["email", "E-post"],
                  ["emergencyPhone", "Journummer"],
                  ["area", "Geografiskt område"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <Label htmlFor={`supplier-${key}`}>{label}</Label>
                    <Input
                      id={`supplier-${key}`}
                      name={key}
                      type={
                        key === "email"
                          ? "email"
                          : key === "phone" || key === "emergencyPhone"
                            ? "tel"
                            : "text"
                      }
                      defaultValue={(editing?.[key as keyof Partner] as string) ?? ""}
                      required={key === "name" || key === "area"}
                      maxLength={150}
                      className="mt-2"
                    />
                  </div>
                ))}
              </div>
              <div>
                <Label htmlFor="supplier-trade">Yrkesområde</Label>
                <select
                  id="supplier-trade"
                  name="trade"
                  defaultValue={editing?.trade ?? trades[0]}
                  className={select}
                >
                  {trades.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <fieldset className="space-y-2">
                <legend className="mb-2 text-sm font-medium">Berörda fastigheter</legend>
                {properties.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="propertyIds"
                      value={p.id}
                      defaultChecked={
                        editing
                          ? editing.propertyIds.includes(p.id)
                          : selectedPropertyIds.includes(p.id)
                      }
                    />
                    {p.address}
                  </label>
                ))}
              </fieldset>
              <label className="flex items-center gap-2 text-sm">
                <input
                  name="preferred"
                  type="checkbox"
                  defaultChecked={editing?.preferred ?? false}
                />
                Prioriterad leverantör
              </label>
              <div>
                <Label htmlFor="supplier-contract">Avtal till (valfritt)</Label>
                <Input
                  id="supplier-contract"
                  name="contractEnd"
                  type="date"
                  defaultValue={editing?.contractEnd ?? ""}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="supplier-notes">Anteckningar</Label>
                <Textarea
                  id="supplier-notes"
                  name="notes"
                  defaultValue={editing?.notes ?? ""}
                  maxLength={2000}
                  className="mt-2"
                />
              </div>
              {(fileError || error) && (
                <p role="alert" className="text-sm text-destructive">
                  {fileError || error}
                </p>
              )}
              <Button type="submit" className="rounded-xl">
                {saving ? "Sparar…" : "Spara leverantör"}
              </Button>
            </fieldset>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={templateForm}
        onOpenChange={(open) => {
          if (!open && !saving && !reading) setTemplateForm(false);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogTitle>Ny avtalsmall</DialogTitle>
          <DialogDescription>Ladda upp er egen PDF, DOCX eller TXT. Högst 10 MB.</DialogDescription>
          <form onSubmit={submitTemplate}>
            <fieldset disabled={saving || reading} className="space-y-4">
              {[
                ["name", "Mallnamn"],
                ["version", "Version"],
                ["updated", "Versionsdatum"],
              ].map(([key, label]) => (
                <div key={key}>
                  <Label htmlFor={`template-${key}`}>{label}</Label>
                  <Input
                    id={`template-${key}`}
                    name={key}
                    required
                    type={key === "updated" ? "date" : "text"}
                    maxLength={120}
                    className="mt-2"
                  />
                </div>
              ))}
              <div>
                <Label htmlFor="template-category">Kategori</Label>
                <select id="template-category" name="category" className={select}>
                  <option>Uthyrning</option>
                  <option>Förvaltning</option>
                  <option>Övrigt</option>
                </select>
              </div>
              <div>
                <Label htmlFor="template-description">Beskrivning</Label>
                <Textarea
                  id="template-description"
                  name="description"
                  maxLength={1000}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="template-file">Mallfil</Label>
                <Input
                  id="template-file"
                  name="file"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  required
                  className="mt-2 h-auto py-2"
                />
              </div>
              {(fileError || error) && (
                <p role="alert" className="text-sm text-destructive">
                  {fileError || error}
                </p>
              )}
              <Button type="submit" className="rounded-xl">
                {saving || reading ? "Sparar…" : "Spara avtalsmall"}
              </Button>
            </fieldset>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!preview}
        onOpenChange={(open) => {
          if (!open) setPreview(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogTitle>{preview?.name}</DialogTitle>
          <DialogDescription>
            {preview?.version} · {preview?.updated}
          </DialogDescription>
          {preview?.text ? (
            <pre className="max-h-[55vh] overflow-y-auto whitespace-pre-wrap break-words rounded-xl bg-secondary p-4 font-sans text-sm">
              {preview.text}
            </pre>
          ) : (
            <p className="text-sm">
              {preview?.fileName} · Ladda ner dokumentet för att öppna det i din dokumentläsare.
            </p>
          )}
          <Button
            className="rounded-xl"
            onClick={() => {
              if (preview) downloadTemplate(preview.fileName, preview.text, preview.fileData);
            }}
          >
            <Download aria-hidden="true" className="size-4" />
            Ladda ner mall
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
