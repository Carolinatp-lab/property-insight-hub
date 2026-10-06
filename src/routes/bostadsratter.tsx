import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Home,
  KeyRound,
  Users,
} from "lucide-react";
import { SiteHeader } from "@/components/brf/SiteHeader";
import { StatusDot } from "@/components/brf/StatusDot";
import { cn } from "@/lib/utils";
import {
  condominiumAttention,
  condominiumMockNote,
  condominiumSummary,
  condominiums,
  type Condominium,
} from "@/data/condominiums";

const title = "Bostadsrätter – BRF Exempel";
const description =
  "Översikt över andrahandsuthyrningar, tomma lägenheter och renoveringsunderlag för föreningens bostadsrätter.";

export const Route = createFileRoute("/bostadsratter")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: CondominiumsPage,
});

const card = "rounded-3xl border border-border bg-card p-6 shadow-card sm:p-7";
const eyebrow = "text-xs font-medium tracking-wide text-muted-foreground uppercase";

function ApartmentRow({ apartment }: { apartment: Condominium }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-2xl border border-border bg-surface">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="grid w-full gap-3 p-4 text-left sm:grid-cols-[1.25fr_0.8fr_1fr_auto] sm:items-center"
      >
        <span className="flex items-center gap-3">
          <span className="rounded-xl bg-secondary p-2 text-foreground">
            <Home className="size-4" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-foreground">{apartment.unit}</span>
            <span className="block text-xs text-muted-foreground">
              {apartment.rooms} · {apartment.area}
            </span>
          </span>
        </span>
        <span>
          <span className="block text-[0.65rem] uppercase tracking-wide text-muted-foreground">
            Boendestatus
          </span>
          <span className="mt-0.5 block text-sm font-medium text-foreground">
            {apartment.occupancy}
          </span>
        </span>
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <StatusDot status={apartment.status} />
          {apartment.statusLabel}
        </span>
        {expanded ? (
          <ChevronUp className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
      </button>

      {expanded ? (
        <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-2">
          <div>
            <h3 className={eyebrow}>Andrahandsuthyrningar</h3>
            {apartment.subletPeriod ? (
              <p className="mt-2 text-sm font-medium text-foreground">
                Nuvarande: {apartment.subletPeriod}
              </p>
            ) : null}
            {apartment.subletHistory.length ? (
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {apartment.subletHistory.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Ingen registrerad historik.</p>
            )}
          </div>
          <div>
            <h3 className={eyebrow}>Renoveringsunderlag</h3>
            {apartment.renovationDocuments.length ? (
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {apartment.renovationDocuments.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Inget underlag registrerat.</p>
            )}
            <p className="mt-3 text-xs font-medium text-foreground">Senaste ärende</p>
            <p className="mt-1 text-sm text-muted-foreground">{apartment.latestCase}</p>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function CondominiumsPage() {
  const [filter, setFilter] = useState<"Alla" | "Andrahandsuthyrd" | "Tom">("Alla");
  const visibleApartments =
    filter === "Alla" ? condominiums : condominiums.filter((item) => item.occupancy === filter);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-5 px-5 py-6 sm:px-8 sm:py-7">
        <div>
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Bostadsrätter</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Översikt för styrelsens uppföljning – utan mer personinformation än vad ärendet kräver.
          </p>
        </div>

        <section className={card}>
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-accent p-2.5 text-accent-foreground">
              <KeyRound className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Läget just nu</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Avvikelser och öppna ärenden, inte medlemsregister.
              </p>
            </div>
          </div>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Bostadsrätter", condominiumSummary.total, "Totalt i föreningen"],
              ["Andrahandsuthyrda", condominiumSummary.sublet, "Aktiva tillstånd"],
              ["Registrerad som tom", condominiumSummary.vacant, "Behöver tillsyn"],
              ["Öppna ärenden", condominiumSummary.openCases, "Kräver uppföljning"],
            ].map(([label, value, note]) => (
              <div key={label} className="rounded-2xl border border-border bg-surface p-4">
                <dt className={eyebrow}>{label}</dt>
                <dd className="mt-2 text-xl font-semibold text-foreground">{value}</dd>
                <p className="mt-1 text-xs text-muted-foreground">{note}</p>
              </div>
            ))}
          </dl>
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <section className={card}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Lägenhetsöversikt</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Visa bara objekt som styrelsen behöver följa närmare.
                </p>
              </div>
              <div className="flex rounded-xl bg-secondary p-1" role="group" aria-label="Filtrera">
                {(["Alla", "Andrahandsuthyrd", "Tom"] as const).map((option) => (
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
                    {option === "Andrahandsuthyrd" ? "Andra hand" : option}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5 space-y-2">
              {visibleApartments.map((apartment) => (
                <ApartmentRow key={apartment.id} apartment={apartment} />
              ))}
            </div>
          </section>

          <section className={card}>
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-secondary p-2 text-foreground">
                <AlertTriangle className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-foreground">För styrelsen</h2>
                <p className="mt-1 text-sm text-muted-foreground">Nästa praktiska steg.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {condominiumAttention.map((item) => (
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

        <section className={cn(card, "grid gap-4 sm:grid-cols-2")}>
          <div className="flex gap-3">
            <Users className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-semibold text-foreground">Bra att följa</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tillståndstid, skäl, kontaktväg, tillsyn av tom lägenhet och återkommande uthyrning.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <FileCheck2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-semibold text-foreground">Renoveringsunderlag</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ansökan, ritning, entreprenör, försäkring och slut- eller kvalitetsintyg vid behov.
              </p>
            </div>
          </div>
        </section>

        <p className="pb-3 text-center text-xs text-muted-foreground">{condominiumMockNote}</p>
      </main>
    </div>
  );
}
