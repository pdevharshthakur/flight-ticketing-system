import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ZodExceptionFilter } from './common/filters/zod-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Enable CORS for frontend communication
	app.enableCors({
		origin: 'http://localhost:3000', // Next.js dev server
		credentials: true,
	});

	// Remove class-validator ValidationPipe; use Zod at parameter level and global error filter
	app.useGlobalFilters(new ZodExceptionFilter());

	await app.listen(3001);
}
bootstrap();
