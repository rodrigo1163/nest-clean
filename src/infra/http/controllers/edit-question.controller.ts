import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	Put,
} from '@nestjs/common'
import z from 'zod'
import { EditQuestionUseCase } from '#/domain/forum/application/use-cases/edit-question.js'
import { CurrentUser } from '../../auth/current-user-decorator.js'
import type { UserPayload } from '../../auth/jwt.strategy.js'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'

const editQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
	attachments: z.array(z.uuid()),
})

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema)

@Controller('/questions/:id')
export class EditQuestionController {
	constructor(private editQuestion: EditQuestionUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(
		@Body(bodyValidationPipe) body: EditQuestionBodySchema,
		@CurrentUser() user: UserPayload,
		@Param('id') questionId: string,
	) {
		const { title, content, attachments } = body
		const { sub: userid } = user

		const result = await this.editQuestion.execute({
			title,
			content,
			authorId: userid,
			attachmentsIds: attachments,
			questionId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
