import { z } from '../common/pipes/zod-validation.pipe';

export const SearchFlightsSchema = z.object({
	from: z.string().min(1),
	to: z.string().min(1),
	date: z.string().optional(),
});
export type SearchFlights = z.infer<typeof SearchFlightsSchema>;

export class FlightResponseDto {
	id: string;
	flightNumber: string;
	airline: {
		code: string;
		name: string;
	};
	departure: {
		code: string;
		city: string;
	};
	arrival: {
		code: string;
		city: string;
	};
	departureTime: string;
	arrivalTime: string;
	duration: string;
	price: number;
	availableSeats: number;
	status: string;
}
