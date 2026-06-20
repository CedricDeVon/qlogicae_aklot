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
		SingletonManager.configurations = new SingletonManagerConfigurations();
	});

	afterEach(() => {
		SingletonManager.configurations = new SingletonManagerConfigurations();
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

	it('should_return_false_when_setup_given_undefined_and_edge_case_handling_enabled', () => {
		expect(
			SingletonManager.setup(
				undefined as unknown as SingletonManagerConfigurations
			)
		).toBe(false);
	});

	it('should_return_false_when_reset_called_and_runtime_execution_disabled', () => {
		SingletonManager.configurations.isRuntimeExecutionHandlingEnabled = false;

		expect(SingletonManager.reset()).toBe(false);
	});

	it('should_return_false_when_setup_throws', () => {
		Object.defineProperty(SingletonManager, 'configurations', {
			get() {
				throw new Error('failure');
			},
			configurable: true
		});

		expect(
			SingletonManager.setup(new SingletonManagerConfigurations())
		).toBe(false);

		Object.defineProperty(SingletonManager, 'configurations', {
			value: new SingletonManagerConfigurations(),
			writable: true,
			configurable: true
		});
	});

	it('should_return_false_when_reset_throws', () => {
		Object.defineProperty(SingletonManager, 'configurations', {
			get() {
				throw new Error('failure');
			},
			configurable: true
		});

		expect(SingletonManager.reset()).toBe(false);

		Object.defineProperty(SingletonManager, 'configurations', {
			value: new SingletonManagerConfigurations(),
			writable: true,
			configurable: true
		});
	});

	it('should_create_instance_when_singleton_not_yet_cached', () => {
		const instance = SingletonManager.getSingleton(AlternateClass);

		expect(instance).toBeInstanceOf(AlternateClass);
	});

	it('should_return_error_handling_flag_when_override_disabled', () => {
		const configuration = new SingletonManagerConfigurations();

		configuration.isOverrideEnabled = false;
		configuration.isErrorHandlingEnabled = false;

		expect(configuration.isEnabledForErrorHandling()).toBe(false);
	});

	it('should_return_enabled_state_for_error_handling_when_override_enabled', () => {
		const configuration = new SingletonManagerConfigurations();

		configuration.isOverrideEnabled = true;
		configuration.isEnabled = false;
		configuration.isErrorHandlingEnabled = true;

		expect(configuration.isEnabledForErrorHandling()).toBe(false);
	});

	it('should_handle_nan_index_in_pool_without_crash', () => {
		let instance: unknown;

		expect(() => {
			instance = SingletonManager.getSingletonFromPool(
				TestClass,
				5,
				NaN as unknown as number
			);
		}).not.toThrow();

		expect(instance).toBeUndefined();
	});

	it('should_return_same_instance_when_pool_size_is_one', () => {
		const first = SingletonManager.getSingletonFromPool(TestClass, 1, 0);
		const second = SingletonManager.getSingletonFromPool(TestClass, 1, 999);

		expect(first).toBe(second);
	});

	it('should_reset_multiple_times_without_state_corruption', () => {
		const a = SingletonManager.getSingleton(TestClass);

		SingletonManager.reset();
		const b = SingletonManager.getSingleton(TestClass);

		SingletonManager.reset();
		const c = SingletonManager.getSingleton(TestClass);

		expect(a).not.toBe(b);
		expect(b).not.toBe(c);
	});

	it('should_keep_singleton_map_stable_across_repeated_calls', () => {
		const instances = Array.from({ length: 50 }, () =>
			SingletonManager.getSingleton(TestClass)
		);

		for (const instance of instances) {
			expect(instance).toBe(instances[0]);
		}
	});

	it('should_return_new_configuration_instance_after_reset', () => {
		const before = SingletonManager.configurations;

		SingletonManager.reset();

		const after = SingletonManager.configurations;

		expect(after).toBeInstanceOf(SingletonManagerConfigurations);
		expect(after).not.toBe(before);
	});

	it('should_reuse_same_pool_instances_across_multiple_calls', () => {
		const firstBatch = Array.from({ length: 10 }, (_, i) =>
			SingletonManager.getSingletonFromPool(TestClass, 5, i)
		);

		const secondBatch = Array.from({ length: 10 }, (_, i) =>
			SingletonManager.getSingletonFromPool(TestClass, 5, i)
		);

		for (let i = 0; i < firstBatch.length; i++) {
			expect(firstBatch[i]).toBe(secondBatch[i]);
		}
	});
});
