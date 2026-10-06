import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/brf/SiteHeader";
import { StatusDot } from "@/components/brf/StatusDot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  decision,
  goodToKnow,
  meetingAnswer,
  meetingQuestions,
  meetingSummary,
  nextMeeting,
  previousDecisions,
  proposedAgenda,
  toWatch,
} from "@/data/board";

const title = "Styrelsemöte – BRF Exempel";
const description =
  "Sammanfattning av det som förändrats, behöver följas upp eller kräver styrelsens beslut inför nästa styrelsemöte.";

export const Route = createFileRoute("/styrelsemote")({
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
  component: BoardMeetingPage,
});

const card = "rounded-3xl border border-border bg-card p-6 shadow-card sm:p-7";
const subCard = "rounded-2xl border border-border bg-secondary/50 p-5";
const eyebrow = "text-xs font-medium tracking-wide text-muted-foreground uppercase";

function BoardMeetingPage() {
  const [showEvidence, setShowEvidence] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [agenda, setAgenda] = useState(proposedAgenda);
  const [ownItem, setOwnItem] = useState("");
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState<string | null>(null);
  const [expandedWatch, setExpandedWatch] = useState<string | null>(null);
  const [openDecision, setOpenDecision] = useState<string | null>(null);
  const [showBrief, setShowBrief] = useState(false);

  function addOwnItem(event: FormEvent) {
    event.preventDefault();
    const trimmed = ownItem.trim();
    if (!trimmed) return;
    setAgenda((prev) => [...prev.slice(0, prev.length - 3), trimmed, ...prev.slice(-3)]);
    setOwnItem("");
  }

  function ask(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setQuestion(trimmed);
    setAsked(trimmed);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-5 px-5 py-6 sm:px-8 sm:py-7">
        {/* 1. Sidhuvud */}
        <section className={card}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
                {nextMeeting.heading}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {nextMeeting.subtitle}
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <div className="rounded-2xl border border-border bg-surface px-4 py-3">
                <p className="text-xs text-muted-foreground">{nextMeeting.label}</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">{nextMeeting.date}</p>
              </div>
              <Button
                className="h-10 rounded-xl"
                aria-expanded={showBrief}
                onClick={() => setShowBrief((prev) => !prev)}
              >
                {showBrief ? "Stäng mötesunderlag" : "Skapa mötesunderlag"}
              </Button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {meetingSummary.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3"
              >
                <StatusDot status={item.status} />
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          {showBrief && (
            <div className={`mt-5 ${subCard}`}>
              <p className={eyebrow}>Förhandsvisning av mötesunderlag</p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                Mötesunderlag · {nextMeeting.date}
              </p>

              <div className="mt-4 space-y-4 text-sm leading-relaxed">
                <div>
                  <p className="font-semibold text-foreground">Viktig information</p>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    {goodToKnow.map((item) => (
                      <li key={item.id}>{item.title}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Frågor att bevaka</p>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    {toWatch.map((item) => (
                      <li key={item.id}>{item.title}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Beslutsfrågor</p>
                  <p className="mt-1 text-muted-foreground">
                    {decision.area} – {decision.question}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Uppföljning av tidigare beslut</p>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    {previousDecisions.map((item) => (
                      <li key={item.id}>
                        {item.area}: {item.decision} · {item.statusLabel}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Dagordning</p>
                  <ol className="mt-1 space-y-1 text-muted-foreground">
                    {agenda.map((item, index) => (
                      <li key={`${item}-${index}`}>
                        {index + 1}. {item}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="outline" className="h-10 rounded-xl">
                  Ladda ner PDF
                </Button>
                <Button variant="outline" className="h-10 rounded-xl">
                  Skicka till styrelsen
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Mockat underlag i prototypen – ingen PDF eller utskick skapas.
              </p>
            </div>
          )}
        </section>

        {/* 2. Inför mötet */}
        <section className={card}>
          <h2 className="text-lg font-semibold text-foreground">Inför mötet</h2>

          {/* Information */}
          <div className="mt-5">
            <p className={eyebrow}>Information</p>
            <ul className="mt-2 space-y-2">
              {goodToKnow.map((item) => (
                <li key={item.id} className="flex gap-2.5">
                  <StatusDot status={item.status} className="mt-1.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.metric}</p>
                    <p className="text-xs text-muted-foreground">{item.assessment}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Bevaka */}
          <div className="mt-6">
            <p className={eyebrow}>Bevaka</p>
            <div className="mt-2 grid gap-3 lg:grid-cols-2">
              {toWatch.map((item) => {
                const open = expandedWatch === item.id;
                return (
                  <div key={item.id} className={subCard}>
                    <div className="flex items-center gap-2">
                      <StatusDot status="watch" />
                      <span className={eyebrow}>{item.title}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      {item.metrics.map((metric, index) =>
                        metric.label ? (
                          <div key={index}>
                            <span className="text-xs text-muted-foreground">{metric.label}: </span>
                            <span className="text-sm font-semibold text-foreground">
                              {metric.value}
                            </span>
                          </div>
                        ) : (
                          <span key={index} className="text-sm font-semibold text-foreground">
                            {metric.value}
                          </span>
                        )
                      )}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.analysis}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.action.to ? (
                        <Button asChild variant="outline" className="h-10 rounded-xl">
                          <Link to={item.action.to}>{item.action.label}</Link>
                        </Button>
                      ) : (
                        <Button variant="outline" className="h-10 rounded-xl">
                          {item.action.label}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="h-10 rounded-xl"
                        aria-expanded={open}
                        onClick={() => setExpandedWatch(open ? null : item.id)}
                      >
                        {open ? "Dölj detaljer" : "Visa detaljer"}
                      </Button>
                    </div>

                    {open && (
                      <div className="mt-4 rounded-xl border border-border bg-card p-4">
                        {item.important && (
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            <span className="text-foreground">Viktigt: </span>
                            {item.important}
                          </p>
                        )}
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          <span className="text-foreground">Nästa steg: </span>
                          {item.nextStep}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Beslut */}
          <div className="mt-6">
            <p className={eyebrow}>Beslut</p>
            <div className="mt-2 rounded-2xl border border-status-alert/40 bg-status-alert/5 p-5">
              <div className="flex items-center gap-2">
                <StatusDot status="alert" />
                <span className={eyebrow}>Beslut krävs</span>
              </div>
              <h3 className="mt-2 text-base font-semibold text-foreground">{decision.area}</h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {decision.facts.map((fact) => (
                  <div key={fact.label} className="rounded-xl border border-border bg-card px-4 py-3">
                    <p className="text-xs text-muted-foreground">{fact.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">{fact.value}</p>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-sm font-semibold text-foreground">{decision.question}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {decision.options.map((option) => (
                  <Button
                    key={option.id}
                    variant={choice === option.id ? "default" : "outline"}
                    onClick={() => setChoice(option.id)}
                    className="h-10 rounded-xl"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              {choice && (
                <p className="mt-4 text-sm text-foreground">
                  Valt förslag:{" "}
                  <span className="font-semibold">
                    {decision.options.find((o) => o.id === choice)?.label}
                  </span>
                  . Beslutet får ansvarig, deadline och uppföljning på nästa styrelsemöte.
                </p>
              )}

              <div className="mt-5">
                <Button
                  variant="outline"
                  className="h-10 rounded-xl"
                  aria-expanded={showEvidence}
                  onClick={() => setShowEvidence((prev) => !prev)}
                >
                  {showEvidence ? "Dölj beslutsunderlag" : "Visa beslutsunderlag"}
                </Button>

                {showEvidence && (
                  <div className="mt-4 rounded-2xl border border-border bg-card p-5">
                    <p className={eyebrow}>Beslutsunderlag</p>
                    <p className="mt-2 text-sm text-foreground">
                      {decision.evidence.component} · {decision.evidence.placement}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      <span className="text-foreground">Bakgrund: </span>
                      {decision.background}
                    </p>

                    <ul className="mt-4 divide-y divide-border">
                      {decision.evidence.repairs.map((repair) => (
                        <li
                          key={repair.date}
                          className="flex items-baseline justify-between gap-4 py-2.5"
                        >
                          <div>
                            <p className="text-sm text-foreground">{repair.date}</p>
                            <p className="text-xs text-muted-foreground">{repair.description}</p>
                          </div>
                          <p className="text-sm font-semibold text-foreground">{repair.cost}</p>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
                      <p className="text-sm text-muted-foreground">Total kostnad 12 mån</p>
                      <p className="text-sm font-semibold text-foreground">
                        {decision.evidence.total}
                      </p>
                    </div>

                    <div className={`mt-4 ${subCard}`}>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        <span className="text-foreground">Analys: </span>
                        {decision.analysis}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        <span className="text-foreground">Rekommendation: </span>
                        {decision.recommendation}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border bg-surface px-4 py-3">
                        <p className="text-xs text-muted-foreground">Planerat byte</p>
                        <p className="mt-0.5 text-sm font-semibold text-foreground">
                          {decision.evidence.plannedReplacement}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-surface px-4 py-3">
                        <p className="text-xs text-muted-foreground">Uppskattad kostnad</p>
                        <p className="mt-0.5 text-sm font-semibold text-foreground">
                          {decision.evidence.estimatedCost}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-muted-foreground">
                      Koppling till underhållsplan: {decision.evidence.maintenancePlan}
                    </p>
                    <div className="mt-4">
                      <Button asChild variant="outline" className="h-10 rounded-xl">
                        <Link to="/fastigheten">Visa originaldata i Fastigheten</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                Mockat beslutsflöde i prototypen – ingen e-signering eller journalföring sker.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Uppföljning av tidigare beslut */}
        <section className={card}>
          <h2 className="text-lg font-semibold text-foreground">
            Uppföljning av tidigare beslut
          </h2>
          <ul className="mt-4 divide-y divide-border">
            {previousDecisions.map((item) => {
              const open = openDecision === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenDecision(open ? null : item.id)}
                    className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-1 rounded-xl px-2 py-3 text-left transition-colors hover:bg-secondary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-sm font-semibold text-foreground">{item.area}</span>
                      <span className="text-sm text-foreground">{item.decision}</span>
                      {item.owner && (
                        <span className="text-xs text-muted-foreground">
                          Ansvarig: {item.owner}
                        </span>
                      )}
                      {item.deadline && (
                        <span className="text-xs text-muted-foreground">
                          Deadline: {item.deadline}
                        </span>
                      )}
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <StatusDot status={item.status} />
                      <span className="text-xs font-medium text-foreground">
                        {item.statusLabel}
                      </span>
                    </span>
                  </button>

                  {open && (
                    <div className={`mx-2 mb-3 ${subCard}`}>
                      {item.decidedAt && (
                        <p className="text-sm text-muted-foreground">
                          <span className="text-foreground">Beslutat: </span>
                          {item.decidedAt}
                        </p>
                      )}
                      {item.comment && (
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          <span className="text-foreground">Systemets kommentar: </span>
                          {item.comment}
                        </p>
                      )}
                      {item.action && (
                        <div className="mt-4">
                          {item.action.to ? (
                            <Button asChild variant="outline" className="h-10 rounded-xl">
                              <Link to={item.action.to}>{item.action.label}</Link>
                            </Button>
                          ) : (
                            <Button variant="outline" className="h-10 rounded-xl">
                              {item.action.label}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* 4. Dagordning */}
        <section className={card}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Förslag till dagordning</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Dagordningen är föreslagen utifrån föreningens aktuella frågor och kan redigeras av
                styrelsen.
              </p>
            </div>
            <Button variant="outline" className="h-10 rounded-xl">
              Redigera dagordning
            </Button>
          </div>
          <ol className="mt-4 space-y-2">
            {agenda.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-2.5"
              >
                <span className="text-sm text-muted-foreground">{index + 1}.</span>
                <span className="text-sm text-foreground">{item}</span>
              </li>
            ))}
          </ol>

          <form onSubmit={addOwnItem} className="mt-5">
            <p className={eyebrow}>Lägg till egen punkt</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Input
                value={ownItem}
                onChange={(event) => setOwnItem(event.target.value)}
                placeholder="Exempel: Diskutera ny cykelförvaring"
                aria-label="Egen punkt till dagordningen"
                className="h-12 rounded-xl bg-surface text-sm"
              />
              <Button type="submit" className="h-12 shrink-0 rounded-xl px-6">
                Lägg till på dagordningen
              </Button>
            </div>
          </form>
        </section>

        {/* 5. Fråga inför mötet */}
        <section className={card}>
          <h2 className="text-lg font-semibold text-foreground">Fråga inför mötet</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              ask(question);
            }}
            className="mt-4 flex flex-col gap-3 sm:flex-row"
          >
            <Input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Exempel: Vad behöver vi besluta om?"
              aria-label="Din fråga inför mötet"
              className="h-12 rounded-xl bg-surface text-sm"
            />
            <Button type="submit" className="h-12 rounded-xl px-6">
              Fråga
            </Button>
          </form>

          <div className="mt-3 flex flex-wrap gap-2">
            {meetingQuestions.map((example) => (
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

          {asked && (
            <div className={`mt-6 ${subCard}`}>
              <p className="text-xs text-muted-foreground">Svar på: {asked}</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{meetingAnswer}</p>
              <p className="mt-3 text-xs text-muted-foreground">Exempelsvar i prototypen.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
