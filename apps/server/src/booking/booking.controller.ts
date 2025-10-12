import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { BookingService } from './booking.service';
import { GetBookingsDto, BookingResponseDto } from './dto/booking.dto';

@Controller('bookings')
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Get()
	async getBookings(
		@Query(new ValidationPipe({ transform: true })) query: GetBookingsDto,
	): Promise<BookingResponseDto[]> {
		return this.bookingService.getBookingsByEmail(query.email);
	}
}
