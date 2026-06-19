import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { SingletonManager } from '../../qlogicae/aklot1/singletonManager';
import { SingletonManagerConfigurations } from '../../qlogicae/aklot1/singletonManagerConfigurations';

class TestClass {
	public readonly value = Math.random();
}

class AlternateClass {
	public readonly value = Math.random();
}

class ThrowingClass {
	public constructor() {
		throw new Error('failure');
	}
}

describe('SingletonManagerTest', () => {
	beforeEach(() => {
		SingletonManager.destruct();
		SingletonManager.configurations = new SingletonManagerConfigurations();
	});

	afterEach(() => {
		SingletonManager.destruct();
		SingletonManager.configurations = new SingletonManagerConfigurations();
	});

	it('should_return_true_when_construct_called', () => {
		expect(SingletonManager.construct()).toBe(true);
	});

	it('should_return_true_when_destruct_called', () => {
		expect(SingletonManager.destruct()).toBe(true);
	});

	it('should_replace_configuration_when_setup_called', () => {
		const configuration = new SingletonManagerConfigurations();

		expect(SingletonManager.setup(configuration)).toBe(true);

		expect(SingletonManager.configurations).toBe(configuration);
	});

	it('should_clear_singletons_when_reset_called', () => {
		const first = SingletonManager.getSingleton(TestClass);

		expect(first).toBeDefined();

		SingletonManager.reset();

		const second = SingletonManager.getSingleton(TestClass);

		expect(second).not.toBe(first);
	});

	it('should_preserve_configuration_when_reset_called', () => {
		const configuration = new SingletonManagerConfigurations();

		SingletonManager.setup(configuration);

		SingletonManager.reset();

		expect(SingletonManager.configurations).toStrictEqual(configuration);
	});

	it.each([TestClass, AlternateClass])(
		'should_return_same_instance_when_get_singleton_called',
		(constructor_function) => {
			const first = SingletonManager.getSingleton(constructor_function);

			const second = SingletonManager.getSingleton(constructor_function);

			expect(first).toBe(second);
		}
	);

	it('should_return_different_instances_when_constructor_differs', () => {
		expect(SingletonManager.getSingleton(TestClass)).not.toBe(
			SingletonManager.getSingleton(AlternateClass)
		);
	});

	it('should_throw_when_constructor_throws_in_get_singleton', () => {
		expect(() => {
			SingletonManager.getSingleton(ThrowingClass);
		}).toThrow();
	});

	it.each([0, 1, 2, 3, 10, 100])(
		'should_return_pool_instance_when_index_valid',
		(index) => {
			const instance = SingletonManager.getSingletonFromPool(
				TestClass,
				5,
				index
			);

			expect(instance).toBeDefined();
		}
	);

	it('should_wrap_positive_index_when_pool_used', () => {
		const first = SingletonManager.getSingletonFromPool(TestClass, 3, 0);

		const wrapped = SingletonManager.getSingletonFromPool(TestClass, 3, 3);

		expect(first).toBe(wrapped);
	});

	it('should_wrap_negative_index_when_pool_used', () => {
		const first = SingletonManager.getSingletonFromPool(TestClass, 3, -1);

		const second = SingletonManager.getSingletonFromPool(TestClass, 3, 1);

		expect(first).toBe(second);
	});

	it('should_throw_when_instance_count_zero', () => {
		expect(() => {
			SingletonManager.getSingletonFromPool(TestClass, 0, 0);
		}).toThrow();
	});

	it('should_throw_when_instance_count_negative', () => {
		expect(() => {
			SingletonManager.getSingletonFromPool(TestClass, -5, 0);
		}).toThrow();
	});

	it('should_throw_when_pool_constructor_throws', () => {
		expect(() => {
			SingletonManager.getSingletonFromPool(ThrowingClass, 3, 0);
		}).toThrow();
	});

	it('should_return_same_manager_when_get_this_singleton_called', () => {
		expect(SingletonManager.getThisSingleton()).toBe(
			SingletonManager.getThisSingleton()
		);
	});

	it('should_reuse_singleton_under_concurrent_promises', async () => {
		const instances = await Promise.all(
			Array.from(
				{
					length: 100
				},
				() => Promise.resolve(SingletonManager.getSingleton(TestClass))
			)
		);

		for (const instance of instances) {
			expect(instance).toBe(instances[0]);
		}
	});

	it('should_reuse_pool_under_concurrent_promises', async () => {
		const instances = await Promise.all(
			Array.from(
				{
					length: 500
				},
				(_, index) =>
					Promise.resolve(
						SingletonManager.getSingletonFromPool(
							TestClass,
							5,
							index
						)
					)
			)
		);

		expect(instances.length).toBe(500);
	});

	it('should_complete_stress_execution_when_many_calls', () => {
		for (let iteration = 0; iteration < 100_000; ++iteration) {
			SingletonManager.getSingleton(TestClass);
		}
	});
});
