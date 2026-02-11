module {
  type OldActor = { var lastId : Nat };
  type NewActor = { lastId : Nat };

  public func run(old : OldActor) : NewActor {
    { lastId = old.lastId };
  };
};
