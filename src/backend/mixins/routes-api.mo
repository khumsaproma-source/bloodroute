import Map "mo:core/Map";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import HospitalTypes "../types/hospitals";
import RouteTypes "../types/routes";
import RoutesLib "../lib/routes";

mixin (hospitals : Map.Map<Text, HospitalTypes.Hospital>) {
  // The IC requires a shared query transform to reach consensus on the response.
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    { input.response with headers = [] };
  };

  public shared ({ caller }) func computeRoute(request : RouteTypes.RouteRequest) : async RouteTypes.RouteResult {
    ignore caller;
    await RoutesLib.computeRoute(hospitals, request, transform);
  };
};
