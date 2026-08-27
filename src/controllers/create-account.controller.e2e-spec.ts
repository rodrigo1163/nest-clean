import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/app.module.js'

describe('Create account (E2E)', () => {
	let app: INestApplication

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleRef.createNestApplication()
		await app.init()
	})

	test('[POST] /accounts', async () => {
		const response = await request(app.getHttpServer()).post('/accounts').send({
			name: 'Jogn Doe',
			email: 'johndoe@example.com',
			password: '123456',
		})

		expect(response.statusCode).toBe(201)
	})
})
