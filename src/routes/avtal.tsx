import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/brf/SiteHeader";
import { ContractsAndPartners } from "@/components/management/ContractsAndPartners";
import { properties } from "@/data/portfolio";
import { useProperties } from "@/components/PropertyProvider";
export const Route = createFileRoute("/avtal")({
  head: () => ({ meta: [{ title: "Avtal & leverantörer – Fastighetsägare Exempel" }] }),
  component: ContractsPage,
});
function ContractsPage() {
  const { items, scope } = useProperties();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main-content" className="mx-auto max-w-6xl space-y-5 px-5 py-6 sm:px-8 sm:py-7">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">Avtal & leverantörer</h1>
          <p className="mt-1 text-sm text-muted-foreground">{scope}</p>
        </div>
        <ContractsAndPartners
          mode="owner"
          properties={properties}
          selectedPropertyIds={items.map((p) => p.id)}
        />
      </main>
    </div>
  );
}
