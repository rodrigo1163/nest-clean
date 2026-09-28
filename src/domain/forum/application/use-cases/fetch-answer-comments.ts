import { Injectable } from '@nestjs/common'
import { Either, right } from '#/core/either.js'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author.js'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository.js'

interface FetchAnswerCommentsUseCaseRequest {
	answerId: string
	page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<
	null,
	{
		comments: CommentWithAuthor[]
	}
>

@Injectable()
export class FetchAnswerCommentsUseCase {
	constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

	async execute({
		page,
		answerId,
	}: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
		const comments =
			await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
				answerId,
				{ page },
			)

		return right({
			comments,
		})
	}
}
