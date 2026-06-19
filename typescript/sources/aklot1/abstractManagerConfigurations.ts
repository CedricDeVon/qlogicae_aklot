export class AbstractManagerConfigurations {
	public isEnabled: boolean;

	public isOverrideEnabled: boolean;

	public isEdgeCaseHandlingEnabled: boolean;

	public isRuntimeExecutionHandlingEnabled: boolean;

	public isErrorHandlingEnabled: boolean;

	public constructor() {
		this.isEnabled = true;
		this.isOverrideEnabled = false;
		this.isEdgeCaseHandlingEnabled = true;
		this.isRuntimeExecutionHandlingEnabled = true;
		this.isErrorHandlingEnabled = true;
	}

	public isEnabledForEdgeCaseHandling(): boolean {
		return this.isOverrideEnabled
			? this.isEnabled
			: this.isEdgeCaseHandlingEnabled;
	}

	public isEnabledForRuntimeExecutionHandling(): boolean {
		return this.isOverrideEnabled
			? this.isEnabled
			: this.isRuntimeExecutionHandlingEnabled;
	}

	public isEnabledForErrorHandling(): boolean {
		return this.isOverrideEnabled
			? this.isEnabled
			: this.isErrorHandlingEnabled;
	}
}
