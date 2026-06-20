import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ErrorManager } from '../../qlogicae/aklot1/errorManager';
import { AbstractManager } from '../../qlogicae/aklot1/abstractManager';
import { SingletonManager } from '../../qlogicae/aklot1/singletonManager';
import { AbstractManagerConfigurations } from '../../qlogicae/aklot1/abstractManagerConfigurations';

class TestConfigurations extends AbstractManagerConfigurations {}

class ThrowingConfigurations extends AbstractManagerConfigurations {
	public constructor() {
		super();

		throw new Error('constructor_error');
	}
}

class TestManager extends AbstractManager<TestConfigurations> {}
describe('AbstractManagerConfigurationsTest', () => {
	let configurations: TestConfigurations;

	beforeEach(() => {
		configurations = new TestConfigurations();
	});

	it('should_initialize_defaults_when_constructed', () => {
		expect(configurations.isOverrideEnabled).toBe(false);
		expect(configurations.isEnabled).toBe(true);
		expect(configurations.isRuntimeExecutionHandlingEnabled).toBe(true);
		expect(configurations.isEdgeCaseHandlingEnabled).toBe(true);
		expect(configurations.isErrorHandlingEnabled).toBe(true);
	});

	describe.each([
		[false, false],
		[true, true]
	])(
		'isEnabledForRuntimeExecutionHandling',
		(is_runtime_execution_handling_enabled: boolean, expected: boolean) => {
			it('should_return_runtime_setting_when_override_disabled', () => {
				configurations.isOverrideEnabled = false;

				configurations.isRuntimeExecutionHandlingEnabled =
					is_runtime_execution_handling_enabled;

				expect(
					configurations.isEnabledForRuntimeExecutionHandling()
				).toBe(expected);
			});
		}
	);

	describe.each([
		[true, true],
		[false, false]
	])(
		'isEnabledForRuntimeExecutionHandlingOverride',
		(is_enabled: boolean, expected: boolean) => {
			it('should_return_enabled_when_override_enabled', () => {
				configurations.isOverrideEnabled = true;

				configurations.isEnabled = is_enabled;

				configurations.isRuntimeExecutionHandlingEnabled = !is_enabled;

				expect(
					configurations.isEnabledForRuntimeExecutionHandling()
				).toBe(expected);
			});
		}
	);

	describe.each([
		[false, false],
		[true, true]
	])(
		'isEnabledForEdgeCaseHandling',
		(is_edge_case_handling_enabled: boolean, expected: boolean) => {
			it('should_return_edge_case_setting_when_override_disabled', () => {
				configurations.isOverrideEnabled = false;

				configurations.isEdgeCaseHandlingEnabled =
					is_edge_case_handling_enabled;

				expect(configurations.isEnabledForEdgeCaseHandling()).toBe(
					expected
				);
			});
		}
	);

	describe.each([
		[true, true],
		[false, false]
	])(
		'isEnabledForEdgeCaseHandlingOverride',
		(is_enabled: boolean, expected: boolean) => {
			it('should_return_enabled_when_override_enabled', () => {
				configurations.isOverrideEnabled = true;

				configurations.isEnabled = is_enabled;

				configurations.isEdgeCaseHandlingEnabled = !is_enabled;

				expect(configurations.isEnabledForEdgeCaseHandling()).toBe(
					expected
				);
			});
		}
	);

	describe.each([
		[false, false],
		[true, true]
	])(
		'isEnabledForErrorHandling',
		(is_error_handling_enabled: boolean, expected: boolean) => {
			it('should_return_error_setting_when_override_disabled', () => {
				configurations.isOverrideEnabled = false;

				configurations.isErrorHandlingEnabled =
					is_error_handling_enabled;

				expect(configurations.isEnabledForErrorHandling()).toBe(
					expected
				);
			});
		}
	);

	describe.each([
		[true, true],
		[false, false]
	])(
		'isEnabledForErrorHandlingOverride',
		(is_enabled: boolean, expected: boolean) => {
			it('should_return_enabled_when_override_enabled', () => {
				configurations.isOverrideEnabled = true;

				configurations.isEnabled = is_enabled;

				configurations.isErrorHandlingEnabled = !is_enabled;

				expect(configurations.isEnabledForErrorHandling()).toBe(
					expected
				);
			});
		}
	);

	describe.each([
		[false, true, false],
		[false, false, true],
		[true, true, true],
		[true, false, true]
	])(
		'isDisabledForHandling',
		(conditions: boolean, runtime_enabled: boolean, expected: boolean) => {
			it('should_return_expected_when_evaluated', () => {
				configurations.isRuntimeExecutionHandlingEnabled =
					runtime_enabled;

				configurations.isEdgeCaseHandlingEnabled = true;

				expect(configurations.isDisabledForHandling(conditions)).toBe(
					expected
				);
			});
		}
	);

	it('should_return_false_when_conditions_false_and_runtime_enabled', () => {
		expect(configurations.isDisabledForHandling(false)).toBe(false);
	});

	it('should_return_true_when_conditions_true_and_edge_case_enabled', () => {
		expect(configurations.isDisabledForHandling(true)).toBe(true);
	});

	it('should_return_false_when_conditions_true_and_edge_case_disabled', () => {
		configurations.isEdgeCaseHandlingEnabled = false;

		expect(configurations.isDisabledForHandling(true)).toBe(false);
	});

	it('should_support_concurrent_evaluations_when_called', async () => {
		const results = await Promise.all(
			Array.from({ length: 1000 }, () =>
				Promise.resolve(configurations.isDisabledForHandling(false))
			)
		);

		expect(results.every((value) => value === false)).toBe(true);
	});

	it('should_complete_race_when_called_concurrently', async () => {
		const result = await Promise.race([
			Promise.resolve(
				configurations.isEnabledForRuntimeExecutionHandling()
			),
			Promise.resolve(
				configurations.isEnabledForRuntimeExecutionHandling()
			)
		]);

		expect(result).toBe(true);
	});

	it('should_initialize_default_values_when_constructed', () => {
		const configuration: AbstractManagerConfigurations =
			new AbstractManagerConfigurations();

		expect(configuration.isOverrideEnabled).toBe(false);
		expect(configuration.isEnabled).toBe(true);
		expect(configuration.isRuntimeExecutionHandlingEnabled).toBe(true);
		expect(configuration.isEdgeCaseHandlingEnabled).toBe(true);
		expect(configuration.isErrorHandlingEnabled).toBe(true);
	});

	it.each([true, false])(
		'should_return_disabled_when_runtime_execution_disabled',
		(condition) => {
			const configuration: AbstractManagerConfigurations =
				new AbstractManagerConfigurations();

			configuration.isRuntimeExecutionHandlingEnabled = false;

			expect(configuration.isDisabledForHandling(condition)).toBe(true);
		}
	);

	it('should_return_disabled_when_condition_true', () => {
		const configuration: AbstractManagerConfigurations =
			new AbstractManagerConfigurations();

		expect(configuration.isDisabledForHandling(true)).toBe(true);
	});

	it('should_return_not_disabled_when_condition_false', () => {
		const configuration: AbstractManagerConfigurations =
			new AbstractManagerConfigurations();

		expect(configuration.isDisabledForHandling(false)).toBe(false);
	});

	it.each([true, false])(
		'should_return_enabled_value_when_override_enabled',
		(enabled) => {
			const configuration: AbstractManagerConfigurations =
				new AbstractManagerConfigurations();

			configuration.isOverrideEnabled = true;
			configuration.isEnabled = enabled;

			expect(configuration.isEnabledForRuntimeExecutionHandling()).toBe(
				enabled
			);

			expect(configuration.isEnabledForEdgeCaseHandling()).toBe(enabled);

			expect(configuration.isEnabledForErrorHandling()).toBe(enabled);
		}
	);

	it('should_return_runtime_execution_flag_when_override_disabled', () => {
		const configuration: AbstractManagerConfigurations =
			new AbstractManagerConfigurations();

		configuration.isRuntimeExecutionHandlingEnabled = false;

		expect(configuration.isEnabledForRuntimeExecutionHandling()).toBe(
			false
		);
	});

	it('should_return_edge_case_flag_when_override_disabled', () => {
		const configuration: AbstractManagerConfigurations =
			new AbstractManagerConfigurations();

		configuration.isEdgeCaseHandlingEnabled = false;

		expect(configuration.isEnabledForEdgeCaseHandling()).toBe(false);
	});

	it('should_return_error_flag_when_override_disabled', () => {
		const configuration: AbstractManagerConfigurations =
			new AbstractManagerConfigurations();

		configuration.isErrorHandlingEnabled = false;

		expect(configuration.isEnabledForErrorHandling()).toBe(false);
	});
});

describe('AbstractManagerTest', () => {
	let configurations: TestConfigurations;

	let manager: TestManager;

	let error_manager: {
		handleErrorOutputs: ReturnType<typeof vi.fn>;
	};

	beforeEach(() => {
		configurations = new TestConfigurations();

		manager = new TestManager(configurations);

		error_manager = {
			handleErrorOutputs: vi.fn().mockReturnValue(true)
		};

		vi.spyOn(SingletonManager, 'getSingleton').mockReturnValue(
			error_manager as unknown as ErrorManager
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should_return_false_and_handle_error_when_setup_throws', () => {
		(
			configurations as unknown as {
				isDisabledForHandling: (...args: unknown[]) => boolean;
			}
		).isDisabledForHandling = vi.fn((): boolean => {
			throw new Error('setup_error');
		});

		expect(manager.setup(new TestConfigurations())).toBe(false);
	});

	it('should_return_false_and_handle_error_when_reset_constructor_throws', () => {
		const bad_config = new TestConfigurations();

		type ConfigCtor = new () => TestConfigurations;

		(bad_config as unknown as { constructor: ConfigCtor }).constructor =
			class {
				public constructor() {
					throw new Error('reset_error');
				}
			} as ConfigCtor;

		const bad_manager = new TestManager(bad_config);

		expect(bad_manager.reset()).toBe(false);
	});

	it('should_assign_configurations_when_constructed', () => {
		expect(manager.configurations).toBe(configurations);
	});

	it('should_return_true_when_setup_valid_configuration', () => {
		const new_configurations = new TestConfigurations();

		expect(manager.setup(new_configurations)).toBe(true);

		expect(manager.configurations).toBe(new_configurations);
	});

	it('should_return_false_when_setup_null_configuration', () => {
		expect(manager.setup(null as unknown as TestConfigurations)).toBe(
			false
		);
	});

	it('should_return_false_when_setup_undefined_configuration', () => {
		expect(manager.setup(undefined as unknown as TestConfigurations)).toBe(
			false
		);
	});

	it('should_return_false_when_runtime_execution_disabled', () => {
		configurations.isRuntimeExecutionHandlingEnabled = false;

		expect(manager.setup(new TestConfigurations())).toBe(false);
	});

	it('should_return_true_when_reset_valid_configuration', () => {
		const original = manager.configurations;

		expect(manager.reset()).toBe(true);

		expect(manager.configurations).not.toBe(original);

		expect(manager.configurations).toBeInstanceOf(TestConfigurations);
	});

	it('should_return_false_when_reset_runtime_execution_disabled', () => {
		configurations.isRuntimeExecutionHandlingEnabled = false;

		expect(manager.reset()).toBe(false);
	});

	it('should_handle_constructor_exception_when_reset_called', () => {
		const throwing_configuration = Object.create(
			ThrowingConfigurations.prototype
		) as ThrowingConfigurations;

		Object.defineProperty(throwing_configuration, 'constructor', {
			value: ThrowingConfigurations
		});

		const throwing_manager = new TestManager(throwing_configuration);

		expect(throwing_manager.reset()).toBe(false);
	});

	it('should_delegate_error_instance_when_handle_error_outputs', () => {
		const error = new Error('error');

		expect(manager.handleErrorOutputs(error)).toBe(true);

		expect(error_manager.handleErrorOutputs).toHaveBeenCalledWith(error);
	});

	it('should_delegate_message_when_handle_error_outputs', () => {
		expect(manager.handleErrorOutputs('message')).toBe(true);

		expect(error_manager.handleErrorOutputs).toHaveBeenCalledWith(
			'message'
		);
	});

	it('should_delegate_title_and_message_when_handle_error_outputs', () => {
		expect(manager.handleErrorOutputs('title', 'message')).toBe(true);

		expect(error_manager.handleErrorOutputs).toHaveBeenCalledWith(
			'title',
			'message'
		);
	});

	it('should_support_async_setup_when_called_with_promise_all', async () => {
		const results = await Promise.all(
			Array.from({ length: 100 }, () =>
				Promise.resolve(manager.setup(new TestConfigurations()))
			)
		);

		expect(results.every((value) => value)).toBe(true);
	});

	it('should_support_async_reset_when_called_with_promise_all', async () => {
		const results = await Promise.all(
			Array.from({ length: 100 }, () => Promise.resolve(manager.reset()))
		);

		expect(results.every((value) => value)).toBe(true);
	});

	it('should_complete_race_between_setup_and_reset_when_called', async () => {
		const result = await Promise.race([
			Promise.resolve(manager.setup(new TestConfigurations())),
			Promise.resolve(manager.reset())
		]);

		expect(typeof result).toBe('boolean');
	});

	it('should_remain_functional_under_stress_when_setup_called', async () => {
		const results = await Promise.all(
			Array.from({ length: 5000 }, () =>
				Promise.resolve(manager.setup(new TestConfigurations()))
			)
		);

		expect(results.every((value) => value)).toBe(true);
	});

	it('should_remain_functional_under_stress_when_reset_called', async () => {
		const results = await Promise.all(
			Array.from({ length: 2000 }, () => Promise.resolve(manager.reset()))
		);

		expect(results.every((value) => value)).toBe(true);
	});

	it('should_resolve_full_override_matrix_runtime_edge_error_combination', () => {
		const cfg = new TestConfigurations();

		cfg.isOverrideEnabled = true;
		cfg.isEnabled = true;
		cfg.isRuntimeExecutionHandlingEnabled = false;
		cfg.isEdgeCaseHandlingEnabled = true;
		cfg.isErrorHandlingEnabled = false;

		expect(cfg.isEnabledForRuntimeExecutionHandling()).toBe(true);
		expect(cfg.isEnabledForEdgeCaseHandling()).toBe(true);
		expect(cfg.isEnabledForErrorHandling()).toBe(true);
	});

	it('should_respect_runtime_disabled_over_edge_case_conditions', () => {
		const cfg = new TestConfigurations();

		cfg.isRuntimeExecutionHandlingEnabled = false;
		cfg.isEdgeCaseHandlingEnabled = true;

		expect(cfg.isDisabledForHandling(false)).toBe(true);
		expect(cfg.isDisabledForHandling(true)).toBe(true);
	});

	it('should_respect_edge_case_disabled_blocks_condition_trigger', () => {
		const cfg = new TestConfigurations();

		cfg.isEdgeCaseHandlingEnabled = false;

		expect(cfg.isDisabledForHandling(true)).toBe(false);
	});

	it('should_support_constructor_reflection_reset_with_multiple_cycles', () => {
		const manager = new TestManager(new TestConfigurations());

		const first = manager.configurations;

		manager.reset();
		const second = manager.configurations;

		manager.reset();
		const third = manager.configurations;

		expect(first).not.toBe(second);
		expect(second).not.toBe(third);
	});

	it('should_handle_mixed_async_setup_and_reset_race_condition', async () => {
		const manager = new TestManager(new TestConfigurations());

		const results = await Promise.all([
			Promise.resolve(manager.setup(new TestConfigurations())),
			Promise.resolve(manager.reset()),
			Promise.resolve(manager.setup(new TestConfigurations())),
			Promise.resolve(manager.reset())
		]);

		expect(results.every(Boolean)).toBe(true);
	});

	it('should_stabilize_state_under_concurrent_mutation', async () => {
		const manager = new TestManager(new TestConfigurations());

		await Promise.all(
			Array.from({ length: 200 }, () =>
				Promise.resolve(manager.setup(new TestConfigurations()))
			)
		);

		await Promise.all(
			Array.from({ length: 200 }, () => Promise.resolve(manager.reset()))
		);

		expect(manager.configurations).toBeInstanceOf(TestConfigurations);
	});

	it('should_handle_error_manager_return_false_path_indirectly', () => {
		const manager = new TestManager(new TestConfigurations());

		const error_mock = vi.fn().mockReturnValue(false);

		vi.spyOn(SingletonManager, 'getSingleton').mockReturnValue({
			handleErrorOutputs: error_mock
		} as unknown as ErrorManager);

		expect(manager.handleErrorOutputs('x')).toBe(false);
		expect(error_mock).toHaveBeenCalled();
	});

	it('should_handle_error_manager_throwing_indirect_failure_path', () => {
		const manager = new TestManager(new TestConfigurations());

		vi.spyOn(SingletonManager, 'getSingleton').mockImplementation(() => {
			throw new Error('boom');
		});

		expect(() => manager.handleErrorOutputs('x')).toThrow();
	});

	it('should_handle_constructor_reset_edge_case_with_prototype_mutation', () => {
		const bad_config = new TestConfigurations();

		Object.setPrototypeOf(bad_config, {
			constructor: class {
				public constructor() {
					throw new Error('bad ctor');
				}
			}
		});

		const manager = new TestManager(
			bad_config as unknown as TestConfigurations
		);

		const result = manager.reset();

		expect(typeof result).toBe('boolean');
	});
});
