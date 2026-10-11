import Map "mo:core/Map";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Common "../types/common";
import HospitalTypes "../types/hospitals";
import RouteTypes "../types/routes";

module {
  // OSRM public routing API. The route is bounded server-side by the two
  // coordinate pairs in the path, so the response stays small.
  let osrmBase = "https://router.project-osrm.org/route/v1/driving/";

  public func getStock(hospital : HospitalTypes.Hospital, bloodGroup : Common.BloodGroup) : Nat {
    var units = 0;
    for (s in hospital.stock.values()) {
      if (s.bloodGroup == bloodGroup) {
        units := s.units;
      };
    };
    units;
  };

  // Straight-line fallback so the UI never breaks when the outcall fails.
  func toRadians(deg : Float) : Float {
    deg * Float.pi / 180.0;
  };

  func haversineMeters(lat1 : Float, lng1 : Float, lat2 : Float, lng2 : Float) : Nat {
    let r = 6371000.0;
    let dLat = toRadians(lat2 - lat1);
    let dLng = toRadians(lng2 - lng1);
    let a = Float.sin(dLat / 2.0) * Float.sin(dLat / 2.0)
      + Float.cos(toRadians(lat1)) * Float.cos(toRadians(lat2)) * Float.sin(dLng / 2.0) * Float.sin(dLng / 2.0);
    let c = 2.0 * Float.arctan2(Float.sqrt(a), Float.sqrt(1.0 - a));
    (r * c).toInt().toNat();
  };

  func parseRoute(body : Text) : ?(Nat, Nat, Text) {
    // Expected OSRM shape: {"code":"Ok","routes":[{"distance":4262,"duration":424.4,"geometry":"..."}]}
    let parts = body.split(#text "\"distance\":");
    ignore parts.next();
    let afterDistance = parts.next() ?? return null;
    let distanceText = (afterDistance.split(#text ",").next() ?? return null);
    let distance = distanceText.toNat() ?? return null;

    let durationParts = body.split(#text "\"duration\":");
    ignore durationParts.next();
    let afterDuration = durationParts.next() ?? return null;
    let durationText = (afterDuration.split(#text ",").next() ?? return null);
    let durationWhole = (durationText.split(#text ".").next() ?? return null);
    let duration = durationWhole.toNat() ?? return null;

    let geometryParts = body.split(#text "\"geometry\":\"");
    ignore geometryParts.next();
    let afterGeometry = geometryParts.next() ?? return null;
    let geometry = (afterGeometry.split(#text "\"").next() ?? return null);

    ?(distance, duration, geometry);
  };

  func fetchOsrm(originLat : Float, originLng : Float, destLat : Float, destLng : Float, transform : OutCall.Transform) : async ?(Nat, Nat, Text) {
    let url = osrmBase
      # originLng.toText() # "," # originLat.toText()
      # ";" # destLng.toText() # "," # destLat.toText()
      # "?overview=full&geometries=polyline";
    try {
      let body = await OutCall.httpGetRequest(url, [], transform);
      parseRoute(body);
    } catch (_) {
      null;
    };
  };

  public func computeRoute(
    hospitals : Map.Map<Text, HospitalTypes.Hospital>,
    request : RouteTypes.RouteRequest,
    transform : OutCall.Transform,
  ) : async RouteTypes.RouteResult {
    let hospital = hospitals.get(request.hospitalId)
      ?? Runtime.trap("Hospital not found: " # request.hospitalId);

    let availableUnits = getStock(hospital, request.bloodGroup);
    let stockSufficient = availableUnits >= request.units;

    let road = await fetchOsrm(request.originLat, request.originLng, hospital.lat, hospital.lng, transform);

    let (distanceMeters, durationSeconds, geometry) = switch (road) {
      case (?(d, t, g)) { (d, t, g) };
      case null {
        let d = haversineMeters(request.originLat, request.originLng, hospital.lat, hospital.lng);
        (d, 0, "");
      };
    };

    {
      distanceMeters;
      durationSeconds;
      geometry;
      originLat = request.originLat;
      originLng = request.originLng;
      destLat = hospital.lat;
      destLng = hospital.lng;
      bloodGroup = request.bloodGroup;
      units = request.units;
      stockSufficient;
      availableUnits;
    };
  };
};
