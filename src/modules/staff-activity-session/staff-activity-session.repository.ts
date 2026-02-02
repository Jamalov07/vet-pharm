import { Injectable } from '@nestjs/common'
import { PrismaService } from '../shared/prisma'
import { SASCreateOneRequest, SASFindManyRequest, SASFindOneRequest, SASUpdateOneRequest } from './interfaces'
import { UserTypeEnum } from '@prisma/client'

@Injectable()
export class SASRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findMany(query: SASFindManyRequest) {
		const dayStart = new Date()
		dayStart.setHours(0, 0, 0, 0)

		const nextDay = new Date(dayStart)
		nextDay.setDate(nextDay.getDate() + 1)

		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const sass = await this.prisma.staffActivitySessionModel.findMany({
			where: {
				date: { gte: dayStart, lte: nextDay },
				userId: query.userId,
				reason: query.reason,
				startAt: { gte: query.startDate },
				endAt: { lte: query.endDate },
			},
			orderBy: { startAt: 'desc' },
			...paginationOptions,
		})

		return sass
	}

	async countFindMany(query: SASFindManyRequest) {
		const permissionsCount = await this.prisma.staffActivitySessionModel.count({
			where: {
				date: query.date,
				userId: query.userId,
				reason: query.reason,
				startAt: { gte: query.startDate },
				endAt: { lte: query.endDate },
			},
		})

		return permissionsCount
	}

	async findOne(query: SASFindOneRequest) {
		const sas = await this.prisma.staffActivitySessionModel.findFirst({
			where: {
				id: query.id,
				date: query.date,
				reason: query.reason,
				userId: query.userId,
				endAt: query.endAt,
			},
			orderBy: { createdAt: 'desc' },
		})

		return sas
	}

	async createOne(body: SASCreateOneRequest) {
		const sas = await this.prisma.staffActivitySessionModel.create({
			data: {
				date: new Date(new Date().toISOString().slice(0, 10)),
				startAt: new Date(),
				userId: body.userId,
			},
		})

		return sas
	}

	async updateOne(query: SASFindOneRequest, body: SASUpdateOneRequest) {
		const sas = await this.prisma.staffActivitySessionModel.update({
			where: { id: query.id },
			data: {
				durationMs: body.durationMs,
				endAt: body.endAt,
				reason: body.reason,
			},
		})

		return sas
	}

	async findForReport(startDate?: Date, endDate?: Date) {
		const where: any = {
			deletedAt: null,
		}

		let start: Date
		let end: Date

		if (startDate) {
			start = new Date(startDate)
			start.setHours(5, 0, 0, 0)
		} else {
			start = new Date()
			start.setHours(5, 0, 0, 0)
		}

		if (endDate) {
			end = new Date(endDate)
			end.setHours(5, 0, 0, 0)
			end.setDate(end.getDate() + 1)
		} else {
			end = new Date(start)
			end.setDate(end.getDate() + 1)
		}

		where.date = { gte: start, lt: end }

		const sessions = await this.prisma.staffActivitySessionModel.findMany({
			where,
			include: {
				user: {
					select: {
						id: true,
						fullname: true,
					},
				},
			},
		})

		const staffs = await this.prisma.userModel.findMany({ where: { type: UserTypeEnum.staff, deletedAt: null } })

		return { sessions: sessions, staffs: staffs }
	}

	async findByDayForReport(date?: Date) {
		const sessions = await this.prisma.staffActivitySessionModel.findMany({
			where: { deletedAt: null, date: new Date(new Date(date).setHours(5, 0, 0, 0)) },
			include: {
				user: {
					select: {
						id: true,
						fullname: true,
					},
				},
			},
		})

		return { sessions: sessions }
	}

	async findAllStaffs() {
		const staffs = await this.prisma.userModel.findMany({ where: { type: UserTypeEnum.staff, deletedAt: null } })

		return staffs
	}
}
