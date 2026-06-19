import { Glob } from 'bun';
import { obfuscate } from 'javascript-obfuscator';
import { readFile, writeFile } from 'node:fs/promises';

for await (const file of new Glob('**/*.js').scan('qlogicae')) {
	const file_path = `qlogicae/${file}`;

	const source_code = await readFile(file_path, 'utf8');

	const result = obfuscate(source_code, {
		compact: true,
		controlFlowFlattening: true,
		controlFlowFlatteningThreshold: 1,
		deadCodeInjection: true,
		deadCodeInjectionThreshold: 0.4,
		debugProtection: true,
		debugProtectionInterval: 4000,
		stringArray: true,
		stringArrayEncoding: ['base64', 'rc4'],
		stringArrayThreshold: 1,
		stringArrayShuffle: true,
		splitStrings: true,
		splitStringsChunkLength: 3,
		identifierNamesGenerator: 'mangled-shuffled',
		renameGlobals: false,
		selfDefending: true,
		simplify: true,
		transformObjectKeys: true,
		disableConsoleOutput: true,
		numbersToExpressions: true,
		stringArrayCallsTransform: true,
		stringArrayCallsTransformThreshold: 1,
		seed: 42
	});

	await writeFile(file_path, result.getObfuscatedCode(), 'utf8');
}
