import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/PortfolioPage";
export const Route = createFileRoute("/hyresobjekt")({
  head: () => ({
    meta: [
      { title: "Hyresrätter & lokaler – Fastighetsägare Exempel" },
      { name: "description", content: "Hyresrätter & lokaler för fastighetsägarens bestånd." },
    ],
  }),
  component: () => <PortfolioPage view="tenancies" />,
});
