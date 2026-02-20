import { Injectable } from '@nestjs/common'
import { PrismaService } from '../shared'
import {
	ExpenseCreateOneRequest,
	ExpenseDeleteOneRequest,
	ExpenseFindManyRequest,
	ExpenseFindOneRequest,
	ExpenseGetManyRequest,
	ExpenseGetOneRequest,
	ExpenseUpdateOneRequest,
} from './interfaces'
import { ExpenseController } from './expense.controller'

@Injectable()
export class ExpenseRepository {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findMany(query: ExpenseFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const expenses = await this.prisma.expenseModel.findMany({
			where: {
				description: { contains: query.description, mode: 'insensitive' },
				createdAt: { gte: query.startDate, lte: query.endDate },
			},
			select: {
				id: true,
				description: true,
				price: true,
				createdAt: true,
				staff: { select: { id: true, createdAt: true, fullname: true, phone: true } },
			},
			...paginationOptions,
		})

		return expenses
	}

	async findOne(query: ExpenseFindOneRequest) {
		const expense = await this.prisma.expenseModel.findFirst({
			where: { id: query.id },
			select: {
				id: true,
				description: true,
				price: true,
				createdAt: true,
				staff: { select: { id: true, createdAt: true, fullname: true, phone: true } },
			},
		})

		return expense
	}

	async countFindMany(query: ExpenseFindManyRequest) {
		const expensesCount = await this.prisma.expenseModel.count({
			where: {
				description: { contains: query.description, mode: 'insensitive' },
				createdAt: { gte: query.startDate, lte: query.endDate },
			},
		})

		return expensesCount
	}

	async getMany(query: ExpenseGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const expenses = await this.prisma.expenseModel.findMany({
			where: { id: { in: query.ids }, description: query.description },
			...paginationOptions,
		})

		return expenses
	}

	async getOne(query: ExpenseGetOneRequest) {
		const expense = await this.prisma.expenseModel.findFirst({
			where: { id: query.id, description: query.description },
		})

		return expense
	}

	async countGetMany(query: ExpenseGetManyRequest) {
		const expensesCount = await this.prisma.expenseModel.count({
			where: { id: { in: query.ids }, description: query.description },
		})

		return expensesCount
	}

	async createOne(body: ExpenseCreateOneRequest) {
		const expense = await this.prisma.expenseModel.create({
			data: { description: body.description, price: body.price, staffId: body.staffId },
		})
		return expense
	}

	async updateOne(query: ExpenseGetOneRequest, body: ExpenseUpdateOneRequest) {
		const expense = await this.prisma.expenseModel.update({
			where: { id: query.id },
			data: { description: body.description, price: body.price, staffId: body.staffId },
		})

		return expense
	}

	async deleteOne(query: ExpenseDeleteOneRequest) {
		const expense = await this.prisma.expenseModel.delete({
			where: { id: query.id },
		})

		return expense
	}

	async onModuleInit() {
		await this.prisma.createActionMethods(ExpenseController)
	}
}
