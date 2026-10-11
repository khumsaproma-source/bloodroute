import HospitalTypes "hospitals";
import BloodGroupValue "BloodGroupValue";

module {
  public func toText(self : HospitalTypes.BloodStock) : Text {
    let group = switch (self.bloodGroup._toRow()) {
      case (#text t) t;
      case _ "";
    };
    group # ":" # self.units.toText();
  };

  public func _toRow(self : HospitalTypes.BloodStock) : {
    #null_;
    #bool : Bool;
    #nat : Nat;
    #int : Int;
    #float : Float;
    #text : Text;
  } {
    #text(self.toText());
  };
};
