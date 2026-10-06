import { statusLabel, type PropertyArea } from "@/data/overview";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StatusDot } from "./StatusDot";
import { Sparkles } from "lucide-react";

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

export function AreaDetailSheet({
  area,
  onOpenChange,
}: {
  area: PropertyArea | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={Boolean(area)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {area ? (
          <>
            <SheetHeader>
              <SheetTitle className="text-xl">{area.name}</SheetTitle>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <StatusDot status={area.status} />
                Status: {statusLabel[area.status]} · {area.placement}
              </p>
            </SheetHeader>

            <div className="space-y-6 px-4 pb-8">
              <dl className="grid grid-cols-2 gap-2">
                <Metric label="Kostnad senaste 12 månader" value={area.cost12m} />
                {area.costPerSqm ? <Metric label="Kostnad per m²" value={area.costPerSqm} /> : null}
                {area.trend ? <Metric label="Trend" value={area.trend} /> : null}
                {area.repairs ? <Metric label="Åtgärder" value={area.repairs} /> : null}
                <Metric label="Senaste större åtgärd" value={area.lastAction} />
                <Metric label="Planerad åtgärd" value={area.plannedAction} />
              </dl>

              <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Observation
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground">{area.fact}</p>
              </div>

              <div className="rounded-2xl border border-border bg-surface/60 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  <Sparkles aria-hidden className="size-3.5" />
                  Analys
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground">{area.analysis}</p>
              </div>

              <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Rekommendation
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                  {area.recommendation}
                </p>
              </div>

              <div className="space-y-2 border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">Nästa steg</p>
                <Button className="w-full">{area.nextStep}</Button>
                <Button variant="outline" className="w-full">
                  Ta upp på nästa förvaltningsmöte
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
