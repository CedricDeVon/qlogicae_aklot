import { bench, describe } from 'vitest';

import { AbstractManager } from '../../qlogicae/aklot1/abstractManager';
import { AbstractManagerConfigurations } from '../../qlogicae/aklot1/abstractManagerConfigurations';

class TestConfigurations extends AbstractManagerConfigurations {}

class TestManager extends AbstractManager<TestConfigurations> {}

describe('AbstractManagerConfigurationsBenchmark', () => {
	const default_configuration = new AbstractManagerConfigurations();

	const override_configuration = new AbstractManagerConfigurations();

	override_configuration.isOverrideEnabled = true;

	bench('isDisabledForHandling_false', () => {
		default_configuration.isDisabledForHandling(false);
	});

	bench('isDisabledForHandling_true', () => {
		default_configuration.isDisabledForHandling(true);
	});

	bench('isEnabledForRuntimeExecutionHandling_default', () => {
		default_configuration.isEnabledForRuntimeExecutionHandling();
	});

	bench('isEnabledForRuntimeExecutionHandling_override', () => {
		override_configuration.isEnabledForRuntimeExecutionHandling();
	});

	bench('isEnabledForEdgeCaseHandling_default', () => {
		default_configuration.isEnabledForEdgeCaseHandling();
	});

	bench('isEnabledForEdgeCaseHandling_override', () => {
		override_configuration.isEnabledForEdgeCaseHandling();
	});

	bench('isEnabledForErrorHandling_default', () => {
		default_configuration.isEnabledForErrorHandling();
	});

	bench('isEnabledForErrorHandling_override', () => {
		override_configuration.isEnabledForErrorHandling();
	});
});

describe('AbstractManagerBenchmarks', () => {
	bench('setup - normal execution', () => {
		const config = new TestConfigurations();
		const manager = new TestManager(config);

		manager.setup(new TestConfigurations());
	});

	bench('setup - null input handling', () => {
		const config = new TestConfigurations();
		const manager = new TestManager(config);

		manager.setup(null as unknown as TestConfigurations);
	});

	bench('reset - normal execution', () => {
		const config = new TestConfigurations();
		const manager = new TestManager(config);

		manager.reset();
	});

	bench('handleErrorOutputs - error instance', () => {
		const config = new TestConfigurations();
		const manager = new TestManager(config);

		manager.handleErrorOutputs(new Error('bench_error'));
	});

	bench('handleErrorOutputs - string message', () => {
		const config = new TestConfigurations();
		const manager = new TestManager(config);

		manager.handleErrorOutputs('message');
	});

	bench('handleErrorOutputs - title + message', () => {
		const config = new TestConfigurations();
		const manager = new TestManager(config);

		manager.handleErrorOutputs('title', 'message');
	});

	bench('setup + reset cycle', () => {
		const config = new TestConfigurations();
		const manager = new TestManager(config);

		manager.setup(new TestConfigurations());
		manager.reset();
	});

	bench('stress - repeated setup/reset loop', () => {
		const config = new TestConfigurations();
		const manager = new TestManager(config);

		for (let i = 0; i < 1000; i++) {
			manager.setup(new TestConfigurations());
			manager.reset();
		}
	});

	bench('concurrent-like simulation (sync)', () => {
		const config = new TestConfigurations();
		const manager = new TestManager(config);

		const ops = Array.from({ length: 100 }, () => {
			manager.setup(new TestConfigurations());
			manager.reset();
		});

		return ops.length;
	});
});
