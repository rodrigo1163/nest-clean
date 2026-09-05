import {
	BadRequestException,
	Body,
	Controller,
	Param,
	Post,
} from '@nestjs/common'
import z from 'zod'
import { CommentOnQuestionUseCase } from '#/domain/forum/application/use-cases/comment-on-question.js'
import { CurrentUser } from '../../auth/current-user-decorator.js'
import type { UserPayload } from '../../auth/jwt.strategy.js'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'

const commentOnQuestionBodySchema = z.object({
	content: z.string(),
})

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema)

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
	constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

	@Post()
	async handle(
		@Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
		@CurrentUser() user: UserPayload,
		@Param('questionId') questionId: string,
	) {
		const { content } = body
		const { sub: userid } = user

		const result = await this.commentOnQuestion.execute({
			content,
			authorId: userid,
			questionId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
