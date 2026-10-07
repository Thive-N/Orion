import {
    App,
    PluginSettingTab,
    Setting,
} from "obsidian";

import VaultManagerPlugin from "./main";

export interface VaultManagerSettings {
    staleDays: number;
    excludeStatus: string[];
};

export const DEFAULT_SETTINGS: VaultManagerSettings = {
    staleDays: 7,
    excludeStatus: ["FINAL", "ARCHIVED"],
};


export class VaultManagerSettingTab extends PluginSettingTab {
    plugin: VaultManagerPlugin;

    constructor(
        app: App,
        plugin: VaultManagerPlugin
    ) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl).setName("Vault manager").setHeading();

        new Setting(containerEl)
            .setName("Stale note threshold")
            .setDesc(
                "Number of days before a note is considered stale"
            )
            .addText((text) =>
                text
                    .setPlaceholder("7")
                    .setValue(
                        this.plugin.settings.staleDays.toString()
                    )
                    .onChange(async (value) => {
                        const days = parseInt(value);

                        if (!isNaN(days) && days > 0) {
                            this.plugin.settings.staleDays =
                                days;
                            await this.plugin.saveSettings();
                        }
                    })
            );

        new Setting(containerEl)
            .setName("Exclude status")
            .setDesc(
                "Comma-separated list of statuses to exclude from stale note check, case-insensitive"
            )
            .addText((text) =>
                text
                    // eslint-disable-next-line obsidianmd/ui/sentence-case
                    .setPlaceholder("final,archived")
                    .setValue(
                        this.plugin.settings.excludeStatus.join(
                            ","
                        )
                    )
                    .onChange(async (value) => {
                        const statuses = value
                            .split(",")
                            .map((s) => s.trim().toUpperCase())
                            .filter((s) => s.length > 0);
                        this.plugin.settings.excludeStatus = statuses;
                        await this.plugin.saveSettings();
                    })
            );
    }
}