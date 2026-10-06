import { Module } from '@nestjs/common'
import { AnswerAttachmentsRepository } from '#/domain/forum/application/repositories/answer-attachments-repository.js'
import { AnswerCommentsRepository } from '#/domain/forum/application/repositories/answer-comments-repository.js'
import { AnswersRepository } from '#/domain/forum/application/repositories/answers-repository.js'
import { AttachmentsRepository } from '#/domain/forum/application/repositories/attachments-repository.js'
import { QuestionAttachmentsRepository } from '#/domain/forum/application/repositories/question-attachments-repository.js'
import { QuestionCommentsRepository } from '#/domain/forum/application/repositories/question-comments-repository.js'
import { QuestionsRepository } from '#/domain/forum/application/repositories/questions-repository.js'
import { StudentsRepository } from '#/domain/forum/application/repositories/students-repository.js'
import { NotificationsRepository } from '#/domain/notification/application/repositories/notifications-repository.js'
import { CacheModule } from '../cache/cache.module.js'
import { PrismaService } from './prisma/prisma.service.js'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository.js'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository.js'
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answer-repository.js'
import { PrismaAttachmentRepository } from './prisma/repositories/prisma-attachments-repository.js'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository.js'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository.js'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository.js'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository.js'
import { PrismaStudentRepository } from './prisma/repositories/prisma-students-repository.js'

@Module({
	imports: [CacheModule],
	providers: [
		PrismaService,
		{
			provide: StudentsRepository,
			useClass: PrismaStudentRepository,
		},
		{
			provide: QuestionsRepository,
			useClass: PrismaQuestionsRepository,
		},
		{
			provide: QuestionCommentsRepository,
			useClass: PrismaQuestionCommentsRepository,
		},
		{
			provide: QuestionAttachmentsRepository,
			useClass: PrismaQuestionAttachmentsRepository,
		},
		{
			provide: AnswersRepository,
			useClass: PrismaAnswerRepository,
		},
		{
			provide: AnswerCommentsRepository,
			useClass: PrismaAnswerCommentsRepository,
		},
		{
			provide: AnswerAttachmentsRepository,
			useClass: PrismaAnswerAttachmentsRepository,
		},
		{
			provide: AttachmentsRepository,
			useClass: PrismaAttachmentRepository,
		},
		{
			provide: NotificationsRepository,
			useClass: PrismaNotificationsRepository,
		},
	],
	exports: [
		PrismaService,
		QuestionsRepository,
		StudentsRepository,
		QuestionCommentsRepository,
		QuestionAttachmentsRepository,
		AnswersRepository,
		AnswerCommentsRepository,
		AnswerAttachmentsRepository,
		AttachmentsRepository,
		NotificationsRepository,
	],
})
export class DatabaseModule {}
