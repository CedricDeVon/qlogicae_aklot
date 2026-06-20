import { bench, describe } from 'vitest';

import { ErrorManager } from '../../qlogicae/aklot1/errorManager';
import { ErrorManagerConfigurations } from '../../qlogicae/aklot1/errorManagerConfigurations';

describe('ErrorManager Benchmarks', () => {
	bench('setup - normal', () => {
		const manager = new ErrorManager();
		manager.setup(new ErrorManagerConfigurations());
	});

	bench('setup - null input', () => {
		const manager = new ErrorManager();
		manager.setup(null as unknown as ErrorManagerConfigurations);
	});

	bench('reset - normal', () => {
		const manager = new ErrorManager();
		manager.reset();
	});

	bench('transformToErrorLog - error instance', () => {
		const manager = new ErrorManager();
		manager.transformToErrorLog(new Error('benchmark_error'));
	});

	bench('transformToErrorLog - string message', () => {
		const manager = new ErrorManager();
		manager.transformToErrorLog('message');
	});

	bench('transformToErrorLog - title + message', () => {
		const manager = new ErrorManager();
		manager.transformToErrorLog('title', 'message');
	});

	bench('handleErrorOutputs - error instance', () => {
		const manager = new ErrorManager();
		manager.handleErrorOutputs(new Error('benchmark_error'));
	});

	bench('handleErrorOutputs - string message', () => {
		const manager = new ErrorManager();
		manager.handleErrorOutputs('message');
	});

	bench('handleErrorOutputs - title + message', () => {
		const manager = new ErrorManager();
		manager.handleErrorOutputs('title', 'message');
	});

	bench('handleErrorOutputConditions - console output enabled', () => {
		const manager = new ErrorManager();

		manager.configurations.isEnabledForRuntimeExecutionHandling = () =>
			true;

		manager.configurations.isEnabledForConsoleOutput = () => true;

		manager.configurations.isEnabledForRuntimeThrowOutput = () => false;

		manager.handleErrorOutputConditions('benchmark_error');
	});

	bench('handleErrorOutputConditions - runtime disabled fast path', () => {
		const manager = new ErrorManager();

		manager.configurations.isEnabledForRuntimeExecutionHandling = () =>
			false;

		manager.handleErrorOutputConditions('benchmark_error');
	});

	bench('hot loop - transform + handle cycle', () => {
		const manager = new ErrorManager();

		for (let i = 0; i < 1000; i++) {
			manager.handleErrorOutputs(new Error(`error_${i}`));
		}
	});

	bench('hot loop - string logging cycle', () => {
		const manager = new ErrorManager();

		for (let i = 0; i < 1000; i++) {
			manager.handleErrorOutputs(`message_${i}`);
		}
	});

	bench('stress - mixed operations', () => {
		const manager = new ErrorManager();

		for (let i = 0; i < 500; i++) {
			manager.setup(new ErrorManagerConfigurations());
			manager.transformToErrorLog(`msg_${i}`);
			manager.handleErrorOutputs(`msg_${i}`);
			manager.reset();
		}
	});
});
