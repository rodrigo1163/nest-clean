import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import z from 'zod'
import { CurrentUser } from '../../auth/current-user-decorator.js'
import type { UserPayload } from '../../auth/jwt.strategy.js'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js'
import { PrismaService } from '../../database/prisma/prisma.service.js'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe.js'

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
	constructor(private prisma: PrismaService) {}

	@Post()
	async handle(
		@Body(bodyValidationPipe) body: CreateQuestionBodySchema,
		@CurrentUser() user: UserPayload,
	) {
		const { title, content } = body
		const { sub: userid } = user

		const slug = this.convertToSlug(title)

		await this.prisma.question.create({
			data: {
				title,
				content,
				slug,
				authorId: userid,
			},
		})
	}

	private convertToSlug(title: string): string {
		return title
			.normalize('NFD') // Separates letters from accents
			.replace(/[\u0300-\u036f]/g, '') // Removes accents
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, '-') // Replaces separators with hyphens
			.replace(/^-+|-+$/g, '') // Removes leading/trailing hyphens
	}
}
