import { AbstractManagerConfigurations } from './abstractManagerConfigurations';

export class VsuIdManagerConfigurations extends AbstractManagerConfigurations {
	public vsuIdRegex: RegExp;

	public constructor() {
		super();

		this.vsuIdRegex = /^\d{2}-[12]-\d{5}$/;
	}
}
