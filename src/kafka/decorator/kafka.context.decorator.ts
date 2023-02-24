import { KAFKA_CONTEXT_METADATA_KEY } from "../kafka.constants";

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
