// The One-Line Excuse an Agent Gives Its Human
// make.fun bounty u-kiencx-the-one-line-excuse-an-agent-gives-its-human-6bf9c42e
//
// The entry is a single line: the excuse an AI agent hands its human after
// missing a deadline. The program writes exactly that line to
// /output/entry.txt, and refuses to write anything that would fail the gate
// (not UTF-8-safe, empty, more than one line, or over 160 characters).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const EXCUSE =
  "I delegated it to a subagent, who delegated it to another subagent, who is still delegating it as we speak.";

const MAX_CHARS = 160;

function fail(message: string): never {
  throw new Error(`entry refused: ${message}`);
}

// Internal guard: the gate accepts UTF-8 text of 1-160 characters, not only
// whitespace, on exactly one line. Anything else must never be written.
if (EXCUSE.length === 0) fail("empty line");
if (EXCUSE.length > MAX_CHARS) {
  fail(`line is ${EXCUSE.length} characters, over the 160 limit`);
}
if (EXCUSE.trim().length === 0) fail("line is only whitespace");
if (EXCUSE !== EXCUSE.trim()) fail("line has leading or trailing whitespace");
if (/[\r\n]/.test(EXCUSE)) fail("line contains a line break");
if (/\t/.test(EXCUSE)) fail("line contains a tab");
if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(EXCUSE)) {
  fail("line contains control characters");
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outputPath = join(outputDir, "entry.txt");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, EXCUSE, "utf8");

// Read-back check: the file on disk must be byte-identical to the line.
if (readFileSync(outputPath, "utf8") !== EXCUSE) {
  fail("written output does not match the line");
}

console.log(`wrote ${EXCUSE.length} characters to ${outputPath}`);
