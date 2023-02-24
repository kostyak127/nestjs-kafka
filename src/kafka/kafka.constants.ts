import { KafkaHandlerType, KafkaTopic } from "./kafka.types";

export const KAFKA_HANDLERS_METADATA = "KAFKA_HANDLERS_METADATA";
export const KAFKA_SKIP_MESSAGE_METADATA = "KAFKA_SKIP_MESSAGE_METADATA";
export const KAFKA_CONTEXT_METADATA_KEY = "KAFKA_CONTEXT_METADATA_KEY";
export const KAFKA_PAYLOAD_METADATA_KEY = "KAFKA_PAYLOAD_METADATA_KEY";
export const KAFKA_VALIDATION_METADATA_KEY = "KAFKA_VAlIDATION_METADATA_KEY";
export const KAFKA_TOPIC_HANDLERS_MAP = new Map<
  KafkaTopic,
  KafkaHandlerType[]
>();