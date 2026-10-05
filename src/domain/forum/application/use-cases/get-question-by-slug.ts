import { Injectable } from '@nestjs/common'
import { Either, left, right } from '#/core/either.js'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error.js'
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details.js'
import { QuestionsRepository } from '../repositories/questions-repository.js'

interface GetQuestionBySlugUseCaseRequest {
	slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		question: QuestionDetails
	}
>

@Injectable()
export class GetQuestionBySlugUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		slug,
	}: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
		const question = await this.questionsRepository.findDetailsBySlug(slug)

		if (!question) {
			return left(new ResourceNotFoundError())
		}

		return right({
			question,
		})
	}
}
