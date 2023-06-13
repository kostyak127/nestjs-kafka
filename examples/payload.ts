import { Injectable } from "@nestjs/common";
import { KafkaPayload, SubscribeToTopic } from "../src/kafka/kafka.decorators";

@Injectable()
export class PayloadExample {
  @SubscribeToTopic("MY-TOPIC", { messagePattern: "order.items" })
  async countOrderItemsPrice(
    @KafkaPayload() orderItems: { name: string; price: number }[]
  ) {
    const price = orderItems.reduce((sum, item) => sum + item, 0);
    await this.savePrice(price);
  }
  private async savePrice(price: number) {
    //saving order price
  }
}
