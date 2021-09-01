import * as fastq from 'fastq';
import { Contract, IQueueListener } from './models';

import { MetadataBuilder } from './metadata-builder';
import { Queues } from './queues';

export class InMemoryQueueManager {
  public static registerController(classes: Function[], queues: Queues): void {
    const jobs = new MetadataBuilder().buildControllerMetadata(classes);

    jobs.forEach((job) => {
      job.listeners.forEach((listener) => {
        try {
          const concurrency = listener.concurrency || 10;
          queues.addListener(
            listener.contract.Topic,
            this.createQueue(listener.contract, listener.exec, concurrency),
          );
        } catch (err) {
          console.log(err);
        }
      });
    });
  }

  private static createQueue<Data>(
    contract: Contract<Data>,
    listener: IQueueListener<Data>,
    concurrency: number,
  ) {
    return fastq.promise<Data>(listener, concurrency);
  }
}
