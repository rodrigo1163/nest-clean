import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module.js'
import { CacheRepository } from './cache-repository.js'
import { RedisService } from './regis/redis.service.js'
import { RedisCacheRepository } from './regis/redis-cache-repository.js'

@Module({
	imports: [EnvModule],
	providers: [
		RedisService,
		{
			provide: CacheRepository,
			useClass: RedisCacheRepository,
		},
	],
	exports: [CacheRepository],
})
export class CacheModule {}
