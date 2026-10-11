import Common "common";

module {
  public func _toRow(self : Common.BloodGroup) : {
    #null_;
    #bool : Bool;
    #nat : Nat;
    #int : Int;
    #float : Float;
    #text : Text;
  } {
    #text(
      switch (self) {
        case (#APos) "APos";
        case (#ANeg) "ANeg";
        case (#BPos) "BPos";
        case (#BNeg) "BNeg";
        case (#ABPos) "ABPos";
        case (#ABNeg) "ABNeg";
        case (#OPos) "OPos";
        case (#ONeg) "ONeg";
      }
    );
  };
};
