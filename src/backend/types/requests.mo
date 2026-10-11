import Common "../types/common";

module {
  public type BloodRequest = {
    id : Nat;
    originName : Text;
    originLat : Float;
    originLng : Float;
    hospitalId : Text;
    hospitalName : Text;
    bloodGroup : Common.BloodGroup;
    units : Nat;
    distanceMeters : Nat;
    durationSeconds : Nat;
    geometry : Text;
    status : Common.RequestStatus;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type BloodRequestInput = {
    originName : Text;
    originLat : Float;
    originLng : Float;
    hospitalId : Text;
    hospitalName : Text;
    bloodGroup : Common.BloodGroup;
    units : Nat;
    distanceMeters : Nat;
    durationSeconds : Nat;
    geometry : Text;
  };
};
