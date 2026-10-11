import { useEffect, useRef } from "react";

/** Decode a Google-encoded polyline string into [lat, lng] pairs. */
export function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}

type LeafletGlobal = typeof window.L;
type LeafletMap = ReturnType<LeafletGlobal["map"]>;
type LeafletLayerGroup = ReturnType<LeafletGlobal["layerGroup"]>;
type LeafletDivIcon = ReturnType<LeafletGlobal["divIcon"]>;

/** Leaflet's polyline factory is not in the minimal CDN declaration. */
type PolylineFactory = (
  latlngs: [number, number][],
  options?: {
    color?: string;
    weight?: number;
    opacity?: number;
    dashArray?: string;
  },
) => ReturnType<LeafletGlobal["layerGroup"]>;

type LeafletWithPolyline = LeafletGlobal & {
  polyline: PolylineFactory;
};

type RouteMapProps = {
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  geometry: string;
  originName: string;
  destName: string;
};

function markerIcon(
  L: LeafletGlobal,
  color: string,
  glyph: string,
): LeafletDivIcon {
  return L.divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9999px;background:${color};color:#fff;font-size:14px;font-weight:700;box-shadow:0 4px 12px rgba(0,0,0,0.25);border:2px solid #fff">${glyph}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

export function RouteMap({
  originLat,
  originLng,
  destLat,
  destLng,
  geometry,
  originName,
  destName,
}: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LeafletLayerGroup | null>(null);

  // Initialize the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const L = window.L;
    if (!L) return;

    const map = L.map(containerRef.current, {
      center: [13.7563, 100.5018],
      zoom: 11,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Redraw markers and route whenever inputs change.
  useEffect(() => {
    const L = window.L as LeafletWithPolyline | undefined;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!L || !map || !layer) return;

    layer.clearLayers();

    const origin: [number, number] = [originLat, originLng];
    const dest: [number, number] = [destLat, destLng];

    const decoded = geometry ? decodePolyline(geometry) : [];
    const path: [number, number][] =
      decoded.length > 1 ? decoded : [origin, dest];

    const originMarker = L.marker(origin, {
      icon: markerIcon(L, "#c8102e", "A"),
    });
    originMarker.bindPopup(originName || "จุดเริ่มต้น");
    layer.addLayer(originMarker);

    const destMarker = L.marker(dest, {
      icon: markerIcon(L, "#0d9488", "B"),
    });
    destMarker.bindPopup(destName || "โรงพยาบาลปลายทาง");
    layer.addLayer(destMarker);

    const routeLine = L.polyline(path, {
      color: "#c8102e",
      weight: 4,
      opacity: 0.85,
      dashArray: decoded.length > 1 ? undefined : "8 8",
    });
    layer.addLayer(routeLine);

    const bounds = L.latLngBounds([origin, dest]);
    for (const point of path) bounds.extend(point);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [originLat, originLng, destLat, destLng, geometry, originName, destName]);

  return (
    <div
      ref={containerRef}
      className="h-full min-h-[320px] w-full"
      data-ocid="route.map"
    />
  );
}
