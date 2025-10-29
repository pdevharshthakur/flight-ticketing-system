import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { BookingResponseDto } from './dto/booking.dto';
import { type CreateBooking } from './dto/create-booking.dto';

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

	async createBooking(data: CreateBooking): Promise<BookingResponseDto> {
		const { email, flightId, passengerCount } = data;

		const flight = await this.prisma.flight.findUnique({ where: { id: flightId } });
		if (!flight) {
			throw new NotFoundException('Flight not found');
		}
		if (flight.availableSeats < passengerCount) {
			throw new BadRequestException('Not enough seats available');
		}

		const user = await this.prisma.user.upsert({
			where: { email },
			update: {},
			create: {
				email,
				firstName: 'Test',
				lastName: 'User',
			},
		});

		const bookingRef = this.generateBookingRef();
		const seatNumbers = this.generateSeatNumbers(passengerCount);

		const booking = await this.prisma.$transaction(async (tx) => {
			// 1) Prevent duplicate bookings for the same user & flight
			const already = await tx.booking.findFirst({
				where: {
					userId: user.id,
					flightId: flight.id,
					status: { in: ['CONFIRMED', 'COMPLETED'] },
				},
				include: { flight: { include: { airline: true, departure: true, arrival: true } } },
			});
			if (already) {
				return already;
			}

			// 2) Atomically decrement seats only if enough are available (race-safe)
			const seatUpdate = await tx.flight.updateMany({
				where: { id: flight.id, availableSeats: { gte: passengerCount } },
				data: { availableSeats: { decrement: passengerCount } },
			});
			if (seatUpdate.count !== 1) {
				throw new BadRequestException('Not enough seats available');
			}

			return tx.booking.create({
				data: {
					userId: user.id,
					flightId: flight.id,
					bookingRef,
					status: 'CONFIRMED',
					totalPrice: flight.price * passengerCount,
					passengerCount,
					seatNumbers,
				},
				include: {
					flight: {
						include: { airline: true, departure: true, arrival: true },
					},
				},
			});
		});

		return {
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
		};
	}

	private generateBookingRef(): string {
		const ts = Date.now().toString().slice(-6);
		const rnd = Math.random().toString(36).toUpperCase().slice(2, 6);
		return `BK${ts}${rnd}`;
	}

	private generateSeatNumbers(count: number): string {
		const seats: string[] = [];
		const rows = ['10', '11', '12', '13', '14', '15', '16'];
		const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
		let i = 0;
		while (seats.length < count) {
			const row = rows[i % rows.length];
			const col = cols[i % cols.length];
			seats.push(`${row}${col}`);
			i++;
		}
		return seats.join(',');
	}
}
