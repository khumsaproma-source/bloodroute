import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BLOOD_GROUPS, bloodGroupColor, bloodGroupLabel } from "@/lib/blood";
import type { BloodGroup, BloodStock } from "@/types";
import { Droplet } from "lucide-react";

interface StockEditorProps {
  stock: BloodStock[];
  onChange: (stock: BloodStock[]) => void;
}

/** Read the unit count for a group from a stock array. */
function unitsFor(stock: BloodStock[], group: BloodGroup): bigint {
  return stock.find((entry) => entry.bloodGroup === group)?.units ?? 0n;
}

/**
 * Editor for all 8 blood groups. Emits a complete stock array on every
 * change so the parent form always holds a full, valid draft.
 */
export function StockEditor({ stock, onChange }: StockEditorProps) {
  const total = BLOOD_GROUPS.reduce(
    (sum, group) => sum + unitsFor(stock, group),
    0n,
  );

  function handleChange(group: BloodGroup, raw: string) {
    const parsed = Number.parseInt(raw, 10);
    const units = BigInt(Number.isNaN(parsed) || parsed < 0 ? 0 : parsed);
    const next = BLOOD_GROUPS.map((entry) => ({
      bloodGroup: entry,
      units: entry === group ? units : unitsFor(stock, entry),
    }));
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5">
          <Droplet className="size-3.5 text-primary" />
          ปริมาณเลือดคงคลัง (ยูนิต)
        </Label>
        <span className="font-mono text-xs text-muted-foreground">
          รวม {Number(total).toLocaleString("th-TH")} ยูนิต
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {BLOOD_GROUPS.map((group) => (
          <div
            key={group}
            className={`flex flex-col gap-1.5 rounded-lg border p-2.5 ${bloodGroupColor(group)}`}
          >
            <Label
              htmlFor={`stock-${group}`}
              className="font-mono text-sm font-bold"
            >
              {bloodGroupLabel(group)}
            </Label>
            <Input
              id={`stock-${group}`}
              type="number"
              min={0}
              inputMode="numeric"
              value={Number(unitsFor(stock, group))}
              onChange={(event) => handleChange(group, event.target.value)}
              className="h-8 bg-card font-mono text-sm tabular-nums"
              data-ocid={`hospital.stock_input.${bloodGroupLabel(group)}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
