import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { bloodGroupLabel } from "@/lib/blood";
import { formatDistance, formatDuration, formatUnits } from "@/lib/format";
import type { RouteResult } from "@/types";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Droplet,
  Loader2,
  Route as RouteIcon,
  Save,
} from "lucide-react";

type RouteResultCardProps = {
  result: RouteResult;
  onSave: () => void;
  isSaving: boolean;
  saveError: boolean;
  saved: boolean;
};

export function RouteResultCard({
  result,
  onSave,
  isSaving,
  saveError,
  saved,
}: RouteResultCardProps) {
  const sufficient = result.stockSufficient;

  return (
    <Card
      className="overflow-hidden border-border shadow-elevated"
      data-ocid="route.result.card"
    >
      <div
        className={
          sufficient
            ? "flex items-center gap-2 border-b border-success/20 bg-success/10 px-4 py-3"
            : "flex items-center gap-2 border-b border-warning/20 bg-warning/10 px-4 py-3"
        }
      >
        {sufficient ? (
          <CheckCircle2 className="size-4 text-success" />
        ) : (
          <AlertTriangle className="size-4 text-warning" />
        )}
        <span
          className={
            sufficient
              ? "text-sm font-semibold text-success"
              : "text-sm font-semibold text-warning"
          }
          data-ocid="route.result.status"
        >
          {sufficient ? "เลือดคงคลังเพียงพอต่อคำขอ" : "เลือดคงคลังไม่เพียงพอ"}
        </span>
      </div>

      <CardContent className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 rounded-lg border border-border bg-secondary/40 p-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <RouteIcon className="size-3.5" />
              ระยะทาง
            </span>
            <span
              className="font-display text-lg font-semibold tabular"
              data-ocid="route.result.distance"
            >
              {formatDistance(result.distanceMeters)}
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-lg border border-border bg-secondary/40 p-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              เวลาโดยประมาณ
            </span>
            <span
              className="font-display text-lg font-semibold tabular"
              data-ocid="route.result.duration"
            >
              {formatDuration(result.durationSeconds)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1 border-primary/30 bg-primary/10 text-primary"
          >
            <Droplet className="size-3" />
            {bloodGroupLabel(result.bloodGroup)}
          </Badge>
          <Badge variant="outline" className="tabular">
            คำขอ {formatUnits(result.units)}
          </Badge>
          <Badge
            variant="outline"
            className={
              sufficient
                ? "border-success/30 bg-success/10 text-success"
                : "border-warning/30 bg-warning/10 text-warning"
            }
          >
            คงคลัง {formatUnits(result.availableUnits)}
          </Badge>
        </div>

        {!sufficient && (
          <div
            className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning"
            data-ocid="route.result.warning"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <p>
              เลือดหมู่ {bloodGroupLabel(result.bloodGroup)} คงเหลือเพียง{" "}
              {formatUnits(result.availableUnits)} ซึ่งไม่เพียงพอต่อคำขอ{" "}
              {formatUnits(result.units)} กรุณาพิจารณาโรงพยาบาลอื่นหรือจำนวนที่น้อยลง
            </p>
          </div>
        )}

        <Separator />

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving || saved}
            className="w-full gap-2 rounded-lg"
            data-ocid="route.save_button"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                กำลังบันทึก…
              </>
            ) : saved ? (
              <>
                <CheckCircle2 className="size-4" />
                บันทึกคำขอแล้ว
              </>
            ) : (
              <>
                <Save className="size-4" />
                บันทึกคำขอนี้
              </>
            )}
          </Button>
          {saved && (
            <p
              className="text-center text-sm font-medium text-success"
              data-ocid="route.success_state"
            >
              บันทึกคำขอสำเร็จ กำลังนำไปหน้ารายการคำขอ…
            </p>
          )}
          {saveError && (
            <p
              className="text-center text-sm text-destructive"
              data-ocid="route.error_state"
            >
              บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
