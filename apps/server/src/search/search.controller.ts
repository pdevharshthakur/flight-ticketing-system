import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchFlightsDto, FlightResponseDto } from './search.dto';

@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Get('flights')
	async searchFlights(
		@Query(new ValidationPipe({ transform: true })) query: SearchFlightsDto,
	): Promise<FlightResponseDto[]> {
		return this.searchService.searchFlights(query.from, query.to, query.date);
	}
}
