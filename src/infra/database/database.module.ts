import { Module } from '@nestjs/common'
import { QuestionsRepository } from '#/domain/forum/application/repositories/questions-repository.js'
import { PrismaService } from './prisma/prisma.service.js'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository.js'

@Module({
	providers: [
		PrismaService,
		{
			provide: QuestionsRepository,
			useClass: PrismaQuestionsRepository,
		},
	],
	exports: [PrismaService, QuestionsRepository],
})
export class DatabaseModule {}
