import { describe, expect, it } from 'vitest';
import { greet } from '../../src/utils';

describe('greet', () => {
	it('returns a true', () => {
		expect(greet('World')).toBeTruthy();
	});
});
