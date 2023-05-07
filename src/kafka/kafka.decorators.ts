import {
  KAFKA_CONTEXT_METADATA_KEY, KAFKA_HANDLERS_METADATA,
  KAFKA_SKIP_MESSAGE_METADATA,
  KAFKA_VALIDATION_METADATA_KEY
} from "./kafka.constants";
import {Any} from "io-ts";
import {AnySchema} from "@hapi/joi";
import {ZodTypeAny} from "zod/lib/types";
import {applyDecorators, SetMetadata} from "@nestjs/common";
import {KafkaSubscribeToTopicOptions, SubscribableKafkaTopic} from "./kafka.types";

export function KafkaContext() {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    Reflect.defineMetadata(
      KAFKA_CONTEXT_METADATA_KEY,
      {
        parameterIndex,
      },
      target[propertyKey]
    );
  };
}


export function IoTsValidator(schema: Any) {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    Reflect.defineMetadata(
      KAFKA_VALIDATION_METADATA_KEY,
      {
        type: "io-ts",
        schema,
        parameterIndex,
      },
      target[propertyKey]
    );
  };
}

export function JoiValidator(schema: AnySchema) {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    Reflect.defineMetadata(
      KAFKA_VALIDATION_METADATA_KEY,
      {
        type: "joi",
        schema,
        parameterIndex,
      },
      target[propertyKey]
    );
  };
}

export function ZodValidator(schema: ZodTypeAny) {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    Reflect.defineMetadata(
      KAFKA_VALIDATION_METADATA_KEY,
      {
        type: "zod",
        schema,
        parameterIndex,
      },
      target[propertyKey]
    );
  };
}

export function KafkaPayload() {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    Reflect.defineMetadata(
      KAFKA_VALIDATION_METADATA_KEY,
      {
        type: undefined,
        schema: undefined,
        parameterIndex,
      },
      target[propertyKey]
    );
  };
}

export function SkipMessage(
  options: {
    field: string;
    rule: (field: unknown) => boolean;
  }[]
): MethodDecorator {
  return applyDecorators(SetMetadata(KAFKA_SKIP_MESSAGE_METADATA, options));
}


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