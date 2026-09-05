import {
	BadRequestException,
	Body,
	Controller,
	Param,
	Post,
} from '@nestjs/common'
import z from 'zod'
import { CommentOnAnswerUseCase } from '#/domain/forum/application/use-cases/comment-on-answer.js'
import { CurrentUser } from '../../auth/current-user-decorator.js'
import type { UserPayload } from '../../auth/jwt.strategy.js'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'

const commentOnAnswerBodySchema = z.object({
	content: z.string(),
})

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema)

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
	constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

	@Post()
	async handle(
		@Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
		@CurrentUser() user: UserPayload,
		@Param('answerId') answerId: string,
	) {
		const { content } = body
		const { sub: userid } = user

		const result = await this.commentOnAnswer.execute({
			content,
			authorId: userid,
			answerId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
