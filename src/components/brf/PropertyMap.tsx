import { propertyAreas, statusLabel, type PropertyArea, type Status } from "@/data/overview";
import { StatusDot } from "./StatusDot";
import { BuildingIllustration, areaMarkers, VIEW_H, VIEW_W } from "./BuildingIllustration";
import { cn } from "@/lib/utils";

const markerTone: Record<Status, string> = {
  good: "border-status-good/60",
  watch: "border-status-watch/70",
  alert: "border-status-alert/70",
  neutral: "border-border",
};

export function PropertyMap({
  activeId,
  hoverId,
  onHover,
  onSelect,
}: {
  activeId: string | null;
  hoverId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (area: PropertyArea) => void;
}) {
  const focusId = hoverId ?? activeId;
  const focusArea = propertyAreas.find((a) => a.id === focusId) ?? null;

  return (
    <section
      aria-label="Fastighetens delar"
      className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <StatusDot status="good" /> Bra
        </span>
        <span className="flex items-center gap-1.5">
          <StatusDot status="watch" /> Bevaka
        </span>
        <span className="flex items-center gap-1.5">
          <StatusDot status="alert" /> Åtgärd behövs
        </span>
      </div>

      <div className="relative mx-auto mt-3 w-full">
        <BuildingIllustration
          highlight={focusArea ? { id: focusArea.id, status: focusArea.status } : null}
        />

        <div className="absolute inset-0">
          {propertyAreas.map((area) => {
            const pos = areaMarkers[area.id];
            if (!pos) return null;
            const isFocus = focusId === area.id;
            const isActive = activeId === area.id;
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => onSelect(area)}
                onMouseEnter={() => onHover(area.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(area.id)}
                onBlur={() => onHover(null)}
                style={{
                  left: `${(pos.x / VIEW_W) * 100}%`,
                  top: `${(pos.y / VIEW_H) * 100}%`,
                }}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-card/90 p-2 shadow-card backdrop-blur transition-all",
                  "hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  markerTone[area.status],
                  (isFocus || isActive) && "scale-110 shadow-lift",
                )}
                aria-label={`${area.name} – ${statusLabel[area.status]}`}
                aria-pressed={isActive}
              >
                <StatusDot status={area.status} className="size-3" />
              </button>
            );
          })}
        </div>

        <div
          className={cn(
            "pointer-events-none absolute top-3 left-3 max-w-[15rem] rounded-2xl border border-border bg-card/95 p-3 shadow-card backdrop-blur transition-opacity duration-150",
            focusArea ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={!focusArea}
        >
          {focusArea ? (
            <>
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <StatusDot status={focusArea.status} />
                {focusArea.name}
              </p>
              <dl className="mt-2 space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between gap-3">
                  <dt>Status</dt>
                  <dd className="text-foreground">{statusLabel[focusArea.status]}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Kostnad 12 mån</dt>
                  <dd className="text-foreground">{focusArea.cost12m}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Planerad åtgärd</dt>
                  <dd className="text-foreground">{focusArea.plannedAction}</dd>
                </div>
              </dl>
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-1.5 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-3">
        {propertyAreas.map((area) => (
          <button
            key={area.id}
            type="button"
            onClick={() => onSelect(area)}
            onMouseEnter={() => onHover(area.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(area.id)}
            onBlur={() => onHover(null)}
            className={cn(
              "flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              focusId === area.id && "bg-accent",
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              <StatusDot status={area.status} />
              <span className="truncate">{area.name}</span>
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">{area.cost12m}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
