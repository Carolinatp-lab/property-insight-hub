import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { propertyAreas, type PropertyArea } from "@/data/overview";
import { SiteHeader } from "@/components/brf/SiteHeader";
import { PropertyMap } from "@/components/brf/PropertyMap";
import { AreaDetailPanel } from "@/components/brf/AreaDetailPanel";
import { EnergyDetailPanel } from "@/components/brf/EnergyDetailPanel";

const title = "Fastigheten – BRF Exempel";
const description =
  "Ekonomi, historik och planerat underhåll kopplat till fastighetens olika delar och komponenter.";

export const Route = createFileRoute("/fastigheten")({
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
  component: PropertyPage,
});

function PropertyPage() {
  const initial = (propertyAreas.find((a) => a.id === "tvattstuga") ??
    propertyAreas[0]) as PropertyArea;
  const [active, setActive] = useState<PropertyArea>(initial);
  const [hoverId, setHoverId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl space-y-5 px-5 py-6 sm:px-8 sm:py-7">
        <div>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">Fastigheten</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ekonomi, historik och planerat underhåll – kopplat till fastighetens olika delar.
          </p>
        </div>

        <PropertyMap
          activeId={active.id}
          hoverId={hoverId}
          onHover={setHoverId}
          onSelect={setActive}
        />

        {active.id === "varme" ? (
          <EnergyDetailPanel area={active} />
        ) : (
          <AreaDetailPanel area={active} />
        )}
      </main>
    </div>
  );
}
