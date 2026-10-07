import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useManagement } from "@/hooks/use-management";
import {
  availablePartners,
  partnerSnapshot,
  trades,
  type ManagementMode,
  type ManagedProperty,
  type PartnerSnapshot,
} from "@/data/management";
export function SupplierPicker({
  mode,
  properties,
  propertyId,
  value,
  onChange,
  id,
}: {
  mode: ManagementMode;
  properties: ManagedProperty[];
  propertyId: string;
  value: PartnerSnapshot | null;
  onChange: (partner: PartnerSnapshot | null) => void;
  id: string;
}) {
  const { record, error } = useManagement(mode, properties);
  const [trade, setTrade] = useState("all");
  const partners = availablePartners(record?.partners ?? [], propertyId, trade);
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor={`${id}-trade`}>Leverantörens yrkesområde</Label>
        <select
          id={`${id}-trade`}
          value={trade}
          onChange={(e) => setTrade(e.target.value)}
          className="mt-2 h-10 w-full rounded-xl border border-input bg-card px-3 text-sm"
        >
          <option value="all">Alla yrkesområden</option>
          {trades.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor={id}>Ansvarig leverantör (valfritt)</Label>
        <select
          id={id}
          disabled={!record}
          value={value?.id ?? ""}
          onChange={(e) => {
            const partner = record?.partners.find((p) => p.id === e.target.value);
            onChange(partner ? partnerSnapshot(partner) : null);
          }}
          className="mt-2 h-10 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
        >
          <option value="">Ingen leverantör vald</option>
          {value && !partners.some((p) => p.id === value.id) && (
            <option value={value.id}>{value.name} · valt uppdrag</option>
          )}
          {partners.map((p) => (
            <option key={p.id} value={p.id}>
              {p.preferred ? "★ " : ""}
              {p.name} · {p.trade}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-muted-foreground">
          Prioriterade leverantörer visas först. Bara leverantörer för denna fastighet kan väljas.
        </p>
        {error && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
