import { Contract } from '../models';
import { IListenerMetadataArgs } from './args/ilistenermetadataargs';
import { ControllerMetadata } from './controller-metadata';

export class ListenerMetadata {
  jobMetadata: ControllerMetadata;

  method: string;
  contract: Contract<any>;
  concurrency: number;

  constructor(jobMetadata: ControllerMetadata, args: IListenerMetadataArgs) {
    this.jobMetadata = jobMetadata;

    this.method = args.method;
    this.contract = args.contract;
    this.concurrency = args.options.concurrency;
  }

  public exec = (message: any): Promise<void> => {
    const handlerInstance = this.jobMetadata.instance;
    return handlerInstance[this.method](message);
  };

  public getContext(): any {
    return this.jobMetadata.instance;
  }
}
