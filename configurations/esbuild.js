import { build } from 'esbuild';
import { Glob } from 'bun';

const entryPoints = [];

for await (const file of new Glob('**/*.ts').scan('sources')) {
	entryPoints.push(`sources/${file}`);
}

await build({
	entryPoints,
	outbase: 'sources',
	outdir: 'build',
	bundle: false,
	format: 'esm',
	platform: 'neutral',
	target: 'esnext',
	sourcemap: true
});
