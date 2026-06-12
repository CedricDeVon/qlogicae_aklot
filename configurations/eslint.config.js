import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: [
			'build/**',
			'builds/**',
			'dist/**',
			'dists/**',
			'sandbox/**',
			'node_modules/**',
			'coverage/**',
			'coverages/**',
			'library/**',
			'libraries/**',
			'report/**',
			'reports/**'
		]
	},

	js.configs.recommended,
	...tseslint.configs.recommended,

	{
		files: ['**/*.ts'],
		rules: {}
	}
);
