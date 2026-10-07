import { useEffect, useRef, useState } from "react";
import { createUnitRecord, type RentalUnit, type UnitRecord } from "@/data/rental-units";
import { loadUnitRecord, saveUnitRecord } from "@/lib/unit-storage";

export function useUnitRecord(unit: RentalUnit) {
  const [record, setRecord] = useState<UnitRecord | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const lock = useRef(false);
  useEffect(() => {
    let active = true;
    loadUnitRecord(unit.id)
      .then((saved) => {
        if (active) setRecord(saved ?? createUnitRecord(unit));
      })
      .catch(() => {
        if (active)
          setError(
            "Objektsjournalen kunde inte öppnas. Tillåt lokal lagring i webbläsaren och försök igen.",
          );
      });
    return () => {
      active = false;
    };
  }, [unit]);
  async function save(next: UnitRecord): Promise<boolean> {
    if (lock.current) return false;
    lock.current = true;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await saveUnitRecord(unit.id, next);
      setRecord(next);
      setNotice("Sparat i den här webbläsaren.");
      return true;
    } catch {
      setError(
        "Det gick inte att spara. Kontrollera webbläsarens lagringsutrymme och försök igen. Uppgifterna i formuläret finns kvar.",
      );
      return false;
    } finally {
      lock.current = false;
      setSaving(false);
    }
  }
  return { record, save, saving, error, notice };
}
