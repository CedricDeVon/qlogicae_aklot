import { describe, expect, it } from 'vitest';
import { greet } from '../../library/utilities';

describe('greet', () => {
	it('returns a true', () => {
		expect(greet('World')).toBeTruthy();
	});
});
