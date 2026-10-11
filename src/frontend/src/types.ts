// Shared frontend types re-exported from the generated backend bindings.
// Value exports (enums) must be re-exported as values so pages can use
// `BloodGroup.APos` and `RequestStatus.Pending` in switches and comparisons.

export { BloodGroup, RequestStatus, UserRole } from "./backend";

export type {
  BloodRequest,
  BloodRequestInput,
  BloodStock,
  Hospital,
  HospitalInput,
  Profile,
  RouteRequest,
  RouteResult,
  Timestamp,
} from "./backend";
