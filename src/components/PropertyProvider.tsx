import { createContext, useContext, useState, type ReactNode } from "react";
import { properties, summarizeProperties } from "@/data/portfolio";
const PropertyContext = createContext<{
  selectedId: string;
  selectProperty: (id: string) => void;
} | null>(null);
export function PropertyProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState("all");
  function selectProperty(id: string) {
    setSelectedId(properties.some((p) => p.id === id) ? id : "all");
  }
  return (
    <PropertyContext.Provider value={{ selectedId, selectProperty }}>
      {children}
    </PropertyContext.Provider>
  );
}
export function useProperties() {
  const context = useContext(PropertyContext);
  if (!context) throw new Error("PropertyProvider saknas");
  const items =
    context.selectedId === "all"
      ? properties
      : properties.filter((p) => p.id === context.selectedId);
  return {
    ...context,
    items,
    summary: summarizeProperties(items),
    scope: context.selectedId === "all" ? "Alla fastigheter" : items[0]!.address,
  };
}
