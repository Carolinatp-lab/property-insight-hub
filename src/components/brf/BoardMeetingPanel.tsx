import { boardItems } from "@/data/overview";
import { cn } from "@/lib/utils";

const categories = [
  { id: "information", label: "Information" },
  { id: "bevaka", label: "Bevaka" },
  { id: "beslut", label: "Beslut krävs" },
];

export function BoardMeetingPanel({
  onHoverArea,
  onSelectArea,
}: {
  onHoverArea?: (id: string | null) => void;
  onSelectArea?: (id?: string) => void;
}) {
  return (
    <section
      aria-labelledby="board-heading"
      className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-7"
    >
      <h2 id="board-heading" className="text-lg font-semibold text-foreground">
        Inför nästa styrelsemöte
      </h2>
      <p className="mt-0.5 text-sm text-muted-foreground">
        Frågor som kan behöva styrelsens uppmärksamhet.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {categories.map((category) => {
          const items = boardItems.filter((item) => item.category === category.id);
          const emphasised = category.id === "beslut";
          return (
            <div
              key={category.id}
              className={cn(
                "flex flex-col rounded-2xl border p-4",
                emphasised
                  ? "border-status-alert/35 bg-status-alert/5"
                  : "border-border bg-secondary/50",
              )}
            >
              <p
                className={cn(
                  "text-xs font-semibold tracking-wide uppercase",
                  emphasised ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {category.label}
              </p>
              <ul className="mt-2.5 space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="text-sm leading-relaxed text-foreground">
                    {item.text}
                    {item.action ? (
                      <button
                        type="button"
                        onClick={() => onSelectArea?.(item.areaId)}
                        onMouseEnter={() => onHoverArea?.(item.areaId ?? null)}
                        onMouseLeave={() => onHoverArea?.(null)}
                        className="mt-2 block rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        {item.action}
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
