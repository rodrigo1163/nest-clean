import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
} from '@nestjs/common'
import { DeleteQuestionUseCase } from '#/domain/forum/application/use-cases/delete-question.js'
import { CurrentUser } from '../../auth/current-user-decorator.js'
import type { UserPayload } from '../../auth/jwt.strategy.js'

@Controller('/questions/:id')
export class DeleteQuestionController {
	constructor(private deleteQuestion: DeleteQuestionUseCase) {}

	@Delete()
	@HttpCode(204)
	async handle(
		@CurrentUser() user: UserPayload,
		@Param('id') questionId: string,
	) {
		const { sub: userid } = user

		const result = await this.deleteQuestion.execute({
			questionId,
			authorId: userid,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
