import { Either, right } from '@/core/either.js'
import { QuestionComment } from '../../enterprise/entities/question-comment.js'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository.js'

interface FetchQuestionCommentsUseCaseRequest {
	questionId: string
	page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<
	null,
	{
		questionComments: QuestionComment[]
	}
>

export class FetchQuestionCommentsUseCase {
	constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

	async execute({
		page,
		questionId,
	}: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
		const questionComments =
			await this.questionCommentsRepository.findManyByQuestionId(questionId, {
				page,
			})

		return right({
			questionComments,
		})
	}
}
