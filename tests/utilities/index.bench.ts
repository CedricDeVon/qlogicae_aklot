import { bench, describe } from 'vitest';
import { greet } from '../../library/utilities';

describe('greet', () => {
	bench('returns a true', () => {
		greet('World');
	});
});
