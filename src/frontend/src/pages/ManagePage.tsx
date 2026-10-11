import { HospitalForm } from "@/components/HospitalForm";
import { ManageTable } from "@/components/ManageTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteHospital,
  useListHospitals,
  useUpsertHospital,
} from "@/hooks/useQueries";
import type { Hospital, HospitalInput } from "@/types";
import { Building2, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";

const SKELETON_IDS = Array.from({ length: 4 }, (_, i) => `skeleton-${i}`);

export function ManagePage() {
  const { data: hospitals, isLoading, isError, refetch } = useListHospitals();
  const upsertHospital = useUpsertHospital();
  const deleteHospital = useDeleteHospital();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Hospital | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Hospital | null>(null);

  const list = hospitals ?? [];

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(hospital: Hospital) {
    setEditing(hospital);
    setFormOpen(true);
  }

  function handleSubmit(input: HospitalInput) {
    upsertHospital.mutate(input, {
      onSuccess: () => {
        setFormOpen(false);
        setEditing(null);
      },
    });
  }

  function handleConfirmDelete() {
    if (!pendingDelete) return;
    deleteHospital.mutate(pendingDelete.id, {
      onSuccess: () => setPendingDelete(null),
    });
  }

  return (
    <div
      className="mx-auto w-full max-w-[1600px] px-4 py-8 lg:px-6"
      data-ocid="manage.page"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            จัดการโรงพยาบาล
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            เพิ่ม แก้ไข และลบโรงพยาบาลพร้อมปริมาณเลือดคงคลังทั้ง 8 กลุ่ม
          </p>
        </div>
        <Button
          type="button"
          onClick={openCreate}
          className="gap-2"
          data-ocid="hospital.open_modal_button"
        >
          <Plus className="size-4" />
          เพิ่มโรงพยาบาล
        </Button>
      </div>

      {formOpen && (
        <div className="mt-6">
          <HospitalForm
            key={editing?.id ?? "new"}
            hospital={editing}
            onSubmit={handleSubmit}
            onCancel={() => {
              setFormOpen(false);
              setEditing(null);
            }}
            isPending={upsertHospital.isPending}
            isError={upsertHospital.isError}
          />
        </div>
      )}

      <div className="mt-6">
        {isLoading ? (
          <div
            className="flex flex-col gap-2"
            data-ocid="hospital.loading_state"
          >
            {SKELETON_IDS.map((id) => (
              <Skeleton key={id} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center"
            data-ocid="hospital.error_state"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <RefreshCw className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold">
                โหลดข้อมูลไม่สำเร็จ
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                เกิดข้อผิดพลาดในการดึงข้อมูลโรงพยาบาล
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => void refetch()}
              data-ocid="hospital.retry_button"
            >
              <RefreshCw className="size-4" />
              ลองอีกครั้ง
            </Button>
          </div>
        ) : list.length === 0 ? (
          <div
            className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center"
            data-ocid="hospital.empty_state"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Building2 className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold">
                ยังไม่มีโรงพยาบาลในระบบ
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                เริ่มต้นด้วยการเพิ่มโรงพยาบาลและปริมาณเลือดคงคลัง
              </p>
            </div>
            <Button
              type="button"
              onClick={openCreate}
              className="gap-2"
              data-ocid="hospital.empty_add_button"
            >
              <Plus className="size-4" />
              เพิ่มโรงพยาบาล
            </Button>
          </div>
        ) : (
          <ManageTable
            hospitals={list}
            onEdit={openEdit}
            onDelete={setPendingDelete}
          />
        )}
      </div>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent data-ocid="hospital.delete_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบโรงพยาบาล</AlertDialogTitle>
            <AlertDialogDescription>
              ต้องการลบ &ldquo;{pendingDelete?.name}&rdquo; ออกจากระบบใช่หรือไม่
              การลบจะไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteHospital.isError && (
            <p
              className="text-sm text-destructive"
              data-ocid="hospital.delete_error_state"
            >
              ลบไม่สำเร็จ กรุณาลองอีกครั้ง
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="hospital.delete_cancel_button">
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleConfirmDelete();
              }}
              disabled={deleteHospital.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="hospital.delete_confirm_button"
            >
              {deleteHospital.isPending ? "กำลังลบ…" : "ลบโรงพยาบาล"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
