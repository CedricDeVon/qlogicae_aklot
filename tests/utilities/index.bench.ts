import { bench, describe } from 'vitest';
import { greet } from '../../sources/utilities';

describe('greet', () => {
	bench('returns a true', () => {
		greet('World');
	});
});
