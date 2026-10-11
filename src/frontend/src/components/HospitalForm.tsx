import { StockEditor } from "@/components/StockEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BLOOD_GROUPS } from "@/lib/blood";
import type { BloodStock, Hospital, HospitalInput } from "@/types";
import { Building2, Save, X } from "lucide-react";
import { useState } from "react";

interface HospitalFormProps {
  /** Existing hospital when editing, or null when creating. */
  hospital: Hospital | null;
  onSubmit: (input: HospitalInput) => void;
  onCancel: () => void;
  isPending: boolean;
  isError: boolean;
}

/** Build a full 8-group stock array from an existing hospital. */
function stockFrom(hospital: Hospital | null): BloodStock[] {
  return BLOOD_GROUPS.map((group) => ({
    bloodGroup: group,
    units:
      hospital?.stock.find((entry) => entry.bloodGroup === group)?.units ?? 0n,
  }));
}

/**
 * Create/edit form for a hospital. Owns its draft in local state and only
 * resets when the user submits or cancels.
 */
export function HospitalForm({
  hospital,
  onSubmit,
  onCancel,
  isPending,
  isError,
}: HospitalFormProps) {
  const [name, setName] = useState(hospital?.name ?? "");
  const [address, setAddress] = useState(hospital?.address ?? "");
  const [lat, setLat] = useState(hospital ? String(hospital.lat) : "");
  const [lng, setLng] = useState(hospital ? String(hospital.lng) : "");
  const [stock, setStock] = useState<BloodStock[]>(() => stockFrom(hospital));

  const isEditing = hospital !== null;
  const latValue = Number.parseFloat(lat);
  const lngValue = Number.parseFloat(lng);
  const isValid =
    name.trim().length > 0 &&
    address.trim().length > 0 &&
    Number.isFinite(latValue) &&
    Number.isFinite(lngValue);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;
    onSubmit({
      id: hospital?.id ?? crypto.randomUUID(),
      name: name.trim(),
      address: address.trim(),
      lat: latValue,
      lng: lngValue,
      stock,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 shadow-sm"
      data-ocid="hospital.form"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Building2 className="size-4" />
        </span>
        <div>
          <h2 className="font-display text-base font-semibold">
            {isEditing ? "แก้ไขโรงพยาบาล" : "เพิ่มโรงพยาบาลใหม่"}
          </h2>
          <p className="text-xs text-muted-foreground">
            ระบุข้อมูลที่ตั้งและปริมาณเลือดคงคลังของโรงพยาบาล
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="hospital-name">ชื่อโรงพยาบาล</Label>
          <Input
            id="hospital-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="เช่น โรงพยาบาลศิริราช"
            required
            data-ocid="hospital.name_input"
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="hospital-address">ที่อยู่</Label>
          <Input
            id="hospital-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="เช่น 2 ถนนวังหลัง แขวงศิริราช เขตบางกอกน้อย กรุงเทพฯ"
            required
            data-ocid="hospital.address_input"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="hospital-lat">ละติจูด</Label>
          <Input
            id="hospital-lat"
            type="number"
            step="any"
            value={lat}
            onChange={(event) => setLat(event.target.value)}
            placeholder="13.7563"
            required
            className="font-mono"
            data-ocid="hospital.lat_input"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="hospital-lng">ลองจิจูด</Label>
          <Input
            id="hospital-lng"
            type="number"
            step="any"
            value={lng}
            onChange={(event) => setLng(event.target.value)}
            placeholder="100.5018"
            required
            className="font-mono"
            data-ocid="hospital.lng_input"
          />
        </div>
      </div>

      <StockEditor stock={stock} onChange={setStock} />

      {isError && (
        <p
          className="text-sm text-destructive"
          data-ocid="hospital.error_state"
        >
          บันทึกไม่สำเร็จ กรุณาตรวจสอบข้อมูลแล้วลองอีกครั้ง
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          data-ocid="hospital.cancel_button"
        >
          <X className="size-4" />
          ยกเลิก
        </Button>
        <Button
          type="submit"
          disabled={isPending || !isValid}
          data-ocid="hospital.submit_button"
        >
          <Save className="size-4" />
          {isPending ? "กำลังบันทึก…" : isEditing ? "บันทึกการแก้ไข" : "เพิ่มโรงพยาบาล"}
        </Button>
      </div>
    </form>
  );
}
