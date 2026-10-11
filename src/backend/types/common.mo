module {
  public type Timestamp = Nat;

  public type BloodGroup = {
    #APos;
    #ANeg;
    #BPos;
    #BNeg;
    #ABPos;
    #ABNeg;
    #OPos;
    #ONeg;
  };

  public type RequestStatus = {
    #Pending;
    #InTransit;
    #Delivered;
  };
};
