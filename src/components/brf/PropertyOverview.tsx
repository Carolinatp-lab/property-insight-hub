import { useState } from "react";
import { propertyAreas, type PropertyArea } from "@/data/overview";
import { PropertySection } from "./PropertySection";
import { InsightsPanel } from "./InsightsPanel";
import { BoardMeetingPanel } from "./BoardMeetingPanel";
import { AreaDetailSheet } from "./AreaDetailSheet";

export function PropertyOverview() {
  const [active, setActive] = useState<PropertyArea | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const selectById = (id?: string) => {
    if (!id) return;
    const area = propertyAreas.find((a) => a.id === id);
    if (area) setActive(area);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <PropertySection
            activeId={active?.id ?? null}
            hoverId={hoverId}
            onHover={setHoverId}
            onSelect={setActive}
          />
        </div>
        <div className="lg:col-span-2">
          <InsightsPanel onHoverArea={setHoverId} onSelectArea={setActive} />
        </div>
      </div>

      <BoardMeetingPanel onHoverArea={setHoverId} onSelectArea={selectById} />

      <AreaDetailSheet area={active} onOpenChange={(open) => !open && setActive(null)} />
    </>
  );
}
