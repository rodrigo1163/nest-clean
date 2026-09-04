import { Module } from '@nestjs/common'
import { QuestionsRepository } from '#/domain/forum/application/repositories/questions-repository.js'
import { StudentsRepository } from '#/domain/forum/application/repositories/students-repository.js'
import { PrismaService } from './prisma/prisma.service.js'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository.js'
import { PrismaStudentRepository } from './prisma/repositories/prisma-students-repository.js'

@Module({
	providers: [
		PrismaService,
		{
			provide: QuestionsRepository,
			useClass: PrismaQuestionsRepository,
		},
		{
			provide: StudentsRepository,
			useClass: PrismaStudentRepository,
		},
	],
	exports: [PrismaService, QuestionsRepository, StudentsRepository],
})
export class DatabaseModule {}
