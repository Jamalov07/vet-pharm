import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PrismaService } from '../prisma'

@Injectable()
export class CronService {
	private readonly logger = new Logger(CronService.name)

	constructor(private readonly prisma: PrismaService) {}

	@Cron('0 0 18 * * *')
	async autoStopSessions() {
		const now = new Date()

		const openSessions = await this.prisma.staffActivitySessionModel.findMany({
			where: { endAt: null },
		})

		if (!openSessions.length) {
			this.logger.log('No open sessions found at 18:00')
			return
		}

		this.logger.log(`Found ${openSessions.length} open sessions to stop`)

		for (const session of openSessions) {
			const durationMs = now.getTime() - new Date(session.startAt).getTime()

			await this.prisma.staffActivitySessionModel.update({
				where: { id: session.id },
				data: {
					endAt: now,
					durationMs,
					reason: 'auto',
				},
			})

			this.logger.log(`Auto-stopped session ${session.id}, duration ${durationMs}ms`)
		}
	}
}
