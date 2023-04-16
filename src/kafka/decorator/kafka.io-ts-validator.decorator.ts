import { KAFKA_VALIDATION_METADATA_KEY } from "../kafka.constants";
import { Any } from "io-ts";
import { AnySchema } from "@hapi/joi";
import { ZodTypeAny } from "zod/lib/types";

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
