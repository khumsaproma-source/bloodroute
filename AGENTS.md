# Project Guidance

## User Preferences

- แอปพลิเคชันภาษาไทย (Thai-language UI)
- เน้นการคำนวณเส้นทางส่งเลือดไปยังโรงพยาบาลที่ผู้ป่วยต้องการเลือด

## Verified Commands

[Filled after first successful build]

## Learnings

- The project uses @tanstack/react-router; persist filter state via a route's validateSearch plus useSearch/useNavigate with a functional search updater.
- Leaflet tile URL must include all three placeholders {z}/{x}/{y}; omitting {y} silently breaks tile loading.
- The Leaflet CDN global is typed via a module-scoped declare namespace in src/types/leaflet.d.ts, so bare L.* types do not resolve in module scope; use typeof window.L and ReturnType<typeof window.L.map>.
- Client-generated entity ids must be non-empty (crypto.randomUUID()); an empty id collides on the backend Map key and overwrites prior records.
- The project's biome config only processes paths when run from src/frontend.
- In an enhanced migration chain, the migration's OldActor/Old* types must match the frozen previous version exactly (use Time.Time for old timestamps).
- M0230 unresolved `_toRow` for a record field that is a variant or an array of records is fixed by importing the custom `<Type>Value` module top-level in the file that declares the OQL entity.
- Motoko has no triple-quoted strings; Time.now() is Int; Float math is module-call style; the IC outcall transform must be a public query func.
- The mock backend must implement every method of the generated backendInterface, including __-prefixed debug methods and _internet_identity_sign_in_*.
