import pino from "pino";
const logger = pino();
function greet(name) {
  logger.info(`Hello ${name}!`);
  return true;
}
export {
  greet
};
//# sourceMappingURL=index.js.map
