import { BloodGroup, RequestStatus } from "@/backend";

/** Thai display label for a backend blood-group variant, e.g. `APos` → "A+". */
export const BLOOD_GROUP_LABEL: Record<BloodGroup, string> = {
  [BloodGroup.APos]: "A+",
  [BloodGroup.ANeg]: "A-",
  [BloodGroup.BPos]: "B+",
  [BloodGroup.BNeg]: "B-",
  [BloodGroup.ABPos]: "AB+",
  [BloodGroup.ABNeg]: "AB-",
  [BloodGroup.OPos]: "O+",
  [BloodGroup.ONeg]: "O-",
};

/** Ordered list of every blood group for pickers and stock tables. */
export const BLOOD_GROUPS: BloodGroup[] = [
  BloodGroup.APos,
  BloodGroup.ANeg,
  BloodGroup.BPos,
  BloodGroup.BNeg,
  BloodGroup.ABPos,
  BloodGroup.ABNeg,
  BloodGroup.OPos,
  BloodGroup.ONeg,
];

/**
 * Semantic color token per blood group. Crimson family for the common
 * positive groups, teal for the rarer negative groups, so a stock table
 * reads at a glance without inventing a new palette.
 */
export const BLOOD_GROUP_COLOR: Record<BloodGroup, string> = {
  [BloodGroup.APos]: "text-primary bg-primary/10 border-primary/20",
  [BloodGroup.ANeg]: "text-accent bg-accent/10 border-accent/20",
  [BloodGroup.BPos]: "text-primary bg-primary/10 border-primary/20",
  [BloodGroup.BNeg]: "text-accent bg-accent/10 border-accent/20",
  [BloodGroup.ABPos]: "text-primary bg-primary/10 border-primary/20",
  [BloodGroup.ABNeg]: "text-accent bg-accent/10 border-accent/20",
  [BloodGroup.OPos]: "text-primary bg-primary/10 border-primary/20",
  [BloodGroup.ONeg]: "text-accent bg-accent/10 border-accent/20",
};

/** Thai label for a request status. */
export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  [RequestStatus.Pending]: "รอดำเนินการ",
  [RequestStatus.InTransit]: "กำลังขนส่ง",
  [RequestStatus.Delivered]: "ส่งถึงแล้ว",
};

/** Badge classes for a request status. */
export const REQUEST_STATUS_COLOR: Record<RequestStatus, string> = {
  [RequestStatus.Pending]: "bg-warning/15 text-warning border-warning/30",
  [RequestStatus.InTransit]: "bg-accent/15 text-accent border-accent/30",
  [RequestStatus.Delivered]: "bg-success/15 text-success border-success/30",
};

/** Short Thai label for a blood group, used in compact badges. */
export function bloodGroupLabel(group: BloodGroup): string {
  return BLOOD_GROUP_LABEL[group];
}

/** Badge classes for a blood group. */
export function bloodGroupColor(group: BloodGroup): string {
  return BLOOD_GROUP_COLOR[group];
}

/** Thai label for a request status. */
export function requestStatusLabel(status: RequestStatus): string {
  return REQUEST_STATUS_LABEL[status];
}

/** Badge classes for a request status. */
export function requestStatusColor(status: RequestStatus): string {
  return REQUEST_STATUS_COLOR[status];
}
