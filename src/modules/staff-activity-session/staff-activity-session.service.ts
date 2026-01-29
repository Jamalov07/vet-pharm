import { BadRequestException, Injectable } from '@nestjs/common'
import { SASRepository } from './staff-activity-session.repository'
import { SASCreateOneRequest, SASFindManyRequest } from './interfaces'
import { formatDuration, getDateKeys } from './helpers'
import { createResponse } from '../../common'
import { SASCreateMethodEnum } from './enums'
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
			workStart.setHours(8, 0, 0, 0)

			const workEnd = new Date(item.date)
			workEnd.setHours(18, 0, 0, 0)

			// 2️⃣ Clamp qilingan start / end
			const effectiveStart = new Date(Math.max(sessionStart.getTime(), workStart.getTime()))

			const effectiveEnd = new Date(Math.min(sessionEnd.getTime(), workEnd.getTime()))

			// 3️⃣ Agar kesishma yo‘q bo‘lsa → 0
			let durationMs = 0
			if (effectiveEnd.getTime() > effectiveStart.getTime()) {
				durationMs = effectiveEnd.getTime() - effectiveStart.getTime()
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
		workStart.setHours(8, 0, 0, 0)

		const workEnd = new Date(today)
		workEnd.setHours(18, 0, 0, 0)

		let totalMs = 0
		let isActive = false

		for (const s of sessions) {
			const start = s.startAt
			const end = s.endAt ?? now

			if (!s.endAt) {
				isActive = true
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
		const sessions = await this.sasRepository.findForReport(query.startDate, query.endDate)

		const dayKeys = getDateKeys(query.startDate, query.endDate)

		const workMap = new Map<
			string,
			{
				userId: string
				fullname: string
				byDay: Record<string, number>
				totalMs: number
			}
		>()

		let grandTotalMs = 0

		for (const s of sessions) {
			const userId = s.user.id
			const dayKey = s.date.toISOString().slice(0, 10)

			if (!workMap.has(userId)) {
				workMap.set(userId, {
					userId,
					fullname: s.user.fullname,
					byDay: Object.fromEntries(dayKeys.map((d) => [d, 0])),
					totalMs: 0,
				})
			}

			const row = workMap.get(userId)

			// ish oynasi
			const workStart = new Date(s.date)
			workStart.setHours(8, 0, 0, 0)

			const workEnd = new Date(s.date)
			workEnd.setHours(18, 0, 0, 0)

			const start = s.startAt
			const end = s.endAt ?? new Date()

			const effectiveStart = Math.max(start.getTime(), workStart.getTime())
			const effectiveEnd = Math.min(end.getTime(), workEnd.getTime())

			if (effectiveEnd > effectiveStart) {
				const ms = effectiveEnd - effectiveStart
				row.byDay[dayKey] += ms
				row.totalMs += ms
				grandTotalMs += ms
			}
		}

		return createResponse({
			data: { days: dayKeys, rows: Array.from(workMap.values()), grandTotalMs },
			success: { messages: ['get report success'] },
		})
	}
}
