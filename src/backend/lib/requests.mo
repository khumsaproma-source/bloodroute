import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Common "../types/common";
import RequestTypes "../types/requests";

module {
  public func listRequests(requests : Map.Map<Nat, RequestTypes.BloodRequest>) : [RequestTypes.BloodRequest] {
    requests.values().toArray();
  };

  public func getRequest(requests : Map.Map<Nat, RequestTypes.BloodRequest>, id : Nat) : ?RequestTypes.BloodRequest {
    requests.get(id);
  };

  public func createRequest(
    requests : Map.Map<Nat, RequestTypes.BloodRequest>,
    state : { var nextRequestId : Nat },
    input : RequestTypes.BloodRequestInput,
  ) : Nat {
    let id = state.nextRequestId;
    state.nextRequestId := id + 1;
    let now = Time.now().toNat();
    requests.add(id, {
      id;
      originName = input.originName;
      originLat = input.originLat;
      originLng = input.originLng;
      hospitalId = input.hospitalId;
      hospitalName = input.hospitalName;
      bloodGroup = input.bloodGroup;
      units = input.units;
      distanceMeters = input.distanceMeters;
      durationSeconds = input.durationSeconds;
      geometry = input.geometry;
      status = #Pending;
      createdAt = now;
      updatedAt = now;
    });
    id;
  };

  public func updateRequestStatus(
    requests : Map.Map<Nat, RequestTypes.BloodRequest>,
    id : Nat,
    status : Common.RequestStatus,
  ) : () {
    switch (requests.get(id)) {
      case (?r) {
        requests.add(id, {
          id = r.id;
          originName = r.originName;
          originLat = r.originLat;
          originLng = r.originLng;
          hospitalId = r.hospitalId;
          hospitalName = r.hospitalName;
          bloodGroup = r.bloodGroup;
          units = r.units;
          distanceMeters = r.distanceMeters;
          durationSeconds = r.durationSeconds;
          geometry = r.geometry;
          status;
          createdAt = r.createdAt;
          updatedAt = Time.now().toNat();
        });
      };
      case null {};
    };
  };

  public func deleteRequest(requests : Map.Map<Nat, RequestTypes.BloodRequest>, id : Nat) : () {
    requests.remove(id);
  };
};
