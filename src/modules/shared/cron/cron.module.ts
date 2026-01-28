import { Module } from '@nestjs/common'
import { CronService } from './cron.service'
import { ScheduleModule } from '@nestjs/schedule'
import { PrismaModule } from '../prisma'

@Module({
	imports: [ScheduleModule.forRoot(), PrismaModule],
	providers: [CronService],
	exports: [CronService],
})
export class CronModule {}
