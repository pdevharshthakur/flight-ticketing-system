import { Controller, Get } from '@nestjs/common';
import { AirportService } from './airport.service';
import { AirportResponseDto } from './dto/airport.dto';

@Controller('airports')
export class AirportController {
	constructor(private readonly airportService: AirportService) {}

	@Get()
	async findAll(): Promise<AirportResponseDto[]> {
		return this.airportService.findAll();
	}
}
