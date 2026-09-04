import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client/extension'
import { PaginationParams } from '#/core/repositories/pagination-params.js'
import { AnswersRepository } from '#/domain/forum/application/repositories/answers-repository.js'
import { Answer } from '#/domain/forum/enterprise/entities/answer.js'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper.js'

@Injectable()
export class PrismaAnswerRepository implements AnswersRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async findById(id: string): Promise<Answer | null> {
		const answer = await this.prisma.answer.findUnique({
			where: {
				id,
			},
		})

		if (!answer) {
			return null
		}

		return PrismaAnswerMapper.toDomain(answer)
	}
	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<Answer[]> {
		const answers = await this.prisma.answer.findMany({
			where: {
				questionId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: 20,
			skip: (page - 1) * 20,
		})

		return answers.map(PrismaAnswerMapper.toDomain)
	}
	async create(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPrisma(answer)

		await this.prisma.answer.create({
			data,
		})
	}
	async delete(answer: Answer): Promise<void> {
		await this.prisma.answer.update({
			where: {
				id: answer.id.toString(),
			},
		})
	}
	async save(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPrisma(answer)

		await this.prisma.answer.update({
			where: {
				id: answer.id.toString(),
			},
			data,
		})
	}
}
