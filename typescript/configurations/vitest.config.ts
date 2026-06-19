import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		coverage: {
			clean: true,
			provider: 'v8',
			reporter: ['clover', 'html', 'json', 'lcov', 'text']
		}
	}
});
