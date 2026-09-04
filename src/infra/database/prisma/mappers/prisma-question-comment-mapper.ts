import { UniqueEntityId } from '#/core/entities/unique-entity-id.js'
import { QuestionComment } from '#/domain/forum/enterprise/entities/question-comment.js'
import { Prisma, Comment as PrismaComment } from '../config/generated/client.js'

export class PrismaQuestionCommentMapper {
	static toDomain(raw: PrismaComment): QuestionComment {
		if (!raw.questionId) {
			throw new Error('Invalid comment type.')
		}

		return QuestionComment.create(
			{
				content: raw.content,
				authorId: new UniqueEntityId(raw.authorId),
				questionId: new UniqueEntityId(raw.questionId),
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toPrisma(
		questioncomment: QuestionComment,
	): Prisma.CommentUncheckedCreateInput {
		return {
			id: questioncomment.id.toString(),
			authorId: questioncomment.authorId.toString(),
			questionId: questioncomment.questionId.toString(),
			content: questioncomment.content,
			createdAt: questioncomment.createdAt,
			updatedAt: questioncomment.updatedAt,
		}
	}
}
