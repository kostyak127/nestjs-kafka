import { Injectable } from "@nestjs/common";
import { SkipMessage, SubscribeToTopic } from "../src/kafka/kafka.decorators";
import { KafkaClient } from "../src/kafka/kafka.client";

const THIS_SERVICE_AUTHOR = "THIS_SERVICE_AUTHOR";
const TOPIC = "skip_message_example_topic";

@Injectable()
export class SkipMessageExample {
  public constructor(private readonly kafkaClient: KafkaClient) {}
  @SkipMessage([
    { field: "author", rule: (author) => author === "THIS_SERVICE_AUTHOR" },
  ])
  @SubscribeToTopic(TOPIC)
  async skipMesEx() {
    console.log("message handled");
  }

  async sendMessageWouldBeSkippedByHandler() {
    await this.kafkaClient.send({
      topic: TOPIC,
      messages: [
        {
          key: "any key",
          value: JSON.stringify({
            author: THIS_SERVICE_AUTHOR,
            data: { foo: "bar" },
          }),
        },
      ],
    });
  }
}
