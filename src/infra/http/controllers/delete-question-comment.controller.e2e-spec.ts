import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '#/infra/app.module.js'
import { DatabaseModule } from '#/infra/database/database.module.js'
import { PrismaService } from '#/infra/database/prisma/prisma.service.js'
import { QuestionCommentFactoty } from '#test/factories/make-question-comment.js'
import { QuestionFactory } from '#test/factories/make-questions.js'
import { StudentFactory } from '#test/factories/make-student.js'

describe('Delete question comment (E2E)', () => {
	let app: INestApplication
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let questionCommentFactory: QuestionCommentFactoty
	let prisma: PrismaService
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, QuestionCommentFactoty],
		}).compile()

		app = moduleRef.createNestApplication()
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		questionCommentFactory = moduleRef.get(QuestionCommentFactoty)
		prisma = moduleRef.get(PrismaService)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[DELETE] /questions/comments/:id', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		})

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const questionComment =
			await questionCommentFactory.makePrismaQuestionComment({
				questionId: question.id,
				authorId: user.id,
			})

		const questionCommentId = questionComment.id.toString()

		const response = await request(app.getHttpServer())
			.delete(`/questions/comments/${questionCommentId}`)
			.set('Authorization', `Bearer ${accessToken}`)

		expect(response.statusCode).toBe(204)

		const commentOnDatabase = await prisma.comment.findUnique({
			where: {
				id: questionCommentId,
			},
		})

		expect(commentOnDatabase).toBeNull()
	})
})
