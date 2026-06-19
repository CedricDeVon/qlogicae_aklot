import { mergeConfig } from 'vitest/config';
import baseConfig from './vitest.config';

export default mergeConfig(baseConfig, {
	test: {
		coverage: {
			reportsDirectory: './reports/tests/bench'
		},
		include: ['./tests/**/*.bench.ts']
	}
});
