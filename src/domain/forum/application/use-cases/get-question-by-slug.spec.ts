import { makeQuestion } from '#test/factories/make-questions.js'
import { InMemoryQuestionAttachmentsRepository } from '#test/repositories/in-memory-question-attachments-repository.js'
import { InMemoryQuestionsRepository } from '#test/repositories/in-memory-questions-repository.js'
import { Slug } from '../../enterprise/entities/value-objects/slug.js'
import { GetQuestionBySlugUseCase } from './get-question-by-slug.js'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		)
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to get a question by slug', async () => {
		const newQuestion = makeQuestion({
			slug: Slug.create('example-question'),
		})

		await inMemoryQuestionsRepository.create(newQuestion)

		const result = await sut.execute({
			slug: 'example-question',
		})

		expect(result.isRight()).toBe(true)

		if (result.isLeft()) {
			throw new Error('Expected to get a question')
		}

		expect(result.value.question.id).toBeTruthy()
		expect(result.value.question.title).toEqual(newQuestion.title)
	})
})
