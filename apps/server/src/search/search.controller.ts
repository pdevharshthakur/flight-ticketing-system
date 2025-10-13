import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { FlightResponseDto, type SearchFlights, SearchFlightsSchema } from './search.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Get('flights')
	async searchFlights(
		@Query(new ZodValidationPipe(SearchFlightsSchema)) query: SearchFlights,
	): Promise<FlightResponseDto[]> {
		return this.searchService.searchFlights(query.from, query.to, query.date);
	}
}
