import { makeNotification } from '@test/factories/make-notification.js'
import { InMemoryNotificationRepository } from '@test/repositories/in-memory-notifications-repository.js'
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error.js'
import { ReadNotificationUseCase } from './read-notification.js'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
	beforeEach(() => {
		inMemoryNotificationRepository = new InMemoryNotificationRepository()
		sut = new ReadNotificationUseCase(inMemoryNotificationRepository)
	})

	it('should be able to send a notification', async () => {
		const notification = makeNotification()

		await inMemoryNotificationRepository.create(notification)

		const result = await sut.execute({
			recipientId: notification.recipientId.toString(),
			notificationId: notification.id.toString(),
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryNotificationRepository.items[0].readAt).toEqual(
			expect.any(Date),
		)
	})
	it('should not be able to read a notification from another user', async () => {
		const notification = makeNotification({
			recipientId: new UniqueEntityId('recipient-1'),
		})

		await inMemoryNotificationRepository.create(notification)

		const result = await sut.execute({
			notificationId: notification.id.toString(),
			recipientId: 'recipient-2',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
