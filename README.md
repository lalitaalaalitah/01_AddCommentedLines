# LaTeX Vertical Comment Formatter for VS Code & Antigravity IDE

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/lalitaalaalitah/01_AddCommentedLines)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-purple.svg)](https://marketplace.visualstudio.com/items?itemName=lalitaalaalitah.latex-vertical-comment-formatter)
[![Open VSX](https://img.shields.io/badge/Open%20VSX-Registry-orange.svg)](https://open-vsx.org/extension/lalitaalaalitah/latex-vertical-comment-formatter)

> **Automated, idempotent LaTeX vertical comment line (`%`) formatter for Sanskrit critical editions, classical TeX text structures, and multi-layered commentary environments.**

---

## Metadata & Author Information

- **Author:** `lalitaalaalitah`
- **Website:** [https://www.lalitaalaalitah.com](https://www.lalitaalaalitah.com)
- **GitHub Profile:** [https://github.com/lalitaalaalitah](https://github.com/lalitaalaalitah)
- **Repository:** [https://github.com/lalitaalaalitah/01_AddCommentedLines](https://github.com/lalitaalaalitah/01_AddCommentedLines)
- **Version:** `1.0.0`

---

## Overview

In Sanskrit critical editions and complex LaTeX typesetting pipelines (such as `reledmac` / `ekdosis`), structural markers and tag boundaries must be cleanly isolated using exact vertical comment lines (`%`). 

This extension automatically inserts, normalizes, and enforces a configurable number of pure comment lines (default: **3**) directly before and after key LaTeX constructs:

- **Tag Markers:** `%<*1>%`, `%</1>%`, `%<*१>%`, `%</१>%`, `%<*2>%`, `%</2>%`
- **TeX Block Markers:** `\pstart%`, `\pend%` (and variants without `%`)
- **Environment Boundaries:** `\begin{vyAkhyA}`, `\end{vyAkhyA}`, `\begin{Jnanankusham}`, `\begin{Pathabhedah}`, etc.
- **Structural Commands:** `\section`, `\subsection`, `\subsubsection`, `\shlokaH`, `\granthaH`

### Key Features

- **Format on Save & Manual Format:** Seamlessly format files automatically when saving (`editor.formatOnSave` / `latexVerticalCommentFormatter.formatOnSave`) or manually via shortcut/command palette.
- **Preserves Indentation:** Adapts to line indentation so `%` comments align with surrounding code structure.
- **Guaranteed Idempotency:** Running formatting multiple times yields the exact same clean output without accumulating redundant duplicate `%` lines.
- **Smart Batch Workspace Formatting:** Format all content `.tex` files across your workspace in a single click with progress reporting, automatically skipping non-content macro definitions (`02_macros_*.tex`) and root project driver files (`03_AllTexFiles.tex`).
- **Secondary Post-Formatter Execution:** Optionally kick a custom VS Code command (e.g. `latex-workshop.indent`) or CLI tool (e.g. `latexindent -w {file}`) automatically after formatting.
- **Companion CLI Python Script:** This extension is tightly coupled with the official [LaTeX Project Helpers CLI Script](https://github.com/lalitaalaalitah/21_LaTeXProjectHelpers) (`latex_vertical_comment_formatter.py`), sharing the exact same core formatting engine and smart batch filtering logic.


---

## Example Before & After

### Before Formatting
```latex
%<*1>%
\pstart%
\shlokaH{धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।}
\pend%
%</1>%
```

### After Formatting (3-Line Comment Padding)
```latex
%
%
%
%<*1>%
%
%
%
%
%
%
\pstart%
%
%
%
    %
    %
    %
    \shlokaH{धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।}
    %
    %
    %
%
%
%
\pend%
%
%
%
%
%
%
%</1>%
%
%
%
```

---

## Extension Settings

Customize extension behavior in VS Code settings (`settings.json`):

| Setting | Default | Description |
| :--- | :--- | :--- |
| `latexVerticalCommentFormatter.commentCount` | `3` | Number of commented lines (`%`) to insert before and after target markers. |
| `latexVerticalCommentFormatter.formatOnSave` | `true` | Automatically format LaTeX files when saved. |
| `latexVerticalCommentFormatter.enablePostFormat` | `false` | Enable executing secondary post-formatter command after vertical comment formatting. |
| `latexVerticalCommentFormatter.postFormatCommand` | `""` | Secondary VS Code command ID (e.g. `latex-workshop.indent`) or CLI command (e.g. `latexindent -w {file}`) to execute after formatting. |
| `latexVerticalCommentFormatter.targetPatterns.tagMarkers` | `true` | Include tag markers (e.g. `%<*1>%`, `%</1>%`, `%<*१>%`, `%</१>`). |
| `latexVerticalCommentFormatter.targetPatterns.pstartPend` | `true` | Include `\pstart%` and `\pend%` block markers. |
| `latexVerticalCommentFormatter.targetPatterns.environments` | `true` | Include `\begin{...}` and `\end{...}` boundaries. |
| `latexVerticalCommentFormatter.targetPatterns.structuralCommands` | `true` | Include `\section`, `\subsection`, `\shlokaH`, `\granthaH`. |


---

## Commands & Keyboard Shortcuts

Open the Command Palette (`Cmd+Shift+P` on macOS / `Ctrl+Shift+P` on Windows/Linux) and search for:

- **LaTeX Formatter: Format Current Document**
- **LaTeX Formatter: Format Selection**
- **LaTeX Formatter: Format All TeX Files in Workspace**

Standard VS Code formatting shortcuts also apply:
- **Format Document:** `Shift+Option+F` (macOS) / `Shift+Alt+F` (Windows/Linux)
- **Format Selection:** `Cmd+K Cmd+F` (macOS) / `Ctrl+K Ctrl+F` (Windows/Linux)

---

## License

Distributed under the [MIT License](LICENSE).
Copyright (c) 2026 `lalitaalaalitah` ([https://www.lalitaalaalitah.com](https://www.lalitaalaalitah.com)).
