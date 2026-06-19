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

	public construct(): boolean {
		return this.setup(
			new (this.configurations.constructor as new () => Configurations)()
		);
	}

	public destruct(): boolean {
		return this.reset();
	}

	public setup(newConfigurations: Configurations): boolean {
		this.configurations = newConfigurations;

		return true;
	}

	public reset(): boolean {
		this.configurations = new (this.configurations
			.constructor as new () => Configurations)();

		return true;
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
