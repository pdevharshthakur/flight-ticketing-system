import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z, type ZodTypeAny } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform<unknown> {
	constructor(private readonly schema: ZodTypeAny) {}

	transform(value: unknown, _metadata: ArgumentMetadata): unknown {
		const result = this.schema.safeParse(value);
		if (!result.success) {
			// Throw and let the global filter format the error consistently
			throw new BadRequestException({
				message: 'Validation failed',
				issues: result.error.issues,
			});
		}
		return result.data as unknown;
	}
}

// Re-export z to allow importing from a single place if desired
export { z };
