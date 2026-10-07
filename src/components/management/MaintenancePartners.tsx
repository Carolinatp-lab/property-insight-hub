import { Button } from "@/components/ui/button";
import { SupplierPicker } from "./SupplierPicker";
import { useManagement } from "@/hooks/use-management";
import type { ManagedProperty, ManagementMode } from "@/data/management";
export type ManagedAction = { id: string; propertyId: string; title: string; due: string };
export function MaintenancePartners({
  mode,
  properties,
  actions,
}: {
  mode: ManagementMode;
  properties: ManagedProperty[];
  actions: ManagedAction[];
}) {
  const { record, save, saving, error, notice } = useManagement(mode, properties);
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-7">
      <h2 className="text-lg font-semibold">Leverantörer & uppdrag</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Välj utförare för underhållsåtgärderna. Leverantören finns kvar i historiken när uppdraget
        markeras som utfört.
      </p>
      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}
      <p role="status" className="mt-3 text-xs text-primary">
        {notice}
      </p>
      {!record ? (
        <p className="mt-4 text-sm">Öppnar uppdragen…</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {actions.map((action) => {
            const assignment = record.assignments[action.id];
            return (
              <li key={action.id} className="space-y-4 py-5">
                <div>
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {properties.find((p) => p.id === action.propertyId)?.address} · {action.due}
                  </p>
                </div>
                {assignment?.completedAt ? (
                  <div className="rounded-xl bg-secondary p-4">
                    <p className="text-sm font-medium">Utfört {assignment.completedAt}</p>
                    <p className="mt-1 text-sm">
                      Utförare: {assignment.supplier?.name} · {assignment.supplier?.trade}
                    </p>
                  </div>
                ) : (
                  <fieldset disabled={saving} className="max-w-lg space-y-3">
                    <SupplierPicker
                      mode={mode}
                      properties={properties}
                      propertyId={action.propertyId}
                      value={assignment?.supplier ?? null}
                      id={`action-${action.id}`}
                      onChange={(supplier) =>
                        save((current) => ({
                          ...current,
                          assignments: {
                            ...current.assignments,
                            [action.id]: {
                              supplier,
                              completedAt: null,
                              title: action.title,
                              propertyId: action.propertyId,
                            },
                          },
                        }))
                      }
                    />
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      disabled={!assignment?.supplier || saving}
                      onClick={() =>
                        save((current) => ({
                          ...current,
                          assignments: {
                            ...current.assignments,
                            [action.id]: {
                              supplier: current.assignments[action.id]!.supplier,
                              completedAt: new Intl.DateTimeFormat("sv-SE", {
                                timeZone: "Europe/Stockholm",
                              }).format(new Date()),
                              title: action.title,
                              propertyId: action.propertyId,
                            },
                          },
                        }))
                      }
                    >
                      Markera uppdrag utfört
                    </Button>
                  </fieldset>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
