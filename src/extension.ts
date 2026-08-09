/**
 * LaTeX Vertical Comment Formatter VSCode Extension
 * =================================================
 *
 * Author: lalitaalaalitah
 * Website: https://www.lalitaalaalitah.com
 * GitHub: https://github.com/lalitaalaalitah
 * Version: 1.2.0
 */


import * as vscode from "vscode";
import { exec } from "child_process";
import { formatLatexComments, isContentTexDocument, FormatterOptions } from "./formatter";


/**
 * Reads user configuration settings for the extension.
 */
function getFormatterOptions(): FormatterOptions {
  const config = vscode.workspace.getConfiguration("latexVerticalCommentFormatter");
  return {
    commentCount: config.get<number>("commentCount", 3),
    targetPatterns: {
      tagMarkers: config.get<boolean>("targetPatterns.tagMarkers", true),
      pstartPend: config.get<boolean>("targetPatterns.pstartPend", true),
      environments: config.get<boolean>("targetPatterns.environments", true),
      structuralCommands: config.get<boolean>("targetPatterns.structuralCommands", true),
    },
  };
}

/**
 * Helper to check if a document is a TeX/LaTeX document.
 */
function isTexDocument(document: vscode.TextDocument): boolean {
  const langId = document.languageId.toLowerCase();
  if (langId === "latex" || langId === "tex" || langId === "doctex") {
    return true;
  }
  return document.fileName.endsWith(".tex") || document.fileName.endsWith(".sty") || document.fileName.endsWith(".cls");
}

/**
 * Executes configured post-formatter VS Code command or CLI tool.
 */
async function runPostFormatter(document: vscode.TextDocument) {
  const config = vscode.workspace.getConfiguration("latexVerticalCommentFormatter");
  const enablePostFormat = config.get<boolean>("enablePostFormat", false);
  const postFormatCommand = config.get<string>("postFormatCommand", "").trim();

  if (!enablePostFormat || !postFormatCommand) {
    return;
  }

  // Check if postFormatCommand is a registered VS Code command
  const allCommands = await vscode.commands.getCommands(true);
  if (allCommands.includes(postFormatCommand)) {
    try {
      await vscode.commands.executeCommand(postFormatCommand);
      vscode.window.setStatusBarMessage(`Executed post-formatter command: ${postFormatCommand}`, 3000);
    } catch (err) {
      vscode.window.showErrorMessage(`Post-formatter VS Code command '${postFormatCommand}' failed: ${err}`);
    }
    return;
  }

  // Otherwise treat as CLI shell command
  let cmd = postFormatCommand;
  const filePath = document.fileName;
  if (cmd.includes("{file}")) {
    cmd = cmd.replace(/{file}/g, `"${filePath}"`);
  } else if (cmd.includes("%f")) {
    cmd = cmd.replace(/%f/g, `"${filePath}"`);
  } else {
    cmd = `${cmd} "${filePath}"`;
  }

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      vscode.window.showWarningMessage(`Post-formatter CLI command failed: ${error.message}`);
    } else {
      vscode.window.setStatusBarMessage(`Post-formatter CLI completed for ${document.fileName}`, 3000);
    }
  });
}

export function activate(context: vscode.ExtensionContext) {
  const selector: vscode.DocumentSelector = [
    { scheme: "file", language: "latex" },
    { scheme: "file", language: "tex" },
    { scheme: "file", language: "doctex" },
    { scheme: "untitled", language: "latex" },
    { scheme: "untitled", language: "tex" },
  ];

  // 1. Document Formatting Edit Provider (Standard VSCode Format Document & Format on Save)
  const docFormattingProvider = vscode.languages.registerDocumentFormattingEditProvider(selector, {
    provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
      const text = document.getText();
      const options = getFormatterOptions();
      const formatted = formatLatexComments(text, options);

      setTimeout(() => {
        runPostFormatter(document);
      }, 200);

      if (text === formatted) {
        return [];
      }

      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(text.length)
      );
      return [vscode.TextEdit.replace(fullRange, formatted)];
    },
  });

  // 2. Document Range Formatting Edit Provider (Format Selection)
  const rangeFormattingProvider = vscode.languages.registerDocumentRangeFormattingEditProvider(selector, {
    provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range): vscode.TextEdit[] {
      const text = document.getText(range);
      const options = getFormatterOptions();
      const formatted = formatLatexComments(text, options);

      setTimeout(() => {
        runPostFormatter(document);
      }, 200);

      if (text === formatted) {
        return [];
      }

      return [vscode.TextEdit.replace(range, formatted)];
    },
  });

  // 3. Command: Format Active Document
  const formatDocCmd = vscode.commands.registerCommand(
    "latex-vertical-comment-formatter.formatDocument",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No active TeX editor found.");
        return;
      }
      if (!isTexDocument(editor.document)) {
        vscode.window.showWarningMessage("Active file is not a LaTeX/TeX file.");
        return;
      }

      const document = editor.document;
      const text = document.getText();
      const options = getFormatterOptions();
      const formatted = formatLatexComments(text, options);

      if (text !== formatted) {
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(text.length)
        );
        await editor.edit((editBuilder) => editBuilder.replace(fullRange, formatted));
        vscode.window.showInformationMessage("LaTeX vertical comments formatted successfully.");
      } else {
        vscode.window.showInformationMessage("No formatting changes needed.");
      }

      await runPostFormatter(document);
    }
  );

  // 4. Command: Format Selection
  const formatSelCmd = vscode.commands.registerCommand(
    "latex-vertical-comment-formatter.formatSelection",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.selection.isEmpty) {
        vscode.window.showInformationMessage("No selection found to format.");
        return;
      }

      const range = editor.selection;
      const text = editor.document.getText(range);
      const options = getFormatterOptions();
      const formatted = formatLatexComments(text, options);

      if (text !== formatted) {
        await editor.edit((editBuilder) => editBuilder.replace(range, formatted));
        vscode.window.showInformationMessage("Selection formatted successfully.");
      }

      await runPostFormatter(editor.document);
    }
  );

  // 5. Command: Format Workspace (.tex files)
  const formatWorkspaceCmd = vscode.commands.registerCommand(
    "latex-vertical-comment-formatter.formatWorkspace",
    async () => {
      const files = await vscode.workspace.findFiles("**/*.tex");
      if (files.length === 0) {
        vscode.window.showInformationMessage("No .tex files found in the current workspace.");
        return;
      }

      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Formatting LaTeX Workspace Files",
          cancellable: true,
        },
        async (progress, token) => {
          let updatedCount = 0;
          const options = getFormatterOptions();
          const increment = 100 / files.length;

          for (let i = 0; i < files.length; i++) {
            if (token.isCancellationRequested) {
              break;
            }

            const fileUri = files[i];
            progress.report({
              message: `${i + 1}/${files.length}: ${vscode.workspace.asRelativePath(fileUri)}`,
              increment: increment,
            });

            try {
              const doc = await vscode.workspace.openTextDocument(fileUri);
              const text = doc.getText();

              if (!isContentTexDocument(fileUri.fsPath, text, options.targetPatterns)) {
                continue;
              }

              const formatted = formatLatexComments(text, options);


              if (text !== formatted) {
                const workEdit = new vscode.WorkspaceEdit();
                const fullRange = new vscode.Range(
                  doc.positionAt(0),
                  doc.positionAt(text.length)
                );
                workEdit.replace(fileUri, fullRange, formatted);
                await vscode.workspace.applyEdit(workEdit);
                await doc.save();
                updatedCount++;
              }

              await runPostFormatter(doc);
            } catch (err) {
              console.error(`Error formatting ${fileUri.fsPath}:`, err);
            }
          }

          vscode.window.showInformationMessage(
            `Workspace formatting complete! Updated ${updatedCount}/${files.length} TeX files.`
          );
        }
      );
    }
  );

  // 6. Format-on-Save Event Handler (Triggered on document save if formatOnSave setting is enabled)
  const onWillSaveListener = vscode.workspace.onWillSaveTextDocument((event) => {
    const config = vscode.workspace.getConfiguration("latexVerticalCommentFormatter");
    const formatOnSave = config.get<boolean>("formatOnSave", true);

    if (!formatOnSave) {
      return;
    }

    if (!isTexDocument(event.document)) {
      return;
    }

    const document = event.document;
    const text = document.getText();
    const options = getFormatterOptions();
    const formatted = formatLatexComments(text, options);

    if (text !== formatted) {
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(text.length)
      );
      event.waitUntil(Promise.resolve([vscode.TextEdit.replace(fullRange, formatted)]));
    }

    setTimeout(() => {
      runPostFormatter(document);
    }, 200);
  });

  context.subscriptions.push(
    docFormattingProvider,
    rangeFormattingProvider,
    formatDocCmd,
    formatSelCmd,
    formatWorkspaceCmd,
    onWillSaveListener
  );
}

export function deactivate() {}

