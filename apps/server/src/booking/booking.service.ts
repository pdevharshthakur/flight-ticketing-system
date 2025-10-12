import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { BookingResponseDto } from './dto/booking.dto';

@Injectable()
export class BookingService {
	constructor(private readonly prisma: PrismaService) {}

	async getBookingsByEmail(email: string): Promise<BookingResponseDto[]> {
		const bookings = await this.prisma.booking.findMany({
			where: {
				user: {
					email: email,
				},
			},
			include: {
				flight: {
					include: {
						airline: true,
						departure: true,
						arrival: true,
					},
				},
			},
			orderBy: {
				bookingDate: 'desc',
			},
		});

		return bookings.map((booking) => ({
			id: booking.id,
			bookingRef: booking.bookingRef,
			status: booking.status,
			totalPrice: booking.totalPrice,
			bookingDate: booking.bookingDate.toISOString(),
			passengerCount: booking.passengerCount,
			seatNumbers: booking.seatNumbers || '',
			flight: {
				id: booking.flight.id,
				flightNumber: booking.flight.flightNumber,
				departureTime: booking.flight.departureTime.toISOString(),
				arrivalTime: booking.flight.arrivalTime.toISOString(),
				price: booking.flight.price,
				status: booking.flight.status,
				airline: {
					id: booking.flight.airline.id,
					code: booking.flight.airline.code,
					name: booking.flight.airline.name,
				},
				departure: {
					id: booking.flight.departure.id,
					code: booking.flight.departure.code,
					name: booking.flight.departure.name,
					city: booking.flight.departure.city,
					country: booking.flight.departure.country,
				},
				arrival: {
					id: booking.flight.arrival.id,
					code: booking.flight.arrival.code,
					name: booking.flight.arrival.name,
					city: booking.flight.arrival.city,
					country: booking.flight.arrival.country,
				},
			},
		}));
	}
}
