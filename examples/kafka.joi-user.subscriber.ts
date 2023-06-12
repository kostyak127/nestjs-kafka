import { Injectable } from "@nestjs/common";
import * as joi from "@hapi/joi";
import "joi-extract-type";
import {
  JoiValidator,
  KafkaContext,
  SubscribeToTopic,
} from "../src/kafka/kafka.decorators";

export const JoiUser = joi.object({
  userId: joi.number(),
  name: joi.string(),
});

@Injectable()
export class KafkaJoiUserSubscriber {
  public constructor() {}
  @SubscribeToTopic("my_topic", { messagePattern: "user" })
  async onJoiUser(
    @JoiValidator(JoiUser) user: joi.extractType<typeof JoiUser>,
    @KafkaContext() context: any
  ) {
    console.log(user);
  }
}
