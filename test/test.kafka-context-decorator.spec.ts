import { KafkaTopicMetadataHandler } from "../src/kafka/kafka.topic-metadata-handler";
import { TestingModule } from "@nestjs/testing";
import { testKafkaModule } from "./test.kafka-module";
import { KAFKA_TOPIC_HANDLERS_MAP } from "../src/kafka/kafka.contants";

describe("kafka context", () => {
  let metadataHandler: KafkaTopicMetadataHandler;
  beforeAll(async () => {
    const moduleRef: TestingModule = await testKafkaModule();
    metadataHandler = moduleRef.get<KafkaTopicMetadataHandler>(
      KafkaTopicMetadataHandler
    );
    await metadataHandler.onModuleInit();
  });
  describe("context available", () => {
    it("should be not undefined", () => {
      expect(
        KAFKA_TOPIC_HANDLERS_MAP.get("context")?.at(0)?.params.context
      ).not.toBe(undefined);
    });
  });
  describe("context index", () => {
    it("should be with index 0", () => {
      expect(
        KAFKA_TOPIC_HANDLERS_MAP.get("context")?.at(0)?.params.context
          ?.parameterIndex
      ).toBe(0);
    });
  });
  describe("context index 1", () => {
    it("should be with index 1", () => {
      expect(
        KAFKA_TOPIC_HANDLERS_MAP.get("context_with_second_arg_context")?.at(0)
          ?.params.context?.parameterIndex
      ).toBe(1);
    });
  });
});
