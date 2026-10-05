import { makeAttachment } from '#test/factories/make-attachment.js'
import { makeQuestionAttachment } from '#test/factories/make-question-attachment.js'
import { makeQuestion } from '#test/factories/make-questions.js'
import { makeStudent } from '#test/factories/make-student.js'
import { InMemoryAttachmentRepository } from '#test/repositories/in-memory-attachments-repository.js'
import { InMemoryQuestionAttachmentsRepository } from '#test/repositories/in-memory-question-attachments-repository.js'
import { InMemoryQuestionsRepository } from '#test/repositories/in-memory-questions-repository.js'
import { InMemoryStudentRepository } from '#test/repositories/in-memory-student-repository.js'
import { Slug } from '../../enterprise/entities/value-objects/slug.js'
import { GetQuestionBySlugUseCase } from './get-question-by-slug.js'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
		inMemoryStudentRepository = new InMemoryStudentRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentRepository,
			inMemoryStudentRepository,
		)
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to get a question by slug', async () => {
		const student = makeStudent({ name: 'John Doe' })

		await inMemoryStudentRepository.create(student)

		const newQuestion = makeQuestion({
			authorId: student.id,
			slug: Slug.create('example-question'),
		})

		await inMemoryQuestionsRepository.create(newQuestion)

		const attachment = makeAttachment({
			title: 'Some attachment',
		})

		inMemoryAttachmentRepository.items.push(attachment)

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				attachmentId: attachment.id,
				questionId: newQuestion.id,
			}),
		)

		const result = await sut.execute({
			slug: 'example-question',
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toMatchObject({
			question: expect.objectContaining({
				title: newQuestion.title,
				author: 'John Doe',
				attachments: [
					expect.objectContaining({
						title: 'Some attachment',
					}),
				],
			}),
		})
	})
})
