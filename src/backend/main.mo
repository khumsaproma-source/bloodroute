import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import OQL "mo:caffeineai-oql";
import Expose "mo:caffeineai-oql/Expose";
import MapEntity "mo:caffeineai-oql/MapEntity";
import Entity "mo:caffeineai-oql/Entity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import FloatValue "mo:caffeineai-oql/FloatValue";
import PrincipalValue "mo:caffeineai-oql/PrincipalValue";
import BloodGroupValue "types/BloodGroupValue";
import RequestStatusValue "types/RequestStatusValue";
import BloodStockValue "types/BloodStockValue";
import HospitalTypes "types/hospitals";
import RequestTypes "types/requests";
import ProfileTypes "types/profiles";
import HospitalsApi "mixins/hospitals-api";
import RoutesApi "mixins/routes-api";
import RequestsApi "mixins/requests-api";
import ProfilesApi "mixins/profiles-api";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  let hospitals : Map.Map<Text, HospitalTypes.Hospital>;
  let requests : Map.Map<Nat, RequestTypes.BloodRequest>;
  let userProfiles : Map.Map<Principal, ProfileTypes.Profile>;
  let state : { var nextRequestId : Nat };

  include HospitalsApi(hospitals);
  include RoutesApi(hospitals);
  include RequestsApi(requests, state);
  include ProfilesApi(userProfiles);
  include ApiDocMixin();

  include Expose({
    entities = [
      hospitals.toEntityManual("hospital", "Hospital", "id")
        .sample({
          id = "";
          name = "";
          address = "";
          lat = 0.0;
          lng = 0.0;
          stock = [{ bloodGroup = #APos; units = 0 }];
        })
        .payload("id", func h = h.id)
        .payload("name", func h = h.name)
        .payload("address", func h = h.address)
        .payload("lat", func h = h.lat)
        .payload("lng", func h = h.lng)
        .payload("stock", func h = h.stock.values().map(func s = s.toText()).join(", "))
        .public_()
        .build(),
      requests.toEntity("request", "BloodRequest", "id")
        .sample({
          id = 0;
          originName = "";
          originLat = 0.0;
          originLng = 0.0;
          hospitalId = "";
          hospitalName = "";
          bloodGroup = #APos;
          units = 0;
          distanceMeters = 0;
          durationSeconds = 0;
          geometry = "";
          status = #Pending;
          createdAt = 0;
          updatedAt = 0;
        })
        .public_()
        .build(),
      userProfiles.toEntity("profile", "Profile", "displayName")
        .sample({ displayName = ""; organizationName = "" })
        .public_()
        .build(),
    ];
  });
};
