import { StaleNoteIssue, VaultNote } from "../core/types";

export class StaleNoteAnalyzer {
    constructor(
        private readonly staleAfterDays: number
    ) {}

    analyze(notes: VaultNote[]): StaleNoteIssue[] {
        const now = Date.now();

        const staleAfterMs =
            this.staleAfterDays * 24 * 60 * 60 * 1000;

        return notes
            .filter(note => {
                return now - note.modified > staleAfterMs;
            })
            .filter(note => {
                return note.status !== "final";
            })
            .map(note => ({
                ageDays: Math.floor((now - note.modified) / (1000 * 60 * 60 * 24)),
                type: "stale",
                note,
                message: `Note has not been modified for ${this.staleAfterDays} days`
            }));
    }
}