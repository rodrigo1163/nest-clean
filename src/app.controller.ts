import { Controller, Get } from '@nestjs/common'
import type { AppService } from './app.service'
import type { PrismaService } from './prisma/prisma.service'

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly prismaService: PrismaService,
	) {}

	@Get()
	async getHello() {
		return await this.prismaService.user.findMany()
	}
}
