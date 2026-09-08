import { AttachmentsRepository } from '#/domain/forum/application/repositories/attachments-repository.js'
import { Attachment } from '#/domain/forum/enterprise/entities/attachment.js'

export class InMemoryAttachmentRepository implements AttachmentsRepository {
	public items: Attachment[] = []

	async create(Attachment: Attachment) {
		this.items.push(Attachment)
	}
}
