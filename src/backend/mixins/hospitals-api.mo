import Map "mo:core/Map";
import Text "mo:core/Text";
import Types "../types/hospitals";
import HospitalsLib "../lib/hospitals";

mixin (hospitals : Map.Map<Text, Types.Hospital>) {
  public query func listHospitals() : async [Types.Hospital] {
    HospitalsLib.listHospitals(hospitals);
  };

  public query func getHospital(id : Text) : async ?Types.Hospital {
    HospitalsLib.getHospital(hospitals, id);
  };

  public query func searchHospitals(term : Text) : async [Types.Hospital] {
    HospitalsLib.searchHospitals(hospitals, term);
  };

  public shared ({ caller }) func upsertHospital(input : Types.HospitalInput) : async () {
    ignore caller;
    HospitalsLib.upsertHospital(hospitals, input);
  };

  public shared ({ caller }) func deleteHospital(id : Text) : async () {
    ignore caller;
    HospitalsLib.deleteHospital(hospitals, id);
  };
};
