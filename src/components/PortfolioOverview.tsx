import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KpiSection } from "@/components/brf/KpiSection";
import { StatusDot } from "@/components/brf/StatusDot";
import { useProperties } from "@/components/PropertyProvider";
import { money, percent, summarizeProperties, type Property } from "@/data/portfolio";

const card = "rounded-3xl border border-border bg-card p-6 shadow-card sm:p-7";

/** Alla fastigheter i samma schematiska stadsbild, på en gemensam markyta. */
function PortfolioIllustration({ items }: { items: Property[] }) {
  return (
    <svg
      viewBox="0 0 960 370"
      role="img"
      aria-label={`Hela fastighetsbeståndet: ${items.map((p) => p.address).join(", ")}`}
      className="mt-6 h-auto w-full"
    >
      <path d="M25 286H935V320H25Z" fill="var(--secondary)" />
      <path d="M25 286H935" stroke="var(--border)" strokeWidth="3" />
      <path
        d="M35 311H925"
        stroke="var(--muted-foreground)"
        strokeWidth="2"
        strokeDasharray="20 15"
        opacity=".3"
      />
      {items.map((p, index) => {
        const commercial = p.apartments === 0;
        const x = 90 + index * 300;
        const top = commercial ? 170 : index === 0 ? 70 : 110;
        const floors = commercial ? 1 : index === 0 ? 4 : 3;
        return (
          <g key={p.id}>
            <rect
              x={x + 8}
              y={top + 12}
              width="198"
              height={274 - top}
              rx="3"
              fill="var(--border)"
            />
            <rect
              x={x}
              y={top}
              width="196"
              height={286 - top}
              rx="3"
              fill="var(--secondary)"
              stroke="var(--border)"
              strokeWidth="2"
            />
            <path
              d={
                commercial
                  ? `M${x - 6} ${top}h208v14H${x - 6}Z`
                  : `M${x - 10} ${top}L${x + 98} ${top - 42}L${x + 206} ${top}Z`
              }
              fill="var(--primary)"
              opacity=".8"
            />
            {Array.from({ length: floors }, (_, row) =>
              Array.from({ length: 4 }, (_, column) => (
                <g key={`${row}-${column}`}>
                  <rect
                    x={x + 17 + column * 44}
                    y={top + 22 + row * 42}
                    width="29"
                    height={commercial ? 46 : 27}
                    rx="2"
                    fill="oklch(0.86 0.025 210)"
                    stroke="oklch(0.78 0.02 210)"
                  />
                  <path
                    d={`M${x + 31 + column * 44} ${top + 22 + row * 42}v${commercial ? 46 : 27}`}
                    stroke="var(--surface)"
                    strokeWidth="2"
                  />
                </g>
              )),
            )}
            <rect
              x={x + 78}
              y="244"
              width="40"
              height="42"
              rx="2"
              fill="var(--primary)"
              opacity=".4"
            />
            {commercial && (
              <path d={`M${x + 130} 247h48v39h-48Z`} fill="var(--muted-foreground)" opacity=".35" />
            )}
            <text
              x={x + 98}
              y="352"
              textAnchor="middle"
              fontSize="22"
              fontWeight="600"
              fill="var(--foreground)"
            >
              {p.address}
            </text>
          </g>
        );
      })}
      {[55, 370, 905].map((x) => (
        <g key={x}>
          <path d={`M${x} 286v-45`} stroke="var(--muted-foreground)" strokeWidth="4" opacity=".4" />
          <circle cx={x} cy="235" r="20" fill="oklch(0.88 0.035 155)" />
        </g>
      ))}
    </svg>
  );
}

export function PortfolioOverview() {
  const { items, summary: s, selectProperty } = useProperties();
  const units = s.apartments + s.premises;
  const rented = units - s.vacant;
  const attention = items.filter((p) => p.status === "watch" || p.status === "alert").length;
  const nextAction = [...items].sort((a, b) => a.due.localeCompare(b.due))[0];
  const costsShare = s.rent > 0 ? (s.operatingCosts / s.rent) * 100 : 0;
  return (
    <>
      <section className={card} aria-labelledby="portfolio-heading">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Alla fastigheter · Samlad översikt
            </p>
            <h2 id="portfolio-heading" className="mt-2 text-xl font-semibold">
              Hela ditt fastighetsbestånd
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {s.count} fastigheter med totalt {units} hyresobjekt och {s.garages} garageplatser.
            </p>
          </div>
          <Button asChild variant="outline" className="self-start rounded-xl">
            <Link to="/fastigheten">
              Utforska fastigheterna <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <PortfolioIllustration items={items} />
        <p className="mt-2 text-xs text-muted-foreground">
          Schematisk bild av hela beståndet. Byggnadernas placering och storlek är illustrativa.
        </p>
        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-border pt-5 sm:flex-row">
          <p className="flex items-center gap-2 text-sm">
            <StatusDot status={attention > 0 ? "watch" : "good"} />
            {attention > 0
              ? `${attention} av ${s.count} fastigheter behöver uppföljning`
              : "Stabil drift i hela beståndet"}
          </p>
          <p className="text-sm text-muted-foreground">
            {rented} av {units} hyresobjekt uthyrda · {percent(units ? (rented / units) * 100 : 0)}{" "}
            uthyrningsgrad
          </p>
        </div>
      </section>

      <KpiSection />
      <div className="grid gap-5 lg:grid-cols-2">
        <section className={card} aria-labelledby="portfolio-economy">
          <h2 id="portfolio-economy" className="text-lg font-semibold">
            Beståndets samlade ekonomi
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Årsintäkter och driftkostnader för alla {s.count} fastigheter.
          </p>
          <p className="mt-5 text-xs text-muted-foreground">Hyresintäkter / år</p>
          <p className="mt-1 text-2xl font-semibold">{money(s.rent)}</p>
          <div
            className="mt-5 flex h-3 overflow-hidden rounded-full bg-secondary"
            aria-hidden="true"
          >
            <div className="bg-muted-foreground/50" style={{ width: `${costsShare}%` }} />
            <div className="bg-primary" style={{ width: `${100 - costsShare}%` }} />
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-muted-foreground">Driftkostnader</dt>
              <dd className="font-medium">{money(s.operatingCosts)}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-muted-foreground">Driftnetto</dt>
              <dd className="font-semibold text-primary">{money(s.net)}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2 border-t border-border pt-3">
              <dt className="text-muted-foreground">Driftnettomarginal</dt>
              <dd className="font-medium">{percent(s.rent ? (s.net / s.rent) * 100 : 0)}</dd>
            </div>
          </dl>
        </section>
        <section className={card} aria-labelledby="portfolio-followup">
          <h2 id="portfolio-followup" className="text-lg font-semibold">
            Beståndets gemensamma prioriteringar
          </h2>
          <ul className="mt-4 divide-y divide-border text-sm">
            <li className="py-3">
              <p className="font-semibold">Uthyrning: {s.vacant} vakanta hyresobjekt</p>
              <p className="mt-1 text-muted-foreground">
                {percent(s.vacancy)} vakans i hela beståndet. Dessutom finns {s.vacantGarages}{" "}
                lediga garageplatser.
              </p>
            </li>
            <li className="py-3">
              <p className="font-semibold">Underhåll: {money(s.maintenance)} planerat</p>
              <p className="mt-1 text-muted-foreground">
                {items.length} åtgärder kommande 12 månader. Gemensam plan och budget för hela
                beståndet.
              </p>
            </li>
            {nextAction && (
              <li className="py-3">
                <p className="font-semibold">Närmaste åtgärd: {nextAction.due}</p>
                <p className="mt-1 text-muted-foreground">
                  {nextAction.action} · {nextAction.address}
                </p>
              </li>
            )}
          </ul>
        </section>
      </div>

      <section className={card} aria-labelledby="portfolio-comparison">
        <h2 id="portfolio-comparison" className="text-lg font-semibold">
          Fastigheterna i sitt sammanhang
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Jämför bidraget till hela beståndet. Välj en adress för att gå vidare till fastighetens
          detaljvy.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Fastigheternas hyresobjekt, hyresintäkter, vakans och driftnetto, med en summering av
              hela beståndet.
            </caption>
            <thead>
              <tr>
                {["Fastighet", "Hyresobjekt", "Hyresintäkt / år", "Vakans", "Driftnetto"].map(
                  (label) => (
                    <th
                      key={label}
                      scope="col"
                      className="whitespace-nowrap px-3 py-3 text-xs font-medium text-muted-foreground"
                    >
                      {label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <th scope="row" className="px-3 py-4">
                    <button
                      type="button"
                      onClick={() => selectProperty(p.id)}
                      className="whitespace-nowrap rounded text-left font-medium underline decoration-border underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      {p.address}
                    </button>
                  </th>
                  <td className="px-3">{p.apartments + p.premises}</td>
                  <td className="whitespace-nowrap px-3">{money(p.rent)}</td>
                  <td className="px-3">{percent(summarizeProperties([p]).vacancy)}</td>
                  <td className="whitespace-nowrap px-3">{money(p.rent - p.operatingCosts)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border bg-secondary/50 font-semibold">
                <th scope="row" className="whitespace-nowrap px-3 py-4">
                  Hela beståndet
                </th>
                <td className="px-3">{units}</td>
                <td className="whitespace-nowrap px-3">{money(s.rent)}</td>
                <td className="px-3">{percent(s.vacancy)}</td>
                <td className="whitespace-nowrap px-3">{money(s.net)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  );
}
