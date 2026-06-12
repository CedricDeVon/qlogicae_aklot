import { bench, describe } from 'vitest';
import { greet } from '../../src/utils';

describe('greet', () => {
	bench('returns a true', () => {
		greet('World');
	});
});
