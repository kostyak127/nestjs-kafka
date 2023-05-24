import {
  ConsumerConfig,
  ConsumerRunConfig,
  KafkaConfig,
  KafkaMessage,
  Message,
  ProducerConfig,
  ProducerRecord,
} from "kafkajs";
import { ZodTypeAny } from "zod/lib/types";
import { Any } from "io-ts";
import { AnySchema } from "@hapi/joi";

export type ValidationSchema = ZodTypeAny | Any | AnySchema;

export type SubscribableKafkaTopic = string | RegExp | string[] | RegExp[];
export type KafkaTopic = string | RegExp;
export type KafkaMessagePattern = string;
export type KafkaSkipMessageOption = {
  field: KafkaMessagePattern;
  rule: (field: unknown) => boolean;
};
export type KafkaSkipMessageOptions = KafkaSkipMessageOption[];
export type KafkaSubscribeToTopicOptions =
  | Partial<{
      messagePattern: KafkaMessagePattern;
    }>
  | undefined;

export type KafkaMetadata = {
  topic: SubscribableKafkaTopic;
  options: KafkaSubscribeToTopicOptions;
};
type ParameterMetadata = {
  parameterIndex: number;
};
export type KafkaHandlerValidation = ParameterMetadata & {
  schema: ValidationSchema;
  type: "zod" | "io-ts" | "joi";
};
export type KafkaHandlerContext = ParameterMetadata;

export type KafkaHandlerParams = Partial<{
  context: KafkaHandlerContext;
  validation: KafkaHandlerValidation;
}>;

export type KafkaHandlerType = {
  classContext: any;
  function: (classContext: any, ...args: any[]) => Promise<void>;
  options: KafkaSubscribeToTopicOptions;
  params: Partial<KafkaHandlerParams>;
  skipMessageOptions: KafkaSkipMessageOptions;
};

export type KafkaModuleOption = {
  client: KafkaConfig;
  consumer: ConsumerConfig;
  consumerRunConfig?: ConsumerRunConfig;
  producer?: ProducerConfig;
  consumeFromBeginning?: boolean;
  seek?: Record<string, number | "earliest" | Date>;
};

export type KafkaMessageContext = KafkaMessage & {
  partition: number;
  topic: string;
};

type KafkaMessageObject = Message & {
  value: any | Buffer | string | null;
  key: any;
};

export interface KafkaMessageSend extends Omit<ProducerRecord, "topic"> {
  messages: KafkaMessageObject[];
  topic: string;
}
