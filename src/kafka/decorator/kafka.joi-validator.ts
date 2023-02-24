import { KAFKA_VALIDATION_METADATA_KEY } from "../kafka.constants";
import { AnySchema } from "@hapi/joi";

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
