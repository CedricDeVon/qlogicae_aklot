import { ErrorManagerConfigurations } from './errorManagerConfigurations';

export class ErrorManager {
	public configurations: ErrorManagerConfigurations;

	public constructor() {
		this.configurations = new ErrorManagerConfigurations();
	}

	public setup(newConfigurations: ErrorManagerConfigurations): boolean {
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

			this.configurations = new ErrorManagerConfigurations();

			return true;
		} catch (error: unknown) {
			this.handleErrorOutputs(error);

			return false;
		}
	}

	public transformToErrorLog(message: string): string;

	public transformToErrorLog(error: unknown): string;

	public transformToErrorLog(title: string, message: string): string;

	public transformToErrorLog(
		value1: string | unknown,
		value2?: string
	): string {
		if (value1 instanceof Error) {
			return `${value1.name}${this.configurations.titleMessageSeparator}${value1.message}`;
		}

		if (value2 !== undefined) {
			return `${value1}${this.configurations.titleMessageSeparator}${value2}`;
		}

		return `${this.configurations.title}${this.configurations.titleMessageSeparator}${value1}`;
	}

	public handleErrorOutputs(message: string): boolean;

	public handleErrorOutputs(error: unknown): boolean;

	public handleErrorOutputs(title: string, message: string): boolean;

	public handleErrorOutputs(
		error: string | unknown,
		message?: string
	): boolean {
		if (error instanceof Error) {
			this.handleErrorOutputConditions(this.transformToErrorLog(error));

			return true;
		}

		if (message !== undefined) {
			this.handleErrorOutputConditions(
				this.transformToErrorLog(error as string, message)
			);

			return true;
		}

		this.handleErrorOutputConditions(this.transformToErrorLog(error));

		return true;
	}

	public handleErrorOutputConditions(errorLog: string): boolean {
		if (!this.configurations.isEnabledForRuntimeExecutionHandling()) {
			return false;
		}

		if (this.configurations.isEnabledForConsoleOutput()) {
			console.log(errorLog);
		}

		if (this.configurations.isEnabledForRuntimeThrowOutput()) {
			throw Error(errorLog);
		}

		return true;
	}
}
