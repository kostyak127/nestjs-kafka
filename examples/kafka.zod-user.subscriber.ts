import { Injectable } from "@nestjs/common";
import { z } from "zod";
import {
  KafkaContext,
  SubscribeToTopic,
  ZodValidator,
} from "../src/kafka/kafka.decorators";

export const ZodUser = z.object({
  userId: z.number(),
  name: z.string(),
});

@Injectable()
export class KafkaZodUserSubscriber {
  public constructor() {}
  @SubscribeToTopic("my_topic", { messagePattern: "user" })
  async onValidZodUser(
    @ZodValidator(ZodUser) user: z.TypeOf<typeof ZodUser>,
    @KafkaContext() context: any
  ) {
    console.log(user);
  }
}
