import { PortfolioOverview } from "@/components/PortfolioOverview";
import { Link } from "@tanstack/react-router";
import { Building2, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/brf/SiteHeader";
import { KpiSection } from "@/components/brf/KpiSection";
import { StatusDot } from "@/components/brf/StatusDot";
import { BuildingIllustration } from "@/components/brf/BuildingIllustration";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/components/PropertyProvider";
import { properties, money, percent, summarizeProperties, type Property } from "@/data/portfolio";
const card = "rounded-3xl border border-border bg-card p-6 shadow-card sm:p-7";
type View =
  "overview" | "properties" | "economy" | "maintenance" | "tenancies" | "garage" | "followup";
const titles: Record<View, string> = {
  overview: "Översikt",
  properties: "Fastigheter",
  economy: "Ekonomi",
  maintenance: "Underhåll",
  tenancies: "Hyresrätter & lokaler",
  garage: "Garage",
  followup: "Uppföljning",
};
function PropertyCard({ property: p }: { property: Property }) {
  const { selectProperty } = useProperties();
  return (
    <Link
      to="/"
      onClick={() => selectProperty(p.id)}
      aria-label={`Visa översikt för ${p.address}`}
      className={`${card} block transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-ring`}
    >
      <div className="flex items-start justify-between gap-3">
        <Building2 aria-hidden="true" className="size-6 text-primary" />
        <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{p.address}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{p.type}</p>
      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
        {[
          ["Lägenheter", p.apartments],
          ["Lokaler", p.premises],
          ["Vakansgrad", percent(summarizeProperties([p]).vacancy)],
          ["Hyresintäkt / år", money(p.rent)],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-1 font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 flex items-center gap-2 text-sm">
        <StatusDot status={p.status} />
        {p.statusText}
      </p>
      <div className="mt-4 border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">Nästa viktiga åtgärd · {p.due}</p>
        <p className="mt-1 text-sm font-medium">{p.action}</p>
      </div>
    </Link>
  );
}
export function PortfolioPage({ view }: { view: View }) {
  const { items, scope, summary: s, selectedId, selectProperty } = useProperties();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto w-full max-w-6xl space-y-5 px-5 py-6 sm:px-8 sm:py-7"
      >
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">{titles[view]}</h1>
          <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
            {scope} · Förvaltning, hyresintäkter och uppföljning samlade på ett ställe.
          </p>
        </div>
        {(view === "economy" || (view === "overview" && selectedId !== "all")) && <KpiSection />}
        {view === "properties" && (
          <>
            <p className="text-sm text-muted-foreground">
              Välj ett kort för att öppna fastighetens översikt.
            </p>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </>
        )}
        {view === "overview" && selectedId === "all" && <PortfolioOverview />}
        {view === "overview" && selectedId !== "all" && (
          <>
            <Button variant="outline" className="rounded-xl" onClick={() => selectProperty("all")}>
              Visa hela beståndet
            </Button>
            <div className="grid gap-5 lg:grid-cols-5">
              <section className={`${card} lg:col-span-3`}>
                <h2 className="text-lg font-semibold">{scope}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {s.apartments + s.premises} hyresobjekt · {s.garages} garageplatser
                </p>
                <BuildingIllustration />
                <p className="text-xs text-muted-foreground">
                  Schematisk illustration av en bostadsfastighet.
                </p>
                <Button asChild variant="outline" className="rounded-xl">
                  <Link to="/fastigheten">
                    Byt fastighet <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </section>
              <section className={`${card} lg:col-span-2`}>
                <h2 className="text-lg font-semibold">Att följa upp</h2>
                <ul className="mt-4 divide-y divide-border">
                  {items.map((p) => (
                    <li key={p.id} className="py-4">
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        <StatusDot status={p.status} />
                        {p.address} · {p.statusText}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">{p.followUp}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
            <Maintenance items={items} />
          </>
        )}
        {view === "economy" && (
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/ekonomi/investeringssimulator">
              Testa en investering <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        )}
        {view === "economy" && (
          <section className={card}>
            <h2 className="text-lg font-semibold">Intäkter och drift · år 2026</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Ekonomi per fastighet i valt bestånd</caption>
                <thead>
                  <tr>
                    {["Fastighet", "Hyresintäkter", "Driftkostnader", "Driftnetto"].map((t) => (
                      <th key={t} scope="col" className="px-3 py-3 font-medium">
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <th scope="row" className="px-3 py-4 font-medium">
                        {p.address}
                      </th>
                      <td className="px-3">{money(p.rent)}</td>
                      <td className="px-3">{money(p.operatingCosts)}</td>
                      <td className="px-3">{money(p.rent - p.operatingCosts)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border font-semibold">
                    <th scope="row" className="px-3 py-4">
                      Totalt
                    </th>
                    <td className="px-3">{money(s.rent)}</td>
                    <td className="px-3">{money(s.operatingCosts)}</td>
                    <td className="px-3">{money(s.net)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        )}
        {view === "maintenance" && <Maintenance items={items} />}
        {(view === "tenancies" || view === "garage") && (
          <section className={card}>
            <h2 className="text-lg font-semibold">
              {view === "garage" ? "Garage & parkering" : "Uthyrningsläge"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {view === "garage"
                ? "Antal platser och tillgänglighet per fastighet."
                : "Antal hyreslägenheter och lokaler. Vakans avser antal objekt, exklusive garage."}
            </p>
            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {items.map((p) => (
                <li key={p.id} className="rounded-2xl border border-border bg-secondary/50 p-5">
                  <h3 className="font-semibold">{p.address}</h3>
                  <p className="mt-3 text-sm">
                    {view === "garage"
                      ? `${p.garages} garageplatser · ${p.vacantGarages} lediga`
                      : `${p.apartments} hyreslägenheter · ${p.premises} lokaler`}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {view === "garage"
                      ? `${p.garages - p.vacantGarages} uthyrda platser`
                      : `${p.vacant} vakanta objekt · ${percent(summarizeProperties([p]).vacancy)} vakans`}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
        {view === "followup" && (
          <section className={card}>
            <h2 className="text-lg font-semibold">Aktuella åtgärder och ansvar</h2>
            <ul className="mt-4 divide-y divide-border">
              {items.map((p) => (
                <li key={p.id} className="py-5">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <StatusDot status={p.status} />
                    {p.address} · {p.statusText}
                  </h3>
                  <p className="mt-2 text-sm">{p.followUp}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Nästa steg: {p.action}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Ansvarig: {p.owner} · Måldatum: {p.due}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
        <p className="text-xs text-muted-foreground">
          Exempeldata för fastighetsägaren. Årsbelopp i kronor. Ingen anslutning till ekonomisystem.
        </p>
      </main>
    </div>
  );
}
function Maintenance({ items }: { items: Property[] }) {
  return (
    <section className={card}>
      <h2 className="text-lg font-semibold">Kommande underhåll</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Planerade åtgärder kommande 12 månader · {money(summarizeProperties(items).maintenance)}
      </p>
      <ul className="mt-4 divide-y divide-border">
        {items.map((p) => (
          <li key={p.id} className="flex flex-col justify-between gap-2 py-4 sm:flex-row">
            <div>
              <h3 className="text-sm font-semibold">{p.action}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {p.address} · {p.due} · {p.owner}
              </p>
            </div>
            <p className="text-sm font-semibold">{money(p.maintenanceCost)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
