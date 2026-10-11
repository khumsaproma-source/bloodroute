import Common "../types/common";

module {
  public type BloodStock = {
    bloodGroup : Common.BloodGroup;
    units : Nat;
  };

  public type Hospital = {
    id : Text;
    name : Text;
    address : Text;
    lat : Float;
    lng : Float;
    stock : [BloodStock];
  };

  public type HospitalInput = {
    id : Text;
    name : Text;
    address : Text;
    lat : Float;
    lng : Float;
    stock : [BloodStock];
  };
};
