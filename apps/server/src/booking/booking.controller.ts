import { Controller, Get, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingResponseDto, type GetBookings, GetBookingsSchema } from './dto/booking.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('bookings')
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	@Get()
	async getBookings(
		@Query(new ZodValidationPipe(GetBookingsSchema)) query: GetBookings,
	): Promise<BookingResponseDto[]> {
		return this.bookingService.getBookingsByEmail(query.email);
	}
}
