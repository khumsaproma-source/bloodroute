import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { bloodGroupColor, bloodGroupLabel } from "@/lib/blood";
import { formatDistance, formatDuration, formatUnits } from "@/lib/format";
import type { BloodRequest } from "@/types";
import { ArrowRight, Clock, MapPin, Route, Trash2 } from "lucide-react";

interface RequestListProps {
  requests: BloodRequest[];
  isLoading: boolean;
  onOpen: (request: BloodRequest) => void;
  onDelete: (request: BloodRequest) => void;
}

function RequestRow({
  request,
  index,
  onOpen,
  onDelete,
}: {
  request: BloodRequest;
  index: number;
  onOpen: (request: BloodRequest) => void;
  onDelete: (request: BloodRequest) => void;
}) {
  return (
    <li
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-smooth hover:border-primary/30 hover:shadow-elevated sm:flex-row sm:items-center"
      data-ocid={`request.item.${index + 1}`}
    >
      <button
        type="button"
        onClick={() => onOpen(request)}
        className="flex min-w-0 flex-1 items-start gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        data-ocid={`request.open_modal_button.${index + 1}`}
      >
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-bold ${bloodGroupColor(request.bloodGroup)}`}
          aria-label={`กลุ่มเลือด ${bloodGroupLabel(request.bloodGroup)}`}
        >
          {bloodGroupLabel(request.bloodGroup)}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="truncate font-display text-sm font-semibold text-foreground">
              {request.hospitalName}
            </span>
            <StatusBadge status={request.status} />
          </span>
          <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">จาก {request.originName}</span>
          </span>
          <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Route className="size-3.5" />
              {formatDistance(request.distanceMeters)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {formatDuration(request.durationSeconds)}
            </span>
            <span className="font-mono tabular-nums">
              {formatUnits(request.units)}
            </span>
          </span>
        </span>
      </button>

      <div className="flex items-center gap-2 sm:shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onOpen(request)}
          data-ocid={`request.detail_button.${index + 1}`}
        >
          รายละเอียด
          <ArrowRight className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`ลบคำขอไปยัง ${request.hospitalName}`}
          onClick={() => onDelete(request)}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          data-ocid={`request.delete_button.${index + 1}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </li>
  );
}

function RequestSkeleton() {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <Skeleton className="size-11 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-3 w-3/5" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-8 w-24 rounded-md" />
    </li>
  );
}

/** Thai list of saved blood requests with loading and empty states. */
export function RequestList({
  requests,
  isLoading,
  onOpen,
  onDelete,
}: RequestListProps) {
  if (isLoading) {
    return (
      <ul
        className="flex flex-col gap-3"
        aria-busy="true"
        data-ocid="request.loading_state"
      >
        {Array.from({ length: 4 }, (_, i) => `request-skeleton-${i}`).map(
          (id) => (
            <RequestSkeleton key={id} />
          ),
        )}
      </ul>
    );
  }

  if (requests.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center"
        data-ocid="request.empty_state"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Route className="size-7" />
        </span>
        <h2 className="font-display text-lg font-semibold">ยังไม่มีคำขอเลือด</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          สร้างคำขอจากหน้า «คำนวณเส้นทาง» เพื่อบันทึกเส้นทางส่งเลือดไปยังโรงพยาบาลที่ต้องการ
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3" data-ocid="request.list">
      {requests.map((request, index) => (
        <RequestRow
          key={request.id.toString()}
          request={request}
          index={index}
          onOpen={onOpen}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
