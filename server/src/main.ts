import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { KafkaAdapter } from './adapter/kafkaAdapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const loggingAdapter = new KafkaAdapter(app);
  app.useWebSocketAdapter(loggingAdapter);

  await app.listen(5000);
}
bootstrap();
