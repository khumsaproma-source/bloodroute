import { Badge } from "@/components/ui/badge";
import { requestStatusColor, requestStatusLabel } from "@/lib/blood";
import type { RequestStatus } from "@/types";
import { CheckCircle2, Clock, Truck } from "lucide-react";

const STATUS_ICON: Record<RequestStatus, typeof Clock> = {
  Pending: Clock,
  InTransit: Truck,
  Delivered: CheckCircle2,
} as Record<RequestStatus, typeof Clock>;

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

/** Thai status pill: รอดำเนินการ / กำลังขนส่ง / ส่งถึงแล้ว. */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const Icon = STATUS_ICON[status] ?? Clock;
  return (
    <Badge
      variant="outline"
      className={`gap-1.5 border px-2.5 py-1 text-xs font-medium ${requestStatusColor(status)} ${className ?? ""}`}
    >
      <Icon className="size-3.5" />
      {requestStatusLabel(status)}
    </Badge>
  );
}
