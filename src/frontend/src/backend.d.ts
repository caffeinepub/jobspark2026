import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WorkEntry {
    id: bigint;
    status: string;
    entryType: string;
    projectName: string;
    date: string;
    earnings: bigint;
}
export interface UserProfile {
    name: string;
    timeWorked: string;
}
export interface PaginatedResult {
    totalEntries: bigint;
    page: bigint;
    entries: Array<WorkEntry>;
    totalPages: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addWorkEntry(entry: WorkEntry): Promise<WorkEntry>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEntriesCount(): Promise<bigint>;
    getEntryById(id: bigint): Promise<WorkEntry | null>;
    getPaginatedEntries(page: bigint, pageSize: bigint): Promise<PaginatedResult>;
    getTodayEarnings(todayDate: string): Promise<bigint>;
    getTotalEarnings(): Promise<bigint>;
    getTotalWithdrawn(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordWithdrawal(amount: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchEntriesByProjectName(projectName: string): Promise<Array<WorkEntry>>;
    seedEntriesOnce(): Promise<void>;
}
