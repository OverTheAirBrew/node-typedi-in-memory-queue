import { Contract } from '../../models';
import { getMetadataArgsStorage } from '../../index';

export function Listener<Data>(
  name: string,
  contract: Contract<Data>,
  options: { concurrency: number } = {
    concurrency: 10,
  },
) {
  return (target: Object, key: string | symbol): void => {
    getMetadataArgsStorage().addListenerMetadata({
      target: target.constructor,
      name: name,
      method: key as string,
      contract,
      options: options,
    });
  };
}
