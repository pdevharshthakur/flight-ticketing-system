import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { FlightResponseDto } from './search.dto';

@Injectable()
export class SearchService {
	constructor(private readonly prisma: PrismaService) {}

	async searchFlights(from: string, to: string, date: string): Promise<FlightResponseDto[]> {
		// Parse the date to get start and end of day
		const searchDate = new Date(date);
		const startOfDay = new Date(searchDate);
		startOfDay.setHours(0, 0, 0, 0);

		const endOfDay = new Date(searchDate);
		endOfDay.setHours(23, 59, 59, 999);

		const flights = await this.prisma.flight.findMany({
			where: {
				departure: {
					code: from.toUpperCase(),
				},
				arrival: {
					code: to.toUpperCase(),
				},
				departureTime: {
					gte: startOfDay,
					lte: endOfDay,
				},
				status: {
					not: 'CANCELLED',
				},
			},
			include: {
				airline: true,
				departure: true,
				arrival: true,
			},
			orderBy: {
				departureTime: 'asc',
			},
		});

		return flights.map((flight) => this.transformToResponseDto(flight));
	}

	private transformToResponseDto(flight: any): FlightResponseDto {
		const duration = this.calculateDuration(flight.departureTime, flight.arrivalTime);

		return {
			id: flight.id,
			flightNumber: flight.flightNumber,
			airline: {
				code: flight.airline.code,
				name: flight.airline.name,
			},
			departure: {
				code: flight.departure.code,
				city: flight.departure.city,
			},
			arrival: {
				code: flight.arrival.code,
				city: flight.arrival.city,
			},
			departureTime: flight.departureTime.toISOString(),
			arrivalTime: flight.arrivalTime.toISOString(),
			duration,
			price: flight.price,
			availableSeats: flight.availableSeats,
			status: flight.status,
		};
	}

	private calculateDuration(departureTime: Date, arrivalTime: Date): string {
		const diffMs = arrivalTime.getTime() - departureTime.getTime();
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

		return `${diffHours}h ${diffMinutes}m`;
	}
}
