export type KafkaTopic = string | RegExp | string[] | RegExp[];
export type KafkaMetadata = {
  topic: KafkaTopic;
};
export type KafkaHandlerType = {
  classContext: any;
  function: (classContext: any, ...args: any[]) => Promise<void>;
};
