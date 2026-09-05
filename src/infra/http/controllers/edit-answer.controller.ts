import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	Put,
} from '@nestjs/common'
import z from 'zod'
import { EditAnswerUseCase } from '#/domain/forum/application/use-cases/edit-answer.js'
import { CurrentUser } from '../../auth/current-user-decorator.js'
import type { UserPayload } from '../../auth/jwt.strategy.js'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'

const editAnwerBodySchema = z.object({
	content: z.string(),
})

type EditAnwerBodySchema = z.infer<typeof editAnwerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editAnwerBodySchema)

@Controller('/answers/:id')
export class EditAnwerController {
	constructor(private editAnwer: EditAnswerUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(
		@Body(bodyValidationPipe) body: EditAnwerBodySchema,
		@CurrentUser() user: UserPayload,
		@Param('id') answerId: string,
	) {
		const { content } = body
		const { sub: userid } = user

		const result = await this.editAnwer.execute({
			content,
			authorId: userid,
			attachmentsIds: [],
			answerId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
