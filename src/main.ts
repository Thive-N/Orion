import {
	App,
	Modal,
	Notice,
	Plugin,
	TFile,
} from "obsidian";

import { VaultManagerSettings, VaultManagerSettingTab, DEFAULT_SETTINGS } from "./settings";
import { VaultScanner } from "./core/VaultScanner";
import { StaleNoteAnalyzer } from "./analyzer/StaleNoteAnalyzer";
import { VaultIssue } from "./core/types";



export default class VaultManagerPlugin extends Plugin {
	settings: VaultManagerSettings = DEFAULT_SETTINGS;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(
			new VaultManagerSettingTab(this.app, this)
		);

		this.addCommand({
			id: "check-stale-notes",
			name: "Check stale notes",
			callback: async () => {
				const staleNotes = await this.getStaleNotes();

				if (staleNotes.length === 0) {
					new Notice("No stale notes found");
					return;
				}

				new StaleNotesModal(
					this.app,
					staleNotes,
					this.settings.staleDays
				).open();
			},
		});
	}

	onunload() { }

	async loadSettings() {
		const data = (await this.loadData()) as Partial<VaultManagerSettings> | null;

		this.settings = {
			...DEFAULT_SETTINGS,
			...(data ?? {}),
		};
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private async getStaleNotes(): Promise<VaultIssue[]> {
		const scanner = new VaultScanner(this.app);
		const files = scanner.scan();

		const staleNotes = new StaleNoteAnalyzer(this.settings.staleDays).analyze(await files);

		return staleNotes;

	}
}


class StaleNotesModal extends Modal {
	private files: VaultIssue[];
	private staleDays: number;

	constructor(
		app: App,
		files: VaultIssue[],
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

			// const ageDays = Math.floor(
			// 	(Date.now() - file.stat.mtime) /
			// 	(1000 * 60 * 60 * 24)
			// );

			// const link = row.createEl("a", {
			// 	text: file.path,
			// 	href: "#",
			// });

		// 	link.addEventListener("click", (e) => {
		// 		e.preventDefault();

		// 		const leaf =
		// 			this.app.workspace.getLeaf();

		// 		void leaf.openFile(file).then(() => {
		// 			this.close();
		// 		});
		// 	});

		// 	row.createEl("div", {
		// 		text: `Last modified: ${new Date(
		// 			file.stat.mtime
		// 		).toLocaleString()}`,
		// 	});

		// 	row.createEl("div", {
		// 		text: `${ageDays} days old`,
		// 	});

		// 	row.createEl("hr");
		});
	}

	onClose() {
		this.contentEl.empty();
	}
}