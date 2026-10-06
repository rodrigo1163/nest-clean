import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module.js'
import { EnvService } from '../env/env.service.js'

@Module({
	imports: [EnvModule],
	providers: [EnvService],
})
export class CacheModule {}
