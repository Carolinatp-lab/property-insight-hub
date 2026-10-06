import { insights, propertyAreas, type PropertyArea } from "@/data/overview";
import { Sparkles } from "lucide-react";
import { StatusDot } from "./StatusDot";
import { cn } from "@/lib/utils";

export function InsightsPanel({
  onHoverArea,
  onSelectArea,
}: {
  onHoverArea?: (id: string | null) => void;
  onSelectArea?: (area: PropertyArea) => void;
}) {
  return (
    <section
      aria-labelledby="insights-heading"
      className="flex h-full flex-col rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7"
    >
      <div className="flex items-center gap-2">
        <Sparkles aria-hidden className="size-4 text-muted-foreground" />
        <h2 id="insights-heading" className="text-lg font-semibold text-foreground">
          Det här bör styrelsen känna till
        </h2>
      </div>

      <ul className="mt-4 space-y-3">
        {insights.map((insight) => {
          const area = insight.areaId
            ? propertyAreas.find((a) => a.id === insight.areaId)
            : undefined;
          return (
            <li
              key={insight.id}
              onMouseEnter={() => onHoverArea?.(insight.areaId ?? null)}
              onMouseLeave={() => onHoverArea?.(null)}
              className={cn(
                "rounded-2xl border border-border bg-surface/60 p-4 transition-colors",
                area && "hover:border-ring/30",
              )}
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <StatusDot status={insight.status} />
                {insight.title}
              </p>

              <p className="mt-2 text-sm leading-relaxed text-foreground/80">{insight.fact}</p>

              {insight.analysis ? (
                <p className="mt-2 flex gap-2 text-xs leading-relaxed text-muted-foreground">
                  <span className="shrink-0 font-semibold tracking-wide uppercase">Analys</span>
                  <span>{insight.analysis}</span>
                </p>
              ) : null}

              {insight.recommendation ? (
                <p className="mt-2 flex gap-2 border-t border-border pt-2 text-xs leading-relaxed text-foreground">
                  <span className="shrink-0 font-semibold tracking-wide text-muted-foreground uppercase">
                    Förslag
                  </span>
                  <span>{insight.recommendation}</span>
                </p>
              ) : null}

              {area ? (
                <button
                  type="button"
                  onClick={() => onSelectArea?.(area)}
                  onFocus={() => onHoverArea?.(area.id)}
                  onBlur={() => onHoverArea?.(null)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <StatusDot status={area.status} />
                  Visa i fastigheten
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Observation bygger på föreningens egna siffror. Analys är en tolkning – orsaken anges endast
        när underlaget visar den.
      </p>
    </section>
  );
}
