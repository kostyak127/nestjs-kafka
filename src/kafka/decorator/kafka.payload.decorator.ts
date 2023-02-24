import { KAFKA_VALIDATION_METADATA_KEY } from "../kafka.contants";

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
