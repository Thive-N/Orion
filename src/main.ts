import {
	Notice,
	Plugin,
} from "obsidian";

import {StaleNotesModal} from "./ui/StaleNotesModal";
import { VaultManagerSettings, VaultManagerSettingTab, DEFAULT_SETTINGS } from "./settings";
import { VaultScanner } from "./core/VaultScanner";
import { StaleNoteAnalyzer } from "./analyzer/StaleNoteAnalyzer";
import { StaleNoteIssue } from "./core/types";



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

	private async getStaleNotes(): Promise<StaleNoteIssue[]> {
		const scanner = new VaultScanner(this.app);
		const files = scanner.scan();

		const staleNotes = new StaleNoteAnalyzer(this.settings.staleDays).analyze(await files);

		return staleNotes;

	}
}