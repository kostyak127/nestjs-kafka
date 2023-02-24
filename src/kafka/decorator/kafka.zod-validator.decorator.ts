import { KAFKA_VALIDATION_METADATA_KEY } from "../kafka.contants";
import { ZodTypeAny } from "zod/lib/types";

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
