import { InMemoryAttachmentRepository } from '#test/repositories/in-memory-attachments-repository.js'
import { FakeUploader } from '#test/storage/fake-uploader.js'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type.js'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment.js'

let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let fakeUploader: FakeUploader

let sut: UploadAndCreateAttachmentUseCase

describe('Upload and create attachment', () => {
	beforeEach(() => {
		inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
		fakeUploader = new FakeUploader()
		sut = new UploadAndCreateAttachmentUseCase(
			inMemoryAttachmentRepository,
			fakeUploader,
		)
	})

	it('should not be able upload and create an attachment', async () => {
		const result = await sut.execute({
			fileName: 'profile.png',
			fileType: 'image/png',
			body: Buffer.from(''),
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			attachment: inMemoryAttachmentRepository.items[0],
		})
		expect(fakeUploader.uploads).toHaveLength(1)
		expect(fakeUploader.uploads[0]).toEqual(
			expect.objectContaining({
				fileName: 'profile.png',
			}),
		)
	})

	it('should be able to upload an attachment with invalid file type', async () => {
		const result = await sut.execute({
			fileName: 'profile.mp3',
			fileType: 'audio/mpeg',
			body: Buffer.from(''),
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
	})
})
