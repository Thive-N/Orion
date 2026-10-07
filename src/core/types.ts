export type IssueType =
    | "stale"
    | "orphan"
    | "broken-link"
    | "empty";

export interface VaultIssue {
    type: IssueType;
    note: VaultNote;
    message: string;
}

export interface VaultNote {
    path: string;
    name: string;
    modified: number;
}