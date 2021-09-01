import fastq = require('fastq');
import { Service } from 'typedi';
import { Contract } from './models';

@Service()
export class Queues {
  private queues: Record<string, fastq.queueAsPromised<any>[]> = {};

  public addListener<Data>(
    topic: string,
    listener: fastq.queueAsPromised<Data>,
  ) {
    const queues = this.queues[topic];

    if (!queues) {
      this.queues[topic] = [listener];
    } else {
      this.queues[topic] = [...queues, listener];
    }
  }

  public sendMessage<Data>(message: Contract<Data>) {
    return async (request: Data) => {
      const queue = this.queues[message.Topic];

      if (!queue) return;

      for (const q of queue) {
        await q.push(request);
      }
    };
  }
}
