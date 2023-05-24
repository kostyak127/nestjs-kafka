import { Injectable } from "@nestjs/common";
import { SubscribeToTopic } from "../src/kafka/kafka.decorators";

const CUSTOMER_UPDATED_TOPIC = "customer_updated";
const CUSTOMER_EVENTS_TOPIC = /customer_.*/;

@Injectable()
export class CustomersSubscriber {
  @SubscribeToTopic(CUSTOMER_UPDATED_TOPIC)
  async onCustomerUpdated(message: {
    user: { balance: number; phone: string };
  }) {
    this.handleCustomerBalanceUpdated(message.user.phone, message.user.balance);
  }
  private handleCustomerBalanceUpdated(phone: string, balance: number) {
    // do something
  }

  @SubscribeToTopic(CUSTOMER_EVENTS_TOPIC)
  async onCustomer(message: any) {
    this.logCustomerEvent(message);
  }

  private logCustomerEvent(data: any) {
    console.log(JSON.stringify(data));
  }
}
