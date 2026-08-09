# Change Log

All notable changes to the **LaTeX Vertical Comment Formatter** extension will be documented in this file.

## [1.0.0] - 2026-08-09

### Added
- Initial release of LaTeX Vertical Comment Formatter for VS Code & Antigravity IDE.
- Core formatting engine in TypeScript enforcing exact 3-commented-line (%) vertical block spacing around structural tags (`%<*1>%`), TeX block markers (`\pstart%`, `\pend%`), environments (`\begin{...}`), and sections (`\shlokaH`, `\section`).
- Document Formatting Provider (`vscode.languages.registerDocumentFormattingEditProvider`).
- Document Range Formatting Provider (`vscode.languages.registerDocumentRangeFormattingEditProvider`).
- Commands for Manual Formatting (`formatDocument`, `formatSelection`, `formatWorkspace`).
- Configurable settings: `commentCount`, `formatOnSave`, `targetPatterns`.
- Devanagari and Roman tag numeral support.
- Fully idempotent formatting engine.
- Complete documentation (`README.md`, `HOW_TO_USE.md`, `HowToPublish_VSCE.md`, `HowToPublish_OVSX.md`).
