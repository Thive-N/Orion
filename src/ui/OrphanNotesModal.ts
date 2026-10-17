import { Modal, App } from "obsidian";
import { OrphanNoteIssue } from "../core/types";

export class OrphanNotesModal extends Modal {
    private files: OrphanNoteIssue[];

    constructor(
        app: App,
        files: OrphanNoteIssue[],
    ) {
        super(app);
        this.files = files;
    }

    onOpen() {
        const { contentEl } = this;

        contentEl.empty();

        contentEl.createEl("h2", {
            text: `Orphaned Notes (${this.files.length})`,
        });

        contentEl.createEl("p", {
            text: `All orphaned notes.`,
        });

        this.files.forEach((file) => {
            const row = contentEl.createDiv({
                cls: "vault-manager-orphaned-note",
            });

            const link = row.createEl("a", {
                text: file.note.name,
                href: "#",
            });

            link.addEventListener("click", (e) => {
                e.preventDefault();
                const leaf = this.app.workspace.getLeaf();
                void leaf.openFile(file.note.tfile).then(() => {
                    this.close();
                });
            }
            );
            row.createEl("div", {
                text: `Last modified: ${new Date(
                    file.note.modified
                ).toLocaleString()}`,
            });
        }
        );
    }
}