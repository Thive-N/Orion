import { Modal, App } from "obsidian";
import { StaleNoteIssue } from "../core/types";

export class StaleNotesModal extends Modal {
	private files: StaleNoteIssue[];
	private staleDays: number;

	constructor(
		app: App,
		files: StaleNoteIssue[],
		staleDays: number
	) {
		super(app);
		this.files = files;
		this.staleDays = staleDays;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.empty();

		contentEl.createEl("h2", {
			text: `Stale Notes (${this.files.length})`,
		});

		contentEl.createEl("p", {
			text: `Notes not modified in the last ${this.staleDays} days.`,
		});

		this.files.forEach((file) => {
			const row = contentEl.createDiv({
				cls: "vault-manager-stale-note",
			});

			const ageDays = file.ageDays;

			const link = row.createEl("a", {
				text: file.note.name,
				href: "#",
			});

			link.addEventListener("click", (e) => {
				e.preventDefault();

				const leaf =
					this.app.workspace.getLeaf();

				void leaf.openFile(file.note.tfile).then(() => {
					this.close();
				});
			});

			row.createEl("div", {
				text: `Last modified: ${new Date(
					file.note.modified
				).toLocaleString()}`,
			});

			row.createEl("div", {
				text: `${ageDays} days old`,
			});

			row.createEl("hr");
		});
	}

	onClose() {
		this.contentEl.empty();
	}
}