import { Module } from '@nestjs/common'
import { PrismaModule } from '../shared'
import { SASController } from './staff-activity-session.controller'
import { SASService } from './staff-activity-session.service'
import { SASRepository } from './staff-activity-session.repository'

@Module({
	imports: [PrismaModule],
	controllers: [SASController],
	providers: [SASService, SASRepository],
	exports: [SASService, SASRepository],
})
export class SASModule {}
