import { KafkaHandlerType, KafkaTopic } from "./kafka.types";

export const KAFKA_HANDLERS_METADATA = "KAFKA_HANDLERS_METADATA";
export const KAFKA_TOPIC_HANDLERS_MAP = new Map<
  KafkaTopic,
  KafkaHandlerType[]
>();
