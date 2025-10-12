import { IsString, IsDateString } from 'class-validator';

export class SearchFlightsDto {
	@IsString()
	from: string;

	@IsString()
	to: string;

	@IsDateString()
	date: string;
}

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
