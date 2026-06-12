import { build } from 'esbuild';
import { Glob } from 'bun';

const entryPoints = [];

for await (const file of new Glob('**/*.ts').scan('src')) {
	entryPoints.push(`src/${file}`);
}

await build({
	entryPoints,
	outbase: 'src',
	outdir: 'build',
	bundle: false,
	format: 'esm',
	platform: 'neutral',
	target: 'esnext',
	sourcemap: true
});
