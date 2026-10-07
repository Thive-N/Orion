import { VaultIssue, VaultNote } from "../core/types";


export class StaleNoteAnalyzer {
    constructor(
        private readonly staleAfterDays: number
    ) {}

    analyze(notes: VaultNote[]): VaultIssue[] {
        const now = Date.now();

        const staleAfterMs =
            this.staleAfterDays * 24 * 60 * 60 * 1000;

        return notes
            .filter(note => {
                return now - note.modified > staleAfterMs;
            })
            .map(note => ({
                type: "stale",
                note,
                message: `Note has not been modified for ${this.staleAfterDays} days`
            }));
    }
}