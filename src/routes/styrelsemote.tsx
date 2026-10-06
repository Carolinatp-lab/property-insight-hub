import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/PortfolioPage";
export const Route = createFileRoute("/styrelsemote")({
  head: () => ({
    meta: [
      { title: "Uppföljning – Fastighetsägare Exempel" },
      { name: "description", content: "Uppföljning för fastighetsägarens bestånd." },
    ],
  }),
  component: () => <PortfolioPage view="followup" />,
});
