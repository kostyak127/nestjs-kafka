import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

require("dotenv").config();

async function bootstrap() {
  await NestFactory.create(AppModule);
}
bootstrap().then(() => console.log("bootstrapped"));
