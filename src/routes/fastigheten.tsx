import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/PortfolioPage";
export const Route = createFileRoute("/fastigheten")({
  head: () => ({
    meta: [
      { title: "Fastigheter – Fastighetsägare Exempel" },
      { name: "description", content: "Fastigheter för fastighetsägarens bestånd." },
    ],
  }),
  component: () => <PortfolioPage view="properties" />,
});
