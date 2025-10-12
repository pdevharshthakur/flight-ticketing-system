import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { AirportResponseDto } from './dto/airport.dto';

@Injectable()
export class AirportService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll(): Promise<AirportResponseDto[]> {
		const airports = await this.prisma.airport.findMany({
			orderBy: {
				city: 'asc',
			},
		});

		return airports.map((airport) => ({
			id: airport.id,
			code: airport.code,
			name: airport.name,
			city: airport.city,
			country: airport.country,
		}));
	}
}
