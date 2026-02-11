import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  var lastId = 0;

  func generateId() : Nat {
    lastId += 1;
    lastId;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type CashflowEntry = {
    id : Nat;
    description : Text;
    amount : Float;
    entryType : CashflowEntryType;
    createdAt : Int;
    updatedAt : Int;
  };

  public type CashflowEntryType = {
    #credit;
    #debit;
  };

  public type CashflowInput = {
    id : ?Nat;
    description : Text;
    amount : Float;
    entryType : CashflowEntryType;
  };

  public type CashflowSummary = {
    totalCredit : Float;
    totalDebit : Float;
    netBalance : Float;
  };

  public type DaywiseSummary = {
    date : Int;
    totalCredit : Float;
    totalDebit : Float;
    netProfitLoss : Float;
  };

  public type DailyReport = {
    dailySummaries : [DaywiseSummary];
  };

  public type Property = {
    id : Nat;
    location : Text;
    landArea : Float;
    purchasePrice : Float;
    acquisitionDate : Int;
    createdAt : Int;
    updatedAt : Int;
  };

  public type PropertyInput = {
    id : ?Nat;
    location : Text;
    landArea : Float;
    purchasePrice : Float;
    acquisitionDate : Int;
  };

  public type Loan = {
    id : Nat;
    borrowerName : Text;
    collateral : Text;
    termMonthly : Bool;
    loanTenure : Float;
    interestRate : Float;
    principal : Float;
    createdAt : Int;
    updatedAt : Int;
  };

  public type LoanInput = {
    id : ?Nat;
    borrowerName : Text;
    collateral : Text;
    termMonthly : Bool;
    loanTenure : Float;
    interestRate : Float;
    principal : Float;
  };

  public type WealthInput = {
    id : Nat;
    goldWeight : Float;
    goldValue : Float;
    stocksValue : Float;
    cashLiquid : Float;
    otherAssets : Float;
    createdAt : Int;
    updatedAt : Int;
  };

  public type WealthInputInput = {
    id : ?Nat;
    goldWeight : Float;
    goldValue : Float;
    stocksValue : Float;
    cashLiquid : Float;
    otherAssets : Float;
  };

  public type UserProfile = {
    name : Text;
  };

  // User profiles storage
  let userProfiles = Map.empty<Principal, UserProfile>();

  let cashflowEntries = Map.empty<Principal, Map.Map<Nat, CashflowEntry>>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type PropertyWithOwner = {
    property : Property;
    owner : Principal;
  };

  type LoanWithOwner = {
    loan : Loan;
    owner : Principal;
  };

  type WealthInputWithOwner = {
    wealthInput : WealthInput;
    owner : Principal;
  };

  let properties = Map.empty<Nat, PropertyWithOwner>();
  let loans = Map.empty<Nat, LoanWithOwner>();
  let wealthInputs = Map.empty<Nat, WealthInputWithOwner>();

  func canAccessResource(caller : Principal, owner : Principal) : Bool {
    caller == owner or AccessControl.isAdmin(accessControlState, caller);
  };

  // Cashflow CRUD operations
  public shared ({ caller }) func addOrUpdateCashflowEntry(input : CashflowInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage cashflow entries");
    };

    let id = switch (input.id) {
      case (null) { generateId() };
      case (?existing) { existing };
    };

    let entry : CashflowEntry = {
      id;
      description = input.description;
      amount = input.amount;
      entryType = input.entryType;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    let userEntries = switch (cashflowEntries.get(caller)) {
      case (null) {
        let newMap = Map.empty<Nat, CashflowEntry>();
        newMap;
      };
      case (?existingEntries) { existingEntries };
    };

    userEntries.add(id, entry);
    cashflowEntries.add(caller, userEntries);

    id;
  };

  public shared ({ caller }) func deleteCashflowEntry(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete cashflow entries");
    };

    switch (cashflowEntries.get(caller)) {
      case (null) { Runtime.trap("Cashflow entry not found") };
      case (?userEntries) {
        userEntries.remove(id);
        cashflowEntries.add(caller, userEntries);
      };
    };
  };

  public query ({ caller }) func listCashflowEntries() : async [CashflowEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list cashflow entries");
    };

    switch (cashflowEntries.get(caller)) {
      case (null) { [] };
      case (?userEntries) { userEntries.values().toArray() };
    };
  };

  public query ({ caller }) func getCashflowEntry(id : Nat) : async CashflowEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view cashflow entries");
    };

    switch (cashflowEntries.get(caller)) {
      case (null) { Runtime.trap("Cashflow entry not found") };
      case (?userEntries) {
        switch (userEntries.get(id)) {
          case (null) { Runtime.trap("Cashflow entry not found") };
          case (?entry) { entry };
        };
      };
    };
  };

  public query ({ caller }) func getCashflowSummary() : async CashflowSummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get cashflow summary");
    };

    switch (cashflowEntries.get(caller)) {
      case (null) {
        {
          totalCredit = 0.0;
          totalDebit = 0.0;
          netBalance = 0.0;
        };
      };
      case (?userEntries) {
        var totalCredit : Float = 0.0;
        var totalDebit : Float = 0.0;

        for (entry in userEntries.values()) {
          switch (entry.entryType) {
            case (#credit) { totalCredit += entry.amount };
            case (#debit) { totalDebit += entry.amount };
          };
        };

        {
          totalCredit;
          totalDebit;
          netBalance = totalCredit - totalDebit;
        };
      };
    };
  };

  // Generate daily report strictly from cashflow entries
  public query ({ caller }) func generateDailyReport() : async DailyReport {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate daily reports");
    };

    let entries = switch (cashflowEntries.get(caller)) {
      case (null) { [] };
      case (?userEntries) { userEntries.values().toArray() };
    };

    let groupedEntries = groupByDay(entries);

    let dailySummaries = groupedEntries.map(func((day, dayEntries)) {
      calculateDaywiseSummary(day, dayEntries);
    });

    { dailySummaries };
  };

  func groupByDay(entries : [CashflowEntry]) : [(Int, [CashflowEntry])] {
    let sorted = entries.sort(
      func(a, b) { compareByDay(a.createdAt, b.createdAt) }
    );

    var currentDay : Int = 0;
    let currentEntries = List.empty<CashflowEntry>();
    let result = List.empty<(Int, [CashflowEntry])>();

    for (entry in sorted.values()) {
      let entryDay = entry.createdAt / (24 * 60 * 60 * 1000000000);

      if (currentDay != 0 and currentDay != entryDay) {
        result.add((currentDay, currentEntries.toArray()));
        currentEntries.clear();
      };

      currentDay := entryDay;
      currentEntries.add(entry);
    };

    if (currentEntries.size() > 0 and currentDay != 0) {
      result.add((currentDay, currentEntries.toArray()));
    };

    result.toArray();
  };

  func compareByDay(a : Int, b : Int) : Order.Order {
    let dayA = a / (24 * 60 * 60 * 1000000000);
    let dayB = b / (24 * 60 * 60 * 1000000000);

    Nat.compare(dayA.toNat(), dayB.toNat());
  };

  func calculateDaywiseSummary(day : Int, entries : [CashflowEntry]) : DaywiseSummary {
    var totalCredit : Float = 0.0;
    var totalDebit : Float = 0.0;

    for (entry in entries.values()) {
      switch (entry.entryType) {
        case (#credit) { totalCredit += entry.amount };
        case (#debit) { totalDebit += entry.amount };
      };
    };

    {
      date = day;
      totalCredit;
      totalDebit;
      netProfitLoss = totalCredit - totalDebit;
    };
  };

  // Property Ledger
  public shared ({ caller }) func addOrUpdateProperty(propertyInput : PropertyInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage properties");
    };

    let id = switch (propertyInput.id) {
      case (null) { generateId() };
      case (?existing) { existing };
    };

    // If updating, verify ownership
    switch (propertyInput.id) {
      case (?existingId) {
        switch (properties.get(existingId)) {
          case (?existing) {
            if (not canAccessResource(caller, existing.owner)) {
              Runtime.trap("Unauthorized: Can only update your own properties");
            };
          };
          case (null) { /* New property, will be created */ };
        };
      };
      case (null) { /* New property */ };
    };

    let property : Property = {
      id;
      location = propertyInput.location;
      landArea = propertyInput.landArea;
      purchasePrice = propertyInput.purchasePrice;
      acquisitionDate = propertyInput.acquisitionDate;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    let propertyWithOwner : PropertyWithOwner = {
      property;
      owner = caller;
    };

    properties.add(id, propertyWithOwner);
    id;
  };

  public shared ({ caller }) func deleteProperty(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete properties");
    };

    switch (properties.get(id)) {
      case (null) { Runtime.trap("Property does not exist") };
      case (?existing) {
        if (not canAccessResource(caller, existing.owner)) {
          Runtime.trap("Unauthorized: Can only delete your own properties");
        };
        properties.remove(id);
      };
    };
  };

  public query ({ caller }) func listProperties() : async [Property] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list properties");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let filtered = properties.values()
      .filter(func(p : PropertyWithOwner) : Bool {
        isAdmin or p.owner == caller
      })
      .map(func(p : PropertyWithOwner) : Property { p.property });

    filtered.toArray();
  };

  public query ({ caller }) func getProperty(id : Nat) : async Property {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view properties");
    };

    switch (properties.get(id)) {
      case (null) { Runtime.trap("Property does not exist") };
      case (?existing) {
        if (not canAccessResource(caller, existing.owner)) {
          Runtime.trap("Unauthorized: Can only view your own properties");
        };
        existing.property;
      };
    };
  };

  // Lending Ledger
  public shared ({ caller }) func addOrUpdateLoan(loanInput : LoanInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage loans");
    };

    let id = switch (loanInput.id) {
      case (null) { generateId() };
      case (?existing) { existing };
    };

    // If updating, verify ownership
    switch (loanInput.id) {
      case (?existingId) {
        switch (loans.get(existingId)) {
          case (?existing) {
            if (not canAccessResource(caller, existing.owner)) {
              Runtime.trap("Unauthorized: Can only update your own loans");
            };
          };
          case (null) { /* New loan, will be created */ };
        };
      };
      case (null) { /* New loan */ };
    };

    let loan : Loan = {
      id;
      borrowerName = loanInput.borrowerName;
      collateral = loanInput.collateral;
      termMonthly = loanInput.termMonthly;
      loanTenure = loanInput.loanTenure;
      interestRate = loanInput.interestRate;
      principal = loanInput.principal;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    let loanWithOwner : LoanWithOwner = {
      loan;
      owner = caller;
    };

    loans.add(id, loanWithOwner);
    id;
  };

  public shared ({ caller }) func deleteLoan(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete loans");
    };

    switch (loans.get(id)) {
      case (null) { Runtime.trap("Loan does not exist") };
      case (?existing) {
        if (not canAccessResource(caller, existing.owner)) {
          Runtime.trap("Unauthorized: Can only delete your own loans");
        };
        loans.remove(id);
      };
    };
  };

  public query ({ caller }) func listLoans() : async [Loan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list loans");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let filtered = loans.values()
      .filter(func(l : LoanWithOwner) : Bool {
        isAdmin or l.owner == caller
      })
      .map(func(l : LoanWithOwner) : Loan { l.loan });

    filtered.toArray();
  };

  public query ({ caller }) func getLoan(id : Nat) : async Loan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view loans");
    };

    switch (loans.get(id)) {
      case (null) { Runtime.trap("Loan does not exist") };
      case (?existing) {
        if (not canAccessResource(caller, existing.owner)) {
          Runtime.trap("Unauthorized: Can only view your own loans");
        };
        existing.loan;
      };
    };
  };

  // Wealth Inputs
  public shared ({ caller }) func addOrUpdateWealthInput(wealthInput : WealthInputInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage wealth inputs");
    };

    let id = switch (wealthInput.id) {
      case (null) { generateId() };
      case (?existing) { existing };
    };

    // If updating, verify ownership
    switch (wealthInput.id) {
      case (?existingId) {
        switch (wealthInputs.get(existingId)) {
          case (?existing) {
            if (not canAccessResource(caller, existing.owner)) {
              Runtime.trap("Unauthorized: Can only update your own wealth inputs");
            };
          };
          case (null) { /* New wealth input, will be created */ };
        };
      };
      case (null) { /* New wealth input */ };
    };

    let entry : WealthInput = {
      id;
      goldWeight = wealthInput.goldWeight;
      goldValue = wealthInput.goldValue;
      stocksValue = wealthInput.stocksValue;
      cashLiquid = wealthInput.cashLiquid;
      otherAssets = wealthInput.otherAssets;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    let wealthInputWithOwner : WealthInputWithOwner = {
      wealthInput = entry;
      owner = caller;
    };

    wealthInputs.add(id, wealthInputWithOwner);
    id;
  };

  public shared ({ caller }) func deleteWealthInput(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete wealth inputs");
    };

    switch (wealthInputs.get(id)) {
      case (null) { Runtime.trap("Wealth input does not exist") };
      case (?existing) {
        if (not canAccessResource(caller, existing.owner)) {
          Runtime.trap("Unauthorized: Can only delete your own wealth inputs");
        };
        wealthInputs.remove(id);
      };
    };
  };

  public query ({ caller }) func listWealthInputs() : async [WealthInput] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list wealth inputs");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let filtered = wealthInputs.values()
      .filter(func(w : WealthInputWithOwner) : Bool {
        isAdmin or w.owner == caller
      })
      .map(func(w : WealthInputWithOwner) : WealthInput { w.wealthInput });

    filtered.toArray();
  };

  public query ({ caller }) func getWealthInput(id : Nat) : async WealthInput {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wealth inputs");
    };

    switch (wealthInputs.get(id)) {
      case (null) { Runtime.trap("Wealth input does not exist") };
      case (?existing) {
        if (not canAccessResource(caller, existing.owner)) {
          Runtime.trap("Unauthorized: Can only view your own wealth inputs");
        };
        existing.wealthInput;
      };
    };
  };

  // Aggregated KPIs - user-specific
  public query ({ caller }) func totalPropertyValue() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view property values");
    };

    var total = 0.0;
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    for (propertyWithOwner in properties.values()) {
      if (isAdmin or propertyWithOwner.owner == caller) {
        total += propertyWithOwner.property.purchasePrice;
      };
    };
    total;
  };

  public query ({ caller }) func totalLendingPortfolio() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view lending portfolio");
    };

    var total = 0.0;
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    for (loanWithOwner in loans.values()) {
      if (isAdmin or loanWithOwner.owner == caller) {
        total += loanWithOwner.loan.principal;
      };
    };
    total;
  };

  public query ({ caller }) func totalWealthInputs() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view wealth inputs");
    };

    var total = 0.0;
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    for (wealthInputWithOwner in wealthInputs.values()) {
      if (isAdmin or wealthInputWithOwner.owner == caller) {
        let input = wealthInputWithOwner.wealthInput;
        total += input.goldValue + input.stocksValue + input.cashLiquid + input.otherAssets;
      };
    };
    total;
  };

  public query ({ caller }) func netWorth() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view net worth");
    };

    var propertyTotal = 0.0;
    var lendingTotal = 0.0;
    var wealthTotal = 0.0;

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    for (propertyWithOwner in properties.values()) {
      if (isAdmin or propertyWithOwner.owner == caller) {
        propertyTotal += propertyWithOwner.property.purchasePrice;
      };
    };

    for (loanWithOwner in loans.values()) {
      if (isAdmin or loanWithOwner.owner == caller) {
        lendingTotal += loanWithOwner.loan.principal;
      };
    };

    for (wealthInputWithOwner in wealthInputs.values()) {
      if (isAdmin or wealthInputWithOwner.owner == caller) {
        let input = wealthInputWithOwner.wealthInput;
        wealthTotal += input.goldValue + input.stocksValue + input.cashLiquid + input.otherAssets;
      };
    };

    propertyTotal + lendingTotal + wealthTotal;
  };

  type Team = Text;

  public type MatchStatus = {
    #pending;
    #in_progress;
    #completed;
    #settled;
  };

  public type MatchInput = {
    id : ?Nat;
    matchName : Text;
    team1 : Team;
    team2 : Team;
  };

  public type Match = {
    id : Nat;
    matchName : Text;
    team1 : Team;
    team2 : Team;
    status : MatchStatus;
    winner : ?Team;
    createdAt : Int;
    updatedAt : Int;
    settledAt : ?Int;
  };

  type EntryType = {
    #back;
    #lay;
  };

  public type EntryInput = {
    matchId : Nat;
    favoriteTeam : Team;
    entryType : EntryType;
    rate : Float;
    amount : Float;
    bookieName : Text;
  };

  public type Entry = {
    id : Nat;
    matchId : Nat;
    favoriteTeam : Team;
    entryType : EntryType;
    rate : Float;
    amount : Float;
    bookieName : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  public type PLSummary = {
    id : Nat;
    matchId : Nat;
    team1 : Text;
    team2 : Text;
    status : MatchStatus;
    winner : ?Team;
    team1StrongPL : Float;
    team1WeakPL : Float;
    team2StrongPL : Float;
    team2WeakPL : Float;
    totalPL : Float;
    finalScore : ?Float;
  };

  type MatchWithOwner = {
    match : Match;
    owner : Principal;
  };

  var matchIdCounter = 0;
  let matches = Map.empty<Nat, MatchWithOwner>();
  let entries = Map.empty<Nat, List.List<Entry>>();

  public shared ({ caller }) func createMatch(input : MatchInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create matches");
    };

    let id = switch (input.id) {
      case (null) { matchIdCounter += 1; matchIdCounter };
      case (?existingId) { existingId };
    };
    let match : Match = {
      id;
      matchName = input.matchName;
      team1 = input.team1;
      team2 = input.team2;
      status = #pending;
      winner = null;
      createdAt = Time.now();
      updatedAt = Time.now();
      settledAt = null;
    };

    let matchWithOwner : MatchWithOwner = {
      match;
      owner = caller;
    };

    matches.add(id, matchWithOwner);
    id;
  };

  public query ({ caller }) func listMatches() : async [Match] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list matches");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let filtered = matches.values()
      .filter(func(m : MatchWithOwner) : Bool {
        isAdmin or m.owner == caller
      })
      .map(func(m : MatchWithOwner) : Match { m.match });

    filtered.toArray();
  };

  public query ({ caller }) func getMatch(matchId : Nat) : async Match {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve matches");
    };
    switch (matches.get(matchId)) {
      case (null) {
        Runtime.trap("Match not found");
      };
      case (?matchWithOwner) {
        if (not canAccessResource(caller, matchWithOwner.owner)) {
          Runtime.trap("Unauthorized: Can only view your own matches");
        };
        matchWithOwner.match;
      };
    };
  };

  public shared ({ caller }) func addEntry(input : EntryInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add entries");
    };

    // Verify match exists and caller owns it
    switch (matches.get(input.matchId)) {
      case (null) {
        Runtime.trap("Match not found");
      };
      case (?matchWithOwner) {
        if (not canAccessResource(caller, matchWithOwner.owner)) {
          Runtime.trap("Unauthorized: Can only add entries to your own matches");
        };

        // Prevent adding entries to settled matches
        switch (matchWithOwner.match.status) {
          case (#settled) {
            Runtime.trap("Cannot add entries to a settled match");
          };
          case (_) { /* Allow */ };
        };
      };
    };

    let id = generateId();
    let entry : Entry = {
      id;
      matchId = input.matchId;
      favoriteTeam = input.favoriteTeam;
      entryType = input.entryType;
      rate = input.rate;
      amount = input.amount;
      bookieName = input.bookieName;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    let existingEntries = switch (entries.get(input.matchId)) {
      case (null) { List.empty<Entry>() };
      case (?entries) { entries };
    };
    existingEntries.add(entry);
    entries.add(input.matchId, existingEntries);

    id;
  };

  public query ({ caller }) func listEntries(matchId : Nat) : async [Entry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list entries");
    };

    // Verify match exists and caller owns it
    switch (matches.get(matchId)) {
      case (null) {
        Runtime.trap("Match not found");
      };
      case (?matchWithOwner) {
        if (not canAccessResource(caller, matchWithOwner.owner)) {
          Runtime.trap("Unauthorized: Can only view entries for your own matches");
        };
      };
    };

    switch (entries.get(matchId)) {
      case (null) { [] };
      case (?matchEntries) { matchEntries.toArray() };
    };
  };

  func calculateTeamPL(matchId : Nat, teamId : Text, isStrong : Bool) : (Float, Float) {
    var teamPL : Float = 0.0;
    var oppositePL : Float = 0.0;

    switch (entries.get(matchId)) {
      case (null) { return (teamPL, oppositePL) };
      case (?entryList) {
        for (entry in entryList.values()) {
          let isTeamEntry = entry.favoriteTeam == teamId;
          if (isTeamEntry == isStrong) {
            switch (entry.entryType) {
              case (#back) {
                if (isStrong) {
                  teamPL += (entry.rate - 1.0) * entry.amount;
                  oppositePL -= entry.amount;
                } else {
                  teamPL -= (entry.rate - 1.0) * entry.amount;
                  oppositePL += entry.amount;
                };
              };
              case (#lay) {
                if (isStrong) {
                  teamPL -= (entry.rate - 1.0) * entry.amount;
                  oppositePL += entry.amount;
                } else {
                  teamPL += (entry.rate - 1.0) * entry.amount;
                  oppositePL -= entry.amount;
                };
              };
            };
          };
        };
      };
    };
    (teamPL, oppositePL);
  };

  public query ({ caller }) func getTeamPLSummary(matchId : Nat) : async PLSummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get PL summary");
    };

    switch (matches.get(matchId)) {
      case (null) {
        Runtime.trap("Match not found");
      };
      case (?matchWithOwner) {
        if (not canAccessResource(caller, matchWithOwner.owner)) {
          Runtime.trap("Unauthorized: Can only view PL summary for your own matches");
        };

        let match = matchWithOwner.match;
        let (team1StrongPL, team1WeakPL) = calculateTeamPL(matchId, match.team1, true);
        let (team2StrongPL, team2WeakPL) = calculateTeamPL(matchId, match.team2, true);

        let totalPL = team1StrongPL + team2StrongPL;
        let finalScore = switch (match.status, match.winner) {
          case (#settled, ?winner) {
            if (winner == match.team1) {
              ?(team1StrongPL + team2WeakPL);
            } else {
              ?(team2StrongPL + team1WeakPL);
            };
          };
          case (_) { null };
        };

        let summary : PLSummary = {
          id = matchId;
          matchId;
          team1 = match.team1;
          team2 = match.team2;
          status = match.status;
          winner = match.winner;
          team1StrongPL;
          team1WeakPL;
          team2StrongPL;
          team2WeakPL;
          totalPL;
          finalScore;
        };
        return summary;
      };
    };
  };

  public shared ({ caller }) func settleMatch({
    matchId : Nat;
    winner : Text;
  }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can settle matches");
    };

    switch (matches.get(matchId)) {
      case (null) {
        Runtime.trap("Match not found");
      };
      case (?matchWithOwner) {
        // Verify ownership: only the match owner or admin can settle
        if (not canAccessResource(caller, matchWithOwner.owner)) {
          Runtime.trap("Unauthorized: Can only settle your own matches");
        };

        let match = matchWithOwner.match;

        // Verify match is not already settled
        switch (match.status) {
          case (#settled) {
            Runtime.trap("Match is already settled");
          };
          case (_) { /* Allow settlement */ };
        };

        // Verify winner is one of the two teams
        if (winner != match.team1 and winner != match.team2) {
          Runtime.trap("Winner must be one of the two teams in the match");
        };

        let updatedMatch : Match = {
          match with
          status = #settled;
          winner = ?winner;
          settledAt = ?Time.now();
          updatedAt = Time.now();
        };

        let updatedMatchWithOwner : MatchWithOwner = {
          matchWithOwner with
          match = updatedMatch;
        };

        matches.add(matchId, updatedMatchWithOwner);
      };
    };
  };
};

