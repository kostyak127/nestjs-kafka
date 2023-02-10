import { Injectable, OnModuleInit } from "@nestjs/common";
import { DiscoveryService, MetadataScanner, Reflector } from "@nestjs/core";
import { KafkaHandlerType, KafkaTopic } from "./kafka.types";
import {
  KAFKA_HANDLERS_METADATA,
  KAFKA_TOPIC_HANDLERS_MAP,
} from "./kafka.contants";

@Injectable()
export class KafkaTopicMetadataHandler implements OnModuleInit {
  public constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector
  ) {}
  async onModuleInit(): Promise<void> {
    console.log("start handling kafka subscribers metadata");
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
    const metadata = this.reflector.get<{ topic: KafkaTopic }, string>(
      KAFKA_HANDLERS_METADATA,
      methodRef
    );
    if (!metadata) return;
    this.addTopicHandler(metadata.topic, methodRef, instance);
  }
  private addTopicHandler(
    handlerTopic: KafkaTopic,
    methodRef: KafkaHandlerType["function"],
    instance: Record<string, KafkaHandlerType["function"]>
  ): void {
    const toHandleTopics = Array.isArray(handlerTopic)
      ? handlerTopic
      : [handlerTopic];
    for (const topic of toHandleTopics) {
      const existedTopicHandlers = KAFKA_TOPIC_HANDLERS_MAP.get(topic);
      if (existedTopicHandlers === undefined) {
        KAFKA_TOPIC_HANDLERS_MAP.set(topic, [
          { classContext: instance, function: methodRef },
        ]);
      } else {
        existedTopicHandlers.push({
          classContext: instance,
          function: methodRef,
        });
        KAFKA_TOPIC_HANDLERS_MAP.set(topic, existedTopicHandlers);
      }
    }
  }
}
