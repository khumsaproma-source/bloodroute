import { Badge } from "@/components/ui/badge";
import { BLOOD_GROUPS, bloodGroupColor, bloodGroupLabel } from "@/lib/blood";
import type { Hospital } from "@/types";
import { MapPin } from "lucide-react";

interface HospitalCardProps {
  hospital: Hospital;
  index: number;
  selected: boolean;
  onSelect: (hospital: Hospital) => void;
}

/** Sidebar card: name, address, and an 8-group blood stock strip. */
export function HospitalCard({
  hospital,
  index,
  selected,
  onSelect,
}: HospitalCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(hospital)}
      aria-pressed={selected}
      data-ocid={`hospital.item.${index + 1}`}
      className={`group w-full rounded-lg border p-3 text-left transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        selected
          ? "border-primary/40 bg-primary/5 shadow-sm"
          : "border-border bg-card hover:border-primary/30 hover:bg-secondary/60"
      }`}
    >
      <div className="flex items-start gap-2">
        <span
          className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md ${
            selected
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground group-hover:bg-primary/10 group-hover:text-primary"
          }`}
        >
          <MapPin className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-sm font-semibold text-foreground">
            {hospital.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            {hospital.address}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {BLOOD_GROUPS.map((group) => {
          const units = hospital.stock[group] ?? 0;
          return (
            <Badge
              key={group}
              variant="outline"
              className={`gap-1 px-1.5 py-0 font-mono text-[11px] ${bloodGroupColor(group)}`}
            >
              <span className="font-semibold">{bloodGroupLabel(group)}</span>
              <span className="tabular-nums opacity-80">{units}</span>
            </Badge>
          );
        })}
      </div>
    </button>
  );
}
