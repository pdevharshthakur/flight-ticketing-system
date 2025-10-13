import { z } from '../../common/pipes/zod-validation.pipe';

export const CreateBookingSchema = z.object({
	flightId: z.string().min(1),
	passengerCount: z.number().int().min(1).default(1),
	email: z.string().email(),
});

export type CreateBooking = z.infer<typeof CreateBookingSchema>;
