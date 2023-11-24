import { IoAdapter } from '@nestjs/platform-socket.io';
import { Socket } from 'socket.io';
import { Kafka, Producer, Consumer, logLevel } from 'kafkajs';

export class KafkaAdapter extends IoAdapter {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private gId = Date.now();

  async connectConsumer() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'sync-socket' });
  }

  createIOServer(port: number, options?: any): any {
    this.kafka = new Kafka({
      clientId: 'kafka-adapt',
      brokers: ['192.168.212.82:9092'],
      logLevel: logLevel.ERROR,
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: `socket-io-kafka-group-${this.gId}`,
    });
    const server = super.createIOServer(port, options);
    this.connectConsumer();
    return server;
  }

  bindMessageHandlers(
    client: Socket,
    handlers: any[],
    processHandler: (data: any) => void,
  ): void {
    handlers.forEach(({ message, callback }) => {
      client.on(message, async (data: any) => {
        // Log the message
        this.producer.send({
          topic: 'sync-socket',
          messages: [
            {
              value: JSON.stringify({
                msg: message,
                data,
                gId: this.gId,
              }),
            },
          ],
        });
        callback(data, client, processHandler);
      });
    });
    this.consumer.run({
      eachMessage: async ({ message }) => {
        const str = message.value.toString('utf-8');
        const { gId, msg, data } = JSON.parse(str);
        if (+gId !== this.gId) {
          client.broadcast.emit(msg, data);
        }
      },
    });
  }
}
