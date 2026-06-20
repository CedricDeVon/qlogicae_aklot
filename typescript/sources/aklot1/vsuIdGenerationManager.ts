import { AbstractManager } from './abstractManager';
import { VsuIdGenerationManagerConfigurations } from './vsuIdGenerationManagerConfigurations';

export class VsuIdGenerationManager extends AbstractManager<VsuIdGenerationManagerConfigurations> {
	public constructor() {
		super(new VsuIdGenerationManagerConfigurations());
	}

	public generateOne(): string {
		try {
			if (this.configurations.isDisabledForHandling()) {
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
			this.handleErrorOutputs(error);

			return '';
		}
	}

	public generateMany(size: number): string[] {
		try {
			if (
				this.configurations.isDisabledForHandling(
					size === null || size === undefined || size < 1
				)
			) {
				return [];
			}

			const outputs: string[] = [];

			while (size) {
				outputs.push(this.generateOne());
				--size;
			}

			return outputs;
		} catch (error: unknown) {
			this.handleErrorOutputs(error);

			return [];
		}
	}
}
