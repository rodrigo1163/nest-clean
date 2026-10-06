import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DomainEvents } from '#/core/events/domain-events.js'
import { AppModule } from '#/infra/app.module.js'
import { DatabaseModule } from '#/infra/database/database.module.js'
import { PrismaService } from '#/infra/database/prisma/prisma.service.js'
import { AnswerFactory } from '#test/factories/make-answers.js'
import { QuestionFactory } from '#test/factories/make-questions.js'
import { StudentFactory } from '#test/factories/make-student.js'
import { waitFor } from '#test/utils/wait-for.js'

describe('On question best answer chosen (E2E)', () => {
	let app: INestApplication
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let answerFactory: AnswerFactory
	let prisma: PrismaService
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, AnswerFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		answerFactory = moduleRef.get(AnswerFactory)
		prisma = moduleRef.get(PrismaService)
		jwt = moduleRef.get(JwtService)

		DomainEvents.shouldRun = true

		await app.init()
	})

	it('should send a notification when question best answer is chosen', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		})

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const answer = await answerFactory.makePrismaAnswer({
			questionId: question.id,
			authorId: user.id,
		})

		const answerId = answer.id.toString()

		await request(app.getHttpServer())
			.patch(`/answers/${answerId}/choose-as-best`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		await waitFor(async () => {
			const notificationOnDatabase = await prisma.notification.findFirst({
				where: {
					recipientId: user.id.toString(),
				},
			})
			expect(notificationOnDatabase).not.toBeNull()
		})
	})
})
