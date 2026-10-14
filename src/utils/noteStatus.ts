import type { App, TFile } from "obsidian";

export function isFinalized(file: TFile, app: App): boolean {
    const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter;
    if (!frontmatter) {
        return false;
    }
    const status = frontmatter.status as unknown;
    if (typeof status === "string") {
        return status.toUpperCase() === "FINAL";
    }

    if (Array.isArray(status)) {
        return status.some(
            (value: unknown) =>
                typeof value === "string" &&
                value.toUpperCase() === "FINAL",
        );
    }

    return false;
}