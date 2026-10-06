import { useProperties } from "@/components/PropertyProvider";
import { money, percent } from "@/data/portfolio";
export function KpiSection() {
  const { summary: s, scope } = useProperties();
  const metrics = [
    ["Fastigheter", s.count, "I valt bestånd"],
    ["Hyreslägenheter", s.apartments, "Bostäder för uthyrning"],
    ["Lokaler", s.premises, "Kommersiella hyresobjekt"],
    ["Garageplatser", s.garages, "Totalt antal platser"],
    ["Hyresintäkter", money(s.rent), "Årsintäkter, inklusive garage"],
    ["Vakansgrad", percent(s.vacancy), "Andel lägenheter och lokaler"],
    ["Driftnetto", money(s.net), "Hyresintäkter minus driftkostnader"],
    ["Kommande underhåll", money(s.maintenance), "Planerat kommande 12 månader"],
  ];
  return (
    <section
      aria-labelledby="kpi-heading"
      className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-7"
    >
      <h2 id="kpi-heading" className="text-lg font-semibold">
        {scope === "Alla fastigheter" ? "Beståndet i korthet" : "Fastigheten i korthet"}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{scope} · Exempeldata för 2026</p>
      <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([label, value, note]) => (
          <div key={label} className="rounded-2xl border border-border bg-secondary/50 px-4 py-4">
            <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
            <dd className="mt-2 text-lg font-semibold">{value}</dd>
            <dd className="mt-1 text-xs text-muted-foreground">{note}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
