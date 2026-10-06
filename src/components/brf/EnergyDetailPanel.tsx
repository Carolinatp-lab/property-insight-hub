import { useState, type FormEvent } from "react";
import { statusLabel, type PropertyArea } from "@/data/overview";
import {
  changeDrivers,
  changeExplanation,
  costBreakdown,
  energyAnswer,
  energyBoardDraft,
  energyInsights,
  energyKpis,
  energyQuestions,
  energySources,
  lifecycle,
  lifecycleStatus,
  technicalEconomy,
  technicalReadings,
  technicalUnits,
  trendSeries,
  type TrendKey,
} from "@/data/energy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusDot } from "./StatusDot";
import { cn } from "@/lib/utils";
import { ArrowDown, Check, ChevronRight, Sparkles } from "lucide-react";

const mockNote = "Exempeldata i prototypen.";

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6", className)}>
      {children}
    </div>
  );
}

function SectionHeading({ title, note }: { title: string; note?: string }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      {note ? <p className="mt-0.5 text-xs text-muted-foreground">{note}</p> : null}
    </div>
  );
}

const shareColors = [
  "bg-foreground/70",
  "bg-foreground/50",
  "bg-status-watch/70",
  "bg-status-good/60",
  "bg-muted-foreground/40",
];

function CostBreakdownContent() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {costBreakdown.map((part, i) => (
          <div
            key={part.id}
            className={cn(shareColors[i % shareColors.length])}
            style={{ width: `${part.share}%` }}
            aria-hidden
          />
        ))}
      </div>

      <ul className="mt-3 space-y-1.5">
        {costBreakdown.map((part, i) => {
          const isOpen = openId === part.id;
          return (
            <li key={part.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : part.id)}
                aria-expanded={isOpen}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  isOpen && "bg-accent",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-2.5 shrink-0 rounded-full",
                    shareColors[i % shareColors.length],
                  )}
                />
                <span className="min-w-0 flex-1 text-sm text-foreground">{part.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{part.share} %</span>
                <span className="shrink-0 text-sm font-medium text-foreground">{part.amount}</span>
                <ChevronRight
                  aria-hidden
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform",
                    isOpen && "rotate-90",
                  )}
                />
              </button>
              {isOpen ? (
                <p className="mx-3 mt-1 mb-2 rounded-2xl border border-border bg-surface/60 p-4 text-sm leading-relaxed text-foreground">
                  {part.detail}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-muted-foreground">
        Total värmekostnad senaste 12 månaderna: 1 488 000 kr.
      </p>
    </div>
  );
}

function EnergySourcesContent() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {energySources.map((source) => (
        <div key={source.id} className="rounded-2xl border border-border bg-surface/60 p-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-semibold text-foreground">{source.name}</p>
            <p className="text-sm font-semibold text-foreground">{source.share} %</p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground/50"
              style={{ width: `${source.share}%` }}
            />
          </div>
          <ol className="mt-3.5 space-y-1">
            {source.steps.map((step, i) => (
              <li key={step} className="text-sm text-foreground">
                {i > 0 ? (
                  <ArrowDown aria-hidden className="mb-1 size-3.5 text-muted-foreground" />
                ) : null}
                <span className="block">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-muted-foreground">{source.note}</p>
        </div>
      ))}
    </div>
  );
}

function TechnicalStatusContent() {
  return (
    <div>
      <dl className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {technicalReadings.map((r) => (
          <div key={r.label} className="rounded-2xl border border-border bg-surface/60 p-4">
            <dt className="text-xs text-muted-foreground">{r.label}</dt>
            <dd className="mt-1.5 text-base font-semibold text-foreground">{r.value}</dd>
          </div>
        ))}
      </dl>
      <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {technicalUnits.map((unit) => (
          <li
            key={unit.label}
            className="flex items-center justify-between gap-2 rounded-xl border border-border px-3 py-2.5 text-sm text-foreground"
          >
            <span className="flex min-w-0 items-center gap-2">
              <StatusDot status={unit.status} />
              <span className="truncate">{unit.label}</span>
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {statusLabel[unit.status]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrendChart() {
  const [key, setKey] = useState<TrendKey>("cost");
  const series = trendSeries[key];
  const max = Math.max(...series.points.map((p) => p.value));

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <SectionHeading title="Utveckling över tid" note={`Senaste fem åren. ${mockNote}`} />
        <div
          role="group"
          aria-label="Välj mätvärde"
          className="flex gap-1 rounded-full border border-border bg-surface/60 p-0.5"
        >
          {(Object.keys(trendSeries) as TrendKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKey(k)}
              aria-pressed={key === k}
              className={cn(
                "rounded-full px-3 py-1 text-xs transition-colors",
                key === k
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {trendSeries[k].label}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-5 flex items-end gap-3 sm:gap-5">
        {series.points.map((p) => (
          <li key={p.year} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <span className="text-xs font-medium text-foreground">{p.display}</span>
            <div className="flex h-28 w-full items-end">
              <div
                className="w-full rounded-t-lg bg-foreground/25"
                style={{ height: `${Math.round((p.value / max) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{p.year}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function AskEnergy() {
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState<string | null>(null);

  function submit(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setQuestion(trimmed);
    setAsked(trimmed);
  }

  return (
    <Card>
      <h4 className="text-sm font-semibold text-foreground">Fråga om värme &amp; ventilation</h4>
      <form
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          submit(question);
        }}
        className="mt-3 flex flex-col gap-2 sm:flex-row"
      >
        <Input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Exempel: Varför har värmekostnaden ökat?"
          aria-label="Din fråga om värme och ventilation"
          className="h-11 rounded-xl bg-surface text-sm"
        />
        <Button type="submit" className="h-11 rounded-xl px-5">
          Fråga
        </Button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {energyQuestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => submit(q)}
            className="rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-ring/40 hover:text-foreground"
          >
            {q}
          </button>
        ))}
      </div>

      {asked ? (
        <div className="mt-5 rounded-2xl border border-border bg-secondary/50 p-5">
          <p className="text-xs text-muted-foreground">Svar på: {asked}</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{energyAnswer}</p>
        </div>
      ) : null}
    </Card>
  );
}

function DeepDiveSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          open && "rounded-b-none bg-accent",
        )}
      >
        <span className="text-sm font-medium text-foreground">{title}</span>
        <ChevronRight
          aria-hidden
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-90",
          )}
        />
      </button>
      {open ? <div className="border-t border-border p-4">{children}</div> : null}
    </div>
  );
}

export function EnergyDetailPanel({ area }: { area: PropertyArea }) {
  const [addedToBoard, setAddedToBoard] = useState(false);
  const [watching, setWatching] = useState(false);
  const [actionCreated, setActionCreated] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  return (
    <section aria-labelledby="energy-detail-heading" className="space-y-4">
      {/* 1. Hur mår det? */}
      <Card className="sm:p-7">
        <div>
          <h3 id="energy-detail-heading" className="text-xl font-semibold text-foreground">
            {area.name}
          </h3>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <StatusDot status={area.status} />
            {statusLabel[area.status]} · {area.placement}
          </p>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-3">
          {energyKpis.map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-border bg-surface/60 p-4">
              <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                {kpi.label}
              </dt>
              <dd className="mt-1.5">
                <span className="text-base font-semibold text-foreground">{kpi.value}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{kpi.note}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">
          Exempeldata i prototypen – verkligt underlag saknas ännu.
        </p>
      </Card>

      {/* 2. Vad har förändrats – och varför? */}
      <Card>
        <SectionHeading title="Varför har kostnaden förändrats?" note="Jämfört med föregående period." />
        <dl className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {changeDrivers.map((driver) => (
            <div key={driver.label} className="rounded-2xl border border-border bg-surface/60 p-4">
              <dt className="text-xs text-muted-foreground">{driver.label}</dt>
              <dd className="mt-1.5 text-base font-semibold text-foreground">{driver.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 rounded-2xl border border-border bg-secondary/50 p-4 text-sm leading-relaxed text-foreground">
          {changeExplanation}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Exempeldata. I den färdiga tjänsten dras slutsatsen endast när underliggande data stödjer
          den.
        </p>
      </Card>

      <TrendChart />

      {/* 3. Behöver vi göra något? Insikt → åtgärd */}
      <Card>
        <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles aria-hidden className="size-3.5 text-muted-foreground" />
          Det här bör styrelsen känna till
        </h4>
        <ul className="mt-4 space-y-2">
          {energyInsights.slice(0, 3).map((insight) => {
            const isExpandable = insight.id === "e3";
            const isOpen = expandedInsight === insight.id;
            return (
              <li
                key={insight.id}
                className="rounded-2xl border border-border bg-surface/60 p-4"
              >
                {isExpandable ? (
                  <button
                    type="button"
                    onClick={() => setExpandedInsight(isOpen ? null : insight.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start gap-3 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <span className="mt-1.5">
                      <StatusDot status={insight.status} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">
                        {insight.title}
                      </span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                        {insight.text}
                      </span>
                    </span>
                    <ChevronRight
                      aria-hidden
                      className={cn(
                        "mt-1 size-4 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-90",
                      )}
                    />
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <span className="mt-1.5">
                      <StatusDot status={insight.status} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{insight.title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        {insight.text}
                      </p>
                    </div>
                  </div>
                )}

                {isExpandable && isOpen ? (
                  <div className="mt-4 space-y-4 border-t border-border pt-4">
                    {(
                      [
                        ["Fakta", technicalEconomy.fact],
                        ["Analys", technicalEconomy.analysis],
                        ["Möjlig förklaring", technicalEconomy.possibleCause],
                        ["Rekommenderad kontroll", technicalEconomy.recommendedCheck],
                      ] as const
                    ).map(([label, text]) => (
                      <div key={label}>
                        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                          {label}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-foreground">{text}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            Beslutsstöd för styrelsen – inte ett automatiskt beslut.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setWatching(true)}>
              Bevaka
            </Button>
            <Button variant="outline" onClick={() => setActionCreated(true)}>
              Skapa åtgärd
            </Button>
            <Button onClick={() => setAddedToBoard(true)}>Lägg till på nästa styrelsemöte</Button>
          </div>

          {watching ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Värme &amp; ventilation bevakas nu och följs upp automatiskt.
            </p>
          ) : null}
          {actionCreated ? (
            <p className="mt-1.5 text-sm text-muted-foreground">
              En åtgärd har skapats för uppföljning av värmekostnad och energipris.
            </p>
          ) : null}

          {addedToBoard ? (
            <div className="mt-4 rounded-2xl border border-status-good/40 bg-card p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Check aria-hidden className="size-4 text-status-good" />
                Frågan har lagts till som beslutspunkt inför nästa styrelsemöte.
              </p>
              <div className="mt-3 rounded-xl border border-border bg-surface/60 p-4">
                <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {energyBoardDraft.area}
                </p>
                <dl className="mt-2 space-y-1.5 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="shrink-0 text-muted-foreground">Fråga</dt>
                    <dd className="text-right font-medium text-foreground">
                      {energyBoardDraft.question}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="shrink-0 text-muted-foreground">Bakgrund</dt>
                    <dd className="text-right text-foreground">{energyBoardDraft.background}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="shrink-0 text-muted-foreground">Förslag</dt>
                    <dd className="text-right text-foreground">{energyBoardDraft.proposal}</dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : null}
        </div>
      </Card>

      {/* 4. Livscykel – kompakt */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <SectionHeading title="Livscykel & kommande investeringar" note={mockNote} />
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <StatusDot status={lifecycleStatus} />
            {statusLabel[lifecycleStatus]}
          </p>
        </div>
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
          {lifecycle.map((item) => (
            <div key={item.label}>
              <dt className="text-xs text-muted-foreground">{item.label}</dt>
              <dd className="mt-0.5 text-sm font-semibold text-foreground">{item.value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {/* 5. Visa mig detaljer om jag vill */}
      <Card>
        <SectionHeading title="Fördjupning" note={`Tekniska detaljer. ${mockNote}`} />
        <div className="mt-4 space-y-2">
          <DeepDiveSection title="Hur produceras värmen?">
            <EnergySourcesContent />
          </DeepDiveSection>
          <DeepDiveSection title="Vad består kostnaden av?">
            <CostBreakdownContent />
          </DeepDiveSection>
          <DeepDiveSection title="Teknisk status">
            <TechnicalStatusContent />
          </DeepDiveSection>
        </div>
      </Card>

      <AskEnergy />
    </section>
  );
}
