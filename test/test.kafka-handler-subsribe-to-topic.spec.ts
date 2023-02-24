import { TestingModule } from "@nestjs/testing";
import { KafkaTopicMetadataHandler } from "../src/kafka/kafka.topic-metadata-handler";
import { KAFKA_TOPIC_HANDLERS_MAP } from "../src/kafka/kafka.constants";
import { testKafkaModule } from "./test.kafka-module";

describe("subscribing", () => {
  let metadataHandler: KafkaTopicMetadataHandler;
  beforeAll(async () => {
    const moduleRef: TestingModule = await testKafkaModule();
    metadataHandler = moduleRef.get<KafkaTopicMetadataHandler>(
      KafkaTopicMetadataHandler
    );
    await metadataHandler.onModuleInit();
  });
  describe("asd topic subscribers not empty", () => {
    it("should be not undefined", () => {
      expect(KAFKA_TOPIC_HANDLERS_MAP.get("asd")).not.toBe(undefined);
    });
  });
  describe("asd topic has two subscribers", () => {
    it("should have list with length 2", () => {
      expect(KAFKA_TOPIC_HANDLERS_MAP.get("asd")?.length).toBe(2);
    });
  });
  describe("qwer topic subscribers not empty", () => {
    it("should be undefined", () => {
      expect(KAFKA_TOPIC_HANDLERS_MAP.get("qwer")).toBe(undefined);
    });
  });
});
