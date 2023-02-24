import { Test, TestingModule } from "@nestjs/testing";
import { KafkaTopicMetadataHandler } from "../src/kafka/kafka.topic-metadata-handler";
import { TestKafkaSubscriber } from "./test.kafka-subscriber";
import { DiscoveryService, MetadataScanner, Reflector } from "@nestjs/core";

export const testKafkaModule = async (): Promise<TestingModule> => {
  return Test.createTestingModule({
    providers: [
      KafkaTopicMetadataHandler,
      TestKafkaSubscriber,
      DiscoveryService,
      MetadataScanner,
      Reflector,
    ],
  }).compile();
};
