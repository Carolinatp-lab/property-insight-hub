import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/PortfolioPage";
export const Route = createFileRoute("/underhall")({
  head: () => ({
    meta: [
      { title: "Underhåll – Fastighetsägare Exempel" },
      { name: "description", content: "Underhåll för fastighetsägarens bestånd." },
    ],
  }),
  component: () => <PortfolioPage view="maintenance" />,
});
