import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { StatusDot } from "@/components/brf/StatusDot";
import { UnitDetails } from "@/components/UnitDetails";
import { useProperties } from "@/components/PropertyProvider";
import { properties } from "@/data/portfolio";
import {
  createRentalUnits,
  createUnitRecord,
  unitLabel,
  type RentalUnit,
  type UnitRecord,
} from "@/data/rental-units";
import { loadUnitRecord } from "@/lib/unit-storage";

const units = createRentalUnits(properties);
const select =
  "mt-2 h-10 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring";

export function RentalUnitRegistry() {
  const { items, selectedId } = useProperties();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<RentalUnit | null>(null);
  const [records, setRecords] = useState<Record<string, UnitRecord>>({});
  const [storageError, setStorageError] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const updateRecord = useCallback(
    (id: string, record: UnitRecord) =>
      setRecords((current) => (current[id] === record ? current : { ...current, [id]: record })),
    [],
  );
  useEffect(() => {
    let active = true;
    Promise.all(units.map(async (unit) => [unit.id, await loadUnitRecord(unit.id)] as const))
      .then((saved) => {
        if (active)
          setRecords((current) => ({
            ...Object.fromEntries(
              saved.filter(
                (entry): entry is readonly [string, UnitRecord] => entry[1] !== undefined,
              ),
            ),
            ...current,
          }));
      })
      .catch(() => {
        if (active) setStorageError(true);
      });
    return () => {
      active = false;
    };
  }, []);
  const scoped = units.filter((unit) => selectedId === "all" || unit.propertyId === selectedId);
  const filtered = scoped.filter((unit) => {
    const address = properties.find((p) => p.id === unit.propertyId)!.address;
    return (
      (type === "all" || unit.type === type) &&
      (status === "all" || (status === "vacant" ? unit.vacant : !unit.vacant)) &&
      `${unitLabel(unit)} ${address}`
        .toLocaleLowerCase("sv-SE")
        .includes(query.trim().toLocaleLowerCase("sv-SE"))
    );
  });
  const selectedUnit = selected && scoped.some((unit) => unit.id === selected.id) ? selected : null;
  return (
    <>
      <section
        className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-7"
        aria-labelledby="unit-registry-heading"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id="unit-registry-heading" className="text-lg font-semibold">
              Lägenheter och lokaler
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Öppna ett objekt för utrustning, förändringslogg, underhållsplan och
              bilddokumentation.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium">
            {scoped.length} objekt · {scoped.filter((u) => u.type === "Hyresrätt").length}{" "}
            hyresrätter · {scoped.filter((u) => u.type === "Lokal").length} lokaler
          </span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Label htmlFor="unit-search">Sök objekt</Label>
            <div className="relative mt-2">
              <Search
                aria-hidden="true"
                className="absolute top-3 left-3 size-4 text-muted-foreground"
              />
              <Input
                id="unit-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Lägenhetsnummer eller adress"
                className="h-10 rounded-xl pl-9"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="unit-type">Objekttyp</Label>
            <select
              id="unit-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={select}
            >
              <option value="all">Alla typer</option>
              <option>Hyresrätt</option>
              <option>Lokal</option>
            </select>
          </div>
          <div>
            <Label htmlFor="unit-status">Uthyrningsstatus</Label>
            <select
              id="unit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={select}
            >
              <option value="all">Alla statusar</option>
              <option value="rented">Uthyrda</option>
              <option value="vacant">Vakanta</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p aria-live="polite" className="text-xs text-muted-foreground">
            Visar {filtered.length} av {scoped.length} objekt
          </p>
          {(query || type !== "all" || status !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setType("all");
                setStatus("all");
              }}
            >
              Rensa filter
            </Button>
          )}
        </div>
        {storageError && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            Sparade journaler kunde inte läsas. Listan visar exempeldata; kontrollera webbläsarens
            lokala lagring.
          </p>
        )}
      </section>
      {!filtered.length && (
        <p className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          Inga objekt matchar dina filter. Prova ett annat nummer eller rensa filtren.
        </p>
      )}
      {items.map((property) => {
        const propertyUnits = filtered.filter((unit) => unit.propertyId === property.id);
        if (!propertyUnits.length) return null;
        return (
          <section
            key={property.id}
            aria-labelledby={`units-${property.id}`}
            className="overflow-hidden rounded-3xl border border-border bg-card shadow-card"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 bg-secondary/50 px-5 py-4 sm:px-7">
              <div>
                <h3 id={`units-${property.id}`} className="font-semibold">
                  {property.address}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {property.type} · {propertyUnits.length} objekt i listan
                </p>
              </div>
              <Home aria-hidden="true" className="size-5 text-primary" />
            </div>
            <div
              aria-hidden="true"
              className="hidden grid-cols-[1.15fr_.8fr_1fr_1.2fr_1.2fr_20px] gap-4 border-b border-border px-7 py-3 text-xs font-medium text-muted-foreground lg:grid"
            >
              <span>Objekt</span>
              <span>Yta & plan</span>
              <span>Status</span>
              <span>Senaste ändring</span>
              <span>Nästa underhåll</span>
              <span />
            </div>
            <ul className="divide-y divide-border">
              {propertyUnits.map((unit) => {
                const record = records[unit.id] ?? createUnitRecord(unit);
                const latest = [...record.events].sort((a, b) => b.date.localeCompare(a.date))[0];
                const next = [...record.tasks]
                  .filter((t) => !t.completed)
                  .sort((a, b) => a.due.localeCompare(b.due))[0];
                return (
                  <li key={unit.id}>
                    <button
                      type="button"
                      onClick={(event) => {
                        triggerRef.current = event.currentTarget;
                        setSelected(unit);
                      }}
                      aria-label={`Öppna ${unitLabel(unit)} · ${property.address}`}
                      className="grid w-full grid-cols-[1fr_1fr_20px] items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-secondary/40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:px-7 lg:grid-cols-[1.15fr_.8fr_1fr_1.2fr_1.2fr_20px]"
                    >
                      <div className="col-start-1 row-start-1">
                        <p className="text-sm font-semibold">{unitLabel(unit)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {unit.type === "Hyresrätt"
                            ? `${unit.rooms} rum och kök`
                            : "Kommersiell lokal"}
                        </p>
                      </div>
                      <p className="col-span-2 col-start-1 row-start-2 text-xs text-muted-foreground lg:col-span-1 lg:col-start-2 lg:row-start-1">
                        {unit.area} m² · {unit.floor}
                      </p>
                      <p className="col-start-2 row-start-1 flex items-center gap-2 text-xs lg:col-start-3">
                        <StatusDot status={unit.vacant ? "watch" : "good"} />
                        {unit.vacant ? "Vakant" : "Uthyrd"}
                      </p>
                      <div className="col-start-1 row-start-3 min-w-0 lg:col-start-4 lg:row-start-1">
                        <p className="text-xs text-muted-foreground lg:hidden">Senaste ändring</p>
                        <p className="mt-1 break-words text-xs">
                          {latest?.title ?? "Ingen händelse registrerad"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{latest?.date}</p>
                      </div>
                      <div className="col-start-2 row-start-3 min-w-0 lg:col-start-5 lg:row-start-1">
                        <p className="text-xs text-muted-foreground lg:hidden">Nästa underhåll</p>
                        <p className="mt-1 break-words text-xs">
                          {next?.title ?? "Ingen åtgärd planerad"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{next?.due}</p>
                      </div>
                      <ChevronRight
                        aria-hidden="true"
                        className="col-start-3 row-start-1 size-4 text-muted-foreground lg:col-start-6"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      <Sheet
        open={!!selectedUnit}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent
          className="w-full overflow-y-auto p-5 sm:w-full sm:max-w-3xl sm:p-8"
          onCloseAutoFocus={(event) => {
            // Återställ fokus till samma objekt även efter filteruppdatering eller sparande.
            event.preventDefault();
            if (triggerRef.current?.isConnected) triggerRef.current.focus();
            else document.getElementById("unit-search")?.focus();
          }}
        >
          {selectedUnit && (
            <UnitDetails
              key={selectedUnit.id}
              unit={selectedUnit}
              address={properties.find((p) => p.id === selectedUnit.propertyId)!.address}
              onRecordChange={updateRecord}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
