import { useState } from "react";
import { propertyAreas, statusLabel, type PropertyArea, type Status } from "@/data/overview";
import { StatusDot } from "./StatusDot";
import { BuildingIllustration, areaMarkers, VIEW_H, VIEW_W } from "./BuildingIllustration";
import { cn } from "@/lib/utils";

const periods = [
  { id: "12m", label: "Senaste 12 mån" },
  { id: "current", label: "Detta år" },
  { id: "previous", label: "Föregående år" },
] as const;

const markerTone: Record<Status, string> = {
  good: "border-status-good/60",
  watch: "border-status-watch/70",
  alert: "border-status-alert/70",
  neutral: "border-border",
};

export function PropertySection({
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
  const [period, setPeriod] = useState<(typeof periods)[number]["id"]>("12m");
  const focusId = hoverId ?? activeId;
  const focusArea = propertyAreas.find((a) => a.id === focusId) ?? null;

  return (
    <section
      aria-labelledby="property-heading"
      className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="property-heading" className="text-lg font-semibold text-foreground">
            Så mår fastigheten
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Se ekonomi, status och utveckling för fastighetens olika delar.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
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
      </div>

      <div className="relative mx-auto mt-4 w-full">
        <BuildingIllustration
          highlight={focusArea ? { id: focusArea.id, status: focusArea.status } : null}
        />

        <div className="absolute inset-0">
          {propertyAreas.map((area) => {
            const pos = areaMarkers[area.id];
            if (!pos) return null;
            const isFocus = focusId === area.id;
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
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-card/90 p-1.5 shadow-card backdrop-blur transition-all",
                  "hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  markerTone[area.status],
                  isFocus && "scale-110 shadow-lift",
                )}
                aria-label={`${area.name} – ${statusLabel[area.status]}`}
              >
                <StatusDot status={area.status} className="size-2.5" />
              </button>
            );
          })}
        </div>

        {/* Diskret informationsruta som visar kopplingen ekonomi ↔ byggnadsdel */}
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
                {focusArea.trend ? (
                  <div className="flex justify-between gap-3">
                    <dt>Trend</dt>
                    <dd className="text-foreground">{focusArea.trend}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-3">
                  <dt>Planerad åtgärd</dt>
                  <dd className="text-foreground">{focusArea.plannedAction}</dd>
                </div>
              </dl>
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">
            Kostnader senaste 12 månaderna
          </h3>
          <div className="flex items-center rounded-full border border-border bg-background p-0.5">
            {periods.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                  period === p.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Varje krona kopplas så långt möjligt till den del av fastigheten som kostnaden avser.
      </p>
    </section>
  );
}
