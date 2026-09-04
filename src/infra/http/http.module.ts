import { Module } from '@nestjs/common'
import { CreateQuestionUseCase } from '#/domain/forum/application/use-cases/create-question.js'
import { FetchRecentQuestionsUseCase } from '#/domain/forum/application/use-cases/fetch-recent-questions.js'
import { DatabaseModule } from '../database/database.module.js'
import { AuthenticateController } from './controllers/authenticate.controller.js'
import { CreateAccountController } from './controllers/create-account.controller.js'
import { CreateQuestionController } from './controllers/create-question.controller.js'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller.js'
import { AuthenticateStudentUseCase } from '#/domain/forum/application/use-cases/authenticate-student.js'
import { RegisterStudentUseCase } from '#/domain/forum/application/use-cases/register-student.js'
import { CryptographyModule } from '../cryptography/cryptography.module.js'

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [
		CreateAccountController,
		AuthenticateController,
		CreateQuestionController,
		FetchRecentQuestionsController,
	],
	providers: [CreateQuestionUseCase, FetchRecentQuestionsUseCase, AuthenticateStudentUseCase, RegisterStudentUseCase],
})
export class HttpModule {}
