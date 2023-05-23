# kostyak127-nestjs-kafka
Library provides great nestjs and kafkajs integration.

Functionality:
- send messages
- subscribe to topics (string and regexp) from your injectable classes
- subscribe to one topic from many classes or functions
- io-ts, joi, zod message validation
- skip messages rules
- getting message payload by property
- getting message context in function arguments
## Installation
### npm
`npm install kostyak127-nestjs-kafka`
### yarn
`yarn add kostyak127-nestjs-kafka`

## Usage
#### Register module
```javascript
import { KafkaModule } from 'kostyak127-nestjs-kafka';
import { KafkaModuleOption } from '@app/modules/kafka/interfaces';

// put your options here (it is kafkajs options)
let options: KafkaModuleOption;

@Module({
  imports: [KafkaModule.register(options)],
})
export class AppModule {}
```

#### Sending messages
```javascript
import { Injectable } from '@nestjs/common';
import { KafkaClient } from 'kostyak127-nestjs-kafka';

@Injectable()
export class SendMessageService {
  public constructor(private readonly kafkaClient: KafkaClient) {}
  public async sendMessage(message: { foo: 'bar' }, topic: string) {
    await this.kafkaClient.send({
      messages: [{ key: 'myKey', value: JSON.stringify({ message }],
      topic: topic,
    });
  }
}
```

#### Subscripe to topic handler
```javascript
@Injectable()
export class MessageHandlerService {
  @SubscribeToTopic('TOPIC')
  async onMessage() {
    console.log('message handled');
  }
  @SubscribeToTopic(/.*_customers/)
  async onMessage() {
    console.log('regexp message handled');
  }
}
```
#### Message pattern and payload
```javascript
import { Injectable } from '@nestjs/common';
import { KafkaPayload, SubscribeToTopic } from 'kostyak127-nestjs-kafka';

// specify your path to message payload by messagePattern property
// @KafkaPayload returns payload from message
//
// message from kafka : 
//  {
//     "author": "Author",
//     "message": {
//     "object": { "foo": "bar" }
//  }
// }
// messagePattern:  'message.object'
// @KafkaPayload() messagePayload: { foo: 'bar' }
//
@Injectable()
export class MessageHandlerService {
  @SubscribeToTopic('TOPIC', { messagePattern: 'message.object' })
  async onMessage(@KafkaPayload() messagePayload: { foo: 'bar' }) {
    // logs { foo: 'bar' }
    console.log(messagePayload);
  }
}

```

#### Validation
```javascript
import { Injectable } from '@nestjs/common';
import {
  IoTsValidator,
  JoiValidator,
  SubscribeToTopic,
  ZodValidator,
} from 'kostyak127-nestjs-kafka';

// use your favourite validation library. specify it with schema

@Injectable()
export class MessageHandlerService {
  // export const ZodUser = z.object({
  //    userId: z.number(),
  //    name: z.string(),
  //});
  @SubscribeToTopic('zod_validation', { messagePattern: 'message.object' })
  async validateZod(@ZodValidator(ZodUser) user: ZodTypeOf<typeof ZodUser>) {}


  // export const JoiUser = joi.object({
  //    userId: joi.number(),
  //    name: joi.string(),
  //});
  @SubscribeToTopic('joi_validation', { messagePattern: 'message.object' })
  async validateJoi(
    @JoiValidator(JoiUser) user: joi.extractType<typeof JoiUser>,
  ) {}


  // export const IoTsUser = t.type({
  //    userId: t.number,
  //    name: t.string,
  //});
  @SubscribeToTopic('io-ts_validation', { messagePattern: 'message.object' })
  async validateIoTs(
    @IoTsValidator(IoTsUser) user: IoTsTypeOf<typeof IoTsUser>,
  ) {}
}
```

#### Skip messages
```javascript
import { Injectable } from '@nestjs/common';
import { SkipMessage, SubscribeToTopic } from 'kostyak127-nestjs-kafka';

// skip your messages by some value in message
// here is example how to skip message { author: 'THIS_AUTHOR', data: { foo: 'bar' } }

// you can access nested properties using '.' as wildcard
// use field: 'options.author' for message { message: { author: 'THIS_AUTHOR'} }
@Injectable()
export class MessageHandlerService {
  @SkipMessage([{field: 'author', rule: (author) => author === 'THIS_AUTHOR'}])
  @SubscribeToTopic('TOPIC')
  async onMessage() {
    console.log('messages from author would be skipped by this handler');
  }
}
```

#### Kafka context
```javascript
import { Injectable } from '@nestjs/common';
import { KafkaPayload, SubscribeToTopic, KafkaContext } from 'kostyak127-nestjs-kafka';
import { KafkaMessageContext } from 'kostyak127-nestjs-kafka/src/kafka/kafka.types';

@Injectable()
export class MessageHandlerService {
  @SubscribeToTopic('TOPIC', { messagePattern: 'message.object' })
  async onMessage(@KafkaContext() context: KafkaMessageContext) {
    /// full info message info like topic, offset and other
    console.log(context)
  }
}
```