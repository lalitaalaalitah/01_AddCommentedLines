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
 * exist before and after every target marker/command.
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

      // Remove existing pure comment lines directly before this target in resultLines
      while (resultLines.length > 0 && isPureCommentLine(resultLines[resultLines.length - 1])) {
        resultLines.pop();
      }

      // Insert exactly commentCount comment lines before target
      for (let c = 0; c < commentCount; c++) {
        resultLines.push(commentLine);
      }

      // Insert the target line itself
      resultLines.push(line);

      // Skip any pure comment lines directly following this target in input lines
      i++;
      while (i < numLines && isPureCommentLine(lines[i])) {
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
