import { useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/brf/SiteHeader";
import { StatusDot } from "@/components/brf/StatusDot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import {
  boardAttention,
  budgetRows,
  changeConclusions,
  economyAnswer,
  economyChanges,
  economyHealth,
  economyIntro,
  economyKpis,
  economyQuestions,
  economyReports,
  economyTrends,
  feeAssessment,
  feeScenarios,


  forecast,
  kpiDetails,
  loans,
  maintenanceCapacity,
  mockNote,
  outlook,
  overviewKpis,
  overviewQuestions,
  trendPeriods,
  type EconomyTrendKey,
} from "@/data/economy";

const title = "Ekonomi – BRF Exempel";
const description =
  "Föreningens ekonomiska läge, förändringar, utfall mot budget, prognos och kommande underhåll – sammanfattat för styrelsen.";

export const Route = createFileRoute("/ekonomi")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EconomyPage,
});

const card = "rounded-3xl border border-border bg-card p-6 shadow-card sm:p-7";
const subCard = "rounded-2xl border border-border bg-secondary/50 p-5";
const eyebrow = "text-xs font-medium tracking-wide text-muted-foreground uppercase";

function SectionHeading({ title: heading, note }: { title: string; note?: string }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">{heading}</h2>
      {note ? <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{note}</p> : null}
    </div>
  );
}

function MockTag() {
  return <span className="text-[0.65rem] text-muted-foreground/80">Mockdata</span>;
}

function TrendChart({
  trendKey,
  period,
  height = "h-28",
}: {
  trendKey: EconomyTrendKey;
  period: number;
  height?: string;
}) {
  const trend = economyTrends[trendKey];
  const points = trend.points.slice(-period);
  const max = Math.max(...points.map((p) => p.value));
  return (
    <>
      <p className="mt-5 text-xs text-muted-foreground">
        {trend.label} · {trend.unit}
      </p>
      <ul className="mt-3 flex items-end gap-2 sm:gap-4">
        {points.map((point) => (
          <li key={point.year} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <span className="text-xs font-medium text-foreground">{point.display}</span>
            <div className={cn("flex w-full items-end", height)}>
              <div
                className="w-full rounded-t-lg bg-foreground/25"
                style={{ height: `${Math.round((point.value / max) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{point.year}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

function PeriodToggle({
  period,
  setPeriod,
}: {
  period: number;
  setPeriod: (years: number) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Välj tidsperiod"
      className="flex gap-1 rounded-full border border-border bg-surface/60 p-0.5"
    >
      {trendPeriods.map((p) => (
        <button
          key={p.id}
          type="button"
          aria-pressed={period === p.years}
          onClick={() => setPeriod(p.years)}
          className={cn(
            "rounded-full px-3 py-1 text-xs transition-colors",
            period === p.years
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

type View =
  | { level: "overview" }
  | { level: "details" }
  | { level: "kpi"; id: string }
  | { level: "fee" };

function CollapsibleSection({
  title,
  summary,
  open,
  onToggle,
  children,
}: {
  title: string;
  summary: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className={card}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <div className="mt-1 text-sm text-muted-foreground">{summary}</div>
        </div>
        <ChevronRight
          aria-hidden
          className={cn(
            "size-5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-90",
          )}
        />
      </button>
      {open ? <div className="mt-5">{children}</div> : null}
    </section>
  );
}


function EconomyPage() {
  const [view, setView] = useState<View>({ level: "overview" });
  const [openChange, setOpenChange] = useState<string | null>(null);
  const [openBudget, setOpenBudget] = useState<string | null>(null);
  const [trendKey, setTrendKey] = useState<EconomyTrendKey>("sparande");
  const [period, setPeriod] = useState<number>(5);
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState<string | null>(null);
  const [scenarioId, setScenarioId] = useState<string>("oforandrad");
  const [openKpiSection, setOpenKpiSection] = useState(false);
  const [openChangesSection, setOpenChangesSection] = useState(false);
  const [openOutlookSection, setOpenOutlookSection] = useState(false);
  const [openBoardSection, setOpenBoardSection] = useState(false);
  const [openDetailsSection, setOpenDetailsSection] = useState(false);





  const maturityMax = Math.max(...loans.maturities.map((m) => m.value));
  const maintenanceMax = Math.max(...maintenanceCapacity.years.map((y) => y.value));

  function ask(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setQuestion(trimmed);
    setAsked(trimmed);
  }

  function openDetails() {
    setView({ level: "details" });
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  function openFee() {
    setView({ level: "fee" });
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }



  function openKpi(id: string) {
    const detail = kpiDetails[id];
    if (detail?.trendKey) setTrendKey(detail.trendKey);
    setView({ level: "kpi", id });
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  function backToOverview() {
    setView({ level: "overview" });
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-5 px-5 py-6 sm:px-8 sm:py-7">
        {view.level === "overview" ? (
          <>
            <div>
              <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Ekonomi</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Föreningens ekonomiska läge, utveckling och prognos.
              </p>
            </div>

            {/* A. Så mår ekonomin */}
            <section className={card}>
              <SectionHeading title={economyHealth.heading} note={economyIntro.subtitle} />
              <p className="mt-4 flex items-center gap-2 text-base font-semibold text-foreground">
                <StatusDot status={economyHealth.status} />
                {economyHealth.statusLabel}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {economyHealth.summary}
              </p>
            </section>

            {/* Investeringstest */}
            <section className={card}>
              <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className={eyebrow}>Beslutsstöd</p>
                  <h2 className="mt-2 text-lg font-semibold text-foreground">
                    Testa en investering
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Prova exempelvis en takrenovering och se hur lån, likviditet,
                    belåning och avgifter påverkas.
                  </p>
                </div>
                <Button asChild variant="outline" className="h-10 rounded-xl">
                  <Link to="/ekonomi/investeringssimulator">
                    Öppna simulatorn
                    <ChevronRight aria-hidden className="size-4" />
                  </Link>
                </Button>
              </div>
            </section>

            {/* B. Fyra centrala nyckeltal */}
            <CollapsibleSection
              title="Nyckeltal"
              summary="Likvida medel 4,5 Mkr · Belåning 5 220 kr/m² · Sparande 122 kr/m² · Budget i nivå"
              open={openKpiSection}
              onToggle={() => setOpenKpiSection((v) => !v)}
            >
              <h2 id="kpi-heading" className="sr-only">
                Centrala nyckeltal
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {overviewKpis.map((kpi) => (
                  <button
                    key={kpi.id}
                    type="button"
                    onClick={() => openKpi(kpi.id)}
                    className="rounded-2xl border border-border bg-surface px-4 py-3.5 text-left transition-colors hover:border-ring/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className={eyebrow}>{kpi.label}</p>
                      <ChevronRight aria-hidden className="size-4 text-muted-foreground" />
                    </div>
                    <p className="mt-1.5 text-xl font-semibold text-foreground">{kpi.value}</p>
                    {kpi.comparison ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {kpi.direction === "up" ? "↑ " : kpi.direction === "down" ? "↓ " : ""}
                        {kpi.comparison}
                      </p>
                    ) : null}
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <StatusDot status={kpi.status} />
                      {kpi.statusLabel}
                    </p>
                  </button>
                ))}
              </div>
            </CollapsibleSection>

            {/* C. Det här har förändrats */}
            <CollapsibleSection
              title="Det här har förändrats"
              summary={
                <span className="flex items-center gap-2">
                  <StatusDot status="watch" />
                  {economyChanges.slice(0, 3).length} förändringar att känna till
                </span>
              }
              open={openChangesSection}
              onToggle={() => setOpenChangesSection((v) => !v)}
            >
              <div className="space-y-3">
                {economyChanges.slice(0, 3).map((change) => {
                  const open = openChange === change.id;
                  return (
                    <article key={change.id} className={subCard}>
                      <div className="flex items-center justify-between gap-2">
                        <p className={eyebrow}>{change.title}</p>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <StatusDot status="watch" />
                          Bevaka
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1.5">
                        {change.metrics.map((metric) => (
                          <div key={metric.label ?? metric.value}>
                            {metric.label ? (
                              <p className="text-xs text-muted-foreground">{metric.label}</p>
                            ) : null}
                            <p className="text-sm font-semibold text-foreground">{metric.value}</p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-sm text-foreground">
                        {changeConclusions[change.id] ?? change.explanation}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {change.details ? (
                          <Button
                            variant="outline"
                            className="h-9 rounded-xl"
                            aria-expanded={open}
                            onClick={() => setOpenChange(open ? null : change.id)}
                          >
                            {open ? "Dölj" : "Visa varför"}
                          </Button>
                        ) : null}
                        {change.action?.path ? (
                          <Button asChild variant="outline" className="h-9 rounded-xl">
                            <Link to={change.action.path}>{change.action.label}</Link>
                          </Button>
                        ) : null}
                      </div>
                      {open && change.details ? (
                        <div className="mt-4 rounded-xl border border-border bg-card px-4 py-3">
                          <p className="text-sm text-muted-foreground">{change.explanation}</p>
                          <p className="mt-2 text-sm text-muted-foreground">{change.details}</p>
                          {change.mock ? (
                            <p className="mt-2">
                              <MockTag />
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </CollapsibleSection>

            {/* D. Framåt */}
            <CollapsibleSection
              title={outlook.heading}
              summary={
                <span className="flex items-center gap-2">
                  <StatusDot status="watch" />
                  Större underhåll väntar 2030. Avgiften bör bevakas inför nästa budget.
                </span>
              }
              open={openOutlookSection}
              onToggle={() => setOpenOutlookSection((v) => !v)}
            >
              <SectionHeading
                title={outlook.heading}
                note="Ser ekonomin hållbar ut de kommande åren?"
              />
              <ul className="mt-5 grid gap-2 sm:grid-cols-5">
                {outlook.years.map((year) => (
                  <li
                    key={year.year}
                    className="rounded-2xl border border-border bg-surface px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-foreground">{year.year}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <StatusDot status={year.status} />
                      {year.statusLabel}
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground">{year.note}</p>
                  </li>
                ))}
              </ul>
              <div className={`mt-4 ${subCard}`}>
                <p className="text-sm text-muted-foreground">{outlook.summary}</p>
                <Button variant="outline" className="mt-4 h-9 rounded-xl" onClick={openDetails}>
                  Visa ekonomisk framtidsanalys
                </Button>
              </div>

              {/* Avgiftsbedömning – kompakt kort i Framåt */}
              <div className={`mt-3 ${subCard}`}>
                <p className={eyebrow}>{feeAssessment.heading}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {feeAssessment.currentLabel}
                </p>
                <p className="text-lg font-semibold text-foreground">{feeAssessment.current}</p>
                <p className="mt-3 flex items-start gap-2 text-sm text-foreground">
                  <StatusDot status={feeAssessment.status} className="mt-1.5" />
                  {feeAssessment.statusLabel}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{feeAssessment.explanation}</p>
                <p className="mt-3 flex items-start gap-2 text-sm text-foreground">
                  <StatusDot status={feeAssessment.forwardStatus} className="mt-1.5" />
                  {feeAssessment.forwardLabel}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{feeAssessment.forwardNote}</p>
                <Button variant="outline" className="mt-4 h-9 rounded-xl" onClick={openFee}>
                  {feeAssessment.action}
                </Button>
              </div>
            </CollapsibleSection>

            {/* E. Det här bör styrelsen tänka på */}
            <CollapsibleSection
              title="Det här bör styrelsen tänka på"
              summary={
                <span className="flex items-center gap-2">
                  <StatusDot status="watch" />
                  {boardAttention.slice(0, 3).length} frågor att uppmärksamma
                </span>
              }
              open={openBoardSection}
              onToggle={() => setOpenBoardSection((v) => !v)}
            >
              <div className="flex items-center gap-2">
                <Sparkles aria-hidden className="size-4 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">
                  Det här bör styrelsen tänka på
                </h2>
              </div>
              <ul className="mt-4 space-y-2">
                {boardAttention.slice(0, 3).map((item) => (
                  <li
                    key={item.id}
                    className="rounded-2xl border border-border bg-surface px-4 py-3"
                  >
                    <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <StatusDot status={item.status} />
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>

            {/* F. Ingång till ekonomiska detaljer */}
            <CollapsibleSection
              title="Ekonomiska detaljer"
              summary="Budget, prognos, lån, utveckling och rapporter"
              open={openDetailsSection}
              onToggle={() => setOpenDetailsSection((v) => !v)}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <SectionHeading
                  title="Ekonomiska detaljer"
                  note="Utfall mot budget, prognos, utveckling över tid, lån & ränta, underhåll och rapporter."
                />
                <Button className="h-11 rounded-xl px-5" onClick={openDetails}>
                  Öppna ekonomiska detaljer
                </Button>
              </div>
            </CollapsibleSection>

            {/* G. Fråga om ekonomin */}
            <QuestionSection
              question={question}
              setQuestion={setQuestion}
              ask={ask}
              asked={asked}
              examples={overviewQuestions}
            />
          </>
        ) : null}

        {view.level === "fee" ? (
          <>
            <Button variant="outline" className="h-9 rounded-xl" onClick={backToOverview}>
              <ArrowLeft aria-hidden className="size-4" />
              Tillbaka till översikten
            </Button>

            <section className={card}>
              <SectionHeading
                title="Så påverkas föreningens ekonomi"
                note={`Nuvarande avgift är ${feeAssessment.current}. Välj ett scenario för att se effekten.`}
              />
              <p className="mt-5 text-2xl font-semibold text-foreground">{feeAssessment.current}</p>
              <p className="mt-1 text-sm text-muted-foreground">Nuvarande årsavgift</p>

              <div role="group" aria-label="Välj avgiftsscenario" className="mt-6 flex flex-wrap gap-2">
                {feeScenarios.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={scenarioId === s.id}
                    onClick={() => setScenarioId(s.id)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-colors",
                      scenarioId === s.id
                        ? "border-ring/40 bg-secondary text-foreground"
                        : "border-border bg-surface/60 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {(() => {
                const scenario = feeScenarios.find((s) => s.id === scenarioId) ?? feeScenarios[0]!;
                return (
                  <div className="mt-6 rounded-2xl border border-border bg-surface px-4 py-4">
                    <p className={eyebrow}>Effekt vid {scenario.label.toLowerCase()}</p>
                    <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                      {[
                        { label: "Avgiftsintäkter", value: scenario.income },
                        { label: "Sparande", value: scenario.saving },
                        { label: "Likviditet 2030", value: scenario.liquidity2030 },
                        { label: "Finansieringsbehov", value: scenario.financingNeed },
                      ].map((row) => (
                        <div key={row.label}>
                          <dt className="text-xs text-muted-foreground">{row.label}</dt>
                          <dd className="mt-0.5 text-sm font-semibold text-foreground">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-4 text-sm text-muted-foreground">{scenario.maintenance}</p>
                    <p className="mt-4">
                      <MockTag />
                    </p>
                  </div>
                );
              })()}
            </section>
          </>
        ) : null}



        {view.level === "kpi" ? (
          <KpiDetailView
            id={view.id}
            period={period}
            setPeriod={setPeriod}
            onBack={backToOverview}
            onDetails={openDetails}
          />
        ) : null}

        {view.level === "details" ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button variant="outline" className="h-9 rounded-xl" onClick={backToOverview}>
                <ArrowLeft aria-hidden className="size-4" />
                Tillbaka till översikten
              </Button>
            </div>

            {/* Nyckeltal i sin helhet, inklusive Årsavgift och Soliditet */}
            <section className={card}>
              <SectionHeading
                title="Ekonomiska detaljer"
                note="Samtliga nyckeltal och underliggande analys."
              />
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {economyKpis.map((kpi) => (
                  <div
                    key={kpi.id}
                    className="rounded-2xl border border-border bg-surface px-4 py-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className={eyebrow}>{kpi.label}</p>
                      {kpi.mock ? <MockTag /> : null}
                    </div>
                    <p className="mt-1.5 text-xl font-semibold text-foreground">{kpi.value}</p>
                    {kpi.comparison ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {kpi.direction === "up" ? "↑ " : kpi.direction === "down" ? "↓ " : ""}
                        {kpi.comparison}
                      </p>
                    ) : null}
                    {kpi.statusLabel ? (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <StatusDot status={kpi.status} />
                        {kpi.statusLabel}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            {/* Utfall mot budget */}
            <section className={card}>
              <SectionHeading
                title="Utfall mot budget"
                note={`Större intäkts- och kostnadsområden. ${mockNote}`}
              />
              <ul className="mt-5 space-y-2">
                {budgetRows.map((row) => {
                  const open = openBudget === row.id;
                  return (
                    <li key={row.id} className="rounded-2xl border border-border bg-surface">
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => setOpenBudget(open ? null : row.id)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left"
                      >
                        <StatusDot status={row.status} />
                        <span className="min-w-0 flex-1 text-sm font-medium text-foreground">
                          {row.area}
                        </span>
                        <span className="hidden text-xs text-muted-foreground sm:block">
                          Budget {row.budget}
                        </span>
                        <span className="hidden text-xs text-muted-foreground sm:block">
                          Utfall {row.actual}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {row.deviation}
                        </span>
                        <ChevronRight
                          aria-hidden
                          className={cn(
                            "size-4 shrink-0 text-muted-foreground transition-transform",
                            open && "rotate-90",
                          )}
                        />
                      </button>
                      {open ? (
                        <div className="border-t border-border px-4 py-3">
                          <p className="text-xs text-muted-foreground sm:hidden">
                            Budget {row.budget} · Utfall {row.actual}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">{row.detail}</p>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Prognos */}
            <section className={card}>
              <SectionHeading title={forecast.heading} note={forecast.note} />
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {forecast.rows.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-2xl border border-border bg-surface px-4 py-3"
                  >
                    <p className={eyebrow}>{row.label}</p>
                    <p className="mt-1.5 text-lg font-semibold text-foreground">{row.value}</p>
                  </div>
                ))}
              </div>
              <div className={`mt-4 ${subCard}`}>
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles aria-hidden className="size-3.5" />
                  Prognos – inte faktiskt utfall
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{forecast.explanation}</p>
              </div>
            </section>

            {/* Ekonomisk utveckling */}
            <section className={card}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <SectionHeading
                  title="Ekonomisk utveckling"
                  note="Ett mått åt gången. Syftet är att visa trend."
                />
                <PeriodToggle period={period} setPeriod={setPeriod} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(Object.keys(economyTrends) as EconomyTrendKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={trendKey === key}
                    onClick={() => setTrendKey(key)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                      trendKey === key
                        ? "border-ring/40 bg-secondary text-foreground"
                        : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {economyTrends[key].label}
                  </button>
                ))}
              </div>
              <TrendChart trendKey={trendKey} period={period} />
            </section>

            {/* Lån & ränta */}
            <section className={card}>
              <SectionHeading title="Lån & ränta" note={`Skuld, ränta och förfall. ${mockNote}`} />
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {loans.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-2xl border border-border bg-surface px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className={eyebrow}>{fact.label}</p>
                      {fact.mock ? <MockTag /> : null}
                    </div>
                    <p className="mt-1.5 text-base font-semibold text-foreground">{fact.value}</p>
                  </div>
                ))}
              </div>

              <div className={`mt-4 ${subCard}`}>
                <p className="text-sm font-semibold text-foreground">När förfaller lånen?</p>
                <ul className="mt-4 flex items-end gap-3 sm:gap-5">
                  {loans.maturities.map((item) => (
                    <li key={item.year} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                      <span className="text-xs font-medium text-foreground">{item.display}</span>
                      <div className="flex h-20 w-full items-end">
                        <div
                          className="w-full rounded-t-lg bg-foreground/25"
                          style={{ height: `${Math.round((item.value / maturityMax) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{item.year}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 rounded-2xl border border-border bg-surface px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className={eyebrow}>Räntekänslighet</p>
                  <MockTag />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{loans.sensitivity}</p>
              </div>
            </section>

            {/* Underhåll & finansiering */}
            <section className={card}>
              <SectionHeading
                title={maintenanceCapacity.heading}
                note={`Likvida medel, sparande och lån ställda mot planerat underhåll. ${mockNote}`}
              />
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {maintenanceCapacity.basis.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border bg-surface px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className={eyebrow}>{item.label}</p>
                      {item.mock ? <MockTag /> : null}
                    </div>
                    <p className="mt-1.5 text-base font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              <ul className="mt-5 flex items-end gap-2 sm:gap-4">
                {maintenanceCapacity.years.map((item) => (
                  <li key={item.year} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-medium text-foreground">{item.display}</span>
                    <div className="flex h-24 w-full items-end">
                      <div
                        className="w-full rounded-t-lg bg-foreground/25"
                        style={{ height: `${Math.round((item.value / maintenanceMax) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{item.year}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-3 space-y-1">
                {maintenanceCapacity.years.map((item) => (
                  <li key={item.year} className="text-xs text-muted-foreground">
                    {item.year} · Planerat underhåll {item.display} – {item.note}
                  </li>
                ))}
              </ul>

              <div className={`mt-4 ${subCard}`}>
                <p className="text-sm text-muted-foreground">{maintenanceCapacity.assessment}</p>
                <Button asChild variant="outline" className="mt-4 h-9 rounded-xl">
                  <Link to="/underhall">Visa underhållsplan</Link>
                </Button>
              </div>
            </section>

            {/* Ekonomiska rapporter */}
            <section className={card}>
              <SectionHeading
                title="Ekonomiska rapporter"
                note="Traditionella rapporter för den som vill gå djupare."
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {economyReports.map((report) => (
                  <Button key={report} variant="outline" className="h-9 rounded-xl">
                    {report}
                  </Button>
                ))}
              </div>
            </section>

            <QuestionSection
              question={question}
              setQuestion={setQuestion}
              ask={ask}
              asked={asked}
              examples={economyQuestions}
            />
          </>
        ) : null}
      </main>
    </div>
  );
}

function KpiDetailView({
  id,
  period,
  setPeriod,
  onBack,
  onDetails,
}: {
  id: string;
  period: number;
  setPeriod: (years: number) => void;
  onBack: () => void;
  onDetails: () => void;
}) {
  const detail = kpiDetails[id];
  if (!detail) return null;
  return (
    <>
      <Button variant="outline" className="h-9 rounded-xl" onClick={onBack}>
        <ArrowLeft aria-hidden className="size-4" />
        Tillbaka till översikten
      </Button>

      <section className={card}>
        <SectionHeading title={detail.title} />
        <p className="mt-3 text-3xl font-semibold text-foreground">{detail.value}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {detail.rows.map((row) => (
            <div key={row.label} className="rounded-2xl border border-border bg-surface px-4 py-3">
              <p className={eyebrow}>{row.label}</p>
              <p className="mt-1.5 text-base font-semibold text-foreground">{row.value}</p>
            </div>
          ))}
        </div>
      </section>

      {detail.trendKey ? (
        <section className={card}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <SectionHeading title="Utveckling över tid" />
            <PeriodToggle period={period} setPeriod={setPeriod} />
          </div>
          <TrendChart trendKey={detail.trendKey} period={period} />
        </section>
      ) : null}

      <section className={card}>
        <SectionHeading title={`Vad betyder ${detail.title.toLowerCase()}?`} />
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {detail.meaning}
        </p>
      </section>

      <section className={card}>
        <div className="flex items-center gap-2">
          <Sparkles aria-hidden className="size-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Vad har förändrats?</h2>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {detail.changed}
        </p>
        <Button variant="outline" className="mt-5 h-9 rounded-xl" onClick={onDetails}>
          Visa mer ekonomisk detalj
        </Button>
      </section>
    </>
  );
}

function QuestionSection({
  question,
  setQuestion,
  ask,
  asked,
  examples,
}: {
  question: string;
  setQuestion: (value: string) => void;
  ask: (value: string) => void;
  asked: string | null;
  examples: string[];
}) {
  return (
    <section className={card}>
      <h2 className="text-lg font-semibold text-foreground">Fråga om ekonomin</h2>
      <form
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          ask(question);
        }}
        className="mt-4 flex flex-col gap-3 sm:flex-row"
      >
        <Input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Exempel: Varför är sparandet lägre?"
          aria-label="Din fråga om ekonomin"
          className="h-12 rounded-xl bg-surface text-sm"
        />
        <Button type="submit" className="h-12 rounded-xl px-6">
          Fråga
        </Button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => ask(example)}
            className="rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-ring/40 hover:text-foreground"
          >
            {example}
          </button>
        ))}
      </div>

      {asked ? (
        <div className={`mt-6 ${subCard}`}>
          <p className="text-xs text-muted-foreground">Svar på: {asked}</p>
          <p className="mt-2 text-sm text-foreground">{economyAnswer.fact}</p>
          <p className="mt-2 text-sm text-muted-foreground">{economyAnswer.analysis}</p>
          <p className="mt-2 text-sm text-muted-foreground">{economyAnswer.recommendation}</p>
          <p className="mt-3 text-xs text-muted-foreground/80">{mockNote}</p>
        </div>
      ) : null}
    </section>
  );
}
