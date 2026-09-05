import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AppModule } from '#/infra/app.module.js'
import { DatabaseModule } from '#/infra/database/database.module.js'
import { QuestionCommentFactoty } from '#test/factories/make-question-comment.js'
import { QuestionFactory } from '#test/factories/make-questions.js'
import { StudentFactory } from '#test/factories/make-student.js'

describe('Fetch question comments (E2E)', () => {
	let app: INestApplication
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let questionCommentFactory: QuestionCommentFactoty
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
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[GET] /questions/:questionId/comments', async () => {
		const user = await studentFactory.makePrismaStudent({
			name: 'Jogn Doe',
			email: 'johndoe@example.com',
			password: await hash('123456', 8),
		})

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		})

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		await Promise.all([
			questionCommentFactory.makePrismaQuestionComment({
				authorId: user.id,
				questionId: question.id,
				content: 'Comment 01',
			}),
			questionCommentFactory.makePrismaQuestionComment({
				authorId: user.id,
				questionId: question.id,
				content: 'Comment 02',
			}),
			questionCommentFactory.makePrismaQuestionComment({
				authorId: user.id,
				questionId: question.id,
				content: 'Comment 03',
			}),
		])

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.id}/comments`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		expect(response.statusCode).toBe(200)
		expect(response.body).toEqual({
			questionComments: expect.arrayContaining([
				expect.objectContaining({ content: 'Comment 01' }),
				expect.objectContaining({ content: 'Comment 02' }),
				expect.objectContaining({ content: 'Comment 03' }),
			]),
		})
	})
})
