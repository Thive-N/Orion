import {
	App,
	TFile,
} from "obsidian";

import { VaultNote } from "./types";

export class VaultScanner {
    constructor(private app: App) {}

    async scan(): Promise<VaultNote[]> {
        const files = this.app.vault.getMarkdownFiles();

        const notes: VaultNote[] = [];

        for (const file of files) {
            const note = await this.scanFile(file);
            notes.push(note);
        }

        return notes;
    }

    private async scanFile(file: TFile): Promise<VaultNote> {
        // const content = await this.app.vault.read(file);

        return {
            path: file.path,
            name: file.basename,
            modified: file.stat.mtime,
        };
    }
}