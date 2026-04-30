// Post-build: mirror content/docs/**/*.mdx into out/docs/ so that
// https://docs.syncropel.com/docs/<path>.mdx serves the raw MDX source
// for LLM and script consumers. Runs after `next build` with output: 'export'.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = join(projectRoot, 'content', 'docs');
const outDocsRoot = join(projectRoot, 'out', 'docs');

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      yield full;
    }
  }
}

let written = 0;
for await (const absolutePath of walk(sourceRoot)) {
  const relPath = relative(sourceRoot, absolutePath);
  const targetPath = join(outDocsRoot, relPath);
  await mkdir(dirname(targetPath), { recursive: true });
  const content = await readFile(absolutePath, 'utf8');
  await writeFile(targetPath, content, 'utf8');
  written++;
}

console.log(`✓ mirrored ${written} .mdx files to ${outDocsRoot}/`);
