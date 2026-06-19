import { Glob } from 'bun';
import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';

await mkdir('qlogicae', {
	recursive: true
});

const entry_points = [];

for await (const file of new Glob('**/*.ts').scan('sources')) {
	entry_points.push(`sources/${file}`);
}

await build({
	entryPoints: entry_points,
	outbase: 'sources',
	outdir: 'qlogicae',
	bundle: false,
	format: 'esm',
	platform: 'neutral',
	target: 'esnext',
	sourcemap: true
});
