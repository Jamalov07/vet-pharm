import { Injectable } from '@nestjs/common'
import { PrismaService } from '../shared'
import {
	ClientCategoryCreateOneRequest,
	ClientCategoryDeleteOneRequest,
	ClientCategoryFindManyRequest,
	ClientCategoryFindOneRequest,
	ClientCategoryGetManyRequest,
	ClientCategoryGetOneRequest,
	ClientCategoryUpdateOneRequest,
} from './interfaces'
import { ClientCategoryController } from './client-category.controller'

@Injectable()
export class ClientCategoryRepository {
	private readonly prisma: PrismaService
	constructor(prisma: PrismaService) {
		this.prisma = prisma
	}

	async findMany(query: ClientCategoryFindManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const clientCategorys = await this.prisma.clientCategoryModel.findMany({
			where: {
				name: { contains: query.name, mode: 'insensitive' },
			},
			select: { id: true, name: true, percent: true, minPercent: true, createdAt: true },
			...paginationOptions,
		})

		return clientCategorys
	}

	async findOne(query: ClientCategoryFindOneRequest) {
		const clientCategory = await this.prisma.clientCategoryModel.findFirst({
			where: { id: query.id },
			select: { id: true, name: true, percent: true, minPercent: true, createdAt: true },
		})

		return clientCategory
	}

	async countFindMany(query: ClientCategoryFindManyRequest) {
		const clientCategorysCount = await this.prisma.clientCategoryModel.count({
			where: {
				name: { contains: query.name, mode: 'insensitive' },
			},
		})

		return clientCategorysCount
	}

	async getMany(query: ClientCategoryGetManyRequest) {
		let paginationOptions = {}
		if (query.pagination) {
			paginationOptions = { take: query.pageSize, skip: (query.pageNumber - 1) * query.pageSize }
		}

		const clientCategorys = await this.prisma.clientCategoryModel.findMany({
			where: { id: { in: query.ids }, name: query.name },
			...paginationOptions,
		})

		return clientCategorys
	}

	async getOne(query: ClientCategoryGetOneRequest) {
		const clientCategory = await this.prisma.clientCategoryModel.findFirst({
			where: { id: query.id, name: query.name },
		})

		return clientCategory
	}

	async countGetMany(query: ClientCategoryGetManyRequest) {
		const clientCategorysCount = await this.prisma.clientCategoryModel.count({
			where: { id: { in: query.ids }, name: query.name },
		})

		return clientCategorysCount
	}

	async createOne(body: ClientCategoryCreateOneRequest) {
		const clientCategory = await this.prisma.clientCategoryModel.create({
			data: { name: body.name, percent: body.percent, minPercent: body.minPercent },
		})
		return clientCategory
	}

	async updateOne(query: ClientCategoryGetOneRequest, body: ClientCategoryUpdateOneRequest) {
		const clientCategory = await this.prisma.clientCategoryModel.update({
			where: { id: query.id },
			data: { name: body.name, percent: body.percent, minPercent: body.minPercent },
		})

		return clientCategory
	}

	async deleteOne(query: ClientCategoryDeleteOneRequest) {
		const clientCategory = await this.prisma.clientCategoryModel.delete({
			where: { id: query.id },
		})

		return clientCategory
	}

	async onModuleInit() {
		await this.prisma.createActionMethods(ClientCategoryController)
	}
}
