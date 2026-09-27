import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '#/core/entities/unique-entity-id.js'
import {
	QuestionAttachment,
	QuestionAttachmentProps,
} from '#/domain/forum/enterprise/entities/question-attachment.js'
import { PrismaService } from '#/infra/database/prisma/prisma.service.js'

export function makeQuestionAttachment(
	override: Partial<QuestionAttachmentProps> = {},
	id?: UniqueEntityId,
) {
	const questionAttachment = QuestionAttachment.create(
		{
			questionId: new UniqueEntityId(),
			attachmentId: new UniqueEntityId(),
			...override,
		},
		id,
	)

	return questionAttachment
}

@Injectable()
export class QuestionAttachmentFactory {
	constructor(private prisma: PrismaService) {}
	async makePrismaQuestionAttachment(
		data: Partial<QuestionAttachmentProps> = {},
	): Promise<QuestionAttachment> {
		const questionAttachment = makeQuestionAttachment(data)

		await this.prisma.attachment.update({
			where: {
				id: questionAttachment.attachmentId.toString(),
			},
			data: {
				questionId: questionAttachment.questionId.toString(),
			},
		})

		return questionAttachment
	}
}
