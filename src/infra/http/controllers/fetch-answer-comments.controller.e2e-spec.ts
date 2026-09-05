import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AppModule } from '#/infra/app.module.js'
import { DatabaseModule } from '#/infra/database/database.module.js'
import { AnswerCommentFactory } from '#test/factories/make-answer-comment.js'
import { AnswerFactory } from '#test/factories/make-answers.js'
import { QuestionFactory } from '#test/factories/make-questions.js'
import { StudentFactory } from '#test/factories/make-student.js'

describe('Fetch answer comments (E2E)', () => {
	let app: INestApplication
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let answerFactory: AnswerFactory
	let answerCommentFactory: AnswerCommentFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				StudentFactory,
				QuestionFactory,
				AnswerCommentFactory,
				AnswerFactory,
			],
		}).compile()

		app = moduleRef.createNestApplication()
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		answerCommentFactory = moduleRef.get(AnswerCommentFactory)
		answerFactory = moduleRef.get(AnswerFactory)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[GET] /answers/:answerId/comments', async () => {
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

		const answer = await answerFactory.makePrismaAnswer({
			questionId: question.id,
			authorId: user.id,
		})

		await Promise.all([
			answerCommentFactory.makePrismaAnswerComment({
				authorId: user.id,
				answerId: answer.id,
				content: 'Comment 01',
			}),
			answerCommentFactory.makePrismaAnswerComment({
				authorId: user.id,
				answerId: answer.id,
				content: 'Comment 02',
			}),
			answerCommentFactory.makePrismaAnswerComment({
				authorId: user.id,
				answerId: answer.id,
				content: 'Comment 03',
			}),
		])

		const response = await request(app.getHttpServer())
			.get(`/answers/${answer.id}/comments`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		expect(response.statusCode).toBe(200)
		expect(response.body).toEqual({
			answerComments: expect.arrayContaining([
				expect.objectContaining({ content: 'Comment 01' }),
				expect.objectContaining({ content: 'Comment 02' }),
				expect.objectContaining({ content: 'Comment 03' }),
			]),
		})
	})
})
