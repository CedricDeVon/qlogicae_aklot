import { ErrorManager } from './errorManager';
import { SingletonManager } from './singletonManager';
import { AbstractManagerConfigurations } from './abstractManagerConfigurations';

export abstract class AbstractManager<
	Configurations extends AbstractManagerConfigurations
> {
	public configurations: Configurations;

	public constructor(newConfigurations: Configurations) {
		this.configurations = newConfigurations;
	}

	public setup(newConfigurations: Configurations): boolean {
		try {
			if (
				this.configurations.isDisabledForHandling(
					newConfigurations === null ||
						newConfigurations === undefined
				)
			) {
				return false;
			}

			this.configurations = newConfigurations;

			return true;
		} catch (error: unknown) {
			this.handleErrorOutputs(error);

			return false;
		}
	}

	public reset(): boolean {
		try {
			if (this.configurations.isDisabledForHandling()) {
				return false;
			}

			this.configurations = new (this.configurations
				.constructor as new () => Configurations)();

			return true;
		} catch (error: unknown) {
			this.handleErrorOutputs(error);

			return false;
		}
	}

	public handleErrorOutputs(message: string): boolean;

	public handleErrorOutputs(error: unknown): boolean;

	public handleErrorOutputs(title: string, message: string): boolean;

	public handleErrorOutputs(
		error: string | unknown,
		message?: string
	): boolean {
		if (error instanceof Error) {
			return SingletonManager.getSingleton(
				ErrorManager
			).handleErrorOutputs(error);
		}

		if (message !== undefined) {
			return SingletonManager.getSingleton(
				ErrorManager
			).handleErrorOutputs(error as string, message);
		}

		return SingletonManager.getSingleton(ErrorManager).handleErrorOutputs(
			error
		);
	}
}
