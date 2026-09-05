import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AppModule } from '#/infra/app.module.js'
import { DatabaseModule } from '#/infra/database/database.module.js'
import { QuestionFactory } from '#test/factories/make-questions.js'
import { StudentFactory } from '#test/factories/make-student.js'

describe('Fetch recent questions (E2E)', () => {
	let app: INestApplication
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[GET] /questions', async () => {
		const user = await studentFactory.makePrismaStrudent({
			name: 'Jogn Doe',
			email: 'johndoe@example.com',
			password: await hash('123456', 8),
		})

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		})

		await Promise.all([
			questionFactory.makePrismaQuestion({
				authorId: user.id,
				title: 'Question 01',
			}),
			questionFactory.makePrismaQuestion({
				authorId: user.id,
				title: 'Question 02',
			}),
			questionFactory.makePrismaQuestion({
				authorId: user.id,
				title: 'Question 03',
			}),
		])

		const response = await request(app.getHttpServer())
			.get('/questions')
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		expect(response.statusCode).toBe(200)
		expect(response.body).toEqual({
			questions: [
				expect.objectContaining({ title: 'Question 01' }),
				expect.objectContaining({ title: 'Question 02' }),
				expect.objectContaining({ title: 'Question 03' }),
			],
		})
	})
})
