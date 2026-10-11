import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BLOOD_GROUPS, bloodGroupColor, bloodGroupLabel } from "@/lib/blood";
import type { Hospital } from "@/types";
import { Building2, Pencil, Trash2 } from "lucide-react";

interface ManageTableProps {
  hospitals: Hospital[];
  onEdit: (hospital: Hospital) => void;
  onDelete: (hospital: Hospital) => void;
}

/** Total units across all 8 blood groups for a hospital. */
function totalUnits(hospital: Hospital): bigint {
  return BLOOD_GROUPS.reduce(
    (sum, group) =>
      sum +
      (hospital.stock.find((entry) => entry.bloodGroup === group)?.units ?? 0n),
    0n,
  );
}

/** Responsive hospital table with per-group stock and row actions. */
export function ManageTable({ hospitals, onEdit, onDelete }: ManageTableProps) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      data-ocid="hospital.table"
    >
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-secondary">
          <TableRow className="hover:bg-secondary">
            <TableHead className="px-4">โรงพยาบาล</TableHead>
            <TableHead className="hidden px-4 md:table-cell">ที่อยู่</TableHead>
            <TableHead className="hidden px-4 lg:table-cell">คลังเลือด</TableHead>
            <TableHead className="px-4 text-right">รวม</TableHead>
            <TableHead className="px-4 text-right">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hospitals.map((hospital, index) => (
            <TableRow key={hospital.id} data-ocid={`hospital.row.${index + 1}`}>
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {hospital.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground md:hidden">
                      {hospital.address}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="hidden max-w-xs px-4 py-3 text-muted-foreground md:table-cell">
                <span className="line-clamp-2 whitespace-normal">
                  {hospital.address}
                </span>
              </TableCell>

              <TableCell className="hidden px-4 py-3 lg:table-cell">
                <div className="flex flex-wrap gap-1">
                  {BLOOD_GROUPS.map((group) => {
                    const units =
                      hospital.stock.find((entry) => entry.bloodGroup === group)
                        ?.units ?? 0;
                    return (
                      <Badge
                        key={group}
                        variant="outline"
                        className={`gap-1 px-1.5 py-0 font-mono text-[11px] ${bloodGroupColor(group)}`}
                      >
                        <span className="font-semibold">
                          {bloodGroupLabel(group)}
                        </span>
                        <span className="tabular-nums opacity-80">{units}</span>
                      </Badge>
                    );
                  })}
                </div>
              </TableCell>

              <TableCell className="px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums">
                {Number(totalUnits(hospital)).toLocaleString("th-TH")}
              </TableCell>

              <TableCell className="px-4 py-3">
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(hospital)}
                    aria-label={`แก้ไข ${hospital.name}`}
                    data-ocid={`hospital.edit_button.${index + 1}`}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(hospital)}
                    aria-label={`ลบ ${hospital.name}`}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    data-ocid={`hospital.delete_button.${index + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
