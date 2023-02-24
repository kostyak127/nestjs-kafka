import { KAFKA_VALIDATION_METADATA_KEY } from "../kafka.constants";
import { Any } from "io-ts";

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
