import { AbstractManager } from './abstractManager';
import { VsuIdGenerationManagerConfigurations } from './vsuIdGenerationManagerConfigurations';

export class VsuIdGenerationManager extends AbstractManager<VsuIdGenerationManagerConfigurations> {
	public constructor() {
		super(new VsuIdGenerationManagerConfigurations());
	}

	public generateOne(): string {
		try {
			if (
				!this.configurations.isEnabledForRuntimeExecutionHandling() ||
				this.configurations.isEnabledForEdgeCaseHandling()
			) {
				return '';
			}

			return `${Math.floor(Math.random() * 100)
				.toString()
				.padStart(
					2,
					'0'
				)}-${Math.random() < 0.5 ? '1' : '2'}-${Math.floor(
				Math.random() * 100000
			)
				.toString()
				.padStart(5, '0')}`;
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.handleErrorOutputs(error);
			}

			return '';
		}
	}

	public generateMany(size: number): string[] {
		try {
			if (
				!this.configurations.isEnabledForRuntimeExecutionHandling() ||
				(this.configurations.isEnabledForEdgeCaseHandling() &&
					size === 0)
			) {
				return [];
			}

			const outputs: string[] = [];

			while (size) {
				outputs.push(this.generateOne());
			}

			return outputs;
		} catch (error: unknown) {
			if (error instanceof Error) {
				this.handleErrorOutputs(error);
			}

			return [];
		}
	}
}
