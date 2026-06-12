import pino from 'pino';

const logger = pino();

export function greet(name: string): boolean {
	logger.info(`Hello ${name}!`);

	return true;
}
