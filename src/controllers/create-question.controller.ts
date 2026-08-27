import { Controller, Post, Req, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../auth/current-user-decorator'
import type { UserPayload } from '../auth/jwt.strategy'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
	@Post()
	async handle(@CurrentUser() user: UserPayload) {
		console.log(user)
	}
}
