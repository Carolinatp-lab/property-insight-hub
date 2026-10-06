import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Building2,
  CalendarClock,
  ChevronRight,
  FileText,
  Home,
  ReceiptText,
  Wrench,
  X,
} from "lucide-react";
import { SiteHeader } from "@/components/brf/SiteHeader";
import { StatusDot } from "@/components/brf/StatusDot";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  costBreakdown,
  renovationHistory,
  tenancies,
  tenancyAttention,
  tenancyMockNote,
  tenancySummary,
  type Tenancy,
  type TenancyType,
} from "@/data/tenancies";

const title = "Hyresrätter & lokaler – BRF Exempel";
const description =
  "Avtal, hyresintäkter, kostnader och renoveringshistorik för föreningens hyresrätter och lokaler.";

export const Route = createFileRoute("/hyresobjekt")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: TenanciesPage,
});

const card = "rounded-3xl border border-border bg-card p-6 shadow-card sm:p-7";
const eyebrow = "text-xs font-medium tracking-wide text-muted-foreground uppercase";

function TenancyDetails({ tenancy, onClose }: { tenancy: Tenancy; onClose: () => void }) {
  const details = [
    ["Avtalstid", tenancy.contractEnd],
    ["Sista uppsägningsdag", tenancy.noticeDate],
    ["Indexering", tenancy.indexTerms],
    ["Säkerhet", tenancy.deposit],
    ["Kontakt", tenancy.contact],
    ["Senaste större åtgärd", tenancy.latestRenovation],
  ];

  return (
    <section
      className={cn(card, "border-primary/25")}
      aria-label={`Avtalsdetaljer för ${tenancy.name}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={eyebrow}>{tenancy.type}</p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">{tenancy.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {tenancy.unit} · {tenancy.area}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Stäng avtalsdetaljer">
          <X />
        </Button>
      </div>
      <div className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {details.map(([label, value]) => (
          <dl key={label} className="bg-surface p-4">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
          </dl>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button className="rounded-xl">
          <FileText />
          Visa avtal
        </Button>
        <Button variant="outline" className="rounded-xl">
          <Wrench />
          Lägg till åtgärd
        </Button>
      </div>
    </section>
  );
}

function TenanciesPage() {
  const [filter, setFilter] = useState<"Alla" | TenancyType>("Alla");
  const [selected, setSelected] = useState<Tenancy | null>(null);
  const visibleTenancies =
    filter === "Alla" ? tenancies : tenancies.filter((item) => item.type === filter);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-5 px-5 py-6 sm:px-8 sm:py-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
              Hyresrätter & lokaler
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Samlad kontroll över avtal, intäkter, kostnader och utförda åtgärder.
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            4 aktiva hyresförhållanden · Mockdata
          </span>
        </div>

        <section className={card}>
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-accent p-2.5 text-accent-foreground">
              <ReceiptText className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Årets hyresekonomi</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Prognos för innevarande år, exklusive moms.
              </p>
            </div>
          </div>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Hyresintäkter", tenancySummary.totalIncome, "12 månader"],
              ["Direkta kostnader", tenancySummary.totalCosts, "Drift och underhåll"],
              ["Netto", tenancySummary.net, "Efter direkta kostnader"],
              ["Nettomarginal", tenancySummary.margin, "+2 procentenheter mot 2025"],
            ].map(([label, value, note]) => (
              <div key={label} className="rounded-2xl border border-border bg-surface p-4">
                <dt className={eyebrow}>{label}</dt>
                <dd className="mt-2 text-xl font-semibold text-foreground">{value}</dd>
                <p className="mt-1 text-xs text-muted-foreground">{note}</p>
              </div>
            ))}
          </dl>
        </section>

        <section className={card}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Avtal och hyresgäster</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Viktiga datum och avtalsvillkor på ett ställe.
              </p>
            </div>
            <div
              className="flex rounded-xl bg-secondary p-1"
              role="group"
              aria-label="Filtrera hyresobjekt"
            >
              {(["Alla", "Lokal", "Hyresrätt"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={filter === option}
                  onClick={() => setFilter(option)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    filter === option
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {visibleTenancies.map((tenancy) => (
              <button
                key={tenancy.id}
                type="button"
                onClick={() => setSelected(tenancy)}
                className="grid w-full gap-3 rounded-2xl border border-border bg-surface p-4 text-left transition-colors hover:border-ring/50 sm:grid-cols-[1.5fr_0.7fr_0.8fr_1fr_auto] sm:items-center"
              >
                <span className="flex items-center gap-3">
                  <span className="rounded-xl bg-secondary p-2 text-foreground">
                    {tenancy.type === "Lokal" ? (
                      <Building2 className="size-4" />
                    ) : (
                      <Home className="size-4" />
                    )}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">
                      {tenancy.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {tenancy.unit} · {tenancy.area}
                    </span>
                  </span>
                </span>
                <span>
                  <span className="block text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                    Årshyra
                  </span>
                  <span className="mt-0.5 block text-sm font-medium text-foreground">
                    {tenancy.annualRent}
                  </span>
                </span>
                <span>
                  <span className="block text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                    Avtal till
                  </span>
                  <span className="mt-0.5 block text-sm text-foreground">
                    {tenancy.contractEnd}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <StatusDot status={tenancy.status} />
                  {tenancy.statusLabel}
                </span>
                <ChevronRight className="hidden size-4 text-muted-foreground sm:block" />
              </button>
            ))}
          </div>
        </section>

        {selected ? <TenancyDetails tenancy={selected} onClose={() => setSelected(null)} /> : null}

        <div className="grid gap-5 lg:grid-cols-2">
          <section className={card}>
            <h2 className="text-lg font-semibold text-foreground">Kostnadsfördelning</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Direkta kostnader kopplade till uthyrningen.
            </p>
            <div className="mt-5 space-y-4">
              {costBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-foreground">{item.label}</span>
                    <span className="font-medium text-foreground">{item.amount}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary/75"
                      style={{ width: `${item.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={card}>
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-secondary p-2 text-foreground">
                <AlertTriangle className="size-4" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Behöver uppmärksammas</h2>
                <p className="mt-1 text-sm text-muted-foreground">Nästa steg för styrelsen.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {tenancyAttention.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-border bg-secondary/50 p-4"
                >
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <StatusDot status={item.status} />
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className={card}>
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-secondary p-2 text-foreground">
              <CalendarClock className="size-4" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Renoveringshistorik</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Åtgärder, kostnader och ansvar per objekt.
              </p>
            </div>
          </div>
          <ol className="mt-5 divide-y divide-border">
            {renovationHistory.map((item) => (
              <li
                key={`${item.year}-${item.unit}`}
                className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[4rem_1fr_auto] sm:items-center"
              >
                <span className="text-sm font-semibold text-foreground">{item.year}</span>
                <span>
                  <span className="block text-sm font-medium text-foreground">{item.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {item.unit} · {item.responsibility}
                  </span>
                </span>
                <span className="text-sm font-semibold text-foreground">{item.cost}</span>
              </li>
            ))}
          </ol>
        </section>

        <p className="pb-3 text-center text-xs text-muted-foreground">{tenancyMockNote}</p>
      </main>
    </div>
  );
}
