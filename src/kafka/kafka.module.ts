import { DynamicModule, Module } from "@nestjs/common";
import { KafkaModuleOption } from "./kafka.types";
import { KafkaClient } from "./kafka.client";
import { KafkaTopicMetadataHandler } from "./kafka.topic-metadata-handler";
import { DiscoveryService, MetadataScanner, Reflector } from "@nestjs/core";

@Module({})
export class KafkaModule {
  static register(options: KafkaModuleOption): DynamicModule {
    const kafkaClient = new KafkaClient(options);
    return {
      module: KafkaModule,
      imports: [],
      providers: [
        { provide: KafkaClient, useValue: kafkaClient },
        KafkaTopicMetadataHandler,
        DiscoveryService,
        MetadataScanner,
        Reflector,
      ],
      exports: [{ provide: KafkaClient, useValue: kafkaClient }],
    };
  }
}
