export interface Contract<Data extends Object> {
  Topic: string;
  Data: Data;
}

export interface IQueueListener<Data> {
  (message: Data): Promise<void>;
}
