import { AbstractManager } from './abstractManager';
import { VsuIdManagerConfigurations } from './vsuIdManagerConfigurations';

export class VsuIdManager extends AbstractManager<VsuIdManagerConfigurations> {
	public constructor() {
		super(new VsuIdManagerConfigurations());
	}
}
