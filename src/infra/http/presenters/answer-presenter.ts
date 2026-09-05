import { Answer } from '#/domain/forum/enterprise/entities/answer.js'

export class AnswersPresenter {
	static toHTTP(answers: Answer) {
		return {
			id: answers.id.toString(),
			content: answers.content,
			createdAt: answers.createdAt,
			updatedAt: answers.updatedAt,
		}
	}
}
