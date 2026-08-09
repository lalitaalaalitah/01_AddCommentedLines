import * as assert from "assert";
import { formatLatexComments, isTargetLine, isPureCommentLine } from "../../formatter";

suite("LaTeX Vertical Comment Formatter Test Suite", () => {

  test("isPureCommentLine detects alone percent sign with whitespace", () => {
    assert.strictEqual(isPureCommentLine("%"), true);
    assert.strictEqual(isPureCommentLine("   %  "), true);
    assert.strictEqual(isPureCommentLine("% comment"), false);
    assert.strictEqual(isPureCommentLine("text %"), false);
  });

  test("isTargetLine recognizes tag markers, pstart/pend, environments, and sections", () => {
    assert.strictEqual(isTargetLine("%<*1>%"), true);
    assert.strictEqual(isTargetLine("  %</१>%"), true);
    assert.strictEqual(isTargetLine("\\pstart%"), true);
    assert.strictEqual(isTargetLine("    \\pend%"), true);
    assert.strictEqual(isTargetLine("\\begin{vyAkhyA}"), true);
    assert.strictEqual(isTargetLine("    \\end{Pathabhedah}"), true);
    assert.strictEqual(isTargetLine("\\section{Title}"), true);
    assert.strictEqual(isTargetLine("    \\shlokaH{text}"), true);

    assert.strictEqual(isTargetLine("Normal LaTeX text line"), false);
    assert.strictEqual(isTargetLine("% just a regular comment"), false);
  });

  test("formatLatexComments inserts 3 comments around \\pstart% and \\pend%", () => {
    const input = `\\pstart%\nSome text here\n\\pend%`;
    const expected = `%\n%\n%\n\\pstart%\n%\n%\n%\nSome text here\n%\n%\n%\n\\pend%\n%\n%\n%`;
    const result = formatLatexComments(input, { commentCount: 3 });
    assert.strictEqual(result, expected);
  });

  test("formatLatexComments preserves leading indentation", () => {
    const input = `    \\begin{vyAkhyA}\n        Text inside\n    \\end{vyAkhyA}`;
    const expected = `    %\n    %\n    %\n    \\begin{vyAkhyA}\n    %\n    %\n    %\n        Text inside\n    %\n    %\n    %\n    \\end{vyAkhyA}\n    %\n    %\n    %`;
    const result = formatLatexComments(input, { commentCount: 3 });
    assert.strictEqual(result, expected);
  });

  test("formatLatexComments is strictly idempotent", () => {
    const input = `%<*1>%\n\\pstart%\nText\n\\pend%\n%</1>%`;
    const firstPass = formatLatexComments(input, { commentCount: 3 });
    const secondPass = formatLatexComments(firstPass, { commentCount: 3 });
    const thirdPass = formatLatexComments(secondPass, { commentCount: 3 });
    assert.strictEqual(secondPass, firstPass);
    assert.strictEqual(thirdPass, firstPass);
  });

  test("formatLatexComments respects custom comment count", () => {
    const input = `\\section{Chapter 1}\nIntro`;
    const expected = `%\n%\n\\section{Chapter 1}\n%\n%\nIntro`;
    const result = formatLatexComments(input, { commentCount: 2 });
    assert.strictEqual(result, expected);
  });

  test("formatLatexComments handles Devanagari tag markers", () => {
    const input = `%<*१>%\nVerse\n%</१>%`;
    const result = formatLatexComments(input, { commentCount: 3 });
    assert.strictEqual(result.includes("%<*१>%"), true);
    assert.strictEqual(result.includes("%</१>%"), true);
  });
});
