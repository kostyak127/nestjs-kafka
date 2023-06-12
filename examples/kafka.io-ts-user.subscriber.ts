import { Injectable } from "@nestjs/common";
import * as t from "io-ts";
import {
  IoTsValidator,
  KafkaContext,
  SubscribeToTopic,
} from "../src/kafka/kafka.decorators";

export const IoTsUser = t.type({
  userId: t.number,
  name: t.string,
});

@Injectable()
export class KafkaIoTsUserSubscriber {
  public constructor() {}
  @SubscribeToTopic("my_topic", { messagePattern: "user" })
  async onValidIoTsUser(
    @IoTsValidator(IoTsUser) user: t.TypeOf<typeof IoTsUser>,
    @KafkaContext() context: any
  ) {
    console.log(user);
  }
}
