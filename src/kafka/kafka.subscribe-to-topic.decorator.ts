import { applyDecorators, SetMetadata } from "@nestjs/common";
import { KAFKA_HANDLERS_METADATA } from "./kafka.contants";
import { KafkaTopic } from "./kafka.types";

export function SubscribeToTopic(topic: KafkaTopic): MethodDecorator {
  return applyDecorators(
    SetMetadata(KAFKA_HANDLERS_METADATA, {
      topic,
    })
  );
}
