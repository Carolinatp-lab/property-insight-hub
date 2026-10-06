import { kpis, statusLabel } from "@/data/overview";
import { StatusDot } from "./StatusDot";

export function KpiSection() {
  return (
    <section
      aria-labelledby="kpi-heading"
      className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-7"
    >
      <div>
        <h2 id="kpi-heading" className="text-lg font-semibold text-foreground">
          Föreningen i korthet
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          De viktigaste nyckeltalen och hur de har förändrats.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((kpi) => (
          <article
            key={kpi.id}
            className="rounded-2xl border border-border bg-secondary/50 px-4 py-3.5"
          >
            <div className="flex items-center gap-1.5">
              <StatusDot status={kpi.status} />
              <span className="truncate text-xs font-medium text-muted-foreground">
                {kpi.label}
              </span>
              <span className="sr-only">{statusLabel[kpi.status]}</span>
            </div>
            <p className="mt-1.5 text-lg leading-tight font-semibold text-foreground">
              {kpi.value}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              <span aria-hidden>{kpi.direction === "down" ? "↓" : "↑"}</span> {kpi.comparison}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
