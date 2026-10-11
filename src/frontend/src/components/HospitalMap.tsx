import type { Hospital } from "@/types";
import { useEffect, useRef } from "react";

interface HospitalMapProps {
  hospitals: Hospital[];
  selectedId: string | null;
  onSelect: (hospital: Hospital) => void;
}

const THAILAND_CENTER: [number, number] = [13.7563, 100.5018];
const DEFAULT_ZOOM = 6;

type LeafletMap = ReturnType<typeof window.L.map>;
type LeafletMarker = ReturnType<typeof window.L.marker>;

/** Build a crimson droplet div-icon for a hospital marker. */
function markerIcon(selected: boolean): ReturnType<typeof window.L.divIcon> {
  const size = selected ? 40 : 32;
  return window.L.divIcon({
    className: "bloodroute-marker",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:9999px 9999px 9999px 4px;transform:rotate(-45deg);background:${
      selected ? "oklch(0.5 0.2 22)" : "oklch(0.6 0.11 195)"
    };box-shadow:0 4px 12px -2px rgba(0,0,0,0.35);border:2px solid white;"><span style="transform:rotate(45deg);color:white;font-size:${
      selected ? 18 : 14
    }px;font-weight:700;">+</span></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

/** Interactive Leaflet map rendering a marker per hospital. */
export function HospitalMap({
  hospitals,
  selectedId,
  onSelect,
}: HospitalMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, LeafletMarker>>(new Map());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  // Initialize the map once.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current || !window.L) return;

    const map = window.L.map(container, {
      center: THAILAND_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
    });

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Leaflet needs a size recalculation once the container is laid out.
    const timer = window.setTimeout(() => {
      (map as unknown as { invalidateSize: () => void }).invalidateSize();
    }, 200);

    return () => {
      window.clearTimeout(timer);
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // Sync markers whenever the hospital list changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.L) return;

    const nextIds = new Set(hospitals.map((h) => h.id));

    for (const [id, marker] of markersRef.current) {
      if (!nextIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    }

    for (const hospital of hospitals) {
      if (markersRef.current.has(hospital.id)) continue;
      const marker = window.L.marker([hospital.lat, hospital.lng], {
        icon: markerIcon(false),
      }).addTo(map);
      marker.on("click", () => onSelectRef.current(hospital));
      markersRef.current.set(hospital.id, marker);
    }

    if (hospitals.length > 0) {
      const bounds = window.L.latLngBounds();
      for (const hospital of hospitals) {
        bounds.extend([hospital.lat, hospital.lng]);
      }
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 12 });
    }
  }, [hospitals]);

  // Reflect selection in marker styling and pan to the selected hospital.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const hospital of hospitals) {
      const marker = markersRef.current.get(hospital.id);
      if (!marker) continue;
      const isSelected = hospital.id === selectedId;
      (marker as unknown as { setIcon: (icon: unknown) => void }).setIcon(
        markerIcon(isSelected),
      );
      if (isSelected) {
        map.setView([hospital.lat, hospital.lng], Math.max(map.getZoom(), 11));
      }
    }
  }, [selectedId, hospitals]);

  return (
    <div
      ref={containerRef}
      className="size-full"
      data-ocid="hospital.map"
      aria-label="แผนที่โรงพยาบาล"
    />
  );
}
