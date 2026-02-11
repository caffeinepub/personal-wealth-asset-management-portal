import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WealthInputInput {
    id?: bigint;
    cashLiquid: number;
    otherAssets: number;
    goldWeight: number;
    stocksValue: number;
    goldValue: number;
}
export interface CashflowInput {
    id?: bigint;
    entryType: CashflowEntryType;
    description: string;
    amount: number;
}
export interface DaywiseSummary {
    totalCredit: number;
    date: bigint;
    netProfitLoss: number;
    totalDebit: number;
}
export interface CashflowEntry {
    id: bigint;
    entryType: CashflowEntryType;
    createdAt: bigint;
    description: string;
    updatedAt: bigint;
    amount: number;
}
export interface MatchInput {
    id?: bigint;
    team1: Team;
    team2: Team;
    matchName: string;
}
export interface EntryInput {
    entryType: EntryType;
    rate: number;
    favoriteTeam: Team;
    matchId: bigint;
    bookieName: string;
    amount: number;
}
export interface Loan {
    id: bigint;
    principal: number;
    termMonthly: boolean;
    loanTenure: number;
    createdAt: bigint;
    collateral: string;
    updatedAt: bigint;
    interestRate: number;
    borrowerName: string;
}
export interface Match {
    id: bigint;
    status: MatchStatus;
    team1: Team;
    team2: Team;
    createdAt: bigint;
    winner?: Team;
    updatedAt: bigint;
    settledAt?: bigint;
    matchName: string;
}
export interface PLSummary {
    id: bigint;
    status: MatchStatus;
    team1: string;
    team2: string;
    totalPL: number;
    winner?: Team;
    matchId: bigint;
    team2StrongPL: number;
    team1WeakPL: number;
    finalScore?: number;
    team1StrongPL: number;
    team2WeakPL: number;
}
export interface WealthInput {
    id: bigint;
    cashLiquid: number;
    createdAt: bigint;
    otherAssets: number;
    goldWeight: number;
    updatedAt: bigint;
    stocksValue: number;
    goldValue: number;
}
export interface PropertyInput {
    id?: bigint;
    purchasePrice: number;
    acquisitionDate: bigint;
    landArea: number;
    location: string;
}
export interface Property {
    id: bigint;
    purchasePrice: number;
    acquisitionDate: bigint;
    createdAt: bigint;
    updatedAt: bigint;
    landArea: number;
    location: string;
}
export interface Entry {
    id: bigint;
    entryType: EntryType;
    createdAt: bigint;
    rate: number;
    favoriteTeam: Team;
    updatedAt: bigint;
    matchId: bigint;
    bookieName: string;
    amount: number;
}
export interface CashflowSummary {
    totalCredit: number;
    netBalance: number;
    totalDebit: number;
}
export interface LoanInput {
    id?: bigint;
    principal: number;
    termMonthly: boolean;
    loanTenure: number;
    collateral: string;
    interestRate: number;
    borrowerName: string;
}
export interface DailyReport {
    dailySummaries: Array<DaywiseSummary>;
}
export interface UserProfile {
    name: string;
}
export type Team = string;
export enum CashflowEntryType {
    credit = "credit",
    debit = "debit"
}
export enum EntryType {
    lay = "lay",
    back = "back"
}
export enum MatchStatus {
    settled = "settled",
    pending = "pending",
    in_progress = "in_progress",
    completed = "completed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addEntry(input: EntryInput): Promise<bigint>;
    addOrUpdateCashflowEntry(input: CashflowInput): Promise<bigint>;
    addOrUpdateLoan(loanInput: LoanInput): Promise<bigint>;
    addOrUpdateProperty(propertyInput: PropertyInput): Promise<bigint>;
    addOrUpdateWealthInput(wealthInput: WealthInputInput): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createMatch(input: MatchInput): Promise<bigint>;
    deleteCashflowEntry(id: bigint): Promise<void>;
    deleteLoan(id: bigint): Promise<void>;
    deleteProperty(id: bigint): Promise<void>;
    deleteWealthInput(id: bigint): Promise<void>;
    generateDailyReport(): Promise<DailyReport>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCashflowEntry(id: bigint): Promise<CashflowEntry>;
    getCashflowSummary(): Promise<CashflowSummary>;
    getLoan(id: bigint): Promise<Loan>;
    getMatch(matchId: bigint): Promise<Match>;
    getProperty(id: bigint): Promise<Property>;
    getTeamPLSummary(matchId: bigint): Promise<PLSummary>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWealthInput(id: bigint): Promise<WealthInput>;
    isCallerAdmin(): Promise<boolean>;
    listCashflowEntries(): Promise<Array<CashflowEntry>>;
    listEntries(matchId: bigint): Promise<Array<Entry>>;
    listLoans(): Promise<Array<Loan>>;
    listMatches(): Promise<Array<Match>>;
    listProperties(): Promise<Array<Property>>;
    listWealthInputs(): Promise<Array<WealthInput>>;
    netWorth(): Promise<number>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    settleMatch(arg0: {
        winner: string;
        matchId: bigint;
    }): Promise<void>;
    totalLendingPortfolio(): Promise<number>;
    totalPropertyValue(): Promise<number>;
    totalWealthInputs(): Promise<number>;
}
