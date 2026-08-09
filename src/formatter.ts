/**
 * LaTeX Vertical Comment Formatter for Sanskrit Critical Editions
 * ===============================================================
 *
 * Author: lalitaalaalitah
 * Website: https://www.lalitaalaalitah.com
 * GitHub: https://github.com/lalitaalaalitah
 * Version: 1.0.0
 *
 * Description:
 *   Core formatting module for LaTeX critical edition files. Inserts, normalizes,
 *   and enforces exactly N commented lines (%) before and after structural markers:
 *     - Tag markers: %<*1>%, %</1>%, %<*१>%, %</१>%, etc.
 *     - TeX block markers: \pstart%, \pend%
 *     - Environment boundaries: \begin{...}, \end{...}
 *     - Section & Shloka commands: \section{...}, \shlokaH{...}
 *
 *   Preserves indentation and guarantees idempotency.
 */

export interface FormatterTargetPatterns {
  tagMarkers?: boolean;
  pstartPend?: boolean;
  environments?: boolean;
  structuralCommands?: boolean;
}

export interface FormatterOptions {
  commentCount?: number;
  targetPatterns?: FormatterTargetPatterns;
}

// Regex patterns for structural targets
const TAG_MARKER_PATTERN = /^\s*%(?:<[*\/][\d\u0966-\u096f]+>%|<[*\/][^>]+>\%)/i;
const PSTART_PEND_PATTERN = /^\s*\\(pstart|pend)%?\s*$/i;
const ENV_BOUNDARY_PATTERN = /^\s*\\(begin|end)\{(?:vyAkhyA|Jnanankusham|TikaA|TikaB|Pathabhedah|Ardhashlokanukramanika|[A-Za-z0-9_]+)\}/i;
const STRUCTURAL_CMD_PATTERN = /^\s*\\(section|subsection|subsubsection|shlokaH|granthaH)\b/i;

// Patterns for filtering out non-content macro and master project driver files
const MACRO_FILENAME_PATTERN = /(?:^|[\/_\-])macros?(?:[\/_\-]|\.tex$)|02_macros_|macros\.tex$/i;
const PROJECT_FILENAME_PATTERN = /03_AllTexFiles\.tex$|master\.tex$|main\.tex$|_project_launch/i;

/**
 * Checks if a .tex file is a valid content/body TeX file.
 * Excludes macro definitions and root project driver files without body content.
 */
export function isContentTexDocument(fileName: string, content: string, patterns?: FormatterTargetPatterns): boolean {
  const name = fileName.split(/[/\\]/).pop()?.toLowerCase() || "";

  if (MACRO_FILENAME_PATTERN.test(name) || PROJECT_FILENAME_PATTERN.test(name)) {
    return false;
  }

  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    if (isTargetLine(line, patterns)) {
      return true;
    }
  }

  if (content.includes("\\documentclass") || content.includes("\\usepackage") || content.includes("\\newcommand")) {
    return false;
  }

  return content.trim().length > 0;
}

/**
 * Checks if a line is empty/whitespace-only OR contains ONLY '%' with optional leading whitespace.
 */
export function isBlankOrPureCommentLine(line: string): boolean {
  const stripped = line.trim();
  return stripped === "" || stripped === "%";
}


/**
 * Checks if a line contains ONLY '%' with optional leading whitespace.
 */
export function isPureCommentLine(line: string): boolean {
  return line.trim() === "%";
}

/**
 * Checks if a line contains a target marker requiring surrounding commented lines.
 */
export function isTargetLine(line: string, patterns?: FormatterTargetPatterns): boolean {
  const stripped = line.trim();
  if (!stripped) {
    return false;
  }

  const checkTags = patterns?.tagMarkers ?? true;
  const checkPstart = patterns?.pstartPend ?? true;
  const checkEnvs = patterns?.environments ?? true;
  const checkCmds = patterns?.structuralCommands ?? true;

  return (
    (checkTags && TAG_MARKER_PATTERN.test(line)) ||
    (checkPstart && PSTART_PEND_PATTERN.test(line)) ||
    (checkEnvs && ENV_BOUNDARY_PATTERN.test(line)) ||
    (checkCmds && STRUCTURAL_CMD_PATTERN.test(line))
  );
}

/**
 * Formats content to ensure exactly `commentCount` commented lines (%)
 * exist before and after every target marker/command, stripping any unwanted
 * blank lines around comment blocks.
 *
 * Idempotent: repeating formatting yields the exact same clean output.
 */
export function formatLatexComments(content: string, options?: FormatterOptions): string {
  if (!content) {
    return "";
  }

  const commentCount = options?.commentCount ?? 3;
  const patterns = options?.targetPatterns;

  const isCRLF = content.includes("\r\n");
  const lineEnding = isCRLF ? "\r\n" : "\n";
  const lines = content.split(/\r?\n/);
  const numLines = lines.length;

  if (numLines === 0) {
    return "";
  }

  const resultLines: string[] = [];
  let i = 0;

  while (i < numLines) {
    const line = lines[i];

    if (isTargetLine(line, patterns)) {
      // Extract leading indentation of target line
      const indentLength = line.length - line.trimStart().length;
      const indent = line.substring(0, indentLength);
      const commentLine = `${indent}%`;

      // Remove existing pure comment lines and blank lines directly before this target in resultLines
      while (resultLines.length > 0 && isBlankOrPureCommentLine(resultLines[resultLines.length - 1])) {
        resultLines.pop();
      }

      // Insert exactly commentCount comment lines before target
      for (let c = 0; c < commentCount; c++) {
        resultLines.push(commentLine);
      }

      // Insert the target line itself
      resultLines.push(line);

      // Skip any pure comment lines or blank lines directly following this target in input lines
      i++;
      while (i < numLines && isBlankOrPureCommentLine(lines[i])) {
        i++;
      }

      // Insert exactly commentCount comment lines after target
      for (let c = 0; c < commentCount; c++) {
        resultLines.push(commentLine);
      }
    } else {
      resultLines.push(line);
      i++;
    }
  }

  const hasTrailingNewline = content.endsWith("\n") || content.endsWith("\r\n");
  let output = resultLines.join(lineEnding);
  if (hasTrailingNewline && !output.endsWith(lineEnding)) {
    output += lineEnding;
  }

  return output;
}

