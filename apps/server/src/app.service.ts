import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma';

@Injectable()
export class AppService {
	constructor(private readonly prisma: PrismaService) {}

	getHello(): string {
		return 'Hello World!';
	}

	async getAirports() {
		return this.prisma.airport.findMany();
	}

	async getAirlines() {
		return this.prisma.airline.findMany();
	}
}
