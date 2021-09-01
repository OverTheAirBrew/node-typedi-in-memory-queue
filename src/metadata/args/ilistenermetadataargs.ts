import { Contract } from '../../models';

export interface IListenerMetadataArgs {
  target: Function;
  method: string;
  name: string;
  contract: Contract<any>;
  options: {
    concurrency: number;
  };
}
