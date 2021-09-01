import { getFromContainer } from '../container';
import { IControllerMetadataArgs } from './args/icontrollermetadataargs';
import { ListenerMetadata } from './listener-metadata';

export class ControllerMetadata {
  target: Function;
  namespace?: String;
  listeners: ListenerMetadata[] = [];

  constructor(args: IControllerMetadataArgs) {
    this.target = args.target;
    this.namespace = args.namespace;
  }

  get instance(): any {
    return getFromContainer(this.target);
  }
}
