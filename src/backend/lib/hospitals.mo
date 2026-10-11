import Map "mo:core/Map";
import Text "mo:core/Text";
import Types "../types/hospitals";

module {
  public func listHospitals(hospitals : Map.Map<Text, Types.Hospital>) : [Types.Hospital] {
    hospitals.values().toArray();
  };

  public func getHospital(hospitals : Map.Map<Text, Types.Hospital>, id : Text) : ?Types.Hospital {
    hospitals.get(id);
  };

  public func searchHospitals(hospitals : Map.Map<Text, Types.Hospital>, term : Text) : [Types.Hospital] {
    let needle = term.toLower();
    hospitals.values().filter(
      func(h) {
        h.name.toLower().contains(#text needle) or h.address.toLower().contains(#text needle);
      }
    ).toArray();
  };

  public func upsertHospital(hospitals : Map.Map<Text, Types.Hospital>, input : Types.HospitalInput) : () {
    hospitals.add(input.id, {
      id = input.id;
      name = input.name;
      address = input.address;
      lat = input.lat;
      lng = input.lng;
      stock = input.stock;
    });
  };

  public func deleteHospital(hospitals : Map.Map<Text, Types.Hospital>, id : Text) : () {
    hospitals.remove(id);
  };
};
