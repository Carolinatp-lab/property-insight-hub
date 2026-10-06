import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/brf/SiteHeader";
import { StatusDot } from "@/components/brf/StatusDot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import { propertyAreas } from "@/data/overview";
import {
  areaMaintenance,
  boardNextSteps,
  componentDetails,
  financing,
  fullPlan,
  maintenanceAnswer,
  maintenanceIntro,
  maintenanceKpiDetails,
  maintenanceMockNote,
  maintenanceOutlook,
  maintenanceOverviewQuestions,
  overviewMaintenanceKpis,
  planChangePrinciple,
  planChanges,
  planChangesIntro,
  planDeviationHint,
  planVsActual,
  upcoming,
} from "@/data/maintenance";

const title = "Underhåll – BRF Exempel";
const description =
  "Levande underhållsplan: planerat underhåll, verkligt utfall, förändringar och finansieringsbehov för föreningen.";

export const Route = createFileRoute("/underhall")({
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
  component: MaintenancePage,
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

type View =
  | { level: "overview" }
  | { level: "kpi"; id: string }
  | { level: "plan" }
  | { level: "component"; id: string };

function MaintenancePage() {
  const [view, setView] = useState<View>({ level: "overview" });
  const [openChange, setOpenChange] = useState<string | null>(null);
  const [proposed, setProposed] = useState<string | null>(null);
  const [showFinancing, setShowFinancing] = useState(false);
  const [openArea, setOpenArea] = useState<string | null>(null);
  const [approved, setApproved] = useState(false);
  const [componentAction, setComponentAction] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState<string | null>(null);

  const financingMax = Math.max(...maintenanceOutlook.years.map((y) => y.value));

  function ask(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setQuestion(trimmed);
    setAsked(trimmed);
  }

  function go(next: View) {
    setView(next);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  function openPlan(areaId?: string) {
    if (areaId) setOpenArea(areaId);
    go({ level: "plan" });
  }

  function openComponent(id: string) {
    setComponentAction(null);
    go({ level: "component", id });
  }

  const kpiDetail = view.level === "kpi" ? maintenanceKpiDetails[view.id] : undefined;
  const component = view.level === "component" ? componentDetails[view.id] : undefined;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-5 px-5 py-6 sm:px-8 sm:py-7">
        {view.level === "overview" ? (
          <>
            <div>
              <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Underhåll</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Planerat underhåll, verkligt utfall och vad som behöver uppmärksammas.
              </p>
            </div>

            {/* 1. Så ser underhållsläget ut */}
            <section className={card}>
              <SectionHeading title={maintenanceIntro.heading} />
              <p className="mt-4 flex items-center gap-2 text-base font-semibold text-foreground">
                <StatusDot status={maintenanceIntro.status} />
                {maintenanceIntro.statusLabel}
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {maintenanceIntro.summary}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {overviewMaintenanceKpis.map((kpi) => (
                  <button
                    key={kpi.id}
                    type="button"
                    onClick={() => go({ level: "kpi", id: kpi.id })}
                    className="rounded-2xl border border-border bg-surface px-4 py-3.5 text-left transition-colors hover:border-ring/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className={eyebrow}>{kpi.label}</p>
                      <ChevronRight aria-hidden className="size-4 text-muted-foreground" />
                    </div>
                    <p className="mt-1.5 text-xl font-semibold text-foreground">{kpi.value}</p>
                    {kpi.note ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">{kpi.note}</p>
                    ) : null}
                    {kpi.statusLabel ? (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        {kpi.status ? <StatusDot status={kpi.status} /> : null}
                        {kpi.statusLabel}
                      </p>
                    ) : null}
                    {kpi.mock ? (
                      <p className="mt-2">
                        <MockTag />
                      </p>
                    ) : null}
                  </button>
                ))}
              </div>
            </section>

            {/* 2. Vad kommer närmast? */}
            <section className={card}>
              <SectionHeading
                title="Vad kommer närmast?"
                note={`Planerade åtgärder de närmaste åren. ${maintenanceMockNote}`}
              />
              <ol className="mt-5 space-y-2">
                {upcoming.map((item) => {
                  const clickable = Boolean(item.componentId);
                  const content = (
                    <>
                      <span className="w-12 text-sm font-semibold text-foreground">
                        {item.year}
                      </span>
                      <span className="min-w-0 flex-1 text-sm text-foreground">{item.action}</span>
                      <span className="text-sm font-semibold text-foreground">{item.cost}</span>
                      <span className="flex w-36 shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                        <StatusDot status={item.status} />
                        {item.statusLabel}
                      </span>
                    </>
                  );
                  return (
                    <li key={item.year}>
                      {clickable ? (
                        <button
                          type="button"
                          onClick={() => openComponent(item.componentId as string)}
                          className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-border bg-surface px-4 py-3 text-left transition-colors hover:border-ring/40"
                        >
                          {content}
                        </button>
                      ) : (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-border bg-surface px-4 py-3">
                          {content}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
              <div className="mt-4">
                <Button variant="outline" className="h-9 rounded-xl" onClick={() => openPlan()}>
                  Visa hela underhållsplanen
                </Button>
              </div>
            </section>

            {/* 3. Det här har förändrats */}
            <section className={card}>
              <SectionHeading title="Det här har förändrats" note={planChangesIntro} />
              <div className="mt-5 space-y-3">
                {planChanges.slice(0, 3).map((change) => {
                  const open = openChange === change.id;
                  const planRow = change.rows.find((r) => r.label === "Plan");
                  const infoRow = change.rows.find((r) => r.label !== "Plan");
                  return (
                    <article key={change.id} className={subCard}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className={eyebrow}>{change.title}</p>
                        {change.statusLabel ? (
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <StatusDot status={change.status} />
                            {change.statusLabel}
                          </span>
                        ) : null}
                      </div>
                      <dl className="mt-2 space-y-1">
                        {planRow ? (
                          <div className="flex flex-wrap gap-x-2">
                            <dt className="text-xs text-muted-foreground">{planRow.label}:</dt>
                            <dd className="text-sm text-foreground">{planRow.value}</dd>
                          </div>
                        ) : null}
                        {infoRow ? (
                          <div className="flex flex-wrap gap-x-2">
                            <dt className="text-xs text-muted-foreground">{infoRow.label}:</dt>
                            <dd className="text-sm text-foreground">{infoRow.value}</dd>
                          </div>
                        ) : null}
                      </dl>
                      <p className="mt-2 text-sm text-foreground">{change.assessment}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
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
                        {change.canPropose ? (
                          <Button
                            variant="outline"
                            className="h-9 rounded-xl"
                            onClick={() => setProposed(change.id)}
                          >
                            Föreslå ändring
                          </Button>
                        ) : null}
                        {change.componentId ? (
                          <Button
                            variant="ghost"
                            className="h-9 rounded-xl"
                            onClick={() => openComponent(change.componentId as string)}
                          >
                            Visa komponent
                          </Button>
                        ) : null}
                        {change.analysisPath ? (
                          <Button asChild variant="ghost" className="h-9 rounded-xl">
                            <Link to={change.analysisPath}>Visa i sammanhang</Link>
                          </Button>
                        ) : null}
                      </div>
                      {open ? (
                        <div className="mt-3 space-y-3 rounded-xl border border-border bg-card px-4 py-3">
                          <dl className="space-y-1">
                            {change.rows.map((row) => (
                              <div key={row.label} className="flex flex-wrap gap-x-2">
                                <dt className="text-xs text-muted-foreground">{row.label}:</dt>
                                <dd className="text-sm text-foreground">{row.value}</dd>
                              </div>
                            ))}
                          </dl>
                          {change.details ? (
                            <p className="text-sm text-muted-foreground">{change.details}</p>
                          ) : null}
                        </div>
                      ) : null}
                      {proposed === change.id ? (
                        <p className="mt-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                          Förslaget är förberett i prototypen och väntar på styrelsens godkännande.
                          Planen ändras först efter beslut.
                        </p>
                      ) : null}
                    </article>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">{planChangePrinciple}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <p className="min-w-0 flex-1 text-sm text-muted-foreground">
                  {planDeviationHint.text}
                </p>
                <Button variant="ghost" className="h-9 rounded-xl" onClick={() => openPlan()}>
                  {planDeviationHint.action}
                </Button>
              </div>
            </section>

            {/* 4. Framåt */}
            <section className={card}>
              <SectionHeading title={maintenanceOutlook.heading} note={maintenanceOutlook.note} />
              <ul className="mt-5 space-y-2">
                {maintenanceOutlook.years.map((year) => (
                  <li key={year.year} className="flex items-center gap-3">
                    <span className="w-12 text-sm text-muted-foreground">{year.year}</span>
                    <span className="w-16 text-sm font-semibold text-foreground">
                      {year.display}
                    </span>
                    <span className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-secondary">
                      <span
                        className="block h-full rounded-full bg-foreground/25"
                        style={{ width: `${Math.round((year.value / financingMax) * 100)}%` }}
                      />
                    </span>
                    <span className="flex w-20 shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                      {"flagLabel" in year && year.flagLabel ? (
                        <>
                          <StatusDot status={year.status} />
                          {year.flagLabel}
                        </>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-foreground">{maintenanceOutlook.observation}</p>
              <p className="mt-1 text-sm text-muted-foreground">{maintenanceOutlook.comment}</p>
              <div className="mt-4">
                <Button variant="outline" className="h-9 rounded-xl" onClick={() => openPlan()}>
                  {maintenanceOutlook.action}
                </Button>
              </div>
              <p className="mt-3">
                <MockTag />
              </p>
            </section>

            {/* 5. Det här bör styrelsen tänka på */}
            <section className={card}>
              <SectionHeading title="Det här bör styrelsen tänka på" />
              <div className="mt-5 grid gap-3 lg:grid-cols-3">
                {boardNextSteps.map((step) => (
                  <article key={step.id} className={subCard}>
                    <p className="flex items-start gap-2 text-sm font-semibold text-foreground">
                      <StatusDot status={step.status} className="mt-1.5" />
                      {step.title}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{step.note}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {step.actions.map((action) =>
                        action.path ? (
                          <Button
                            key={action.label}
                            asChild
                            variant="outline"
                            className="h-9 rounded-xl"
                          >
                            <Link to={action.path}>{action.label}</Link>
                          </Button>
                        ) : (
                          <Button
                            key={action.label}
                            variant="outline"
                            className="h-9 rounded-xl"
                            onClick={() =>
                              step.componentId ? openComponent(step.componentId) : openPlan()
                            }
                          >
                            {action.label}
                          </Button>
                        ),
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* 6. Underhåll per fastighetsdel */}
            <section className={card}>
              <SectionHeading
                title="Underhåll per fastighetsdel"
                note="Se planerat underhåll för olika delar av fastigheten."
              />
              <ul className="mt-5 flex flex-wrap gap-2">
                {propertyAreas.map((area) =>
                  areaMaintenance[area.id] ? (
                    <li key={area.id}>
                      <button
                        type="button"
                        onClick={() => openPlan(area.id)}
                        className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-ring/40 hover:text-foreground"
                      >
                        {area.name}
                        <ChevronRight aria-hidden className="size-3.5" />
                      </button>
                    </li>
                  ) : null,
                )}
              </ul>
            </section>
          </>
        ) : null}

        {/* Nivå 2: KPI-detalj */}
        {view.level === "kpi" && kpiDetail ? (
          <>
            <Button
              variant="ghost"
              className="h-9 rounded-xl px-2"
              onClick={() => go({ level: "overview" })}
            >
              <ArrowLeft aria-hidden className="mr-1.5 size-4" />
              Tillbaka till Underhåll
            </Button>
            <section className={card}>
              <SectionHeading title={kpiDetail.title} />
              <p className="mt-3 text-2xl font-semibold text-foreground">{kpiDetail.value}</p>
              <dl className="mt-4 space-y-2">
                {kpiDetail.rows.map((row) => (
                  <div key={row.label} className="flex flex-wrap gap-x-2">
                    <dt className="text-xs text-muted-foreground">{row.label}:</dt>
                    <dd className="text-sm text-foreground">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <div className={`mt-5 ${subCard}`}>
                <p className={eyebrow}>Vad visar det här?</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{kpiDetail.explanation}</p>
                <p className={`mt-4 ${eyebrow}`}>Vad har förändrats?</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{kpiDetail.analysis}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="outline" className="h-9 rounded-xl" onClick={() => openPlan()}>
                  Visa hela underhållsplanen
                </Button>
                {view.id === "ompröva" ? (
                  <Button
                    variant="outline"
                    className="h-9 rounded-xl"
                    onClick={() => openComponent("tm2")}
                  >
                    Visa Tvättmaskin 2
                  </Button>
                ) : null}
              </div>
              <p className="mt-4">
                <MockTag />
              </p>
            </section>
          </>
        ) : null}

        {/* Nivå 2: hela underhållsplanen (arbetsyta) */}
        {view.level === "plan" ? (
          <>
            <Button
              variant="ghost"
              className="h-9 rounded-xl px-2"
              onClick={() => go({ level: "overview" })}
            >
              <ArrowLeft aria-hidden className="mr-1.5 size-4" />
              Tillbaka till Underhåll
            </Button>

            <section className={card}>
              <SectionHeading
                title="Hela underhållsplanen"
                note={`Arbetsyta för dig som arbetar aktivt med planen. ${maintenanceMockNote}`}
              />
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[46rem] text-left text-sm">
                  <thead>
                    <tr className="text-xs text-muted-foreground">
                      <th className="pb-2 font-medium">Fastighetsdel</th>
                      <th className="pb-2 font-medium">Komponent</th>
                      <th className="pb-2 font-medium">Åtgärd</th>
                      <th className="pb-2 font-medium">Senast utfört</th>
                      <th className="pb-2 font-medium">Planerat år</th>
                      <th className="pb-2 font-medium">Bedömd kostnad</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fullPlan.map((row) => (
                      <tr key={row.id} className="border-t border-border">
                        <td className="py-2.5 text-foreground">{row.area}</td>
                        <td className="py-2.5 text-muted-foreground">
                          {row.component === "Tvättmaskin 2" ? (
                            <button
                              type="button"
                              onClick={() => openComponent("tm2")}
                              className="text-foreground underline decoration-border underline-offset-4 hover:decoration-ring"
                            >
                              {row.component}
                            </button>
                          ) : (
                            row.component
                          )}
                        </td>
                        <td className="py-2.5 text-muted-foreground">{row.action}</td>
                        <td className="py-2.5 text-muted-foreground">{row.last}</td>
                        <td className="py-2.5 text-foreground">{row.year}</td>
                        <td className="py-2.5 text-foreground">{row.cost}</td>
                        <td className="py-2.5">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <StatusDot status={row.status} />
                            {row.statusLabel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Underhåll per fastighetsdel */}
            <section className={card}>
              <SectionHeading
                title="Underhåll per fastighetsdel"
                note="Samma fastighetsstruktur som på sidan Fastigheten. Klicka för att se detaljer."
              />
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {propertyAreas.map((area) => {
                  const detail = areaMaintenance[area.id];
                  if (!detail) return null;
                  const open = openArea === area.id;
                  return (
                    <li key={area.id} className="rounded-2xl border border-border bg-surface">
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => setOpenArea(open ? null : area.id)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-foreground">
                            {area.name}
                          </span>
                          <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <StatusDot status={detail.status} />
                            {detail.statusLabel}
                          </span>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            Nästa åtgärd: {detail.nextAction}
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-semibold text-foreground">
                          {detail.year}
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
                        <div className="space-y-4 border-t border-border px-4 py-4">
                          <dl className="grid gap-2 sm:grid-cols-2">
                            {[
                              { label: "Status", value: detail.statusLabel },
                              { label: "Ålder", value: detail.age },
                              { label: "Senaste åtgärd", value: detail.lastAction },
                              { label: "Nästa planerade åtgärd", value: detail.nextAction },
                              { label: "Planerat år", value: detail.year },
                              { label: "Bedömd kostnad", value: detail.estimatedCost },
                              {
                                label: "Faktiska historiska kostnader",
                                value: detail.historicalCost,
                              },
                            ]
                              .filter((row) => Boolean(row.value))
                              .map((row) => (
                                <div key={row.label} className="flex flex-wrap gap-x-2">
                                  <dt className="text-xs text-muted-foreground">{row.label}:</dt>
                                  <dd className="text-sm text-foreground">{row.value}</dd>
                                </div>
                              ))}
                          </dl>

                          <div>
                            <p className={eyebrow}>Historik</p>
                            <ul className="mt-2 space-y-1.5">
                              {detail.history.map((event) => (
                                <li
                                  key={`${event.year}-${event.action}`}
                                  className="flex flex-wrap items-center gap-x-3 text-sm"
                                >
                                  <span className="w-12 text-muted-foreground">{event.year}</span>
                                  <span className="min-w-0 flex-1 text-foreground">
                                    {event.action}
                                    {event.planned ? (
                                      <span className="ml-2 text-xs text-muted-foreground">
                                        (planerat)
                                      </span>
                                    ) : null}
                                  </span>
                                  <span className="text-foreground">{event.cost}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-border bg-card px-4 py-3">
                              <p className={eyebrow}>Vad säger planen?</p>
                              <p className="mt-1.5 text-sm text-muted-foreground">{detail.plan}</p>
                            </div>
                            <div className="rounded-xl border border-border bg-card px-4 py-3">
                              <p className={eyebrow}>Vad vet vi idag?</p>
                              <p className="mt-1.5 text-sm text-muted-foreground">{detail.today}</p>
                            </div>
                          </div>

                          <p className="flex items-start gap-2 text-sm text-foreground">
                            <StatusDot status={detail.status} className="mt-1.5" />
                            {detail.conclusion}
                          </p>

                          {area.id === "tvattstuga" ? (
                            <Button
                              variant="outline"
                              className="h-9 rounded-xl"
                              onClick={() => openComponent("tm2")}
                            >
                              Visa Tvättmaskin 2
                            </Button>
                          ) : null}

                          <p className="text-xs text-muted-foreground/80">
                            K3-komponent: {detail.k3Component}
                            {detail.mock ? ` · ${maintenanceMockNote}` : ""}
                          </p>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Planerat mot verkligt utfall */}
            <section className={card}>
              <SectionHeading title={planVsActual.heading} note={planVsActual.note} />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-surface px-4 py-3">
                  <p className={eyebrow}>Planerat</p>
                  <p className="mt-1.5 text-sm font-semibold text-foreground">
                    {planVsActual.planned.title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {planVsActual.planned.cost} · {planVsActual.planned.year}
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-surface px-4 py-3">
                  <p className={eyebrow}>Verkligt</p>
                  <p className="mt-1.5 text-sm font-semibold text-foreground">
                    {planVsActual.actual.title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {planVsActual.actual.cost} · {planVsActual.actual.year}
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-1.5">
                {planVsActual.observations.map((observation) => (
                  <li
                    key={observation}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <StatusDot status="neutral" />
                    {observation}
                  </li>
                ))}
              </ul>
              <div className={`mt-4 ${subCard}`}>
                <p className="flex items-start gap-2 text-sm text-foreground">
                  <Sparkles aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                  {planVsActual.proposal}
                </p>
                {approved ? (
                  <p className="mt-3 text-sm text-muted-foreground">{planVsActual.approvedLabel}</p>
                ) : (
                  <Button className="mt-4 h-9 rounded-xl" onClick={() => setApproved(true)}>
                    {planVsActual.approveLabel}
                  </Button>
                )}
              </div>
            </section>

            {/* Underhåll & finansiering */}
            <section className={card}>
              <SectionHeading title={financing.heading} note={financing.note} />
              <p className="mt-3 text-xs text-muted-foreground">
                {financing.capacity} · {maintenanceMockNote}
              </p>
              <ul className="mt-5 space-y-2">
                {financing.years.map((year) => (
                  <li key={year.year} className="flex items-center gap-3">
                    <span className="w-12 text-sm text-muted-foreground">{year.year}</span>
                    <span className="w-16 text-sm font-semibold text-foreground">
                      {year.display}
                    </span>
                    <span className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-secondary">
                      <span
                        className="block h-full rounded-full bg-foreground/25"
                        style={{ width: `${Math.round((year.value / financingMax) * 100)}%` }}
                      />
                    </span>
                    <span className="flex w-24 shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                      <StatusDot status={year.status} />
                      {"flagLabel" in year && year.flagLabel ? year.flagLabel : ""}
                    </span>
                  </li>
                ))}
              </ul>
              <div className={`mt-4 ${subCard}`}>
                <p className="text-sm text-foreground">{financing.observation}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{financing.comment}</p>
                <Button
                  variant="outline"
                  className="mt-4 h-9 rounded-xl"
                  aria-expanded={showFinancing}
                  onClick={() => setShowFinancing((v) => !v)}
                >
                  {showFinancing ? "Dölj finansieringsanalys" : financing.action}
                </Button>
                {showFinancing ? (
                  <p className="mt-4 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                    {financing.analysis}
                  </p>
                ) : null}
              </div>
            </section>
          </>
        ) : null}

        {/* Nivå 3: komponent */}
        {view.level === "component" && component ? (
          <>
            <Button
              variant="ghost"
              className="h-9 rounded-xl px-2"
              onClick={() => go({ level: "overview" })}
            >
              <ArrowLeft aria-hidden className="mr-1.5 size-4" />
              Tillbaka till Underhåll
            </Button>

            <section className={card}>
              <p className={eyebrow}>{component.areaName}</p>
              <h2 className="mt-1 text-xl font-semibold text-foreground">{component.name}</h2>
              <dl className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-xs text-muted-foreground">Installerad:</dt>
                  <dd className="text-sm text-foreground">{component.installed}</dd>
                </div>
                <div className="flex flex-wrap items-center gap-x-2">
                  <dt className="text-xs text-muted-foreground">Status:</dt>
                  <dd className="flex items-center gap-1.5 text-sm text-foreground">
                    <StatusDot status={component.status} />
                    {component.statusLabel}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className={subCard}>
                  <p className={eyebrow}>Planen</p>
                  <dl className="mt-3 space-y-2">
                    {component.plan.map((row) => (
                      <div key={row.label} className="flex flex-wrap gap-x-2">
                        <dt className="text-xs text-muted-foreground">{row.label}:</dt>
                        <dd className="text-sm text-foreground">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className={subCard}>
                  <p className={eyebrow}>Verkligheten</p>
                  <ul className="mt-3 space-y-1.5">
                    {component.events.map((event) => (
                      <li
                        key={event.date}
                        className="flex flex-wrap items-center gap-x-3 text-sm"
                      >
                        <span className="w-20 text-muted-foreground">{event.date}</span>
                        <span className="min-w-0 flex-1 text-foreground">{event.type}</span>
                        <span className="text-foreground">{event.cost}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm font-semibold text-foreground">
                    <span>Totalt</span>
                    <span>{component.eventsTotal}</span>
                  </p>
                </div>
              </div>

              <div className={`mt-4 ${subCard}`}>
                <p className={eyebrow}>Analys</p>
                {component.analysis.map((line) => (
                  <p key={line} className="mt-2 text-sm text-muted-foreground">
                    {line}
                  </p>
                ))}
                <p className={`mt-4 ${eyebrow}`}>Förslag</p>
                <p className="mt-2 flex items-start gap-2 text-sm text-foreground">
                  <Sparkles aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                  {component.proposal}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">{planChangePrinciple}</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {component.actions.map((action) => (
                  <Button
                    key={action.id}
                    variant={action.id === "offert" ? "default" : "outline"}
                    className="h-9 rounded-xl"
                    onClick={() => setComponentAction(action.id)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
              {componentAction ? (
                <p className="mt-4 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                  {component.actions.find((a) => a.id === componentAction)?.result}
                </p>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <p className="text-xs text-muted-foreground/80">
                  K3-komponent: {component.k3Component} · {maintenanceMockNote}
                </p>
                <Button asChild variant="ghost" className="h-9 rounded-xl">
                  <Link to="/fastigheten">Visa i Fastigheten</Link>
                </Button>
                <Button variant="ghost" className="h-9 rounded-xl" onClick={() => openPlan()}>
                  Visa i underhållsplanen
                </Button>
              </div>
            </section>
          </>
        ) : null}

        {/* Fråga om underhållet */}
        <section className={card}>
          <h2 className="text-lg font-semibold text-foreground">Fråga om underhållet</h2>
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
              placeholder="Exempel: Finns det något vi borde tidigarelägga?"
              aria-label="Din fråga om underhållet"
              className="h-12 rounded-xl bg-surface text-sm"
            />
            <Button type="submit" className="h-12 rounded-xl px-6">
              Fråga
            </Button>
          </form>

          <div className="mt-3 flex flex-wrap gap-2">
            {maintenanceOverviewQuestions.map((example) => (
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
              <p className="mt-2 text-sm text-foreground">{maintenanceAnswer.fact}</p>
              <p className="mt-2 text-sm text-muted-foreground">{maintenanceAnswer.analysis}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {maintenanceAnswer.recommendation}
              </p>
              <p className="mt-3 text-xs text-muted-foreground/80">{maintenanceMockNote}</p>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
