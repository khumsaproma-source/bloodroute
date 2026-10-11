import { HospitalCard } from "@/components/HospitalCard";
import { HospitalDetailDialog } from "@/components/HospitalDetailDialog";
import { HospitalMap } from "@/components/HospitalMap";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useListHospitals } from "@/hooks/useQueries";
import type { Hospital } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Building2, MapPin, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

export function MapPage() {
  const { data: hospitals, isLoading, isError } = useListHospitals();
  const navigate = useNavigate({ from: "/" });
  const { q: search = "" } = useSearch({ from: "/" });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function setSearch(value: string) {
    void navigate({
      to: "/",
      search: (prev) => ({ ...prev, q: value || undefined }),
      replace: true,
    });
  }

  const allHospitals = useMemo(() => hospitals ?? [], [hospitals]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allHospitals;
    return allHospitals.filter(
      (hospital) =>
        hospital.name.toLowerCase().includes(term) ||
        hospital.address.toLowerCase().includes(term),
    );
  }, [allHospitals, search]);

  const selectedHospital = useMemo(
    () => allHospitals.find((h) => h.id === selectedId) ?? null,
    [allHospitals, selectedId],
  );

  function handleSelect(hospital: Hospital) {
    setSelectedId(hospital.id);
    setDialogOpen(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-6 lg:px-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          แผนที่โรงพยาบาล
        </h1>
        <p className="text-sm text-muted-foreground">
          ค้นหาโรงพยาบาลและตรวจสอบปริมาณเลือดคงคลังทั้ง 8 กลุ่ม
        </p>
      </header>

      <div className="grid h-[calc(100vh-13rem)] min-h-[520px] grid-cols-1 gap-4 lg:grid-cols-[380px_1fr]">
        {/* Sidebar: search + hospital list */}
        <aside className="flex min-h-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ค้นหาชื่อหรือที่อยู่โรงพยาบาล"
              className="pl-9 pr-9"
              aria-label="ค้นหาโรงพยาบาล"
              data-ocid="hospital.search_input"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="ล้างคำค้นหา"
                className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                data-ocid="hospital.clear_button"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>โรงพยาบาลทั้งหมด</span>
            <span className="font-mono tabular-nums">
              {filtered.length}/{allHospitals.length}
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
            {isLoading ? (
              <div
                className="flex flex-col gap-2"
                data-ocid="hospital.loading_state"
              >
                {Array.from(
                  { length: 5 },
                  (_, i) => `hospital-skeleton-${i}`,
                ).map((id) => (
                  <Skeleton key={id} className="h-28 w-full rounded-lg" />
                ))}
              </div>
            ) : isError ? (
              <div
                className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-destructive/40 bg-destructive/5 px-4 py-10 text-center"
                data-ocid="hospital.error_state"
              >
                <p className="text-sm font-medium text-destructive">
                  โหลดข้อมูลโรงพยาบาลไม่สำเร็จ
                </p>
                <p className="text-xs text-muted-foreground">
                  กรุณาลองรีเฟรชหน้าอีกครั้ง
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/40 px-4 py-10 text-center"
                data-ocid="hospital.empty_state"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <Building2 className="size-5" />
                </span>
                <p className="text-sm font-medium">
                  {allHospitals.length === 0
                    ? "ยังไม่มีข้อมูลโรงพยาบาล"
                    : "ไม่พบโรงพยาบาลที่ตรงกับคำค้นหา"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {allHospitals.length === 0
                    ? "เพิ่มโรงพยาบาลได้ที่หน้า จัดการโรงพยาบาล"
                    : "ลองใช้คำค้นหาอื่น หรือล้างคำค้นหา"}
                </p>
              </div>
            ) : (
              filtered.map((hospital, index) => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  index={index}
                  selected={hospital.id === selectedId}
                  onSelect={handleSelect}
                />
              ))
            )}
          </div>
        </aside>

        {/* Map panel */}
        <section className="relative min-h-[420px] overflow-hidden rounded-xl border border-border bg-card shadow-sm lg:min-h-0">
          {" "}
          {isLoading ? (
            <div
              className="flex size-full items-center justify-center bg-secondary/40"
              data-ocid="hospital.map_loading_state"
            >
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <MapPin className="size-6 animate-pulse" />
                <p className="text-sm">กำลังโหลดแผนที่…</p>
              </div>
            </div>
          ) : allHospitals.length === 0 ? (
            <div
              className="flex size-full items-center justify-center bg-secondary/40"
              data-ocid="hospital.map_empty_state"
            >
              <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
                <MapPin className="size-6" />
                <p className="text-sm font-medium">ยังไม่มีโรงพยาบาลบนแผนที่</p>
                <p className="text-xs">เพิ่มโรงพยาบาลเพื่อแสดงตำแหน่งบนแผนที่</p>
              </div>
            </div>
          ) : (
            <HospitalMap
              hospitals={filtered}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          )}
        </section>
      </div>

      <HospitalDetailDialog
        hospital={selectedHospital}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
