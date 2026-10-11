import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BLOOD_GROUPS, bloodGroupColor, bloodGroupLabel } from "@/lib/blood";
import { formatUnits } from "@/lib/format";
import type { Hospital } from "@/types";
import { Droplet, MapPin } from "lucide-react";

interface HospitalDetailDialogProps {
  hospital: Hospital | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Detail dialog: hospital name, address, and full 8-group blood stock. */
export function HospitalDetailDialog({
  hospital,
  open,
  onOpenChange,
}: HospitalDetailDialogProps) {
  const totalUnits = hospital
    ? BLOOD_GROUPS.reduce((sum, group) => sum + (hospital.stock[group] ?? 0), 0)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-ocid="hospital.dialog">
        {hospital && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-display">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Droplet className="size-4" />
                </span>
                {hospital.name}
              </DialogTitle>
              <DialogDescription className="flex items-start gap-1.5 pt-1">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                <span>{hospital.address}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold">
                  ปริมาณเลือดคงคลัง
                </h3>
                <span className="font-mono text-xs text-muted-foreground">
                  รวม {formatUnits(totalUnits)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {BLOOD_GROUPS.map((group) => {
                  const units = hospital.stock[group] ?? 0;
                  return (
                    <div
                      key={group}
                      className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-3 ${bloodGroupColor(group)}`}
                    >
                      <span className="font-mono text-lg font-bold">
                        {bloodGroupLabel(group)}
                      </span>
                      <span className="font-mono text-sm tabular-nums">
                        {units}
                      </span>
                      <span className="text-[11px] opacity-70">ยูนิต</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                <Badge variant="outline" className="gap-1">
                  <span className="size-2 rounded-full bg-primary" />
                  กลุ่มบวก
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <span className="size-2 rounded-full bg-accent" />
                  กลุ่มลบ
                </Badge>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
