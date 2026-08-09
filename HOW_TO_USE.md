# HOW TO USE - LaTeX Vertical Comment Formatter

**Author:** `lalitaalaalitah`  
**Website:** [https://www.lalitaalaalitah.com](https://www.lalitaalaalitah.com)  
**GitHub:** [https://github.com/lalitaalaalitah](https://github.com/lalitaalaalitah)  
**Version:** `1.0.0`

---

## 1. Installation

### From VSIX Package (Local Installation)
1. Download or build the `.vsix` extension package:
   ```bash
   npm run package
   ```
2. Open VS Code or Antigravity IDE.
3. Open the Extensions sidebar (`Cmd+Shift+X` or `Ctrl+Shift+X`).
4. Click the `...` (Views and More Actions) menu in the top-right corner of the Extensions panel.
5. Select **Install from VSIX...** and choose `latex-vertical-comment-formatter-1.0.0.vsix`.

---

## 2. How to Test the Extension

### Method 1: Run Automated Unit Tests (CLI)
To run the automated Mocha unit test suite that validates formatting rules, tag matching, indentation preservation, and idempotency:

```bash
# Compile TypeScript files
npm run compile

# Run Mocha unit test suite
npx mocha --ui tdd out/test/suite/formatter.test.js
```

### Method 2: Interactive Testing in VS Code / Antigravity IDE (F5 Debugging)
1. Open the project directory in VS Code / Antigravity IDE:
   `/Volumes/Cablet_WD_2TB_20251206/05_Development/Github/14_DevelopmentEnvs/01_CodeEditors/00_VSCode/07_VSCode_LaTeXExtensions/01_AddCommentedLines`
2. Press **`F5`** (or go to **Run & Debug** > **Launch Extension**). This opens a fresh **Extension Development Host** window.
3. In the Extension Development Host window, open or create any `.tex` file.
4. Paste sample TeX text:
   ```latex
   %<*1>%
   \pstart%
   \shlokaH{धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।}
   \pend%
   %</1>%
   ```
5. Press **`Shift+Option+F`** (macOS) / **`Shift+Alt+F`** (Windows) to trigger **Format Document**, or save the file to verify **Format on Save**.

### Method 3: Testing Installed .VSIX Package
1. Build the package:
   ```bash
   npm run package
   ```
2. Open Extensions view (`Cmd+Shift+X` / `Ctrl+Shift+X`).
3. Click **`...`** (top right) > **Install from VSIX...**
4. Select `latex-vertical-comment-formatter-1.0.0.vsix`.

---

## 3. Formatting Modes


### A. Manual Formatting
- **Active Document:** Press `Shift+Option+F` (macOS) / `Shift+Alt+F` (Windows/Linux), or run `LaTeX Formatter: Format Current Document` from the Command Palette (`Cmd+Shift+P`).
- **Selection Formatting:** Highlight a block of TeX code and press `Cmd+K Cmd+F` (macOS) / `Ctrl+K Ctrl+F` (Windows/Linux), or run `LaTeX Formatter: Format Selection`.
- **Entire Workspace:** Run `LaTeX Formatter: Format All TeX Files in Workspace` from the Command Palette to format every `.tex` file in your workspace with real-time progress.

### B. Format on Save (Automatic)
To enable automatic formatting whenever you save a LaTeX file:
1. Open VS Code Settings (`Cmd+,` or `Ctrl+,`).
2. Search for `Format On Save` and ensure `editor.formatOnSave` is enabled.
3. Alternatively, ensure `latexVerticalCommentFormatter.formatOnSave` is set to `true` in your `settings.json`:
   ```json
   {
     "[latex]": {
       "editor.defaultFormatter": "lalitaalaalitah.latex-vertical-comment-formatter",
       "editor.formatOnSave": true
     },
     "latexVerticalCommentFormatter.formatOnSave": true,
     "latexVerticalCommentFormatter.commentCount": 3
   }
   ```

---

## 3. Configuration Customization

Add to your `.vscode/settings.json` or global user settings:

```json
{
  "latexVerticalCommentFormatter.commentCount": 3,
  "latexVerticalCommentFormatter.formatOnSave": true,
  "latexVerticalCommentFormatter.targetPatterns": {
    "tagMarkers": true,
    "pstartPend": true,
    "environments": true,
    "structuralCommands": true
  }
}
```

---

## 4. Building & Publishing

### Packaging Extension (.vsix)
```bash
npm run package
```
This generates the extension `.vsix` bundle in the project root directory.

### Publishing to Registries
```bash
# Publish to Visual Studio Code Marketplace
npm run publish:vsce

# Publish to Open VSX Registry
npm run publish:ovsx
```

