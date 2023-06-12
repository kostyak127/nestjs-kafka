import { Injectable, OnModuleInit } from "@nestjs/common";
import {
  Consumer,
  Kafka,
  KafkaMessage,
  Producer,
  RecordMetadata,
} from "kafkajs";
import { KAFKA_TOPIC_HANDLERS_MAP } from "./kafka.constants";
import {
  KafkaHandlerType,
  KafkaHandlerValidation,
  KafkaMessageContext,
  KafkaMessageSend,
  KafkaModuleOption,
  KafkaSkipMessageOptions,
  KafkaTopic,
} from "./kafka.types";
import { ZodTypeAny } from "zod/lib/types";
import { AnySchema } from "@hapi/joi";
import { Any } from "io-ts";

const KafkaJSLogCreator = require("kafkajs-logger");

@Injectable()
export class KafkaClient implements OnModuleInit {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly consumer: Consumer;
  private readonly options: KafkaModuleOption;

  constructor(options: KafkaModuleOption) {
    const {
      client,
      consumer: consumerConfig,
      producer: producerConfig,
    } = options;

    this.kafka = new Kafka({
      ...client,
      logCreator: KafkaJSLogCreator,
    });

    const { groupId } = consumerConfig;
    const consumerOptions = Object.assign(
      {
        groupId: this.getGroupIdSuffix(groupId),
      },
      consumerConfig
    );

    this.consumer = this.kafka.consumer(consumerOptions);
    this.producer = this.kafka.producer(producerConfig);
    this.options = options;
  }

  public async send(
    message: KafkaMessageSend
  ): Promise<RecordMetadata[] | void> {
    if (!this.producer) {
      console.error("There is no producer, unable to send message.");
      return;
    }
    return this.producer.send(message);
  }

  public async onModuleInit() {
    await this.connect();
  }
  private async connect() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.subscribeToTopics();
    await this.startConsumer();
  }
  private async subscribeToTopics() {
    await this.consumer.subscribe({ topics: this.topicsToSubscribe });
  }
  private async startConsumer(): Promise<void> {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const context = this.compileContext(message, topic, partition);
        const value = JSON.parse(message.value?.toString() as string);
        const topicHandlers = this.getTopicHandlers(topic);
        await Promise.all(
          topicHandlers.map((handler) => {
            if (
              handler.skipMessageOptions &&
              this.mustSkip(value, handler.skipMessageOptions)
            ) {
              console.log("SKIPPING MESSAGE BY SKIP RULE");
              return;
            }
            const messageFromMessagePattern = handler.options?.messagePattern
              ? this.getFromMessagePattern(
                  value,
                  handler.options.messagePattern
                )
              : value;
            if (handler.params.validation) {
              if (
                !this.validateMessage(
                  messageFromMessagePattern,
                  handler.params.validation
                )
              ) {
                console.error("MESSAGE INVALID. SKIPPING!");
                return;
              }
            }

            handler.function.apply(
              handler.classContext,
              this.compileFunctionArgs(
                handler,
                messageFromMessagePattern,
                context
              )
            );
          })
        );
      },
    });
  }
  private getTopicHandlers(
    topicFromReceivedMessage: string
  ): KafkaHandlerType[] {
    const matchedTopics: KafkaTopic[] = [];
    for (const topic of this.toppingHandlersMap.keys()) {
      if (topic instanceof RegExp && topic.test(topicFromReceivedMessage)) {
        matchedTopics.push(topic);
      } else if (topic === topicFromReceivedMessage) {
        matchedTopics.push(topic);
      }
    }
    const res: KafkaHandlerType[] = [];
    for (const topic of matchedTopics) {
      const handlers = this.toppingHandlersMap.get(topic);
      if (handlers) {
        res.push(...handlers);
      }
    }
    return res;
  }
  private get toppingHandlersMap() {
    return KAFKA_TOPIC_HANDLERS_MAP;
  }
  private get topicsToSubscribe(): KafkaTopic[] {
    const res: KafkaTopic[] = [];
    KAFKA_TOPIC_HANDLERS_MAP.forEach((_, key) => res.push(key));
    return res;
  }

  private getGroupIdSuffix(groupId: string): string {
    return groupId + "-client";
  }

  private getFromMessagePattern(message: any, pattern: string) {
    let res = message;
    for (const part of pattern.split(".")) {
      res = res[part];
    }
    return res;
  }
  private validateMessage(
    message: any,
    options: KafkaHandlerValidation
  ): boolean {
    if (options.type === "zod") {
      return this.validateZod(message, options.schema as ZodTypeAny);
    }
    if (options.type === "joi") {
      return this.validateJoi(message, options.schema as AnySchema);
    }
    if (options.type === "io-ts") {
      return this.validateIoTs(message, options.schema as Any);
    }
    if (options.type === undefined) {
      return true;
    }
    throw new Error("UNKONOWN VALIDATION OPTIONS");
  }

  private validateZod(message: any, schema: ZodTypeAny): boolean {
    return schema.safeParse(message).success;
  }
  private validateJoi(message: any, schema: AnySchema): boolean {
    return !Boolean(schema.validate(message).error);
  }
  private validateIoTs(message: any, schema: Any): boolean {
    return schema.is(message);
  }
  private compileContext(
    message: KafkaMessage,
    topic: string,
    partition: number
  ): KafkaMessageContext {
    return {
      ...message,
      topic,
      partition,
    } as KafkaMessageContext;
  }
  private compileFunctionArgs(
    handler: KafkaHandlerType,
    fromPattern: any,
    context: KafkaMessageContext
  ): any[] {
    const contextParamIdx = handler.params.context?.parameterIndex;
    const messageIdx = handler.params.validation?.parameterIndex;
    const res = [];
    if (contextParamIdx === 0) {
      res.push(context);
      res.push(fromPattern);
    } else if (messageIdx === 0) {
      res.push(fromPattern);
      res.push(context);
    }
    return res;
  }
  private mustSkip(
    message: any,
    skipOptions: KafkaSkipMessageOptions
  ): boolean {
    for (const skipOption of skipOptions) {
      const field = this.getFromMessagePattern(message, skipOption.field);
      if (skipOption.rule(field)) {
        return true;
      }
    }
    return false;
  }
}
