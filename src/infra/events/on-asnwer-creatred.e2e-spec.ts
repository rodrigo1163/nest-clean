import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '#/infra/app.module.js'
import { DatabaseModule } from '#/infra/database/database.module.js'
import { PrismaService } from '#/infra/database/prisma/prisma.service.js'
import { AttachmentFactory } from '#test/factories/make-attachment.js'
import { QuestionFactory } from '#test/factories/make-questions.js'
import { StudentFactory } from '#test/factories/make-student.js'
import { waitFor } from '#test/utils/wait-for.js'

describe('On answer creater (E2E)', () => {
	let app: INestApplication
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let prisma: PrismaService
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, AttachmentFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		prisma = moduleRef.get(PrismaService)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	it('should send a notification when answer is created', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		})

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const questionId = question.id.toString()

		await request(app.getHttpServer())
			.post(`/questions/${questionId}/answers`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				content: 'New answer',
				attachments: [],
			})

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
