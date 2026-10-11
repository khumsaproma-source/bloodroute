import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Droplet, Menu } from "lucide-react";
import { useState } from "react";

export type NavItem = {
  to: string;
  label: string;
};

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "แผนที่โรงพยาบาล" },
  { to: "/route", label: "คำนวณเส้นทาง" },
  { to: "/requests", label: "คำขอเลือด" },
  { to: "/manage", label: "จัดการโรงพยาบาล" },
];

function isActive(pathname: string, to: string): boolean {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function AppNav() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop navigation */}
      <nav
        className="hidden items-center gap-1 md:flex"
        aria-label="การนำทางหลัก"
        data-ocid="nav.primary"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              data-ocid={`nav.link.${item.to === "/" ? "map" : item.to.slice(1)}`}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile navigation */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="เปิดเมนู"
              data-ocid="nav.open_modal_button"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 font-display">
                <Droplet className="size-5 text-primary" />
                BloodRoute
              </SheetTitle>
            </SheetHeader>
            <nav
              className="mt-6 flex flex-col gap-1"
              aria-label="การนำทางหลัก"
              data-ocid="nav.mobile"
            >
              {NAV_ITEMS.map((item) => {
                const active = isActive(pathname, item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    data-ocid={`nav.mobile_link.${item.to === "/" ? "map" : item.to.slice(1)}`}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
