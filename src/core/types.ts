import { TFile } from "obsidian";

export interface VaultNote {
    path: string;
    name: string;
    modified: number;
    status?: string;
    tfile: TFile;
}

interface BaseVaultIssue {
    note: VaultNote;
    message: string;
}

export interface StaleNoteIssue extends BaseVaultIssue {
    type: "stale";
    ageDays: number;
}

export interface OrphanNoteIssue extends BaseVaultIssue {
    type: "orphan";
}

export interface EmptyNoteIssue extends BaseVaultIssue {
    type: "empty";
    reason: "empty" | "heading-only" | "metadata-only";
}

export interface BrokenLinkIssue {
    type: "broken-link";
    source: VaultNote;
    target: string;
    message: string;
}

export type VaultIssue =
    | StaleNoteIssue
    | OrphanNoteIssue
    | EmptyNoteIssue
    | BrokenLinkIssue;