# Change Log

All notable changes to the **LaTeX Vertical Comment Formatter** extension will be documented in this file.

## [1.2.0] - 2026-08-09

### Added
- Smart Batch Directory Filtering: Recursively processes content/body TeX files while automatically skipping non-content macro definitions (`02_macros_*.tex`) and root project driver files (`03_AllTexFiles.tex`).
- Cross-Referencing Documentation & Architecture: Synchronized companion project architecture linking VS Code Extension and Python CLI script.

## [1.1.0] - 2026-08-09


### Added
- Secondary Post-Formatter execution: Option to kick a custom VS Code command (e.g. `latex-workshop.indent`, `editor.action.reindentlines`) or external CLI tool (e.g. `latexindent -w {file}`) automatically after vertical comment formatting.
- Configurable settings: `latexVerticalCommentFormatter.enablePostFormat` and `latexVerticalCommentFormatter.postFormatCommand`.
- CLI `-p` / `--post-command` flag and interactive menu option in base Python script `latex_vertical_comment_formatter.py`.

### Fixed
- Fixed unwanted blank line gaps between adjacent target comment blocks in both Python script and VS Code Extension.

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
