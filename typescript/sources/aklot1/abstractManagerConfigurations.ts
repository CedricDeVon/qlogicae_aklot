export class AbstractManagerConfigurations {
	public isOverrideEnabled: boolean;

	public isEnabled: boolean;

	public isRuntimeExecutionHandlingEnabled: boolean;

	public isEdgeCaseHandlingEnabled: boolean;

	public isErrorHandlingEnabled: boolean;

	public constructor() {
		this.isOverrideEnabled = false;

		this.isEnabled = true;

		this.isRuntimeExecutionHandlingEnabled = true;

		this.isEdgeCaseHandlingEnabled = true;

		this.isErrorHandlingEnabled = true;
	}

	public isDisabledForHandling(conditions: boolean = false): boolean {
		return (
			!this.isEnabledForRuntimeExecutionHandling() ||
			(this.isEnabledForEdgeCaseHandling() && conditions)
		);
	}

	public isEnabledForRuntimeExecutionHandling(): boolean {
		return this.isOverrideEnabled
			? this.isEnabled
			: this.isRuntimeExecutionHandlingEnabled;
	}

	public isEnabledForEdgeCaseHandling(): boolean {
		return this.isOverrideEnabled
			? this.isEnabled
			: this.isEdgeCaseHandlingEnabled;
	}

	public isEnabledForErrorHandling(): boolean {
		return this.isOverrideEnabled
			? this.isEnabled
			: this.isErrorHandlingEnabled;
	}
}
