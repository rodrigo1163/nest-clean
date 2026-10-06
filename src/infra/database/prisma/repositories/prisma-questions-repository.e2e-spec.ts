import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { QuestionsRepository } from '#/domain/forum/application/repositories/questions-repository.js'
import { AppModule } from '#/infra/app.module.js'
import { CacheModule } from '#/infra/cache/cache.module.js'
import { CacheRepository } from '#/infra/cache/cache-repository.js'
import { DatabaseModule } from '#/infra/database/database.module.js'
import { AttachmentFactory } from '#test/factories/make-attachment.js'
import { QuestionAttachmentFactory } from '#test/factories/make-question-attachment.js'
import { QuestionFactory } from '#test/factories/make-questions.js'
import { StudentFactory } from '#test/factories/make-student.js'

describe('Prisma Questions Repository (E2E)', () => {
	let app: INestApplication
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let attachmentFactory: AttachmentFactory
	let questionAttachmentFactory: QuestionAttachmentFactory
	let cacheRepository: CacheRepository
	let questionsRepository: QuestionsRepository

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule, CacheModule],
			providers: [
				StudentFactory,
				QuestionFactory,
				AttachmentFactory,
				QuestionAttachmentFactory,
			],
		}).compile()

		app = moduleRef.createNestApplication()
		studentFactory = moduleRef.get(StudentFactory)
		attachmentFactory = moduleRef.get(AttachmentFactory)
		questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		cacheRepository = moduleRef.get(CacheRepository)
		questionsRepository = moduleRef.get(QuestionsRepository)

		await app.init()
	})

	it('should cache question details', async () => {
		const user = await studentFactory.makePrismaStudent()

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const attachment = await attachmentFactory.makePrismaAttachment()

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			questionId: question.id,
			attachmentId: attachment.id,
		})
		const slug = question.slug.value

		const questionDetails = await questionsRepository.findDetailsBySlug(slug)

		const cached = await cacheRepository.get(`questions:${slug}:details`)

		expect(cached).toEqual(JSON.stringify(questionDetails))
	})
	it('should return cached question details on subsequent calls', async () => {
		const user = await studentFactory.makePrismaStudent()

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const attachment = await attachmentFactory.makePrismaAttachment()

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			questionId: question.id,
			attachmentId: attachment.id,
		})
		const slug = question.slug.value

		await cacheRepository.set(
			`questions:${slug}:details`,
			JSON.stringify({
				empty: true,
			}),
		)

		const questionDetails = await questionsRepository.findDetailsBySlug(slug)

		expect(questionDetails).toEqual({ empty: true })
	})
})
