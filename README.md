# Typing Simulator for VS Code and Cursor

Typing Simulator simulates typing pre-written code for live presentations, classes, and video tutorials. It can type from the current file or clipboard in either automatic or manual mode.

This fork is maintained for Cursor/VS Code presentation use and includes fixes for clipboard line endings and CRLF typing.

Original project: https://github.com/marcosgomesneto/typing-simulator

## Install in Cursor

Download the latest `.vsix` file from this repository's GitHub Releases page.

In Cursor:

1. Press `Ctrl+Shift+P`.
2. Run `Extensions: Install from VSIX...`.
3. Select the downloaded `.vsix` file.
4. Reload Cursor if prompted.

If the original Marketplace version is already installed, uninstall or disable it first to avoid duplicate command registrations.

## Usage

1. Open a code file or copy the code you want to simulate to the clipboard.
2. Open Settings and search for `Typing Simulator`.
3. Choose `Manual` mode if you want to control the pace yourself.
4. Run `Typing Simulator: Start Typing From Clipboard` or `Typing Simulator: Start Typing From Current File`.
5. In Manual mode, press or hold ordinary typing keys to reveal the prepared code. The actual key you press is ignored; the next character from the prepared code is inserted instead.
6. Configure keyboard shortcuts for the Typing Simulator commands if desired.

For teaching or recording, a useful setup is to bind `Typing Simulator: Start Typing From Clipboard` to a shortcut, then hold a normal key such as `J` while you want code to appear and release it when you want to pause your delivery.

## Configuration

Press `Ctrl+Shift+P`, open User Settings, and search for `Typing Simulator`.

![configuration](https://raw.githubusercontent.com/xueshanlinghu/typing-simulator/main/resources/configuration.png)

Available settings:

- `typingSimulator.mode`: `auto` or `manual`
- `typingSimulator.speed`: `slow`, `medium`, or `fast` (used by automatic mode)

## Available Commands

- **Typing Simulator: Start Typing From Current File**
- **Typing Simulator: Start Typing From Clipboard**
- **Typing Simulator: Continue Typing**
- **Typing Simulator: Stop Typing**

## Actions per line

Add one of these comments to a line:

| End-line comment | Action |
| --- | --- |
| `//[pause]` or `#[pause]` | Pause typing |
| `//[ignore]` or `#[ignore]` | Ignore the line |
| `//[quick]` or `#[quick]` | Insert the line content immediately |

## Fork fixes

### 0.1.3

- Normalize clipboard line endings to the active editor's EOL format.
- Correctly type both LF and CRLF newlines.
- Add Cursor-focused package metadata and installation guidance.
- Add GitHub Actions CI/CD to build `.vsix` packages and publish GitHub Releases automatically.

## Build locally

The project can still be built locally when needed:

```bash
npm install
npm run compile
npx @vscode/vsce package
```

Yarn can also be used for installing dependencies and running the existing package scripts.

## Automated releases

Pushing to `main` runs the GitHub Actions build. The workflow reads the version from `package.json`, builds and lints the extension, packages a `.vsix`, and creates the corresponding `v<version>` GitHub Release if that release does not already exist.

A manually pushed version tag such as `v0.1.3` is also supported. If a tag version does not match `package.json`, the release workflow fails intentionally.

## License and credits

This project remains under the MIT License. The original extension was created by Marcos Gomes Neto; this fork keeps the original author attribution while using a separate publisher identity for forked VSIX builds.
