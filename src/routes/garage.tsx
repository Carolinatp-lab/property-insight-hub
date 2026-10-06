import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Car, CircleParking, Wrench } from "lucide-react";
import { SiteHeader } from "@/components/brf/SiteHeader";
import { propertyAreas } from "@/data/overview";

const title = "Garage – BRF Exempel";
const description = "Översikt över föreningens garage och parkeringsplatser.";

export const Route = createFileRoute("/garage")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: GaragePage,
});

const card = "rounded-3xl border border-border bg-card p-6 shadow-card sm:p-7";

function GaragePage() {
  const garage = propertyAreas.find((area) => area.id === "garage");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-5 px-5 py-6 sm:px-8 sm:py-7">
        <div>
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Garage</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Samlad översikt över garage, parkering, kostnader och planerat underhåll.
          </p>
        </div>

        <section className={card} aria-labelledby="garage-status">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-secondary p-3 text-primary">
              <Car className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="garage-status" className="text-lg font-semibold text-foreground">
                Garage & parkering
              </h2>
              <p className="text-sm text-muted-foreground">{garage?.placement}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: CircleParking, label: "Kostnad senaste 12 månader", value: garage?.cost12m },
              { icon: Wrench, label: "Utförda åtgärder", value: garage?.repairs },
              {
                icon: CalendarClock,
                label: "Nästa planerade åtgärd",
                value: garage?.plannedAction,
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-border bg-surface p-5">
                <Icon className="size-4 text-primary" aria-hidden="true" />
                <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={card} aria-labelledby="garage-follow-up">
          <h2 id="garage-follow-up" className="text-lg font-semibold text-foreground">
            För styrelsen
          </h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-3">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Läge
              </dt>
              <dd className="mt-2 text-sm text-foreground">{garage?.fact}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Bedömning
              </dt>
              <dd className="mt-2 text-sm text-foreground">{garage?.analysis}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Nästa steg
              </dt>
              <dd className="mt-2 text-sm text-foreground">{garage?.recommendation}</dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}
