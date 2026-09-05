import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '#/core/entities/unique-entity-id.js'
import {
	Answer,
	AnswerProps,
} from '#/domain/forum/enterprise/entities/answer.js'
import { PrismaAnswerMapper } from '#/infra/database/prisma/mappers/prisma-answer-mapper.js'
import { PrismaService } from '#/infra/database/prisma/prisma.service.js'

export function makeAnswer(
	override: Partial<AnswerProps> = {},
	id?: UniqueEntityId,
) {
	const answer = Answer.create(
		{
			authorId: new UniqueEntityId(),
			questionId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	)

	return answer
}

@Injectable()
export class AnswerFactoty {
	constructor(private prisma: PrismaService) {}
	async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
		const answer = makeAnswer(data)

		await this.prisma.answer.create({
			data: PrismaAnswerMapper.toPrisma(answer),
		})

		return answer
	}
}
