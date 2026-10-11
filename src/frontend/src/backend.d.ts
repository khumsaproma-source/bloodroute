import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BloodRequest {
    id: bigint;
    status: RequestStatus;
    originName: string;
    createdAt: Timestamp;
    hospitalId: string;
    updatedAt: Timestamp;
    bloodGroup: BloodGroup;
    durationSeconds: bigint;
    units: bigint;
    hospitalName: string;
    geometry: string;
    distanceMeters: bigint;
    originLat: number;
    originLng: number;
}
export interface BloodRequestInput {
    originName: string;
    hospitalId: string;
    bloodGroup: BloodGroup;
    durationSeconds: bigint;
    units: bigint;
    hospitalName: string;
    geometry: string;
    distanceMeters: bigint;
    originLat: number;
    originLng: number;
}
export interface BloodStock {
    bloodGroup: BloodGroup;
    units: bigint;
}
export interface Cell {
    value: Value;
    name: string;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface Hospital {
    id: string;
    lat: number;
    lng: number;
    name: string;
    stock: Array<BloodStock>;
    address: string;
}
export interface HospitalInput {
    id: string;
    lat: number;
    lng: number;
    name: string;
    stock: Array<BloodStock>;
    address: string;
}
export interface HttpHeader {
    value: string;
    name: string;
}
export interface HttpRequestResult {
    status: bigint;
    body: Uint8Array;
    headers: Array<HttpHeader>;
}
export interface Profile {
    organizationName: string;
    displayName: string;
}
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface RouteRequest {
    originName: string;
    hospitalId: string;
    bloodGroup: BloodGroup;
    units: bigint;
    originId: string;
    originLat: number;
    originLng: number;
}
export interface RouteResult {
    stockSufficient: boolean;
    destLat: number;
    destLng: number;
    bloodGroup: BloodGroup;
    durationSeconds: bigint;
    units: bigint;
    availableUnits: bigint;
    geometry: string;
    distanceMeters: bigint;
    originLat: number;
    originLng: number;
}
export type Timestamp = bigint;
export interface TransformationInput {
    context: Uint8Array;
    response: HttpRequestResult;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<HttpHeader>;
}
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum BloodGroup {
    ANeg = "ANeg",
    APos = "APos",
    BNeg = "BNeg",
    BPos = "BPos",
    ONeg = "ONeg",
    OPos = "OPos",
    ABNeg = "ABNeg",
    ABPos = "ABPos"
}
export enum RequestStatus {
    InTransit = "InTransit",
    Delivered = "Delivered",
    Pending = "Pending"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    computeRoute(request: RouteRequest): Promise<RouteResult>;
    createRequest(input: BloodRequestInput): Promise<bigint>;
    deleteHospital(id: string): Promise<void>;
    deleteRequest(id: bigint): Promise<void>;
    execute(qJson: string): Promise<Result>;
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    getHospital(id: string): Promise<Hospital | null>;
    getProfile(): Promise<Profile | null>;
    getRequest(id: bigint): Promise<BloodRequest | null>;
    isCallerAdmin(): Promise<boolean>;
    listHospitals(): Promise<Array<Hospital>>;
    listRequests(): Promise<Array<BloodRequest>>;
    schema(): Promise<string>;
    searchHospitals(term: string): Promise<Array<Hospital>>;
    setProfile(displayName: string, organizationName: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateRequestStatus(id: bigint, status: RequestStatus): Promise<void>;
    upsertHospital(input: HospitalInput): Promise<void>;
}
