import { UniqueEntityId } from '#/core/entities/unique-entity-id.js'
import { makeAnswerComment } from '#test/factories/make-answer-comment.js'
import { makeStudent } from '#test/factories/make-student.js'
import { InMemoryAnswerCommentsRepository } from '#test/repositories/in-memory-answer-comments-repository.js'
import { InMemoryStudentRepository } from '#test/repositories/in-memory-student-repository.js'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments.js'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
	beforeEach(() => {
		inMemoryStudentRepository = new InMemoryStudentRepository()
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
			inMemoryStudentRepository,
		)
		sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
	})

	it('should be able to fetch answer comments', async () => {
		const student = makeStudent({ name: 'John Doe' })

		inMemoryStudentRepository.items.push(student)

		const comment1 = makeAnswerComment({
			answerId: new UniqueEntityId('answer-1'),
			authorId: student.id,
		})
		const comment2 = makeAnswerComment({
			answerId: new UniqueEntityId('answer-1'),
			authorId: student.id,
		})
		const comment3 = makeAnswerComment({
			answerId: new UniqueEntityId('answer-1'),
			authorId: student.id,
		})

		await inMemoryAnswerCommentsRepository.create(comment1)
		await inMemoryAnswerCommentsRepository.create(comment2)
		await inMemoryAnswerCommentsRepository.create(comment3)

		const result = await sut.execute({
			answerId: 'answer-1',
			page: 1,
		})

		expect(result.value?.comments).toHaveLength(3)
		expect(result.value?.comments).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					author: 'John Doe',
					commentId: comment1.id,
				}),
				expect.objectContaining({
					author: 'John Doe',
					commentId: comment2.id,
				}),
				expect.objectContaining({
					author: 'John Doe',
					commentId: comment3.id,
				}),
			]),
		)
	})

	it('should be able to fetch paginated answer comments', async () => {
		const student = makeStudent({ name: 'John Doe' })

		inMemoryStudentRepository.items.push(student)
		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswerCommentsRepository.create(
				makeAnswerComment({
					answerId: new UniqueEntityId('answer-1'),
					authorId: student.id,
				}),
			)
		}

		const result = await sut.execute({
			answerId: 'answer-1',
			page: 2,
		})

		expect(result.value?.comments).toHaveLength(2)
	})
})
