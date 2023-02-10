import { Injectable, OnModuleInit } from "@nestjs/common";
import { Consumer, Kafka, Producer } from "kafkajs";
import { KAFKA_TOPIC_HANDLERS_MAP } from "./kafka.contants";
import { KafkaTopic } from "./kafka.types";

@Injectable()
export class KafkaClient implements OnModuleInit {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly consumer: Consumer;
  public async onModuleInit() {}
  private async connect() {}
  private async onMessageReceived(): Promise<void> {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const topicHandlers = this.getTopicHandlers(topic);
        await Promise.all(
          topicHandlers.map((handler) =>
            handler.function.apply(handler.classContext, [""])
          )
        );
      },
    });
  }
  private getTopicHandlers(topicFromReceivedMessage: string): {
    classContext: any;
    function: (classContext: any, ...args: any[]) => Promise<void>;
  }[] {
    const matchedTopics: KafkaTopic[] = [];
    for (const topic of this.toppingHandlersMap.keys()) {
      if (topic instanceof RegExp && topic.test(topicFromReceivedMessage)) {
        matchedTopics.push(topic);
      } else if (topic === topicFromReceivedMessage) {
        matchedTopics.push(topic);
      }
    }
    return matchedTopics.map((matched) =>
      this.toppingHandlersMap.get(matched)
    ) as unknown as {
      classContext: any;
      function: (classContext: any, ...args: any[]) => Promise<void>;
    }[];
  }
  private get toppingHandlersMap() {
    return KAFKA_TOPIC_HANDLERS_MAP;
  }
}
