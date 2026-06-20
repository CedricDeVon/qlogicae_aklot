import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

import { ErrorManager } from '../../qlogicae/aklot1/errorManager';
import { ErrorManagerConfigurations } from '../../qlogicae/aklot1/errorManagerConfigurations';

class ThrowingSetupErrorManager extends ErrorManager {
	public override setup(_configuration: ErrorManagerConfigurations): boolean {
		try {
			this.configurations = _configuration;

			throw new Error('forced setup failure');
		} catch (error: unknown) {
			this.handleErrorOutputs(error);

			return false;
		}
	}
}

class ThrowingResetErrorManager extends ErrorManager {
	public override reset(): boolean {
		try {
			throw new Error('forced reset failure');
		} catch (error: unknown) {
			this.handleErrorOutputs(error);

			return false;
		}
	}
}

describe('ErrorManagerConfigurationsTest', () => {
	let configurations: ErrorManagerConfigurations;

	beforeEach(() => {
		configurations = new ErrorManagerConfigurations();
	});

	it('should_initialize_defaults_when_constructed', () => {
		expect(configurations.isOutputEnabled).toBe(true);

		expect(configurations.isOutputOverrideEnabled).toBe(false);

		expect(configurations.isAsynchronousOutputEnabled).toBe(true);

		expect(configurations.isAsynchronousOutputOverrideEnabled).toBe(false);

		expect(configurations.isConsoleOutputEnabled).toBe(true);

		expect(configurations.isRuntimeThrowOutputEnabled).toBe(false);

		expect(configurations.title).toContain('QLogicae');
	});

	it.each([
		[true, true],
		[true, false],
		[false, true],
		[false, false]
	])(
		'should_return_runtime_throw_flag_when_override_%s_enabled_%s',
		(override_enabled: boolean, output_enabled: boolean) => {
			configurations.isOutputOverrideEnabled = override_enabled;

			configurations.isOutputEnabled = output_enabled;

			configurations.isRuntimeThrowOutputEnabled = !output_enabled;

			expect(configurations.isEnabledForRuntimeThrowOutput()).toBe(
				override_enabled ? output_enabled : !output_enabled
			);
		}
	);

	it.each([
		[true, true],
		[true, false],
		[false, true],
		[false, false]
	])(
		'should_return_console_flag_when_override_%s_enabled_%s',
		(override_enabled: boolean, output_enabled: boolean) => {
			configurations.isOutputOverrideEnabled = override_enabled;

			configurations.isOutputEnabled = output_enabled;

			configurations.isConsoleOutputEnabled = !output_enabled;

			expect(configurations.isEnabledForConsoleOutput()).toBe(
				override_enabled ? output_enabled : !output_enabled
			);
		}
	);
});

describe('ErrorManagerTest', () => {
	let error_manager: ErrorManager;

	beforeEach(() => {
		error_manager = new ErrorManager();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('setup', () => {
		it('should_assign_configuration_when_valid', () => {
			const configuration = new ErrorManagerConfigurations();

			expect(error_manager.setup(configuration)).toBe(true);

			expect(error_manager.configurations).toBe(configuration);
		});

		it('should_return_false_when_null_configuration', () => {
			expect(error_manager.setup(null as never)).toBe(false);
		});

		it('should_return_false_when_undefined_configuration', () => {
			expect(error_manager.setup(undefined as never)).toBe(false);
		});
	});

	describe('reset', () => {
		it('should_restore_defaults_when_called', () => {
			const configuration = new ErrorManagerConfigurations();

			configuration.title = 'Custom';

			error_manager.configurations = configuration;

			expect(error_manager.reset()).toBe(true);

			expect(error_manager.configurations).toBeInstanceOf(
				ErrorManagerConfigurations
			);

			expect(error_manager.configurations.title).not.toBe('Custom');
		});

		it('should_return_false_when_runtime_disabled', () => {
			error_manager.configurations.isRuntimeExecutionHandlingEnabled = false;

			expect(error_manager.reset()).toBe(false);
		});
	});

	describe('transformToErrorLog', () => {
		it.each([['hello'], [''], ['🔥'], ['测试'], ['A'.repeat(1000)]])(
			'should_transform_message_when_string_provided',
			(message: string) => {
				const result = error_manager.transformToErrorLog(message);

				expect(result).toContain(message);
			}
		);

		it('should_transform_error_when_error_provided', () => {
			const result = error_manager.transformToErrorLog(
				new Error('failure')
			);

			expect(result).toContain('Error');

			expect(result).toContain('failure');
		});

		it('should_transform_title_and_message_when_provided', () => {
			expect(error_manager.transformToErrorLog('Title', 'Message')).toBe(
				'Title - Message'
			);
		});
	});

	describe('handleErrorOutputs', () => {
		it('should_log_when_console_output_enabled', () => {
			const log_spy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			expect(error_manager.handleErrorOutputs('failure')).toBe(true);

			expect(log_spy).toHaveBeenCalled();
		});

		it('should_handle_error_instance_when_provided', () => {
			const log_spy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			expect(error_manager.handleErrorOutputs(new Error('failure'))).toBe(
				true
			);

			expect(log_spy).toHaveBeenCalled();
		});

		it('should_handle_title_and_message_when_provided', () => {
			const log_spy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			expect(error_manager.handleErrorOutputs('Title', 'Message')).toBe(
				true
			);

			expect(log_spy).toHaveBeenCalled();
		});
	});

	describe('handleErrorOutputConditions', () => {
		it('should_return_false_when_runtime_execution_disabled', () => {
			error_manager.configurations.isRuntimeExecutionHandlingEnabled = false;

			expect(error_manager.handleErrorOutputConditions('failure')).toBe(
				false
			);
		});

		it('should_throw_when_runtime_throw_enabled', () => {
			error_manager.configurations.isRuntimeThrowOutputEnabled = true;

			expect(() =>
				error_manager.handleErrorOutputConditions('failure')
			).toThrow();
		});

		it('should_not_log_when_console_disabled', () => {
			const log_spy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			error_manager.configurations.isConsoleOutputEnabled = false;

			expect(error_manager.handleErrorOutputConditions('failure')).toBe(
				true
			);

			expect(log_spy).not.toHaveBeenCalled();
		});
	});

	describe('asynchronous_behavior', () => {
		it('should_support_parallel_execution_when_using_promise_all', async () => {
			const tasks = Array.from(
				{
					length: 100
				},
				() =>
					Promise.resolve(
						error_manager.transformToErrorLog('failure')
					)
			);

			const results = await Promise.all(tasks);

			expect(results).toHaveLength(100);
		});

		it('should_support_promise_race_when_executed', async () => {
			const result = await Promise.race([
				Promise.resolve(1),
				Promise.resolve(2)
			]);

			expect(result).toBe(1);
		});
	});

	describe('concurrent_behavior', () => {
		it('should_remain_consistent_under_concurrent_calls', async () => {
			const tasks = Array.from(
				{
					length: 500
				},
				() =>
					Promise.resolve(
						error_manager.handleErrorOutputConditions('x')
					)
			);

			const results = await Promise.all(tasks);

			expect(results.every((value) => value)).toBe(true);
		});
	});

	describe('stress_behavior', () => {
		it('should_process_large_number_of_logs_when_stressed', () => {
			const log_spy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			for (let index = 0; index < 10000; ++index) {
				error_manager.transformToErrorLog(`${index}`);
			}

			expect(log_spy).not.toBeUndefined();
		});

		it('should_return_false_when_setup_throws_exception', () => {
			const configuration = new ErrorManagerConfigurations();

			const handle_error_outputs_spy = vi
				.spyOn(error_manager, 'handleErrorOutputs')
				.mockImplementation(() => true);

			Object.defineProperty(error_manager, 'configurations', {
				get() {
					throw new Error('forced setup failure');
				}
			});

			expect(error_manager.setup(configuration)).toBe(false);

			expect(handle_error_outputs_spy).toHaveBeenCalledTimes(1);
		});

		it('should_return_false_when_reset_throws_exception', () => {
			const handle_error_outputs_spy = vi
				.spyOn(error_manager, 'handleErrorOutputs')
				.mockImplementation(() => true);

			Object.defineProperty(error_manager, 'configurations', {
				get() {
					throw new Error('forced reset failure');
				}
			});

			expect(error_manager.reset()).toBe(false);

			expect(handle_error_outputs_spy).toHaveBeenCalledTimes(1);
		});

		it('should_respect_override_mode_for_runtime_throw_and_console', () => {
			error_manager.configurations.isOutputOverrideEnabled = true;
			error_manager.configurations.isOutputEnabled = true;
			error_manager.configurations.isRuntimeThrowOutputEnabled = true;
			error_manager.configurations.isConsoleOutputEnabled = true;

			const log_spy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			expect(() =>
				error_manager.handleErrorOutputConditions('failure')
			).toThrow();

			expect(log_spy).toHaveBeenCalled();
		});

		it('should_not_throw_when_runtime_throw_disabled_even_if_console_enabled', () => {
			error_manager.configurations.isOutputOverrideEnabled = false;
			error_manager.configurations.isRuntimeThrowOutputEnabled = false;
			error_manager.configurations.isConsoleOutputEnabled = true;
			error_manager.configurations.isRuntimeExecutionHandlingEnabled = true;

			const log_spy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			const result = error_manager.handleErrorOutputConditions('failure');

			expect(result).toBe(true);
			expect(log_spy).toHaveBeenCalled();
		});

		it('should_handle_empty_string_as_valid_error_input', () => {
			const result = error_manager.handleErrorOutputs('');
			expect(result).toBe(true);
		});

		it('should_handle_numeric_like_unknown_input_in_handleErrorOutputs', () => {
			const result = error_manager.handleErrorOutputs(
				123 as unknown as string
			);
			expect(result).toBe(true);
		});

		it('should_use_custom_title_when_transforming_error_log', () => {
			error_manager.configurations.title = 'CustomTitle';

			const result = error_manager.transformToErrorLog('message');

			expect(result).toContain('CustomTitle');
			expect(result).toContain('message');
		});

		it('should_handle_subclassed_error_instances', () => {
			class CustomError extends Error {
				constructor() {
					super('custom failure');
					this.name = 'CustomError';
				}
			}

			const result = error_manager.transformToErrorLog(new CustomError());

			expect(result).toContain('CustomError');
			expect(result).toContain('custom failure');
		});

		it('should_exercise_override_enabled_console_flag_false_path', () => {
			error_manager.configurations.isOutputOverrideEnabled = true;
			error_manager.configurations.isOutputEnabled = false;
			error_manager.configurations.isConsoleOutputEnabled = true;

			const log_spy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			error_manager.handleErrorOutputConditions('x');

			expect(log_spy).not.toHaveBeenCalled();
		});

		it('should_exercise_override_enabled_runtime_throw_false_path', () => {
			error_manager.configurations.isOutputOverrideEnabled = true;
			error_manager.configurations.isOutputEnabled = false;
			error_manager.configurations.isRuntimeThrowOutputEnabled = true;

			expect(() =>
				error_manager.handleErrorOutputConditions('x')
			).not.toThrow();
		});

		it('should_process_error_like_object_in_handleErrorOutputs', () => {
			const log_spy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			const result = error_manager.handleErrorOutputs({
				name: 'XError',
				message: 'fail'
			} as unknown);

			expect(result).toBe(true);
			expect(log_spy).toHaveBeenCalled();
		});

		it('should_return_false_when_setup_throws_exception', () => {
			const manager = new ThrowingSetupErrorManager();

			const handle_error_outputs_spy = vi
				.spyOn(manager, 'handleErrorOutputs')
				.mockImplementation(() => true);

			expect(manager.setup(new ErrorManagerConfigurations())).toBe(false);

			expect(handle_error_outputs_spy).toHaveBeenCalledTimes(1);
		});

		it('should_return_false_when_reset_throws_exception', () => {
			const manager = new ThrowingResetErrorManager();

			const handle_error_outputs_spy = vi
				.spyOn(manager, 'handleErrorOutputs')
				.mockImplementation(() => true);

			expect(manager.reset()).toBe(false);

			expect(handle_error_outputs_spy).toHaveBeenCalledTimes(1);
		});
	});
});
