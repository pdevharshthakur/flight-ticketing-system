import { z } from '../../common/pipes/zod-validation.pipe';

export const SearchFlightsSchemaV2 = z.object({
	from: z.string().regex(/^[A-Z]{3}$/),
	to: z.string().regex(/^[A-Z]{3}$/),
	date: z.string(),
});
export type SearchFlightsV2 = z.infer<typeof SearchFlightsSchemaV2>;

export class FlightSearchResultDto {
	id: string;
	flightNumber: string;
	airline: {
		code: string;
		name: string;
	};
	departure: {
		airport: {
			code: string;
			name: string;
			city: string;
		};
		time: string;
	};
	arrival: {
		airport: {
			code: string;
			name: string;
			city: string;
		};
		time: string;
	};
	duration: string;
	price: number;
	availableSeats: number;
	status: string;
}

export class SearchFlightsResponseDto {
	flights: FlightSearchResultDto[];
	total: number;
	searchParams: {
		from: string;
		to: string;
		date: string;
	};
}
