import type {
  backendInterface,
  BloodGroup,
  BloodRequest,
  Hospital,
  Profile,
  RequestStatus,
  RouteResult,
  UserRole,
} from "../backend";

const GROUPS: BloodGroup[] = [
  "APos",
  "ANeg",
  "BPos",
  "BNeg",
  "ABPos",
  "ABNeg",
  "OPos",
  "ONeg",
] as BloodGroup[];

function stock(units: number[]) {
  return GROUPS.map((bloodGroup, i) => ({
    bloodGroup,
    units: BigInt(units[i] ?? 0),
  }));
}

const HOSPITALS: Hospital[] = [
  {
    id: "siriraj",
    name: "โรงพยาบาลศิริราช",
    address: "2 ถนนวังหลัง แขวงศิริราช เขตบางกอกน้อย กรุงเทพฯ 10700",
    lat: 13.7563,
    lng: 100.4859,
    stock: stock([12, 4, 9, 3, 5, 2, 18, 6]),
  },
  {
    id: "chula",
    name: "โรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย",
    address: "1873 ถนนพระรามที่ 4 แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ 10330",
    lat: 13.7324,
    lng: 100.5352,
    stock: stock([15, 5, 11, 4, 6, 2, 20, 7]),
  },
  {
    id: "ramathibodi",
    name: "โรงพยาบาลรามาธิบดี",
    address: "270 ถนนพระรามที่ 6 แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพฯ 10400",
    lat: 13.7669,
    lng: 100.5294,
    stock: stock([8, 3, 7, 2, 4, 1, 14, 5]),
  },
  {
    id: "sirindhorn",
    name: "โรงพยาบาลสิรินธร",
    address: "90 ถนนสิรินธร แขวงบางพลัด เขตบางพลัด กรุงเทพฯ 10700",
    lat: 13.7819,
    lng: 100.5086,
    stock: stock([6, 2, 5, 2, 3, 1, 10, 4]),
  },
];

const REQUESTS: BloodRequest[] = [
  {
    id: 1n,
    status: "Pending" as RequestStatus,
    originName: "ศูนย์บริการโลหิตแห่งชาติ สภากาชาดไทย",
    hospitalId: "siriraj",
    hospitalName: "โรงพยาบาลศิริราช",
    bloodGroup: "APos" as BloodGroup,
    units: 3n,
    distanceMeters: 4200n,
    durationSeconds: 900n,
    geometry: "",
    originLat: 13.7307,
    originLng: 100.5231,
    createdAt: 1_700_000_000_000_000_000n,
    updatedAt: 1_700_000_000_000_000_000n,
  },
  {
    id: 2n,
    status: "InTransit" as RequestStatus,
    originName: "คลังเลือด โรงพยาบาลศิริราช",
    hospitalId: "chula",
    hospitalName: "โรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย",
    bloodGroup: "OPos" as BloodGroup,
    units: 5n,
    distanceMeters: 6800n,
    durationSeconds: 1500n,
    geometry: "",
    originLat: 13.7563,
    originLng: 100.4859,
    createdAt: 1_700_100_000_000_000_000n,
    updatedAt: 1_700_200_000_000_000_000n,
  },
  {
    id: 3n,
    status: "Delivered" as RequestStatus,
    originName: "ศูนย์บริการโลหิตแห่งชาติ สภากาชาดไทย",
    hospitalId: "ramathibodi",
    hospitalName: "โรงพยาบาลรามาธิบดี",
    bloodGroup: "BNeg" as BloodGroup,
    units: 2n,
    distanceMeters: 3100n,
    durationSeconds: 720n,
    geometry: "",
    originLat: 13.7307,
    originLng: 100.5231,
    createdAt: 1_700_300_000_000_000_000n,
    updatedAt: 1_700_400_000_000_000_000n,
  },
];

const PROFILE: Profile = {
  displayName: "แอนนา วิน",
  organizationName: "ศูนย์บริการโลหิตแห่งชาติ",
};

export const mockBackend: backendInterface = {
  __accessControlState: async () => ({}),
  __hospitals: async () => ({}),
  __requests: async () => ({}),
  __state: async () => ({}),
  __userProfiles: async () => ({}),
  _initialize_access_control: async () => undefined,
  _internet_identity_sign_in_finish: async () => ({ __kind__: "ok", ok: null }),
  _internet_identity_sign_in_start: async () => new Uint8Array(),
  assignCallerUserRole: async () => undefined,
  computeRoute: async (request): Promise<RouteResult> => {
    const hospital = HOSPITALS.find((h) => h.id === request.hospitalId);
    const available =
      hospital?.stock.find((s) => s.bloodGroup === request.bloodGroup)?.units ??
      0n;
    return {
      stockSufficient: available >= request.units,
      destLat: hospital?.lat ?? 13.7563,
      destLng: hospital?.lng ?? 100.5018,
      bloodGroup: request.bloodGroup,
      durationSeconds: 1200n,
      units: request.units,
      availableUnits: available,
      geometry: "",
      distanceMeters: 5200n,
      originLat: request.originLat,
      originLng: request.originLng,
    };
  },
  createRequest: async () => 4n,
  deleteHospital: async () => undefined,
  deleteRequest: async () => undefined,
  execute: async () => ({ hasMore: false, rows: [] }),
  getApiDoc: async () => "BloodRoute API",
  getCallerUserRole: async () => "admin" as UserRole,
  getHospital: async (id) => HOSPITALS.find((h) => h.id === id) ?? null,
  getProfile: async () => PROFILE,
  getRequest: async (id) => REQUESTS.find((r) => r.id === id) ?? null,
  isCallerAdmin: async () => true,
  listHospitals: async () => HOSPITALS,
  listRequests: async () => REQUESTS,
  schema: async () => "{}",
  searchHospitals: async (term) =>
    HOSPITALS.filter((h) => h.name.includes(term) || h.address.includes(term)),
  setProfile: async () => undefined,
  transform: async (input) => input.response,
  updateRequestStatus: async () => undefined,
  upsertHospital: async () => undefined,
};
