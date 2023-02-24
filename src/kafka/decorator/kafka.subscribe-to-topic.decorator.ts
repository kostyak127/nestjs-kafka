import { applyDecorators, SetMetadata } from "@nestjs/common";
import { KAFKA_HANDLERS_METADATA } from "../kafka.constants";
import {
  KafkaSubscribeToTopicOptions,
  SubscribableKafkaTopic,
} from "../kafka.types";

export function SubscribeToTopic(
  topic: SubscribableKafkaTopic,
  options?: KafkaSubscribeToTopicOptions
): MethodDecorator {
  return applyDecorators(
    SetMetadata(KAFKA_HANDLERS_METADATA, {
      options: options || {},
      topic,
    })
  );
}
