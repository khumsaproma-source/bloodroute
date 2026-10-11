import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Types "../types/profiles";

module {
  public func getProfile(profiles : Map.Map<Principal, Types.Profile>, caller : Principal) : ?Types.Profile {
    profiles.get(caller);
  };

  public func setProfile(
    profiles : Map.Map<Principal, Types.Profile>,
    caller : Principal,
    displayName : Text,
    organizationName : Text,
  ) : () {
    profiles.add(caller, { displayName; organizationName });
  };
};
