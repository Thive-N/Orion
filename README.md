# Orion

Orion is a lightweight, proactive vault management plugin for Obsidian. It helps you identify and surface “silent issues” in your vault, starting with stale note detection.

## ✨ Features

### 📅 Stale Note Detection
Orion scans your vault and identifies notes that haven’t been modified within a configurable time window (default: 7 days).

### 🧠 Proactive Vault Management (planned)
Orion is designed to evolve into a full vault health system, including:

- Orphaned note detection (no backlinks)
- Empty or incomplete notes
- TODO aging tracker
- Inbox / unprocessed notes
- Vault health dashboard

---

## 🚀 Installation (Development)

1. Clone this repository into your vault’s plugin folder:

```bash
.git clone <repo-url>
cd orion
npm install
````

2. Build the plugin:

```bash
npm run build
```

3. Enable it in Obsidian:

* Go to **Settings → Community Plugins**
* Enable **Orion**

---

## ⚙️ Settings

Orion currently supports:

### Stale Note Threshold

* Type: Number
* Default: `7`
* Description: Number of days before a note is considered stale

---

## 🧩 Commands

### Check Stale Notes

Manually scans the vault and opens a modal listing all stale notes.

---

## 🏗️ Development

### Build in watch mode

```bash
npm run dev
```

## ⚠️ Disclaimer

This plugin modifies no content in your vault. It is strictly read-only in its current version.

---

## 🪐 Philosophy

Orion treats your vault like a living system — not a static folder of notes. The goal is to surface entropy before it becomes clutter.

---