import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '#/core/entities/unique-entity-id.js'
import {
	AnswerAttachment,
	AnswerAttachmentProps,
} from '#/domain/forum/enterprise/entities/answer-attachment.js'
import { PrismaService } from '#/infra/database/prisma/prisma.service.js'

export function makeAnswerAttachment(
	override: Partial<AnswerAttachmentProps> = {},
	id?: UniqueEntityId,
) {
	const answerAttachment = AnswerAttachment.create(
		{
			answerId: new UniqueEntityId(),
			attachmentId: new UniqueEntityId(),
			...override,
		},
		id,
	)

	return answerAttachment
}

@Injectable()
export class AnswerAttachmentFactory {
	constructor(private prisma: PrismaService) {}
	async makePrismaAnswerAttachment(
		data: Partial<AnswerAttachmentProps> = {},
	): Promise<AnswerAttachment> {
		const AnswerAttachment = makeAnswerAttachment(data)

		await this.prisma.attachment.update({
			where: {
				id: AnswerAttachment.attachmentId.toString(),
			},
			data: {
				answerId: AnswerAttachment.answerId.toString(),
			},
		})

		return AnswerAttachment
	}
}
