import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { SearchModule } from './search';
import { AirportModule } from './airport';

@Module({
	imports: [PrismaModule, SearchModule, AirportModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
