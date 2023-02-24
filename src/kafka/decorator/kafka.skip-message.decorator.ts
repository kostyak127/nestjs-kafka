import { applyDecorators, SetMetadata } from "@nestjs/common";
import { KAFKA_SKIP_MESSAGE_METADATA } from "../kafka.contants";

export function SkipMessage(
  options: {
    field: string;
    rule: (field: unknown) => boolean;
  }[]
): MethodDecorator {
  return applyDecorators(SetMetadata(KAFKA_SKIP_MESSAGE_METADATA, options));
}
