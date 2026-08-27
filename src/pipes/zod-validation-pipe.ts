import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodType } from 'zod'
import { fromError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
	constructor(private schema: ZodType<any, any, any>) {}

	transform(value: unknown) {
		try {
			return this.schema.parse(value)
		} catch (error) {
			if (error instanceof ZodError) {
				throw new BadRequestException({
					statusCode: 400,
					message: 'Validation failed',
					error: fromError(error).details, // Ex: "Validation error: Expected string, received number at 'email'"
				})
			}
			throw new BadRequestException('Validation failed')
		}
	}
}
