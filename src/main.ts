import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "@nestjs/common";

import { JwtStrategy } from './auth/strategies/jwt.strategy';
import * as passport from 'passport';

async function start() {

    const PORT = process.env.PORT || 5000;
    console.log('!!!PORT = ', PORT)
    const app = await NestFactory.create(AppModule);

    // app.useGlobalPipes(new ValidationPipe({ transform: true }));

    console.log('!!!secret = ', process.env.PRIVATE_KEY)

    // Регистрация и настройка Passport
    app.use(passport.initialize());

    // Подключение стратегии JWT
    const jwtStrategy = app.get(JwtStrategy);
    passport.use(jwtStrategy);

    const config = new DocumentBuilder()
        .setTitle("test-RaDevs")
        .setDescription("Documentation REST API")
        .setVersion("0.0.1")
        .addTag("D_TUZ")
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            'JWT')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/api/docs", app, document);

    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
start();