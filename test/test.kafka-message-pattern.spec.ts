import { TestingModule } from "@nestjs/testing";
import { KafkaTopicMetadataHandler } from "../src/kafka/kafka.topic-metadata-handler";
import { KAFKA_TOPIC_HANDLERS_MAP } from "../src/kafka/kafka.constants";
import { testKafkaModule } from "./test.kafka-module";

describe("message pattern", () => {
  let metadataHandler: KafkaTopicMetadataHandler;
  beforeAll(async () => {
    const moduleRef: TestingModule = await testKafkaModule();
    metadataHandler = moduleRef.get<KafkaTopicMetadataHandler>(
      KafkaTopicMetadataHandler
    );
    await metadataHandler.onModuleInit();
  });
  describe("asd topic message pattern not empty", () => {
    it("should be not undefined", () => {
      expect(
        KAFKA_TOPIC_HANDLERS_MAP.get("asd")?.at(0)?.options?.messagePattern
      ).not.toBe(undefined);
    });
  });
  describe("asd topic subscribers has different patterns", () => {
    it("should be not empty and different", () => {
      const first =
        KAFKA_TOPIC_HANDLERS_MAP.get("asd")?.at(0)?.options?.messagePattern;
      const second =
        KAFKA_TOPIC_HANDLERS_MAP.get("asd")?.at(1)?.options?.messagePattern;
      expect(first && second && first !== second).toBe(true);
    });
  });
  describe("message_pattern subscriber message_pattern equals to message.a", () => {
    it("should equals to message.a", () => {
      expect(
        KAFKA_TOPIC_HANDLERS_MAP.get("message_pattern")?.at(0)?.options
          ?.messagePattern
      ).toBe("message.a");
    });
  });
});
