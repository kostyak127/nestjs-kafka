import { SubscribeToTopic } from "../src/kafka/decorator/kafka.subscribe-to-topic.decorator";
import * as t from "io-ts";
import { TypeOf as IoTsTypeOf } from "io-ts";
import * as joi from "@hapi/joi";
import { z } from "zod";
import { Injectable } from "@nestjs/common";
import { KafkaContext } from "../src/kafka/decorator/kafka.context.decorator";
import { ZodValidator } from "../src/kafka/decorator/kafka.zod-validator.decorator";
import { TypeOf as ZodTypeOf } from "zod/lib/types";
import { JoiValidator } from "../src/kafka/decorator/kafka.joi-validator";
import { IoTsValidator } from "../src/kafka/decorator/kafka.io-ts-validator.decorator";
import "joi-extract-type";

export const IoTsUser = t.type({
  userId: t.number,
  name: t.string,
});
export const JoiUser = joi.object({
  userId: joi.number(),
  name: joi.string(),
});
export const ZodUser = z.object({
  userId: z.number(),
  name: z.string(),
});

@Injectable()
export class TestKafkaSubscriber {
  @SubscribeToTopic("asd", { messagePattern: "message.data" })
  async onAsdTopicFirst() {}
  @SubscribeToTopic("asd", { messagePattern: "message.data.type" })
  async onAsdTopicSecond() {}
  @SubscribeToTopic("message_pattern", { messagePattern: "message.a" })
  async onMessagePattern() {}

  @SubscribeToTopic("context", {})
  async contextHandler(@KafkaContext() context: any) {}

  @SubscribeToTopic("context_with_second_arg_context")
  async contextSecondArg(firstArg: any, @KafkaContext() context: any) {}
  @SubscribeToTopic("zod_validation")
  async validateZod(@ZodValidator(ZodUser) user: ZodTypeOf<typeof ZodUser>) {}
  @SubscribeToTopic("joi_validation")
  async validateJoi(
    @JoiValidator(JoiUser) user: joi.extractType<typeof JoiUser>
  ) {}

  @SubscribeToTopic("io-ts_validation")
  async validateIoTs(
    @IoTsValidator(IoTsUser) user: IoTsTypeOf<typeof IoTsUser>
  ) {}
}
