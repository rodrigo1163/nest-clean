import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
} from '@nestjs/common'
import { DeleteQuestionCommentUseCase } from '#/domain/forum/application/use-cases/delete-question-comment.js'
import { CurrentUser } from '../../auth/current-user-decorator.js'
import type { UserPayload } from '../../auth/jwt.strategy.js'

@Controller('/questions/comments/:id')
export class DeleteQuestionCommentController {
	constructor(private deleteQuestionComment: DeleteQuestionCommentUseCase) {}

	@Delete()
	@HttpCode(204)
	async handle(
		@CurrentUser() user: UserPayload,
		@Param('id') questionCommentId: string,
	) {
		const { sub: userid } = user

		const result = await this.deleteQuestionComment.execute({
			questionCommentId,
			authorId: userid,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
