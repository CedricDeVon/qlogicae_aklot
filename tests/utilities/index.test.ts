import { describe, expect, it } from 'vitest';
import { greet } from '../../sources/utilities';

describe('greet', () => {
	it('returns a true', () => {
		expect(greet('World')).toBeTruthy();
	});
});
