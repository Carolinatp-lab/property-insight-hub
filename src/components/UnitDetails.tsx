import { useEffect, useRef, useState, type FormEvent } from "react";
import { Camera, Download, Plus, Refrigerator, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useUnitRecord } from "@/hooks/use-unit-record";
import { readPhoto } from "@/lib/unit-storage";
import {
  recordUnitEvent,
  unitLabel,
  type RentalUnit,
  type UnitEvent,
  type UnitRecord,
  type UnitPhoto,
} from "@/data/rental-units";
import { SupplierPicker } from "@/components/management/SupplierPicker";
import { properties } from "@/data/portfolio";
import type { PartnerSnapshot } from "@/data/management";
import { money } from "@/data/portfolio";
const box = "rounded-2xl border border-border bg-card p-4 sm:p-5";
const select =
  "h-10 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring";
const today = () =>
  new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
const categories: UnitEvent["category"][] = ["Utbyte", "Renovering", "Besiktning", "Övrigt"];

export function UnitDetails({
  unit,
  address,
  onRecordChange,
}: {
  unit: RentalUnit;
  address: string;
  onRecordChange: (id: string, record: UnitRecord) => void;
}) {
  const { record, save, saving, error, notice } = useUnitRecord(unit);
  const [eventForm, setEventForm] = useState(false);
  const [taskForm, setTaskForm] = useState(false);
  const [supplier, setSupplier] = useState<PartnerSnapshot | null>(null);
  const [category, setCategory] = useState<UnitEvent["category"]>("Utbyte");
  const [equipmentId, setEquipmentId] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [readingPhotos, setReadingPhotos] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (record) onRecordChange(unit.id, record);
  }, [record, onRecordChange, unit.id]);

  async function addEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!record) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const asset = record.equipment.find((item) => item.id === equipmentId);
    const item: UnitEvent = {
      id: crypto.randomUUID(),
      date: String(data.get("date")),
      title: String(data.get("title")).trim(),
      description: String(data.get("description")).trim(),
      category,
      equipmentId:
        category === "Utbyte" ? (equipmentId === "new" ? crypto.randomUUID() : equipmentId) : "",
      equipmentName:
        category === "Utbyte"
          ? (asset?.name ?? String(data.get("equipmentName") ?? "").trim())
          : "",
      model: category === "Utbyte" ? String(data.get("model") ?? "").trim() : "",
      cost: data.get("cost") ? Number(data.get("cost")) : null,
    };
    if (!item.title || (category === "Utbyte" && (!item.equipmentId || !item.equipmentName)))
      return;
    if (await save(recordUnitEvent(record, item))) {
      form.reset();
      setEventForm(false);
      setEquipmentId("");
    }
  }
  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!record) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title")).trim();
    if (!title) return;
    const task = {
      id: crypto.randomUUID(),
      title,
      due: String(data.get("due")),
      budget: Number(data.get("budget")),
      completed: false,
      ...(supplier ? { supplier } : {}),
    };
    if (await save({ ...record, tasks: [...record.tasks, task] })) {
      form.reset();
      setTaskForm(false);
      setSupplier(null);
    }
  }
  async function addPhotos(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!record || readingPhotos) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const files = Array.from(fileInput.current?.files ?? []);
    if (!files.length) return;
    setReadingPhotos(true);
    setPhotoError("");
    try {
      const images: UnitPhoto[] = await Promise.all(
        files.map(async (file) => ({
          id: crypto.randomUUID(),
          src: await readPhoto(file),
          caption: String(data.get("caption")).trim(),
          date: String(data.get("date")),
          stage: String(data.get("stage")) as UnitPhoto["stage"],
          occasion: String(data.get("occasion")) as UnitPhoto["occasion"],
          eventId: String(data.get("eventId")),
        })),
      );
      if (await save({ ...record, photos: [...record.photos, ...images] })) form.reset();
    } catch (cause) {
      setPhotoError(cause instanceof Error ? cause.message : "Bilderna kunde inte läsas.");
    } finally {
      setReadingPhotos(false);
    }
  }
  function exportJournal() {
    if (!record) return;
    const blob = new Blob([JSON.stringify({ unit, address, ...record }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${unit.id}-journal.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const busy = saving || readingPhotos;
  return (
    <>
      <div className="pr-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Objektsjournal · {address}
        </p>
        <SheetTitle className="mt-2 text-2xl">{unitLabel(unit)}</SheetTitle>
        <SheetDescription className="mt-2">
          {unit.type === "Hyresrätt" ? `${unit.rooms} rum och kök · ` : ""}
          {unit.area} m² · {unit.floor} · {unit.vacant ? "Vakant" : "Uthyrd"}
        </SheetDescription>
      </div>
      <div className="my-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
          Egna uppgifter och bilder sparas i den här webbläsaren. De delas inte med andra och
          försvinner om webbplatsens lagring rensas.
        </p>
        <Button
          variant="outline"
          className="self-start rounded-xl"
          onClick={exportJournal}
          disabled={!record || busy}
        >
          <Download aria-hidden="true" className="size-4" />
          Exportera journal
        </Button>
      </div>
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-destructive/30 bg-card p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      <p role="status" className="mb-3 text-xs text-primary">
        {notice}
      </p>
      {!record ? (
        <p className="text-sm text-muted-foreground">
          {error
            ? "Stäng och öppna objektet igen för att försöka på nytt."
            : "Öppnar objektsjournalen…"}
        </p>
      ) : (
        <Tabs defaultValue="equipment">
          <TabsList
            aria-label="Objektsjournalens delar"
            className="grid h-auto w-full grid-cols-2 gap-1 rounded-xl p-1 sm:grid-cols-4"
          >
            {[
              ["equipment", "Utrustning"],
              ["history", "Förändringslogg"],
              ["maintenance", "Underhåll"],
              ["photos", "Bilder"],
            ].map(([value, label]) => (
              <TabsTrigger key={value} value={value!} className="py-2 text-xs sm:text-sm">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="equipment" className="mt-5 space-y-4">
            <div>
              <h3 className="font-semibold">Utrustning och installationer</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Se vad som finns och när det senast byttes. Registrera ett utbyte i
                förändringsloggen för att uppdatera utrustningen.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {record.equipment.map((item) => (
                <li key={item.id} className={box}>
                  <Refrigerator aria-hidden="true" className="size-5 text-primary" />
                  <h4 className="mt-3 font-semibold">{item.name}</h4>
                  <p className="mt-1 break-words text-sm text-muted-foreground">
                    {item.model || "Modell ej registrerad"}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">Installerad / senast bytt</p>
                  <p className="mt-1 text-sm font-medium">{item.installed}</p>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="history" className="mt-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold">Förändringslogg</h3>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setEventForm(!eventForm)}
                aria-expanded={eventForm}
                disabled={busy}
              >
                <Plus aria-hidden="true" className="size-4" />
                Registrera händelse
              </Button>
            </div>
            {eventForm && (
              <form onSubmit={addEvent} className={box}>
                <fieldset disabled={busy} className="space-y-4">
                  <legend className="mb-4 font-semibold">Ny händelse</legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="event-category">Typ av händelse</Label>
                      <select
                        id="event-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as UnitEvent["category"])}
                        className={`mt-2 ${select}`}
                      >
                        {categories.map((value) => (
                          <option key={value}>{value}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="event-date">Datum</Label>
                      <Input
                        id="event-date"
                        name="date"
                        type="date"
                        required
                        max={today()}
                        defaultValue={today()}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  {category === "Utbyte" && (
                    <>
                      <div>
                        <Label htmlFor="event-equipment">Utrustning</Label>
                        <select
                          id="event-equipment"
                          value={equipmentId}
                          onChange={(e) => setEquipmentId(e.target.value)}
                          required
                          className={`mt-2 ${select}`}
                        >
                          <option value="">Välj utrustning</option>
                          {record.equipment.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                          <option value="new">Lägg till ny utrustning</option>
                        </select>
                      </div>
                      {equipmentId === "new" && (
                        <div>
                          <Label htmlFor="equipment-name">Namn på utrustning</Label>
                          <Input
                            id="equipment-name"
                            name="equipmentName"
                            required
                            maxLength={80}
                            placeholder="Exempel: Diskmaskin"
                            className="mt-2"
                          />
                        </div>
                      )}
                      <div>
                        <Label htmlFor="event-model">Ny modell / fabrikat</Label>
                        <Input
                          id="event-model"
                          name="model"
                          maxLength={120}
                          placeholder="Exempel: Bosch Serie 4"
                          className="mt-2"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <Label htmlFor="event-title">Rubrik</Label>
                    <Input
                      id="event-title"
                      name="title"
                      required
                      maxLength={120}
                      placeholder="Exempel: Frys utbytt"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-description">Beskrivning</Label>
                    <Textarea
                      id="event-description"
                      name="description"
                      maxLength={2000}
                      placeholder="Vad gjordes och av vem?"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="event-cost">Kostnad (kr, valfritt)</Label>
                    <Input
                      id="event-cost"
                      name="cost"
                      type="number"
                      min="0"
                      step="1"
                      className="mt-2"
                    />
                  </div>
                  <Button type="submit" className="rounded-xl">
                    {saving ? "Sparar…" : "Spara händelse"}
                  </Button>
                </fieldset>
              </form>
            )}
            <ol className="space-y-3">
              {[...record.events]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((item) => (
                  <li key={item.id} className={box}>
                    <p className="text-xs text-muted-foreground">
                      {item.date} · {item.category}
                    </p>
                    <h4 className="mt-2 break-words font-semibold">{item.title}</h4>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    {item.model && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {item.equipmentName} · {item.model}
                      </p>
                    )}
                    {item.supplier && (
                      <p className="mt-2 text-sm">
                        Utfört av: {item.supplier.name} · {item.supplier.trade}
                      </p>
                    )}
                    {item.cost !== null && (
                      <p className="mt-3 text-sm font-medium">{money(item.cost)}</p>
                    )}
                    {record.photos.some((photo) => photo.eventId === item.id) && (
                      <p className="mt-2 text-xs text-primary">
                        {record.photos.filter((photo) => photo.eventId === item.id).length} kopplade
                        bilder · se Bilder
                      </p>
                    )}
                  </li>
                ))}
            </ol>
          </TabsContent>
          <TabsContent value="maintenance" className="mt-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">Objektets underhållsplan</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Planerad budget:{" "}
                  {money(
                    record.tasks.filter((t) => !t.completed).reduce((sum, t) => sum + t.budget, 0),
                  )}
                </p>
              </div>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setTaskForm(!taskForm)}
                aria-expanded={taskForm}
                disabled={busy}
              >
                <Plus aria-hidden="true" className="size-4" />
                Planera åtgärd
              </Button>
            </div>
            {taskForm && (
              <form onSubmit={addTask} className={box}>
                <fieldset disabled={busy} className="space-y-4">
                  <legend className="mb-4 font-semibold">Ny underhållsåtgärd</legend>
                  <div>
                    <Label htmlFor="task-title">Åtgärd</Label>
                    <Input id="task-title" name="title" required maxLength={120} className="mt-2" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="task-due">Planerat datum</Label>
                      <Input id="task-due" name="due" type="date" required className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="task-budget">Beräknad kostnad (kr)</Label>
                      <Input
                        id="task-budget"
                        name="budget"
                        type="number"
                        min="0"
                        step="1"
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <SupplierPicker
                    mode="owner"
                    properties={properties}
                    propertyId={unit.propertyId}
                    value={supplier}
                    onChange={setSupplier}
                    id="task-supplier"
                  />
                  <Button type="submit" className="rounded-xl">
                    {saving ? "Sparar…" : "Spara åtgärd"}
                  </Button>
                </fieldset>
              </form>
            )}
            <ul className="space-y-3">
              {[...record.tasks]
                .sort(
                  (a, b) => Number(a.completed) - Number(b.completed) || a.due.localeCompare(b.due),
                )
                .map((task) => (
                  <li key={task.id} className={box}>
                    <div className="flex items-start gap-3">
                      <Wrench aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <h4 className="break-words font-semibold">{task.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {task.due} · Budget {money(task.budget)}
                        </p>
                        {task.supplier && (
                          <p className="mt-2 text-sm">
                            Leverantör: {task.supplier.name} · {task.supplier.trade}
                          </p>
                        )}
                        <p className="mt-2 text-xs font-medium">
                          {task.completed
                            ? "Utförd"
                            : task.due < today()
                              ? "Planerat datum passerat"
                              : "Planerad"}
                        </p>
                        {!task.completed && (
                          <Button
                            variant="outline"
                            className="mt-3 rounded-xl"
                            disabled={busy}
                            onClick={() =>
                              save(
                                recordUnitEvent(
                                  {
                                    ...record,
                                    tasks: record.tasks.map((t) =>
                                      t.id === task.id ? { ...t, completed: true } : t,
                                    ),
                                  },
                                  {
                                    id: crypto.randomUUID(),
                                    date: today(),
                                    category: "Övrigt",
                                    title: `Utförd: ${task.title}`,
                                    description:
                                      "Åtgärden har markerats som utförd i underhållsplanen. Faktisk kostnad är inte registrerad.",
                                    equipmentId: "",
                                    equipmentName: "",
                                    model: "",
                                    cost: null,
                                    ...(task.supplier ? { supplier: task.supplier } : {}),
                                  },
                                ),
                              )
                            }
                          >
                            Markera utförd
                          </Button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </TabsContent>
          <TabsContent value="photos" className="mt-5 space-y-4">
            <div>
              <h3 className="font-semibold">Bilddokumentation</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Dokumentera skick före och efter inflyttning, utflyttning eller renovering. Koppla
                gärna bilderna till en händelse.
              </p>
            </div>
            <form onSubmit={addPhotos} className={box}>
              <fieldset disabled={busy} className="space-y-4">
                <legend className="mb-4 flex items-center gap-2 font-semibold">
                  <Camera aria-hidden="true" className="size-4" />
                  Lägg till bilder
                </legend>
                <div>
                  <Label htmlFor="photo-files">Bildfiler</Label>
                  <Input
                    id="photo-files"
                    ref={fileInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    required
                    className="mt-2 h-auto py-2"
                    aria-describedby="photo-help"
                  />
                  <p id="photo-help" className="mt-2 text-xs text-muted-foreground">
                    JPEG, PNG eller WebP. Högst 5 MB per bild.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="photo-occasion">Tillfälle</Label>
                    <select id="photo-occasion" name="occasion" className={`mt-2 ${select}`}>
                      {["Inflyttning", "Utflyttning", "Renovering", "Övrigt"].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="photo-stage">Bildtyp</Label>
                    <select id="photo-stage" name="stage" className={`mt-2 ${select}`}>
                      {["Före", "Efter", "Dokumentation"].map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="photo-date">Fotodatum</Label>
                  <Input
                    id="photo-date"
                    name="date"
                    type="date"
                    required
                    max={today()}
                    defaultValue={today()}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="photo-caption">Beskrivning av bilden</Label>
                  <Input
                    id="photo-caption"
                    name="caption"
                    required
                    maxLength={200}
                    placeholder="Exempel: Köket före renovering"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="photo-event">Kopplad händelse</Label>
                  <select id="photo-event" name="eventId" className={`mt-2 ${select}`}>
                    <option value="">Ingen koppling</option>
                    {[...record.events]
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.date} · {item.title}
                        </option>
                      ))}
                  </select>
                </div>
                {photoError && (
                  <p role="alert" className="text-sm text-destructive">
                    {photoError}
                  </p>
                )}
                <Button type="submit" className="rounded-xl">
                  {busy ? "Sparar bilder…" : "Spara bilder"}
                </Button>
              </fieldset>
            </form>
            {!record.photos.length && (
              <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                Inga bilder registrerade ännu. Lägg till dina första före- och efterbilder ovan.
              </p>
            )}
            {(["Före", "Efter", "Dokumentation"] as const).map(
              (stage) =>
                record.photos.some((photo) => photo.stage === stage) && (
                  <section key={stage} aria-label={`${stage}bilder`}>
                    <h4 className="mb-3 font-semibold">{stage}</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {record.photos
                        .filter((photo) => photo.stage === stage)
                        .map((photo) => (
                          <figure
                            key={photo.id}
                            className="overflow-hidden rounded-2xl border border-border bg-card"
                          >
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  type="button"
                                  className="block w-full focus-visible:outline-2 focus-visible:outline-ring"
                                  aria-label={`Öppna bild: ${photo.caption}`}
                                >
                                  <img
                                    src={photo.src}
                                    alt={photo.caption}
                                    loading="lazy"
                                    className="aspect-[4/3] w-full object-cover"
                                  />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogTitle>{photo.caption}</DialogTitle>
                                <DialogDescription>
                                  {photo.date} · {photo.occasion} · {photo.stage}
                                </DialogDescription>
                                <img
                                  src={photo.src}
                                  alt={photo.caption}
                                  className="max-h-[70vh] w-full object-contain"
                                />
                              </DialogContent>
                            </Dialog>
                            <figcaption className="p-4">
                              <p className="break-words text-sm font-medium">{photo.caption}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {photo.date} · {photo.occasion} · {photo.stage}
                              </p>
                              {photo.eventId && (
                                <p className="mt-2 break-words text-xs text-muted-foreground">
                                  Händelse:{" "}
                                  {record.events.find((e) => e.id === photo.eventId)?.title}
                                </p>
                              )}
                            </figcaption>
                          </figure>
                        ))}
                    </div>
                  </section>
                ),
            )}
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}
