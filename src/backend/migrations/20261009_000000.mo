import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";

// BloodRoute migration: replaces the HushMap workspace-location state with
// hospital blood-stock state, blood-delivery requests, and sender profiles.
// OldActor mirrors the previous migration's NewActor exactly.
module {
  type OldNoiseLevel = {
    #Quiet;
    #Moderate;
    #Buzzing;
  };

  type OldWifiSpeed = {
    #Slow;
    #Okay;
    #Fast;
  };

  type OldLocationType = {
    #Cafe;
    #Library;
    #CoworkingSpace;
  };

  type OldProfile = {
    name : Text;
  };

  type OldRating = {
    noiseLevel : OldNoiseLevel;
    wifiSpeed : OldWifiSpeed;
    description : ?Text;
    userId : Principal;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    editCount : Nat;
  };

  type OldLocation = {
    osmNodeId : Text;
    name : Text;
    locationType : OldLocationType;
    lat : Float;
    lng : Float;
    address : ?Text;
    ratings : [OldRating];
  };

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    locations : Map.Map<Text, OldLocation>;
    userProfiles : Map.Map<Principal, OldProfile>;
  };

  type BloodGroup = {
    #APos;
    #ANeg;
    #BPos;
    #BNeg;
    #ABPos;
    #ABNeg;
    #OPos;
    #ONeg;
  };

  type BloodStock = {
    bloodGroup : BloodGroup;
    units : Nat;
  };

  type Hospital = {
    id : Text;
    name : Text;
    address : Text;
    lat : Float;
    lng : Float;
    stock : [BloodStock];
  };

  type RequestStatus = {
    #Pending;
    #InTransit;
    #Delivered;
  };

  type BloodRequest = {
    id : Nat;
    originName : Text;
    originLat : Float;
    originLng : Float;
    hospitalId : Text;
    hospitalName : Text;
    bloodGroup : BloodGroup;
    units : Nat;
    distanceMeters : Nat;
    durationSeconds : Nat;
    geometry : Text;
    status : RequestStatus;
    createdAt : Nat;
    updatedAt : Nat;
  };

  type Profile = {
    displayName : Text;
    organizationName : Text;
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    hospitals : Map.Map<Text, Hospital>;
    requests : Map.Map<Nat, BloodRequest>;
    userProfiles : Map.Map<Principal, Profile>;
    state : { var nextRequestId : Nat };
  };

  func stock(units : Nat) : [BloodStock] {
    [
      { bloodGroup = #APos; units },
      { bloodGroup = #ANeg; units },
      { bloodGroup = #BPos; units },
      { bloodGroup = #BNeg; units },
      { bloodGroup = #ABPos; units },
      { bloodGroup = #ABNeg; units },
      { bloodGroup = #OPos; units },
      { bloodGroup = #ONeg; units },
    ];
  };

  func seedHospitals() : Map.Map<Text, Hospital> {
    let hospitals = Map.empty<Text, Hospital>();
    hospitals.add("hosp-chula", {
      id = "hosp-chula";
      name = "โรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย";
      address = "1873 ถนนพระรามที่ 4 เขตปทุมวัน กรุงเทพมหานคร 10330";
      lat = 13.7320;
      lng = 100.5230;
      stock = stock(12);
    });
    hospitals.add("hosp-siriraj", {
      id = "hosp-siriraj";
      name = "โรงพยาบาลศิริราช";
      address = "2 ถนนวังหลัง แขวงศิริราช เขตบางกอกน้อย กรุงเทพมหานคร 10700";
      lat = 13.7580;
      lng = 100.4860;
      stock = stock(8);
    });
    hospitals.add("hosp-ramathibodi", {
      id = "hosp-ramathibodi";
      name = "โรงพยาบาลรามาธิบดี";
      address = "270 ถนนพระรามที่ 6 เขตราชเทวี กรุงเทพมหานคร 10400";
      lat = 13.7660;
      lng = 100.5380;
      stock = stock(6);
    });
    hospitals.add("hosp-bhumibol", {
      id = "hosp-bhumibol";
      name = "โรงพยาบาลภูมิพลอดุลยเดช";
      address = "1777 ถนนพหลโยธิน แขวงสายไหม เขตสายไหม กรุงเทพมหานคร 10220";
      lat = 13.8890;
      lng = 100.6080;
      stock = stock(4);
    });
    hospitals.add("hosp-bangkok", {
      id = "hosp-bangkok";
      name = "โรงพยาบาลกรุงเทพ";
      address = "2 ซอยสุขุมวิท 3 ถนนสุขุมวิท เขตวัฒนา กรุงเทพมหานคร 10110";
      lat = 13.7370;
      lng = 100.5580;
      stock = stock(10);
    });
    hospitals.add("hosp-ram", {
      id = "hosp-ram";
      name = "โรงพยาบาลรามคำแหง";
      address = "68 ถนนรามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพมหานคร 10240";
      lat = 13.7550;
      lng = 100.6430;
      stock = stock(5);
    });
    hospitals;
  };

  public func migration(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      hospitals = seedHospitals();
      requests = Map.empty();
      userProfiles = Map.empty();
      state = { var nextRequestId = 0 };
    };
  };
};
