import { Injectable } from '@nestjs/common'
import { Either, right } from '#/core/either.js'
import { UniqueEntityId } from '#/core/entities/unique-entity-id.js'
import { Answer } from '../../enterprise/entities/answer.js'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment.js'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list.js'
import { AnswersRepository } from '../repositories/answers-repository.js'

interface AnswerQuestionUseCaseRequest {
	authorId: string
	questionId: string
	attachmentsIds: string[]
	content: string
}

type AnswerQuestionUseCaseResponse = Either<
	null,
	{
		answer: Answer
	}
>

@Injectable()
export class AnswerQuestionUseCase {
	constructor(private answerRepository: AnswersRepository) {}

	async execute({
		authorId,
		questionId,
		content,
		attachmentsIds,
	}: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({
			content,
			authorId: new UniqueEntityId(authorId),
			questionId: new UniqueEntityId(questionId),
		})

		const questionAttachments = attachmentsIds.map((attachmentId) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				answerId: answer.id,
			})
		})

		answer.attachments = new AnswerAttachmentList(questionAttachments)

		await this.answerRepository.create(answer)

		return right({
			answer,
		})
	}
}
