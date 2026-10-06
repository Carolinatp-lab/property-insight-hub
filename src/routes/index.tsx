import { ArrowRight, Building2, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/brf/SiteHeader";
import { KpiSection } from "@/components/brf/KpiSection";
import { PropertyOverview } from "@/components/brf/PropertyOverview";
import { AskPanel } from "@/components/brf/AskPanel";

const title = "Översikt – Fastighetsägare Exempel";
const description =
  "Överblick över bostadsrättsföreningens ekonomi och fastighet: nyckeltal, status per byggnadsdel och frågor inför nästa styrelsemöte.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-5 px-5 py-6 sm:px-8 sm:py-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Översikt</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Föreningens ekonomi, fastighet och viktigaste frågor samlade på ett ställe.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-10 self-start rounded-xl sm:self-auto"
          >
            <FileUp aria-hidden="true" />
            Läs in årsredovisning
          </Button>
        </div>

        <section className="flex flex-col gap-4 rounded-3xl border border-primary/20 bg-card p-6 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <span className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Building2 aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Ny del i BRF Insight
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                Hyresrätter &amp; lokaler
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Följ avtal, hyresintäkter, kostnader och renoveringshistorik för föreningens uthyrda
                objekt.
              </p>
            </div>
          </div>
          <Button asChild className="shrink-0 self-start rounded-xl sm:self-auto">
            <Link to="/hyresobjekt">
              Öppna översikten
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </section>

        <KpiSection />
        <PropertyOverview />
        <AskPanel />
      </main>
    </div>
  );
}
