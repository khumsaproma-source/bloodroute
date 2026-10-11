import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BLOOD_GROUPS, bloodGroupLabel } from "@/lib/blood";
import { cn } from "@/lib/utils";
import type { BloodGroup, Hospital } from "@/types";
import {
  Crosshair,
  Hospital as HospitalIcon,
  Loader2,
  MapPin,
} from "lucide-react";

export type PresetOrigin = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

/** Preset Thai blood centers / donation points used as route origins. */
export const PRESET_ORIGINS: PresetOrigin[] = [
  {
    id: "nbc",
    name: "ศูนย์บริการโลหิตแห่งชาติ สภากาชาดไทย",
    lat: 13.7307,
    lng: 100.5231,
  },
  {
    id: "siriraj",
    name: "คลังเลือด โรงพยาบาลศิริราช",
    lat: 13.7563,
    lng: 100.4859,
  },
  {
    id: "ramathibodi",
    name: "คลังเลือด โรงพยาบาลรามาธิบดี",
    lat: 13.7669,
    lng: 100.5294,
  },
  {
    id: "chula",
    name: "คลังเลือด โรงพยาบาลจุฬาลงกรณ์",
    lat: 13.7324,
    lng: 100.5352,
  },
];

export type RouteFormValues = {
  originId: string;
  originName: string;
  originLat: number;
  originLng: number;
  hospitalId: string;
  bloodGroup: BloodGroup;
  units: number;
};

type RouteFormProps = {
  hospitals: Hospital[];
  hospitalsLoading: boolean;
  values: RouteFormValues;
  onChange: (patch: Partial<RouteFormValues>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
};

export function RouteForm({
  hospitals,
  hospitalsLoading,
  values,
  onChange,
  onSubmit,
  isSubmitting,
  canSubmit,
}: RouteFormProps) {
  const isCustomOrigin = values.originId === "current";

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          originId: "current",
          originName: "ตำแหน่งปัจจุบันของฉัน",
          originLat: position.coords.latitude,
          originLng: position.coords.longitude,
        });
      },
      () => {
        onChange({ originId: "current", originName: "ตำแหน่งปัจจุบันของฉัน" });
      },
    );
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      data-ocid="route.form"
    >
      {/* Origin */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin className="size-3.5" />
          </span>
          <Label htmlFor="route-origin" className="text-sm font-semibold">
            จุดเริ่มต้น (คลังเลือด)
          </Label>
        </div>
        <Select
          value={values.originId}
          onValueChange={(value) => {
            if (value === "current") {
              handleUseCurrentLocation();
              return;
            }
            const preset = PRESET_ORIGINS.find((item) => item.id === value);
            if (preset) {
              onChange({
                originId: preset.id,
                originName: preset.name,
                originLat: preset.lat,
                originLng: preset.lng,
              });
            }
          }}
        >
          <SelectTrigger id="route-origin" data-ocid="route.origin.select">
            <SelectValue placeholder="เลือกคลังเลือดต้นทาง" />
          </SelectTrigger>
          <SelectContent>
            {PRESET_ORIGINS.map((origin) => (
              <SelectItem key={origin.id} value={origin.id}>
                {origin.name}
              </SelectItem>
            ))}
            <SelectItem value="current">ใช้ตำแหน่งปัจจุบันของฉัน</SelectItem>
          </SelectContent>
        </Select>
        {isCustomOrigin && (
          <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-xs text-accent">
            <Crosshair className="size-3.5 shrink-0" />
            <span className="min-w-0">
              {values.originLat !== 0 || values.originLng !== 0
                ? `พิกัด ${values.originLat.toFixed(4)}, ${values.originLng.toFixed(4)}`
                : "กำลังขอตำแหน่ง… กรุณาอนุญาตการเข้าถึงตำแหน่ง"}
            </span>
          </div>
        )}
      </div>

      {/* Destination hospital */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-accent/10 text-accent">
            <HospitalIcon className="size-3.5" />
          </span>
          <Label htmlFor="route-hospital" className="text-sm font-semibold">
            โรงพยาบาลปลายทาง
          </Label>
        </div>
        <Select
          value={values.hospitalId}
          onValueChange={(value) => onChange({ hospitalId: value })}
          disabled={hospitalsLoading || hospitals.length === 0}
        >
          <SelectTrigger id="route-hospital" data-ocid="route.hospital.select">
            <SelectValue
              placeholder={
                hospitalsLoading
                  ? "กำลังโหลดโรงพยาบาล…"
                  : hospitals.length === 0
                    ? "ยังไม่มีโรงพยาบาลในระบบ"
                    : "เลือกโรงพยาบาลปลายทาง"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {hospitals.map((hospital) => (
              <SelectItem key={hospital.id} value={hospital.id}>
                {hospital.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Blood group chips */}
      <div className="flex flex-col gap-3">
        <Label className="text-sm font-semibold">หมู่เลือดที่ต้องการ</Label>
        <div
          className="grid grid-cols-4 gap-2"
          role="radiogroup"
          aria-label="หมู่เลือดที่ต้องการ"
          data-ocid="route.blood_group.radio"
        >
          {BLOOD_GROUPS.map((group) => {
            const selected = values.bloodGroup === group;
            return (
              <label
                key={group}
                data-ocid={`route.blood_group.${group}`}
                className={cn(
                  "flex h-11 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-smooth has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2",
                  selected
                    ? "border-primary bg-primary text-primary-foreground shadow-crimson"
                    : "border-input bg-card text-foreground hover:border-primary/40 hover:bg-primary/5",
                )}
              >
                <input
                  type="radio"
                  name="blood-group"
                  value={group}
                  checked={selected}
                  onChange={() => onChange({ bloodGroup: group })}
                  className="sr-only"
                />
                {bloodGroupLabel(group)}
              </label>
            );
          })}
        </div>
      </div>

      {/* Units */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="route-units" className="text-sm font-semibold">
          จำนวนยูนิต
        </Label>
        <Input
          id="route-units"
          type="number"
          min={1}
          max={999}
          inputMode="numeric"
          value={values.units}
          onChange={(event) => {
            const next = Number.parseInt(event.target.value, 10);
            onChange({ units: Number.isNaN(next) ? 0 : next });
          }}
          data-ocid="route.units.input"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={!canSubmit || isSubmitting}
        className="w-full gap-2 rounded-lg"
        data-ocid="route.submit_button"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            กำลังคำนวณเส้นทาง…
          </>
        ) : (
          "คำนวณเส้นทาง"
        )}
      </Button>
    </form>
  );
}
