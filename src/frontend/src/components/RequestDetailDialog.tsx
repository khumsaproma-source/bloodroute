import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  BLOOD_GROUPS,
  REQUEST_STATUS_LABEL,
  bloodGroupColor,
  bloodGroupLabel,
} from "@/lib/blood";
import {
  formatDistance,
  formatDuration,
  formatTimestamp,
  formatUnits,
} from "@/lib/format";
import type { BloodRequest, RequestStatus } from "@/types";
import { Clock, MapPin, Route, Trash2 } from "lucide-react";

const STATUS_ORDER: RequestStatus[] = [
  "Pending",
  "InTransit",
  "Delivered",
] as RequestStatus[];

interface RequestDetailDialogProps {
  request: BloodRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (status: RequestStatus) => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

/** Full request detail with status update and Thai delete confirmation. */
export function RequestDetailDialog({
  request,
  open,
  onOpenChange,
  onStatusChange,
  onDelete,
  isUpdating,
  isDeleting,
}: RequestDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-ocid="request.dialog">
        {request && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-display">
                <span
                  className={`flex size-9 items-center justify-center rounded-lg border font-mono text-sm font-bold ${bloodGroupColor(request.bloodGroup)}`}
                >
                  {bloodGroupLabel(request.bloodGroup)}
                </span>
                <span className="min-w-0 truncate">{request.hospitalName}</span>
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 pt-1">
                <StatusBadge status={request.status} />
                <span className="font-mono text-xs">
                  #{request.id.toString()}
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailRow
                  icon={<MapPin className="size-4" />}
                  label="จุดต้นทาง"
                  value={request.originName}
                />
                <DetailRow
                  icon={<MapPin className="size-4" />}
                  label="โรงพยาบาลปลายทาง"
                  value={request.hospitalName}
                />
                <DetailRow
                  icon={<Route className="size-4" />}
                  label="ระยะทาง"
                  value={formatDistance(request.distanceMeters)}
                />
                <DetailRow
                  icon={<Clock className="size-4" />}
                  label="ระยะเวลา"
                  value={formatDuration(request.durationSeconds)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-secondary/40 p-3">
                <div>
                  <p className="text-xs text-muted-foreground">กลุ่มเลือด</p>
                  <p className="font-mono text-sm font-semibold">
                    {bloodGroupLabel(request.bloodGroup)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">จำนวน</p>
                  <p className="font-mono text-sm font-semibold tabular-nums">
                    {formatUnits(request.units)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <p>สร้างเมื่อ {formatTimestamp(request.createdAt)}</p>
                <p>อัปเดตล่าสุด {formatTimestamp(request.updatedAt)}</p>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="request-status"
                  className="text-sm font-medium text-foreground"
                >
                  อัปเดตสถานะ
                </label>
                <Select
                  value={request.status}
                  onValueChange={(value) =>
                    onStatusChange(value as RequestStatus)
                  }
                  disabled={isUpdating}
                >
                  <SelectTrigger
                    id="request-status"
                    className="w-full"
                    data-ocid="request.select"
                  >
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_ORDER.map((status) => (
                      <SelectItem key={status} value={status}>
                        {REQUEST_STATUS_LABEL[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isUpdating && (
                  <p className="text-xs text-muted-foreground">
                    กำลังอัปเดตสถานะ…
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={onDelete}
                disabled={isDeleting}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                data-ocid="request.delete_button"
              >
                <Trash2 className="size-4" />
                {isDeleting ? "กำลังลบ…" : "ลบคำขอ"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                data-ocid="request.close_button"
              >
                ปิด
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
