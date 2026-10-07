import { useEffect, useRef, useState } from "react";
import {
  createManagementRecord,
  type ManagementMode,
  type ManagementRecord,
  type ManagedProperty,
} from "@/data/management";
import { readManagement, writeManagement } from "@/lib/management-storage";
export function useManagement(mode: ManagementMode, properties: ManagedProperty[]) {
  const [record, setRecord] = useState<ManagementRecord | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const current = useRef<ManagementRecord | null>(null);
  const locked = useRef(false);
  const initialProperties = useRef(properties);
  useEffect(() => {
    let active = true;
    const apply = (value: ManagementRecord) => {
      current.current = value;
      setRecord(value);
    };
    readManagement(mode)
      .then((saved) => {
        if (active) apply(saved ?? createManagementRecord(mode, initialProperties.current));
      })
      .catch(() => {
        if (active)
          setError("Registret kunde inte öppnas. Kontrollera webbläsarens lokala lagring.");
      });
    const receive = (event: Event) => {
      const detail = (event as CustomEvent<{ mode: ManagementMode; record: ManagementRecord }>)
        .detail;
      if (detail.mode === mode) apply(detail.record);
    };
    window.addEventListener("management-updated", receive);
    return () => {
      active = false;
      window.removeEventListener("management-updated", receive);
    };
  }, [mode]);
  async function save(update: (record: ManagementRecord) => ManagementRecord): Promise<boolean> {
    if (locked.current || !current.current) return false;
    locked.current = true;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const next = update(current.current);
      await writeManagement(mode, next);
      current.current = next;
      setRecord(next);
      window.dispatchEvent(
        new CustomEvent("management-updated", { detail: { mode, record: next } }),
      );
      setNotice("Sparat i den här webbläsaren.");
      return true;
    } catch {
      setError(
        "Det gick inte att spara. Uppgifterna i formuläret finns kvar. Kontrollera lagringsutrymmet och försök igen.",
      );
      return false;
    } finally {
      locked.current = false;
      setSaving(false);
    }
  }
  return { record, save, saving, error, notice };
}
