import { getMetadataArgsStorage } from '..';
import { ControllerMetadata } from '../metadata/controller-metadata';
import { ListenerMetadata } from '../metadata/listener-metadata';

export class MetadataBuilder {
  public buildControllerMetadata(classes?: Function[]): ControllerMetadata[] {
    return this.createController(classes);
  }

  private createController(classes?: Function[]): ControllerMetadata[] {
    const controllers = !classes
      ? getMetadataArgsStorage().controllerMetadata
      : getMetadataArgsStorage().filterControllerMetadataForClasses(classes);

    return controllers.map((controllerArgs) => {
      const controller = new ControllerMetadata(controllerArgs);
      controller.listeners = this.createListeners(controller);
      return controller;
    });
  }

  private createListeners(controller: ControllerMetadata): ListenerMetadata[] {
    return getMetadataArgsStorage()
      .filterListenersWithTarget(controller.target)
      .map((args) => new ListenerMetadata(controller, args));
  }
}
