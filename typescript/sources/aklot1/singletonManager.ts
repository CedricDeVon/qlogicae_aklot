import type { SingletonManagerConstructor } from './singletonManagerConstructor';
import type { SingletonManagerConstructorKey } from './singletonManagerConstructorKey';

export class SingletonManager {
	public static configurations: object = {};

	private static readonly singletons = new Map<
		SingletonManagerConstructorKey,
		unknown
	>();

	private static readonly singletonArrays = new Map<
		SingletonManagerConstructorKey,
		unknown[]
	>();

	private static readonly thisSingleton = new SingletonManager();

	public constructor() {}

	public static construct(): boolean {
		return true;
	}

	public static destruct(): boolean {
		this.singletons.clear();
		this.singletonArrays.clear();

		return true;
	}

	public static setup(newConfigurations: object): boolean {
		this.configurations = newConfigurations;

		return true;
	}

	public static reset(): boolean {
		this.singletons.clear();
		this.singletonArrays.clear();

		return true;
	}

	public static getSingleton<Type>(
		constructorFunction: SingletonManagerConstructor<Type>
	): Type {
		try {
			let instance = this.singletons.get(constructorFunction) as
				| Type
				| undefined;

			if (instance === undefined) {
				instance = new constructorFunction();
				this.singletons.set(constructorFunction, instance);
			}

			return instance;
		} catch {
			throw new Error(
				"Error at 'QLogicae.Aklot1' - Something went wrong here"
			);
		}
	}

	public static getSingletonFromPool<Type>(
		constructorFunction: SingletonManagerConstructor<Type>,
		instanceCount: number,
		index: number
	): Type {
		try {
			if (instanceCount <= 0) {
				throw new Error(
					"Error at 'QLogicae.Aklot1' - Something went wrong here"
				);
			}

			let instances = this.singletonArrays.get(constructorFunction) as
				| Type[]
				| undefined;

			if (instances === undefined) {
				instances = [];

				for (let i = 0; i < instanceCount; ++i) {
					instances.push(new constructorFunction());
				}

				this.singletonArrays.set(constructorFunction, instances);
			}

			return instances[Math.abs(index) % instanceCount]!;
		} catch {
			throw new Error(
				"Error at 'QLogicae.Aklot1' - Something went wrong here"
			);
		}
	}

	public static getThisSingleton(): SingletonManager {
		return this.thisSingleton;
	}
}
