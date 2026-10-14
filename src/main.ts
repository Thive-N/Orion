import {
	Notice,
	Plugin,
	TFile,
} from "obsidian";

import {StaleNotesModal} from "./ui/StaleNotesModal";
import { VaultManagerSettings, VaultManagerSettingTab, DEFAULT_SETTINGS } from "./settings";
import { VaultScanner } from "./core/VaultScanner";
import { StaleNoteAnalyzer } from "./analyzer/StaleNoteAnalyzer";
import { StaleNoteIssue } from "./core/types";
import { isFinalized } from "./utils/noteStatus";



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

		this.addCommand({
    id: "open-random-finalized-note",
    name: "Open random finalized note",
    callback: async () => {
        const files = this.app.vault.getMarkdownFiles();

        const finalized = files.filter(file =>
            isFinalized(file, this.app),
        );

        if (finalized.length === 0) {
            new Notice("No finalized notes found.");
            return;
        }

        const index = Math.floor(Math.random() * finalized.length);
        const file = finalized[index];

        if (!file) {
            new Notice("Failed to open a finalized note.");
            return;
        }

        await this.app.workspace.getLeaf(false).openFile(file);
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

	private async getStaleNotes(): Promise<StaleNoteIssue[]> {
		const scanner = new VaultScanner(this.app);
		const files = scanner.scan();

		const staleNotes = new StaleNoteAnalyzer(this.settings.staleDays).analyze(await files);

		return staleNotes;

	}
}