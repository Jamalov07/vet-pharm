import { Injectable } from '@nestjs/common'
import { SASRepository } from './staff-activity-session.repository'
import { SASCreateOneRequest, SASFindManyRequest } from './interfaces'
import { formatDuration, getDateKeys } from './helpers'
import { createResponse, WORK_END_HOUR, WORK_START_HOUR } from '../../common'
import { ActivityStopReasonEnum } from '@prisma/client'

@Injectable()
export class SASService {
	constructor(private readonly sasRepository: SASRepository) {}

	async findMany(query: SASFindManyRequest) {
		const [rawItems, totalCount] = await Promise.all([this.sasRepository.findMany(query), this.sasRepository.countFindMany(query)])

		const now = new Date()
		let totalMs = 0

		const mappedItems = rawItems.map((item) => {
			const sessionStart = item.startAt
			const sessionEnd = item.endAt ?? now

			// 1️⃣ Shu session kuni uchun ish oynasi
			const workStart = new Date(item.date)
			workStart.setHours(WORK_START_HOUR, 0, 0, 0)

			const workEnd = new Date(item.date)
			workEnd.setHours(WORK_END_HOUR, 0, 0, 0)

			let durationMs = 0

			// 2️⃣ ISH OYNASIDAN BUTUNLAY TASHQARI BO‘LSA → 0
			if (!(sessionStart >= workEnd || sessionEnd <= workStart)) {
				const effectiveStart = Math.max(sessionStart.getTime(), workStart.getTime())

				const effectiveEnd = Math.min(sessionEnd.getTime(), workEnd.getTime())

				if (effectiveEnd > effectiveStart) {
					durationMs = effectiveEnd - effectiveStart
				}
			}
			totalMs += durationMs

			return {
				...item,
				durationMs,
			}
		})

		const total = formatDuration(totalMs)

		const result = query.pagination
			? {
					totalCount,
					pagesCount: Math.ceil(totalCount / query.pageSize),
					pageSize: mappedItems.length,
					data: mappedItems,
					total: {
						totalDurationMs: totalMs,
						totalDurationInText: total.text,
						totalSeconds: total.seconds,
						totalMinutes: total.minutes,
						totalHours: total.hours,
					},
				}
			: {
					data: mappedItems,
					total: {
						totalDurationMs: totalMs,
						totalDurationInText: total.text,
						totalSeconds: total.seconds,
						totalMinutes: total.minutes,
						totalHours: total.hours,
					},
				}

		return createResponse({
			data: result,
			success: { messages: ['find many success'] },
		})
	}

	async getTodayActivityInfo(query: SASFindManyRequest) {
		const today = new Date()
		today.setHours(0, 0, 0, 0)

		const sessions = await this.sasRepository.findMany({
			userId: query.userId,
			date: today,
			deletedAt: null,
		})

		const now = new Date()

		// Ish oynasi
		const workStart = new Date(today)
		workStart.setHours(WORK_START_HOUR, 0, 0, 0)

		const workEnd = new Date(today)
		workEnd.setHours(WORK_END_HOUR, 0, 0, 0)

		let totalMs = 0
		let isActive = false

		for (const s of sessions) {
			const start = s.startAt
			const end = s.endAt ?? now

			if (!s.endAt) {
				isActive = true
			}

			if (start >= workEnd || end <= workStart) {
				continue
			}

			const effectiveStart = Math.max(start.getTime(), workStart.getTime())
			const effectiveEnd = Math.min(end.getTime(), workEnd.getTime())

			if (effectiveEnd > effectiveStart) {
				totalMs += effectiveEnd - effectiveStart
			}
		}

		const formatted = formatDuration(totalMs)

		return {
			isActive,
			today: {
				totalDurationMs: totalMs,
				totalDurationInText: formatted.text,
				totalSeconds: formatted.seconds,
				totalMinutes: formatted.minutes,
				totalHours: formatted.hours,
			},
		}
	}

	async createOne(body: SASCreateOneRequest) {
		const now = new Date()

		const lastSession = await this.sasRepository.findOne({ userId: body.userId })

		if (!lastSession || lastSession.endAt) {
			await this.sasRepository.createOne({ userId: body.userId })

			return createResponse({ data: null, success: { messages: ['open sas success'] } })
		}

		const durationMs = now.getTime() - lastSession.startAt.getTime()

		await this.sasRepository.updateOne({ id: lastSession.id }, { endAt: now, durationMs: BigInt(durationMs), reason: ActivityStopReasonEnum.manual })

		return createResponse({ data: null, success: { messages: ['close sas success'] } })
	}

	async getStaffWorkReport(query: SASFindManyRequest) {
		const staffs = await this.sasRepository.findAllStaffs()

		const dayKeys = getDateKeys(query.startDate, query.endDate)

		// 05:00 ga normalize qilingan Date[] (DB bilan mos)
		const dates = dayKeys.map((d) => {
			const dt = new Date(d)
			dt.setHours(5, 0, 0, 0)
			return dt
		})

		const sessions = await this.sasRepository.findByDaysForReport(dates)

		const workMap = new Map<
			string,
			{
				userId: string
				fullname: string
				byDay: Record<string, number>
				totalMs: number
			}
		>()

		// 1️⃣ barcha stafflarni 0 bilan init
		for (const staff of staffs) {
			workMap.set(staff.id, {
				userId: staff.id,
				fullname: staff.fullname,
				byDay: Object.fromEntries(dayKeys.map((d) => [d, 0])),
				totalMs: 0,
			})
		}

		let grandTotalMs = 0

		// 2️⃣ ENDI FAQAT KUN ICHIDA HISOBLAYMIZ
		for (const s of sessions) {
			const row = workMap.get(s.user.id)
			if (!row) continue

			const dayKey = s.date.toISOString().slice(0, 10)

			const workStart = new Date(s.date)
			workStart.setHours(WORK_START_HOUR, 0, 0, 0)

			const workEnd = new Date(s.date)
			workEnd.setHours(WORK_END_HOUR, 0, 0, 0)

			const sessionStart = s.startAt
			const sessionEnd = s.endAt ?? new Date()

			// ❗ ish oynasidan tashqarida bo‘lsa – SKIP
			if (sessionStart >= workEnd || sessionEnd <= workStart) {
				continue
			}

			const effectiveStart = Math.max(sessionStart.getTime(), workStart.getTime())

			const effectiveEnd = Math.min(sessionEnd.getTime(), workEnd.getTime())

			if (effectiveEnd > effectiveStart) {
				const ms = effectiveEnd - effectiveStart
				row.byDay[dayKey] += ms
				row.totalMs += ms
				grandTotalMs += ms
			}
		}

		return createResponse({
			data: {
				days: dayKeys,
				rows: Array.from(workMap.values()),
				grandTotalMs,
			},
			success: { messages: ['get report success'] },
		})
	}
}
