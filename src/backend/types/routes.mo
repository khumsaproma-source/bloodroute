import Common "../types/common";

module {
  public type RouteRequest = {
    originId : Text;
    originName : Text;
    originLat : Float;
    originLng : Float;
    hospitalId : Text;
    bloodGroup : Common.BloodGroup;
    units : Nat;
  };

  public type RouteResult = {
    distanceMeters : Nat;
    durationSeconds : Nat;
    geometry : Text;
    originLat : Float;
    originLng : Float;
    destLat : Float;
    destLng : Float;
    bloodGroup : Common.BloodGroup;
    units : Nat;
    stockSufficient : Bool;
    availableUnits : Nat;
  };
};
