import { useEffect, useState } from "react";
import { statusLabel, type PropertyArea } from "@/data/overview";
import {
  areaDetails,
  boardDraftItem,
  type PropertyComponent,
  type Transaction,
} from "@/data/property";
import { Button } from "@/components/ui/button";
import { StatusDot } from "./StatusDot";
import { Sparkles, ChevronRight, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}

function TransactionCard({ transaction }: { transaction: Transaction }) {
  const rows = [
    ["Leverantör", transaction.supplier],
    ["Faktura", transaction.invoice],
    ["Belopp", transaction.amount],
    ["Bokförd som", transaction.accounting],
    ["Fastighetsdel", transaction.areaName],
    ["Komponent", transaction.componentName],
    ["Datum", transaction.date],
  ] as const;

  return (
    <div className="mt-2 rounded-2xl border border-border bg-surface/60 p-4">
      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
      <Button variant="outline" size="sm" className="mt-4">
        <FileText aria-hidden className="size-4" />
        Visa faktura
      </Button>
    </div>
  );
}

function ComponentDetail({ component }: { component: PropertyComponent }) {
  const [openEvent, setOpenEvent] = useState<string | null>(null);
  const [addedToBoard, setAddedToBoard] = useState(false);

  useEffect(() => {
    setOpenEvent(null);
    setAddedToBoard(false);
  }, [component.id]);

  return (
    <div className="mt-4 rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold text-foreground">{component.name}</h4>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
            <StatusDot status={component.status} />
            {statusLabel[component.status]}
            {component.placement ? (
              <>
                <span aria-hidden>·</span>
                {component.placement}
              </>
            ) : null}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
        <MetricCard label="Installerad" value={component.installed} />
        <MetricCard label="Planerat byte" value={component.plannedReplacement} />
        <MetricCard label="Kostnad senaste 12 månaderna" value={component.cost12m} />
        <MetricCard label="Reparationer senaste 12 månaderna" value={component.repairs} />
      </dl>

      {component.timeline?.length ? (
        <div className="mt-6">
          <h5 className="text-sm font-semibold text-foreground">Kostnad och händelser</h5>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Klicka på en reparation för att se den ekonomiska transaktionen bakom den.
          </p>
          <ul className="mt-3 space-y-1.5">
            {component.timeline.map((event) => {
              const isOpen = openEvent === event.id;
              return (
                <li key={event.id}>
                  <button
                    type="button"
                    onClick={() => setOpenEvent(isOpen ? null : event.id)}
                    aria-expanded={isOpen}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                      isOpen && "bg-accent",
                    )}
                  >
                    <ChevronRight
                      aria-hidden
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-90",
                      )}
                    />
                    <span className="min-w-0 flex-1 text-sm text-foreground">{event.period}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{event.type}</span>
                    <span className="shrink-0 text-sm font-medium text-foreground">
                      {event.amount}
                    </span>
                  </button>
                  {isOpen && event.transaction ? (
                    <TransactionCard transaction={event.transaction} />
                  ) : null}
                </li>
              );
            })}
          </ul>
          {component.totalCost ? (
            <p className="mt-3 flex justify-between border-t border-border px-3 pt-3 text-sm">
              <span className="font-medium text-foreground">Total reparationskostnad</span>
              <span className="font-semibold text-foreground">{component.totalCost}</span>
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">
          Inga registrerade händelser för denna komponent de senaste 12 månaderna.
        </p>
      )}

      {component.plan ? (
        <div className="mt-6 rounded-2xl border border-border bg-surface/60 p-5">
          <h5 className="text-sm font-semibold text-foreground">Underhållsplan</h5>
          <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <MetricCard label="Planerad åtgärd" value={component.plan.action} />
            <MetricCard label="Planerat" value={component.plan.year} />
            <MetricCard label="Bedömd kostnad" value={component.plan.estimatedCost} />
          </dl>
          <p className="mt-2.5 text-xs text-muted-foreground">
            K3-koppling: {component.plan.k3Component}
          </p>

          {component.totalCost ? (
            <div className="mt-5 border-t border-border pt-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">Reparationer senaste 12 månader</span>
                    <span className="font-semibold text-foreground">{component.totalCost}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-status-alert/70"
                      style={{ width: "71%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">Planerad kostnad för byte</span>
                    <span className="font-semibold text-foreground">
                      {component.plan.estimatedCost}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-full rounded-full bg-foreground/60" />
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Jämförelsen visar kostnaderna sida vid sida – vilken åtgärd som är lämplig är en
                fråga för förvaltningen.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {component.analysis ? (
        <div className="mt-6 rounded-2xl border border-border bg-surface/60 p-5">
          <h5 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles aria-hidden className="size-3.5 text-muted-foreground" />
            Analys och rekommendation
          </h5>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Beslutsstöd för förvaltningen – inte ett automatiskt beslut.
          </p>
          <div className="mt-3 space-y-4">
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Fakta
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground">
                {component.analysis.fact}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Analys
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground">
                {component.analysis.analysis}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Rekommendation
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground">
                {component.analysis.recommendation}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button>Ta in offert</Button>
            <Button variant="outline" onClick={() => setAddedToBoard(true)}>
              Lägg till på nästa förvaltningsmöte
            </Button>
            <Button variant="ghost">Bevaka</Button>
          </div>

          {addedToBoard ? (
            <div className="mt-4 rounded-2xl border border-status-good/40 bg-card p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Check aria-hidden className="size-4 text-status-good" />
                {component.name} har lagts till som beslutspunkt inför nästa förvaltningsmöte.
              </p>
              <div className="mt-3 rounded-xl border border-border bg-surface/60 p-4">
                <p className="text-sm font-semibold text-foreground">{boardDraftItem.title}</p>
                <dl className="mt-2.5 space-y-1.5 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="shrink-0 text-muted-foreground">Bakgrund</dt>
                    <dd className="text-right text-foreground">{boardDraftItem.background}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Kostnad hittills</dt>
                    <dd className="text-right font-medium text-foreground">
                      {boardDraftItem.costSoFar}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="shrink-0 text-muted-foreground">
                      Planerat byte enligt underhållsplan
                    </dt>
                    <dd className="text-right text-foreground">
                      {boardDraftItem.plannedReplacement}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Bedömd kostnad</dt>
                    <dd className="text-right font-medium text-foreground">
                      {boardDraftItem.estimatedCost}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="shrink-0 text-muted-foreground">Förslag</dt>
                    <dd className="text-right text-foreground">{boardDraftItem.proposal}</dd>
                  </div>
                </dl>
                <p className="mt-3 border-t border-border pt-3 text-sm text-foreground">
                  <span className="font-medium">Fråga till förvaltningen: </span>
                  {boardDraftItem.question}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function AreaDetailPanel({ area }: { area: PropertyArea }) {
  const detail = areaDetails[area.id];
  const [componentId, setComponentId] = useState<string | null>(null);

  useEffect(() => {
    setComponentId(null);
  }, [area.id]);

  const selected = detail?.components.find((c) => c.id === componentId) ?? null;

  const metrics = detail?.metrics ?? [
    { label: "Kostnad senaste 12 månaderna", value: area.cost12m },
    { label: "Antal fel/reparationer", value: area.repairs ?? "–" },
    { label: "Senaste åtgärd", value: area.lastAction },
    { label: "Planerat underhåll", value: area.plannedAction },
  ];

  return (
    <section
      aria-labelledby="area-detail-heading"
      className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7"
    >
      <div>
        <h3 id="area-detail-heading" className="text-xl font-semibold text-foreground">
          {area.name}
        </h3>
        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <StatusDot status={area.status} />
          {statusLabel[area.status]} · {area.placement}
        </p>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <MetricCard key={m.label} label={m.label} value={m.value} />
        ))}
      </dl>

      {detail ? (
        <div className="mt-6 border-t border-border pt-5">
          <h4 className="text-sm font-semibold text-foreground">Komponenter</h4>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Välj en komponent för att se kostnader, historik och planerat underhåll.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {detail.components.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setComponentId(componentId === c.id ? null : c.id)}
                aria-pressed={componentId === c.id}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-xl border border-border px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  componentId === c.id && "bg-accent",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <StatusDot status={c.status} />
                  <span className="truncate">{c.name}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {statusLabel[c.status]}
                </span>
              </button>
            ))}
          </div>

          {selected ? <ComponentDetail component={selected} /> : null}
        </div>
      ) : (
        <div className="mt-6 space-y-4 border-t border-border pt-5">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Observation
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground">{area.fact}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface/60 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <Sparkles aria-hidden className="size-3.5" />
              Analys
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground">{area.analysis}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Rekommendation
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground">{area.recommendation}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Komponentnivå är ännu inte registrerad för denna del av fastigheten.
          </p>
        </div>
      )}
    </section>
  );
}
