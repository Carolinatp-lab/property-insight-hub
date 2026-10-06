import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/PortfolioPage";
export const Route = createFileRoute("/garage")({
  head: () => ({
    meta: [
      { title: "Garage – Fastighetsägare Exempel" },
      { name: "description", content: "Garage för fastighetsägarens bestånd." },
    ],
  }),
  component: () => <PortfolioPage view="garage" />,
});
