import { getMetadataArgsStorage } from '../..';

/**
 * Job decorator.
 *
 * Typescript classes which want to use @Cron need to be decorated with this decorator.
 *
 * @export
 * @param {string} [namespace] Namespace of all owning cron jobs
 * @returns {ClassDecorator}
 */
export function InMemoryQueueController(namespace?: string): ClassDecorator {
  return (target: Function) => {
    getMetadataArgsStorage().addControllerMetadata({
      target: target,
      namespace: namespace,
    });
  };
}
