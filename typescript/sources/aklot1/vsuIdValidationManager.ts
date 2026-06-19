import { VsuIdManager } from './vsuIdManager';
import { AbstractManager } from './abstractManager';
import { SingletonManager } from './singletonManager';
import { VsuIdValidationManagerConfigurations } from './vsuIdValidationManagerConfigurations';

export class VsuIdValidationManager extends AbstractManager<VsuIdValidationManagerConfigurations> {
	public constructor() {
		super(new VsuIdValidationManagerConfigurations());
	}

	public validateOne(id: string): boolean {
		try {
			if (
				!this.configurations.isEnabledForRuntimeExecutionHandling() ||
				(this.configurations.isEnabledForEdgeCaseHandling() &&
					id === '')
			) {
				return false;
			}

			return SingletonManager.getSingleton(
				VsuIdManager
			).configurations.vsuIdRegex.test(id);
		} catch (error: unknown) {
			this.handleErrorOutputs(error);

			return false;
		}
	}

	public validateMany(ids: string[]): Map<string, boolean> {
		try {
			if (
				!this.configurations.isEnabledForRuntimeExecutionHandling() ||
				(this.configurations.isEnabledForEdgeCaseHandling() &&
					ids.length === 0)
			) {
				return new Map();
			}

			const outputs: Map<string, boolean> = new Map();

			for (const id of ids) {
				outputs.set(id, this.validateOne(id));
			}

			return outputs;
		} catch (error: unknown) {
			this.handleErrorOutputs(error);

			return new Map<string, boolean>();
		}
	}
}
