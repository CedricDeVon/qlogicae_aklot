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
			'report/**',
			'reports/**',
			'.qlogicae/**',
			'qlogicae/**'
		]
	},

	js.configs.recommended,
	...tseslint.configs.recommended,

	{
		files: ['**/*.ts'],
		rules: {}
	}
);
