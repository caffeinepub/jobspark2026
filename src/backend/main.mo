import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Types
  public type WorkEntry = {
    id : Nat;
    date : Text;
    projectName : Text;
    entryType : Text;
    earnings : Nat;
    status : Text;
  };

  public type PaginatedResult = {
    entries : [WorkEntry];
    totalEntries : Nat;
    page : Nat;
    totalPages : Nat;
  };

  public type UserProfile = {
    name : Text;
    timeWorked : Text;
  };

  public type UserData = {
    profile : UserProfile;
    totalEarnings : Nat;
    totalWithdrawn : Nat;
    entries : Map.Map<Nat, WorkEntry>;
    nextEntryId : Nat;
  };

  // Comparators
  module WorkEntry {
    public func compare(a : WorkEntry, b : WorkEntry) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  // Storage - per user
  let userData = Map.empty<Principal, UserData>();

  // Authentication
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper functions
  func getUserData(user : Principal) : ?UserData {
    userData.get(user);
  };

  func ensureUserData(user : Principal) : UserData {
    switch (userData.get(user)) {
      case (?data) { data };
      case null {
        let newData : UserData = {
          profile = { name = ""; timeWorked = "0h" };
          totalEarnings = 0;
          totalWithdrawn = 0;
          entries = Map.empty<Nat, WorkEntry>();
          nextEntryId = 1;
        };
        userData.add(user, newData);
        newData;
      };
    };
  };

  func updateUserData(user : Principal, data : UserData) {
    userData.add(user, data);
  };

  func getUserEntriesAsArray(user : Principal) : [WorkEntry] {
    switch (userData.get(user)) {
      case (?data) { data.entries.values().toArray() };
      case null { [] };
    };
  };

  func calculateTodayEarnings(user : Principal, todayDate : Text) : Nat {
    let entriesArray = getUserEntriesAsArray(user);
    var total = 0;
    for (entry in entriesArray.vals()) {
      if (entry.date == todayDate) {
        total += entry.earnings;
      };
    };
    total;
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    switch (userData.get(caller)) {
      case (?data) { ?data.profile };
      case null { null };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (userData.get(user)) {
      case (?data) { ?data.profile };
      case null { null };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let currentData = ensureUserData(caller);
    let updatedData = {
      currentData with profile = profile
    };
    updateUserData(caller, updatedData);
  };

  // Work Entry Functions
  public shared ({ caller }) func addWorkEntry(entry : WorkEntry) : async WorkEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add entries");
    };

    let currentData = ensureUserData(caller);
    let newEntry = { entry with id = currentData.nextEntryId };

    currentData.entries.add(newEntry.id, newEntry);

    let updatedData = {
      profile = currentData.profile;
      totalEarnings = currentData.totalEarnings + newEntry.earnings;
      totalWithdrawn = currentData.totalWithdrawn;
      entries = currentData.entries;
      nextEntryId = currentData.nextEntryId + 1;
    };
    updateUserData(caller, updatedData);

    newEntry;
  };

  public query ({ caller }) func getPaginatedEntries(page : Nat, pageSize : Nat) : async PaginatedResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view entries");
    };

    let entriesArray = getUserEntriesAsArray(caller);
    let totalEntries = entriesArray.size();
    let totalPages = if (totalEntries == 0) { 1 } else {
      Int.abs((totalEntries + pageSize - 1) / pageSize);
    };

    let start = (page - 1) * pageSize;
    let end = if (page * pageSize > totalEntries) { totalEntries } else {
      page * pageSize;
    };

    let pagedEntries = entriesArray.sliceToArray(
      if (start > totalEntries) { totalEntries } else { start },
      if (end > totalEntries) { totalEntries } else { end },
    );

    {
      entries = pagedEntries;
      totalEntries;
      page;
      totalPages;
    };
  };

  public query ({ caller }) func searchEntriesByProjectName(projectName : Text) : async [WorkEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search entries");
    };

    getUserEntriesAsArray(caller).filter(
      func(entry) {
        entry.projectName.contains(#text projectName);
      }
    );
  };

  public query ({ caller }) func getEntriesCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view entry count");
    };

    switch (userData.get(caller)) {
      case (?data) { data.entries.size() };
      case null { 0 };
    };
  };

  public query ({ caller }) func getEntryById(id : Nat) : async ?WorkEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view entries");
    };

    switch (userData.get(caller)) {
      case (?data) { data.entries.get(id) };
      case null { null };
    };
  };

  // Earnings tracking
  public query ({ caller }) func getTotalEarnings() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view earnings");
    };

    switch (userData.get(caller)) {
      case (?data) { data.totalEarnings };
      case null { 0 };
    };
  };

  public query ({ caller }) func getTotalWithdrawn() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view withdrawn amount");
    };

    switch (userData.get(caller)) {
      case (?data) { data.totalWithdrawn };
      case null { 0 };
    };
  };

  public query ({ caller }) func getTodayEarnings(todayDate : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view earnings");
    };

    calculateTodayEarnings(caller, todayDate);
  };

  public shared ({ caller }) func recordWithdrawal(amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record withdrawals");
    };

    let currentData = ensureUserData(caller);
    let updatedData = {
      currentData with totalWithdrawn = currentData.totalWithdrawn + amount
    };
    updateUserData(caller, updatedData);
  };

  // Seed function
  public shared ({ caller }) func seedEntriesOnce() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can seed data");
    };

    let currentData = ensureUserData(caller);

    // Only seed if user has no entries
    if (currentData.entries.size() > 0) {
      Runtime.trap("User already has entries");
    };

    let sampleEntries : [WorkEntry] = [
      {
        id = 1;
        date = "2023-03-01";
        projectName = "Alpha Project";
        entryType = "Development";
        earnings = 1500;
        status = "Completed";
      },
      {
        id = 2;
        date = "2023-03-02";
        projectName = "Beta Launch";
        entryType = "Testing";
        earnings = 1000;
        status = "Pending";
      },
      {
        id = 3;
        date = "2023-03-03";
        projectName = "Gamma Review";
        entryType = "Meeting";
        earnings = 500;
        status = "Completed";
      },
    ];

    var totalEarnings = 0;
    var nextId = 1;

    for (entry in sampleEntries.vals()) {
      let newEntry = { entry with id = nextId };
      currentData.entries.add(newEntry.id, newEntry);
      totalEarnings += newEntry.earnings;
      nextId += 1;
    };

    let updatedData = {
      profile = currentData.profile;
      totalEarnings = totalEarnings;
      totalWithdrawn = currentData.totalWithdrawn;
      entries = currentData.entries;
      nextEntryId = nextId;
    };
    updateUserData(caller, updatedData);
  };
};
