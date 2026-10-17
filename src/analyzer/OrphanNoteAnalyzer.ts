
import type { OrphanNoteIssue, VaultNote } from "../core/types";

type ResolvedLinks = Record<string, Record<string, number>>;

export class OrphanNoteAnalyzer {
    analyze(
        notes: VaultNote[],
        resolvedLinks: ResolvedLinks,
    ): OrphanNoteIssue[] {
        const linkedNotes = new Set<string>();

        // Collect every note that has an incoming link.
        for (const targets of Object.values(resolvedLinks)) {
            for (const [targetPath, count] of Object.entries(targets)) {
                if (count > 0) {
                    linkedNotes.add(targetPath);
                }
            }
        }

        // Find notes that aren't linked to by any other note.
        return notes
            .filter(note => !linkedNotes.has(note.path))
            .map(note => ({
                type: "orphan" as const,
                note,
                message: "Note has no backlinks",
            }));
    }
}
