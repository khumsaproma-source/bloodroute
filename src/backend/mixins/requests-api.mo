import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Common "../types/common";
import RequestTypes "../types/requests";
import RequestsLib "../lib/requests";

mixin (requests : Map.Map<Nat, RequestTypes.BloodRequest>, state : { var nextRequestId : Nat }) {
  public query func listRequests() : async [RequestTypes.BloodRequest] {
    RequestsLib.listRequests(requests);
  };

  public query func getRequest(id : Nat) : async ?RequestTypes.BloodRequest {
    RequestsLib.getRequest(requests, id);
  };

  public shared ({ caller }) func createRequest(input : RequestTypes.BloodRequestInput) : async Nat {
    ignore caller;
    RequestsLib.createRequest(requests, state, input);
  };

  public shared ({ caller }) func updateRequestStatus(id : Nat, status : Common.RequestStatus) : async () {
    ignore caller;
    RequestsLib.updateRequestStatus(requests, id, status);
  };

  public shared ({ caller }) func deleteRequest(id : Nat) : async () {
    ignore caller;
    RequestsLib.deleteRequest(requests, id);
  };
};
