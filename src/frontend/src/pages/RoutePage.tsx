import {
  PRESET_ORIGINS,
  RouteForm,
  type RouteFormValues,
} from "@/components/RouteForm";
import { RouteMap } from "@/components/RouteMap";
import { RouteResultCard } from "@/components/RouteResultCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useComputeRoute,
  useCreateRequest,
  useListHospitals,
} from "@/hooks/useQueries";
import { bloodGroupLabel } from "@/lib/blood";
import { cn } from "@/lib/utils";
import type { BloodRequestInput, RouteResult } from "@/types";
import { BloodGroup } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  MapPinned,
  RotateCcw,
  Route as RouteIcon,
} from "lucide-react";
import { useState } from "react";

const DEFAULT_ORIGIN = PRESET_ORIGINS[0];

const INITIAL_VALUES: RouteFormValues = {
  originId: DEFAULT_ORIGIN.id,
  originName: DEFAULT_ORIGIN.name,
  originLat: DEFAULT_ORIGIN.lat,
  originLng: DEFAULT_ORIGIN.lng,
  hospitalId: "",
  bloodGroup: BloodGroup.APos,
  units: 1,
};

export function RoutePage() {
  const navigate = useNavigate();
  const { data: hospitals = [], isLoading: hospitalsLoading } =
    useListHospitals();
  const computeRoute = useComputeRoute();
  const createRequest = useCreateRequest();

  const [values, setValues] = useState<RouteFormValues>(INITIAL_VALUES);
  const [result, setResult] = useState<RouteResult | null>(null);
  const [saved, setSaved] = useState(false);

  const selectedHospital = hospitals.find(
    (hospital) => hospital.id === values.hospitalId,
  );

  const canSubmit =
    values.originId !== "" &&
    values.hospitalId !== "" &&
    values.units > 0 &&
    (values.originLat !== 0 || values.originLng !== 0);

  function handleChange(patch: Partial<RouteFormValues>) {
    setValues((current) => ({ ...current, ...patch }));
  }

  function handleSubmit() {
    if (!canSubmit) return;
    setSaved(false);
    computeRoute.mutate(
      {
        originId: values.originId,
        originName: values.originName,
        originLat: values.originLat,
        originLng: values.originLng,
        hospitalId: values.hospitalId,
        bloodGroup: values.bloodGroup,
        units: BigInt(values.units),
      },
      {
        onSuccess: (data) => setResult(data),
      },
    );
  }

  function handleSave() {
    if (!result || !selectedHospital) return;
    const input: BloodRequestInput = {
      originName: values.originName,
      originLat: result.originLat,
      originLng: result.originLng,
      hospitalId: selectedHospital.id,
      hospitalName: selectedHospital.name,
      bloodGroup: result.bloodGroup,
      units: result.units,
      distanceMeters: result.distanceMeters,
      durationSeconds: result.durationSeconds,
      geometry: result.geometry,
    };
    createRequest.mutate(input, {
      onSuccess: () => {
        setSaved(true);
        window.setTimeout(() => {
          void navigate({ to: "/requests" });
        }, 1200);
      },
    });
  }

  function handleReset() {
    setResult(null);
    setSaved(false);
    computeRoute.reset();
    createRequest.reset();
  }

  const mapOriginLat = result?.originLat ?? values.originLat;
  const mapOriginLng = result?.originLng ?? values.originLng;
  const mapDestLat = result?.destLat ?? selectedHospital?.lat ?? 13.7563;
  const mapDestLng = result?.destLng ?? selectedHospital?.lng ?? 100.5018;

  return (
    <div
      className="mx-auto w-full max-w-[1600px] px-4 py-6 lg:px-6"
      data-ocid="route.page"
    >
      <header className="mb-6 flex flex-col gap-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          คำนวณเส้นทางส่งเลือด
        </h1>
        <p className="text-sm text-muted-foreground">
          เลือกคลังเลือดต้นทาง โรงพยาบาลปลายทาง หมู่เลือด และจำนวนยูนิต
          เพื่อวางแผนเส้นทางขนส่ง
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(320px,380px)_1fr]">
        {/* Sidebar form */}
        <aside className="flex flex-col gap-4">
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPinned className="size-4 text-primary" />
                รายละเอียดเส้นทาง
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RouteForm
                hospitals={hospitals}
                hospitalsLoading={hospitalsLoading}
                values={values}
                onChange={handleChange}
                onSubmit={handleSubmit}
                isSubmitting={computeRoute.isPending}
                canSubmit={canSubmit}
              />
            </CardContent>
          </Card>

          {computeRoute.isError && (
            <div
              className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
              data-ocid="route.error_state"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>คำนวณเส้นทางไม่สำเร็จ กรุณาตรวจสอบข้อมูลแล้วลองอีกครั้ง</p>
            </div>
          )}

          {result && (
            <RouteResultCard
              result={result}
              onSave={handleSave}
              isSaving={createRequest.isPending}
              saveError={createRequest.isError}
              saved={saved}
            />
          )}
        </aside>

        {/* Map panel */}
        <section className="flex min-h-[420px] flex-col gap-4 lg:min-h-[640px]">
          <Card className="flex flex-1 flex-col overflow-hidden border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <RouteIcon className="size-4 text-primary" />
                แผนที่เส้นทาง
              </CardTitle>
              {result && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="gap-1.5 text-muted-foreground"
                  data-ocid="route.reset_button"
                >
                  <RotateCcw className="size-3.5" />
                  ล้างผลลัพธ์
                </Button>
              )}
            </CardHeader>
            <CardContent className="relative flex-1 p-0">
              {computeRoute.isPending ? (
                <div
                  className="flex h-full min-h-[420px] flex-col items-center justify-center gap-3 bg-muted/40"
                  data-ocid="route.loading_state"
                >
                  <Skeleton className="h-full w-full" />
                  <span className="absolute text-sm font-medium text-muted-foreground">
                    กำลังคำนวณเส้นทาง…
                  </span>
                </div>
              ) : (
                <div className="h-full min-h-[420px] w-full">
                  <RouteMap
                    originLat={mapOriginLat}
                    originLng={mapOriginLng}
                    destLat={mapDestLat}
                    destLng={mapDestLng}
                    geometry={result?.geometry ?? ""}
                    originName={values.originName}
                    destName={selectedHospital?.name ?? "โรงพยาบาลปลายทาง"}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {result && (
            <div
              className={cn(
                "flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border px-4 py-3 text-sm",
                result.stockSufficient
                  ? "border-success/30 bg-success/5"
                  : "border-warning/30 bg-warning/5",
              )}
              data-ocid="route.summary.panel"
            >
              <span className="text-muted-foreground">
                หมู่เลือด{" "}
                <span className="font-semibold text-foreground">
                  {bloodGroupLabel(result.bloodGroup)}
                </span>
              </span>
              <span className="text-muted-foreground">
                ต้นทาง{" "}
                <span className="font-medium text-foreground">
                  {values.originName}
                </span>
              </span>
              <span className="text-muted-foreground">
                ปลายทาง{" "}
                <span className="font-medium text-foreground">
                  {selectedHospital?.name ?? "—"}
                </span>
              </span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
