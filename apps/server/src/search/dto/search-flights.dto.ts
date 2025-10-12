import { IsString, IsDateString, Matches } from 'class-validator';

export class SearchFlightsDto {
	@IsString()
	@Matches(/^[A-Z]{3}$/, { message: 'From airport code must be 3 uppercase letters' })
	from: string;

	@IsString()
	@Matches(/^[A-Z]{3}$/, { message: 'To airport code must be 3 uppercase letters' })
	to: string;

	@IsDateString()
	date: string; // Format: YYYY-MM-DD
}

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
