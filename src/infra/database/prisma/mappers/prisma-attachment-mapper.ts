import { Attachment } from '#/domain/forum/enterprise/entities/attachment.js'
import { Prisma } from '../config/generated/client.js'

export class PrismaAttachmentMapper {
	static toPrisma(
		attachment: Attachment,
	): Prisma.AttachmentUncheckedCreateInput {
		return {
			id: attachment.id.toString(),
			title: attachment.title,
			url: attachment.url,
		}
	}
}
