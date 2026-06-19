import { bench, describe } from 'vitest';

import { SingletonManager } from '../../qlogicae/aklot1/singletonManager';

class TestClass {
	public value = Math.random();
}

describe('SingletonManagerBenchmark', () => {
	bench('construct', () => {
		SingletonManager.construct();
	});

	bench('destruct', () => {
		SingletonManager.destruct();
	});

	bench('setup', () => {
		SingletonManager.setup({
			key: 'value'
		});
	});

	bench('reset', () => {
		SingletonManager.reset();
	});

	bench('getSingleton_first_time', () => {
		SingletonManager.destruct();
		SingletonManager.getSingleton(TestClass);
	});

	bench('getSingleton_cached', () => {
		SingletonManager.getSingleton(TestClass);
	});

	bench('getSingletonFromPool_first_access', () => {
		SingletonManager.destruct();
		SingletonManager.getSingletonFromPool(TestClass, 10, 3);
	});

	bench('getSingletonFromPool_cached_access', () => {
		SingletonManager.getSingletonFromPool(TestClass, 10, 3);
	});

	bench('getThisSingleton', () => {
		SingletonManager.getThisSingleton();
	});
});
