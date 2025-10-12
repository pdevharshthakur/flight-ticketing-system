import { Module } from '@nestjs/common';
import { AirportController } from './airport.controller';
import { AirportService } from './airport.service';
import { PrismaModule } from '../prisma';

@Module({
	imports: [PrismaModule],
	controllers: [AirportController],
	providers: [AirportService],
	exports: [AirportService],
})
export class AirportModule {}
