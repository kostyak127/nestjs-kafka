// @ts-nocheck
import { TestingModule } from "@nestjs/testing";
import { KafkaTopicMetadataHandler } from "../src/kafka/kafka.topic-metadata-handler";
import { KAFKA_TOPIC_HANDLERS_MAP } from "../src/kafka/kafka.constants";
import { testKafkaModule } from "./test.kafka-module";

describe("validation", () => {
  let metadataHandler: KafkaTopicMetadataHandler;
  let validUser: { userId: number; name: string };
  let notValidUser: { userId: string; name: string };
  beforeAll(async () => {
    validUser = {
      userId: 1,
      name: "name",
    };
    notValidUser = {
      userId: "qwertyui",
      name: "name",
    };
    const moduleRef: TestingModule = await testKafkaModule();
    metadataHandler = moduleRef.get<KafkaTopicMetadataHandler>(
      KafkaTopicMetadataHandler
    );
    await metadataHandler.onModuleInit();
  });
  describe("io-ts user not valid", () => {
    it("should be not valid", () => {
      const schema =
        KAFKA_TOPIC_HANDLERS_MAP.get("io-ts_validation")?.at(0)?.params
          .validation?.schema;
      expect(schema.is(notValidUser)).toBe(false);
    });
  });
  describe("io-ts user valid", () => {
    it("should be valid", () => {
      const schema =
        KAFKA_TOPIC_HANDLERS_MAP.get("io-ts_validation")?.at(0)?.params
          .validation?.schema;
      expect(schema.is(validUser)).toBe(true);
    });
  });
  describe("joi user not valid", () => {
    it("should be not valid", () => {
      const schema =
        KAFKA_TOPIC_HANDLERS_MAP.get("joi_validation")?.at(0)?.params.validation
          ?.schema;
      expect(schema.validate(notValidUser).error).not.toBe(undefined);
    });
  });
  describe("joi user valid", () => {
    it("should be valid", () => {
      const schema =
        KAFKA_TOPIC_HANDLERS_MAP.get("joi_validation")?.at(0)?.params.validation
          ?.schema;
      expect(schema.validate(validUser).error).not.toBe(true);
    });
  });
  describe("zod user not valid", () => {
    it("should be not valid", () => {
      const schema =
        KAFKA_TOPIC_HANDLERS_MAP.get("zod_validation")?.at(0)?.params.validation
          ?.schema;
      expect(schema.safeParse(notValidUser).success).not.toBe(true);
    });
  });
  describe("zod user valid", () => {
    it("should be valid", () => {
      const schema =
        KAFKA_TOPIC_HANDLERS_MAP.get("zod_validation")?.at(0)?.params.validation
          ?.schema;
      expect(schema.safeParse(validUser).success).toBe(true);
    });
  });
});
