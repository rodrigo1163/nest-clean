import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import z from 'zod'
import { CreateQuestionUseCase } from '#/domain/forum/application/use-cases/create-question.js'
import { CurrentUser } from '../../auth/current-user-decorator.js'
import type { UserPayload } from '../../auth/jwt.strategy.js'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
	constructor(private createQuestion: CreateQuestionUseCase) {}

	@Post()
	async handle(
		@Body(bodyValidationPipe) body: CreateQuestionBodySchema,
		@CurrentUser() user: UserPayload,
	) {
		const { title, content } = body
		const { sub: userid } = user

		await this.createQuestion.execute({
			title,
			content,
			authorId: userid,
			attachmentsIds: [],
		})
	}
}
