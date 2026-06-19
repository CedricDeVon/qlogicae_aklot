import { AbstractManagerConfigurations } from './abstractManagerConfigurations';

export class ErrorManagerConfigurations extends AbstractManagerConfigurations {
	public isOutputEnabled: boolean;

	public isOutputOverrideEnabled: boolean;

	public isAsynchronousOutputEnabled: boolean;

	public isAsynchronousOutputOverrideEnabled: boolean;

	public isRuntimeThrowOutputEnabled: boolean;

	public isConsoleOutputEnabled: boolean;

	public title: string = `Error at 'QLogicae.Aklot1'`;

	public message: string = 'Something went wrong here';

	public titleMessageSeparator = ' - ';

	public constructor() {
		super();

		this.isOutputEnabled = true;
		this.isOutputOverrideEnabled = false;
		this.isRuntimeThrowOutputEnabled = false;
		this.isConsoleOutputEnabled = true;
		this.isAsynchronousOutputEnabled = true;
		this.isAsynchronousOutputOverrideEnabled = false;
	}

	public isEnabledForRuntimeThrowOutput(): boolean {
		return this.isOutputOverrideEnabled
			? this.isOutputEnabled
			: this.isRuntimeThrowOutputEnabled;
	}

	public isEnabledForConsoleOutput(): boolean {
		return this.isOutputOverrideEnabled
			? this.isOutputEnabled
			: this.isConsoleOutputEnabled;
	}
}
