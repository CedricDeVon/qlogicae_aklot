import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		coverage: {
			provider: 'v8',
			reporter: ['clover', 'html', 'json', 'lcov', 'text'],
			reportsDirectory: './coverage'
		}
	}
});
