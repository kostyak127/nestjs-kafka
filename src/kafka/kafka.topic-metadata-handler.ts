import { Injectable, OnModuleInit } from "@nestjs/common";
import { DiscoveryService, MetadataScanner, Reflector } from "@nestjs/core";
import {
  KafkaHandlerContext,
  KafkaHandlerParams,
  KafkaHandlerType,
  KafkaHandlerValidation,
  KafkaMetadata,
  KafkaSkipMessageOptions,
} from "./kafka.types";
import {
  KAFKA_CONTEXT_METADATA_KEY,
  KAFKA_HANDLERS_METADATA,
  KAFKA_SKIP_MESSAGE_METADATA,
  KAFKA_TOPIC_HANDLERS_MAP,
  KAFKA_VALIDATION_METADATA_KEY,
} from "./kafka.contants";

@Injectable()
export class KafkaTopicMetadataHandler implements OnModuleInit {
  public constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector
  ) {}
  async onModuleInit(): Promise<void> {
    this.mapHandlersToTopic();
  }
  private mapHandlersToTopic() {
    [
      ...this.discoveryService.getProviders(),
      ...this.discoveryService.getControllers(),
    ].forEach(({ instance }) => {
      if (!instance || !Object.getPrototypeOf(instance)) {
        return;
      }
      this.metadataScanner.scanFromPrototype(
        instance,
        Object.getPrototypeOf(instance),
        (key: string) => this.lookupKafkaSubscribers(instance, key)
      );
    });
  }
  private lookupKafkaSubscribers(
    instance: Record<string, KafkaHandlerType["function"]>,
    key: string
  ) {
    const methodRef = instance[key];
    const metadata = this.reflector.get<KafkaMetadata, string>(
      KAFKA_HANDLERS_METADATA,
      methodRef
    );
    if (!metadata) return;
    const context = this.reflector.get<KafkaHandlerContext, string>(
      KAFKA_CONTEXT_METADATA_KEY,
      methodRef
    );
    const validation = this.reflector.get<KafkaHandlerValidation, string>(
      KAFKA_VALIDATION_METADATA_KEY,
      methodRef
    );
    const skipMessageRule = this.reflector.get<KafkaSkipMessageOptions, string>(
      KAFKA_SKIP_MESSAGE_METADATA,
      methodRef
    );
    this.addTopicHandler(
      metadata,
      methodRef,
      instance,
      {
        context: context,
        validation: validation,
      },
      skipMessageRule
    );
  }
  private addTopicHandler(
    metadata: KafkaMetadata,
    methodRef: KafkaHandlerType["function"],
    instance: Record<string, KafkaHandlerType["function"]>,
    params: KafkaHandlerParams,
    skipMessageOptions: KafkaSkipMessageOptions
  ): void {
    const toHandleTopics = Array.isArray(metadata.topic)
      ? metadata.topic
      : [metadata.topic];
    for (const topic of toHandleTopics) {
      const existedTopicHandlers = KAFKA_TOPIC_HANDLERS_MAP.get(topic);
      if (existedTopicHandlers === undefined) {
        KAFKA_TOPIC_HANDLERS_MAP.set(topic, [
          {
            classContext: instance,
            function: methodRef,
            options: metadata.options,
            params,
            skipMessageOptions,
          },
        ]);
        console.log(KAFKA_TOPIC_HANDLERS_MAP.get(topic));
      } else {
        existedTopicHandlers.push({
          classContext: instance,
          function: methodRef,
          options: metadata.options,
          params,
          skipMessageOptions,
        });
        KAFKA_TOPIC_HANDLERS_MAP.set(topic, existedTopicHandlers);
      }
    }
  }
}
