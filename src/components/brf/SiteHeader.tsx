import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { association, navigation } from "@/data/overview";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const objectNavigation = [
  { label: "Hyresrätter & lokaler", path: "/hyresobjekt" as const },
  { label: "Bostadsrätter", path: "/bostadsratter" as const },
  { label: "Garage", path: "/garage" as const },
];

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-6xl px-5 pt-8 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground sm:text-[1.75rem]">
              {association.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{association.subtitle}</p>
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">{association.updated}</p>
        </div>

        <nav className="mt-6 -mb-px flex flex-wrap gap-x-6 gap-y-2">
          {navigation.map((item) => {
            const isObjectNavigation = item.id === "objekt";
            const isActive = isObjectNavigation
              ? objectNavigation.some((subItem) => subItem.path === pathname)
              : item.path
                ? pathname === item.path
                : false;
            const className = cn(
              "shrink-0 border-b-2 pb-3 text-sm transition-colors",
              isActive
                ? "border-primary font-semibold text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            );

            if (isObjectNavigation) {
              return (
                <DropdownMenu key={item.id}>
                  <DropdownMenuTrigger
                    className={cn(className, "flex items-center gap-1 outline-none")}
                    aria-label="Öppna menyn Lägenheter och lokaler"
                  >
                    {item.label}
                    <ChevronDown className="size-4" aria-hidden="true" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-52 rounded-xl p-2">
                    {objectNavigation.map((subItem) => (
                      <DropdownMenuItem key={subItem.path} asChild className="rounded-lg p-0">
                        <Link
                          to={subItem.path}
                          className="w-full px-3 py-2.5"
                          aria-current={pathname === subItem.path ? "page" : undefined}
                        >
                          {subItem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return item.path ? (
              <Link
                key={item.id}
                to={item.path}
                aria-current={isActive ? "page" : undefined}
                className={className}
              >
                {item.label}
              </Link>
            ) : (
              <button key={item.id} type="button" className={className}>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
