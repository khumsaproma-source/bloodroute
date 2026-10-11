import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Types "../types/profiles";
import ProfilesLib "../lib/profiles";

mixin (profiles : Map.Map<Principal, Types.Profile>) {
  public query ({ caller }) func getProfile() : async ?Types.Profile {
    ProfilesLib.getProfile(profiles, caller);
  };

  public shared ({ caller }) func setProfile(displayName : Text, organizationName : Text) : async () {
    ProfilesLib.setProfile(profiles, caller, displayName, organizationName);
  };
};
