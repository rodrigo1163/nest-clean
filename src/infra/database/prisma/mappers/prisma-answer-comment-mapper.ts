import { UniqueEntityId } from '#/core/entities/unique-entity-id.js'
import { AnswerComment } from '#/domain/forum/enterprise/entities/answer-comment.js'
import { Prisma, Comment as PrismaComment } from '../config/generated/client.js'

export class PrismaAnswerCommentMapper {
	static toDomain(raw: PrismaComment): AnswerComment {
		if (!raw.answerId) {
			throw new Error('Invalid comment type.')
		}

		return AnswerComment.create(
			{
				content: raw.content,
				authorId: new UniqueEntityId(raw.authorId),
				answerId: new UniqueEntityId(raw.answerId),
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toPrisma(
		answercomment: AnswerComment,
	): Prisma.CommentUncheckedCreateInput {
		return {
			id: answercomment.id.toString(),
			authorId: answercomment.authorId.toString(),
			answerId: answercomment.answerId.toString(),
			content: answercomment.content,
			createdAt: answercomment.createdAt,
			updatedAt: answercomment.updatedAt,
		}
	}
}
