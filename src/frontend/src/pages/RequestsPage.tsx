import { RequestDetailDialog } from "@/components/RequestDetailDialog";
import { RequestList } from "@/components/RequestList";
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
import {
  useDeleteRequest,
  useListRequests,
  useUpdateRequestStatus,
} from "@/hooks/useQueries";
import type { BloodRequest, RequestStatus } from "@/types";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Droplet, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";

export function RequestsPage() {
  const { data: requests, isLoading, isError, refetch } = useListRequests();
  const updateStatus = useUpdateRequestStatus();
  const deleteRequest = useDeleteRequest();

  const [selected, setSelected] = useState<BloodRequest | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<BloodRequest | null>(null);

  const list = requests ?? [];

  function openDetail(request: BloodRequest) {
    setSelected(request);
    setDetailOpen(true);
  }

  function handleStatusChange(status: RequestStatus) {
    if (!selected) return;
    updateStatus.mutate(
      { id: selected.id, status },
      {
        onSuccess: () =>
          setSelected((prev) => (prev ? { ...prev, status } : prev)),
      },
    );
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    deleteRequest.mutate(pendingDelete.id, {
      onSuccess: () => {
        setPendingDelete(null);
        setDetailOpen(false);
        setSelected(null);
      },
    });
  }

  return (
    <div
      className="mx-auto w-full max-w-[1200px] px-4 py-8 lg:px-6"
      data-ocid="request.page"
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Droplet className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              บันทึกคำขอเลือด
            </span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            คำขอเลือด
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ติดตามสถานะการขนส่งเลือดไปยังโรงพยาบาลที่ต้องการ
          </p>
        </div>
        <Button asChild data-ocid="request.primary_button">
          <Link to="/route">
            <Plus className="size-4" />
            สร้างคำขอใหม่
          </Link>
        </Button>
      </header>

      <section className="mt-6" data-ocid="request.section">
        {isError ? (
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center"
            data-ocid="request.error_state"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-7" />
            </span>
            <h2 className="font-display text-lg font-semibold">
              โหลดคำขอเลือดไม่สำเร็จ
            </h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => void refetch()}
              data-ocid="request.retry_button"
            >
              <RefreshCw className="size-4" />
              ลองใหม่
            </Button>
          </div>
        ) : (
          <RequestList
            requests={list}
            isLoading={isLoading}
            onOpen={openDetail}
            onDelete={setPendingDelete}
          />
        )}
      </section>

      <RequestDetailDialog
        request={selected}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onStatusChange={handleStatusChange}
        onDelete={() => {
          if (selected) setPendingDelete(selected);
        }}
        isUpdating={updateStatus.isPending}
        isDeleting={deleteRequest.isPending}
      />

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent data-ocid="request.modal">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              ยืนยันการลบคำขอเลือด
            </AlertDialogTitle>
            <AlertDialogDescription>
              คำขอไปยัง «{pendingDelete?.hospitalName}» จะถูกลบอย่างถาวร
              และไม่สามารถกู้คืนได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button" data-ocid="request.cancel_button">
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction
              type="button"
              onClick={confirmDelete}
              disabled={deleteRequest.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="request.confirm_button"
            >
              {deleteRequest.isPending ? "กำลังลบ…" : "ลบคำขอ"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
