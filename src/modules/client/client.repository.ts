import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaService } from '../shared/prisma'
import {
	ClientCalc,
	ClientCreateOneRequest,
	ClientDeleteOneRequest,
	ClientFindManyRequest,
	ClientFindOneRequest,
	ClientGetManyRequest,
	ClientGetOneRequest,
	ClientUpdateOneRequest,
} from './interfaces'
import { SellingStatusEnum, ServiceTypeEnum, UserTypeEnum } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { ClientController } from './client.controller'

@Injectable()
export class ClientRepository implements OnModuleInit {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findMany(query: ClientFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const clients = await this.prisma.userModel.findMany({
			where: {
				fullname: query.fullname,
				type: UserTypeEnum.client,
				OR: [{ fullname: { contains: query.search, mode: 'insensitive' } }, { phone: { contains: query.search, mode: 'insensitive' } }],
			},
			select: {
				id: true,
				fullname: true,
				address: true,
				phone: true,
				balance: true,
				actions: true,
				createdAt: true,
				telegram: true,
				category: { select: { id: true, name: true, createdAt: true, percent: true } },
				payments: {
					where: { type: ServiceTypeEnum.client, deletedAt: null },
					select: { card: true, cash: true, other: true, transfer: true, total: true },
				},
				sellings: {
					where: { status: SellingStatusEnum.accepted },
					select: {
						date: true,
						totalPrice: true,
						payment: { select: { card: true, cash: true, other: true, transfer: true, total: true } },
						products: { select: { count: true, price: true } },
					},
					orderBy: { date: 'desc' },
				},
				returnings: {
					where: { status: SellingStatusEnum.accepted },
					select: {
						payment: { select: { fromBalance: true } },
					},
					orderBy: { date: 'desc' },
				},
			},
			...paginationOptions,
		})

		return clients
	}

	async findManyClientForReport(query: ClientFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const clients = await this.prisma.userModel.findMany({
			where: {
				fullname: query.fullname,
				type: UserTypeEnum.client,
				OR: [{ fullname: { contains: query.search, mode: 'insensitive' } }, { phone: { contains: query.search, mode: 'insensitive' } }],
			},
			select: {
				id: true,
				fullname: true,
				address: true,
				phone: true,
				actions: true,
				createdAt: true,
			},
			...paginationOptions,
		})

		return clients
	}

	async findManyStatsForReport(query: ClientFindManyRequest) {
		const startDateSQL = query.startDate ? `'${query.startDate.toISOString()}'` : null
		const endDateSQL = query.endDate ? `'${query.endDate.toISOString()}'` : null

		const [sellingStats, paymentStats, returningStats] = await Promise.all([
			//SELLING
			this.prisma.$queryRaw<{ clientId: string; totalPrice: number; count: number }[]>`
				SELECT
					"client_id"                     AS "clientId",
					COUNT(*)                        AS count,
  				COALESCE(SUM("total_price"), 0) AS "totalPrice"		
				FROM selling
				WHERE status = 'accepted'
					AND "client_id" IS NOT NULL
					${startDateSQL ? `AND date >= ${startDateSQL}` : ''}
        	${endDateSQL ? `AND date <= ${endDateSQL}` : ''}
				GROUP BY "client_id"
			`,

			//PAYMENT
			this.prisma.$queryRaw<{ clientId: string; count: number; total: number; cash: number; card: number; transfer: number; other: number }[]>`
				SELECT
					"user_id"                  AS "clientId",
					COUNT(*)                   AS count,
					COALESCE(SUM(total), 0)    AS total,
					COALESCE(SUM(cash), 0)     AS cash,
					COALESCE(SUM(card), 0)     AS card,
					COALESCE(SUM(transfer), 0) AS transfer,
					COALESCE(SUM(other), 0)    AS other
				FROM payment
				WHERE type IN ('client', 'selling')
					AND "user_id" IS NOT NULL
					AND "deleted_at" IS NULL
					${startDateSQL ? `AND "created_at" >= ${startDateSQL}` : ''}
        	${endDateSQL ? `AND "created_at" <= ${endDateSQL}` : ''}
				GROUP BY "user_id"
			`,

			//RETURNING
			this.prisma.$queryRaw<{ clientId: string; count: number; totalPrice: number; fromBalance: number; cash: number }[]>`
				SELECT
					r."client_id"                          AS "clientId",
					COUNT(*)                               AS count,
					COALESCE(SUM(r."total_price"), 0)      AS "totalPrice",
					COALESCE(SUM(p."from_balance"), 0)     AS "fromBalance",
					COALESCE(SUM(p.cash), 0)               AS cash
				FROM returning r
				LEFT JOIN payment p ON p.returning_id = r."id"
				WHERE r.status = 'accepted'
					AND r."client_id" IS NOT NULL
					${startDateSQL ? `AND r.date >= ${startDateSQL}` : ''}
					${endDateSQL ? `AND r.date <= ${endDateSQL}` : ''}
				GROUP BY r."client_id"
			`,
		])

		const clientMap = new Map<string, ReturnType<typeof this.createEmptyCalc>>()

		const get = (clientId: string) => {
			if (!clientMap.has(clientId)) {
				clientMap.set(clientId, this.createEmptyCalc())
			}
			return clientMap.get(clientId)
		}

		// SELLING
		for (const s of sellingStats) {
			const c = get(s.clientId)
			c.selling.count = Number(s.count)
			c.selling.totalPrice = Number(s.totalPrice)
		}

		// PAYMENT
		for (const p of paymentStats) {
			const c = get(p.clientId)
			c.selling.payment.count = Number(p.count)
			c.selling.payment.total = Number(p.total)
			c.selling.payment.totalCash = Number(p.cash)
			c.selling.payment.totalCard = Number(p.card)
			c.selling.payment.totalTransfer = Number(p.transfer)
			c.selling.payment.totalOther = Number(p.other)
		}

		// RETURNING
		for (const r of returningStats) {
			const c = get(r.clientId)
			c.returning.count = Number(r.count)
			c.returning.totalPrice = Number(r.totalPrice)
			c.returning.payment.totalFromBalance = Number(r.fromBalance)
			c.returning.payment.totalCash = Number(r.cash)
		}

		return Object.fromEntries(clientMap)
	}

	async findManyStatsForReport2(query: ClientFindManyRequest) {
		const clientMap = new Map<string, ClientCalc>()

		const createEmptyCalc = (): ClientCalc => ({
			selling: {
				count: 0,
				totalPrice: 0,
				payment: {
					count: 0,
					total: 0,
					totalCard: 0,
					totalCash: 0,
					totalTransfer: 0,
					totalOther: 0,
				},
			},
			returning: {
				count: 0,
				totalPrice: 0,
				payment: {
					totalFromBalance: 0,
					totalCash: 0,
				},
			},
		})

		const getClient = (clientId: string) => {
			if (!clientMap.has(clientId)) clientMap.set(clientId, createEmptyCalc())
			return clientMap.get(clientId)
		}

		// --- SELLING STATS ---
		const sellingStats = await this.prisma.sellingModel.groupBy({
			by: ['clientId'],
			where: {
				status: 'accepted',
				...(query.startDate && { date: { gte: query.startDate } }),
				...(query.endDate && { date: { lte: query.endDate } }),
			},
			_count: { clientId: true },
			_sum: { totalPrice: true },
		})

		for (const s of sellingStats) {
			const c = getClient(s.clientId)
			c.selling.count = Number(s._count.clientId)
			c.selling.totalPrice = Number(s._sum.totalPrice ?? 0)
		}

		// --- PAYMENT STATS ---
		const paymentStats = await this.prisma.paymentModel.groupBy({
			by: ['userId'],
			where: {
				type: { in: ['client', 'selling'] },
				deletedAt: null,
				total: { gt: 0 },
				...(query.startDate && { createdAt: { gte: query.startDate } }),
				...(query.endDate && { createdAt: { lte: query.endDate } }),
			},
			_count: { userId: true },
			_sum: { total: true, cash: true, card: true, transfer: true, other: true },
		})

		for (const p of paymentStats) {
			const c = getClient(p.userId)
			c.selling.payment.count = Number(p._count.userId)
			c.selling.payment.total = Number(p._sum.total ?? 0)
			c.selling.payment.totalCash = Number(p._sum.cash ?? 0)
			c.selling.payment.totalCard = Number(p._sum.card ?? 0)
			c.selling.payment.totalTransfer = Number(p._sum.transfer ?? 0)
			c.selling.payment.totalOther = Number(p._sum.other ?? 0)
		}

		// --- RETURNING STATS ---
		const returningStats = await this.prisma.returningModel.findMany({
			where: {
				status: 'accepted',
				...(query.startDate && { date: { gte: query.startDate } }),
				...(query.endDate && { date: { lte: query.endDate } }),
			},
			include: { payment: { select: { fromBalance: true, cash: true } } },
		})

		for (const r of returningStats) {
			const c = getClient(r.clientId)
			c.returning.count += 1
			c.returning.totalPrice += Number(r.totalPrice ?? 0)
			c.returning.payment.totalFromBalance += Number(r.payment?.fromBalance ?? 0)
			c.returning.payment.totalCash += Number(r.payment?.cash ?? 0)
		}

		return Object.fromEntries(clientMap)
	}

	async findOne(query: ClientFindOneRequest) {
		const client = await this.prisma.userModel.findFirst({
			where: { id: query.id, type: UserTypeEnum.client },
			select: {
				id: true,
				fullname: true,
				address: true,
				balance: true,
				phone: true,
				actions: true,
				updatedAt: true,
				createdAt: true,
				deletedAt: true,
				category: { select: { id: true, name: true, createdAt: true, percent: true } },
				payments: {
					where: { type: ServiceTypeEnum.client, deletedAt: null },
					select: { card: true, total: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
				},
				sellings: {
					where: { status: SellingStatusEnum.accepted },
					select: {
						date: true,
						totalPrice: true,
						products: { select: { cost: true, count: true, price: true } },
						payment: {
							select: { total: true, card: true, cash: true, other: true, transfer: true, createdAt: true, description: true },
						},
					},
					orderBy: { date: 'desc' },
				},
				returnings: {
					where: { status: SellingStatusEnum.accepted },
					select: {
						payment: {
							select: { fromBalance: true, createdAt: true, description: true },
						},
					},
				},
				telegram: true,
			},
		})

		return client
	}

	async countFindMany(query: ClientFindManyRequest) {
		const clientsCount = await this.prisma.userModel.count({
			where: {
				fullname: query.fullname,
				type: UserTypeEnum.client,
				OR: [{ fullname: { contains: query.search, mode: 'insensitive' } }, { phone: { contains: query.search, mode: 'insensitive' } }],
			},
		})

		return clientsCount
	}

	async getMany(query: ClientGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const clients = await this.prisma.userModel.findMany({
			where: {
				id: { in: query.ids },
				type: UserTypeEnum.client,
				fullname: query.fullname,
			},
			...paginationOptions,
		})

		return clients
	}

	async getOne(query: ClientGetOneRequest) {
		const client = await this.prisma.userModel.findFirst({
			where: { id: query.id, fullname: query.fullname, phone: query.phone },
			select: {
				id: true,
				fullname: true,
				phone: true,
				address: true,
				createdAt: true,
				deletedAt: true,
				password: true,
				token: true,
			},
		})

		return client
	}

	async countGetMany(query: ClientGetManyRequest) {
		const clientsCount = await this.prisma.userModel.count({
			where: {
				id: { in: query.ids },
				fullname: query.fullname,
				type: UserTypeEnum.client,
			},
		})

		return clientsCount
	}

	async createOne(body: ClientCreateOneRequest) {
		const password = await bcrypt.hash(body.phone, 7)

		const client = await this.prisma.userModel.create({
			data: {
				fullname: body.fullname,
				password: password,
				phone: body.phone,
				type: UserTypeEnum.client,
				categoryId: body.categoryId,
			},
			select: {
				id: true,
				fullname: true,
				phone: true,
				address: true,
				createdAt: true,
				category: { select: { id: true, name: true, createdAt: true, percent: true } },
			},
		})
		return client
	}

	async updateOne(query: ClientGetOneRequest, body: ClientUpdateOneRequest) {
		const client = await this.prisma.userModel.update({
			where: { id: query.id },
			data: {
				fullname: body.fullname,
				phone: body.phone,
				balance: body.balance,
				deletedAt: body.deletedAt,
				categoryId: body.categoryId,
			},
		})

		return client
	}

	async deleteOne(query: ClientDeleteOneRequest) {
		const client = await this.prisma.userModel.delete({
			where: { id: query.id },
		})

		return client
	}

	async onModuleInit() {
		await this.prisma.createActionMethods(ClientController)
	}

	createEmptyCalc() {
		return {
			selling: {
				count: 0,
				totalPrice: 0,
				payment: {
					count: 0,
					total: 0,
					totalCash: 0,
					totalCard: 0,
					totalTransfer: 0,
					totalOther: 0,
				},
			},
			returning: {
				count: 0,
				totalPrice: 0,
				payment: {
					totalFromBalance: 0,
					totalCash: 0,
				},
			},
		}
	}
}
