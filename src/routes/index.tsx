import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/PortfolioPage";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Översikt – Fastighetsägare Exempel" },
      { name: "description", content: "Översikt för fastighetsägarens bestånd." },
    ],
  }),
  component: () => <PortfolioPage view="overview" />,
});
