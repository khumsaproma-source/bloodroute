import Common "common";

module {
  public func _toRow(self : Common.RequestStatus) : {
    #null_;
    #bool : Bool;
    #nat : Nat;
    #int : Int;
    #float : Float;
    #text : Text;
  } {
    #text(
      switch (self) {
        case (#Pending) "Pending";
        case (#InTransit) "InTransit";
        case (#Delivered) "Delivered";
      }
    );
  };
};
