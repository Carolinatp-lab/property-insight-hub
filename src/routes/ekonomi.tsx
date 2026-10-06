import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/PortfolioPage";
export const Route = createFileRoute("/ekonomi")({
  head: () => ({
    meta: [
      { title: "Ekonomi – Fastighetsägare Exempel" },
      { name: "description", content: "Ekonomi för fastighetsägarens bestånd." },
    ],
  }),
  component: () => <PortfolioPage view="economy" />,
});
