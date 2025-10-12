import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Enable CORS for frontend communication
	app.enableCors({
		origin: 'http://localhost:3000', // Next.js dev server
		credentials: true,
	});

	// Enable global validation pipe
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	await app.listen(3001);
}
bootstrap();
