import { BadRequestException, Injectable } from '@nestjs/common'
import { ClientCategoryRepository } from './client-category.repository'
import { createResponse, DeleteMethodEnum, ERROR_MSG } from '@common'
import {
	ClientCategoryGetOneRequest,
	ClientCategoryCreateOneRequest,
	ClientCategoryUpdateOneRequest,
	ClientCategoryGetManyRequest,
	ClientCategoryFindManyRequest,
	ClientCategoryFindOneRequest,
	ClientCategoryDeleteOneRequest,
} from './interfaces'

@Injectable()
export class ClientCategoryService {
	constructor(private readonly clientCategoryRepository: ClientCategoryRepository) {}

	async findMany(query: ClientCategoryFindManyRequest) {
		const clientCategorys = await this.clientCategoryRepository.findMany(query)
		const clientCategorysCount = await this.clientCategoryRepository.countFindMany(query)

		const result = query.pagination
			? {
					totalCount: clientCategorysCount,
					pagesCount: Math.ceil(clientCategorysCount / query.pageSize),
					pageSize: clientCategorys.length,
					data: clientCategorys,
				}
			: { data: clientCategorys }

		return createResponse({ data: result, success: { messages: ['find many success'] } })
	}

	async findOne(query: ClientCategoryFindOneRequest) {
		const clientCategory = await this.clientCategoryRepository.findOne(query)

		if (!clientCategory) {
			throw new BadRequestException(ERROR_MSG.USER_CATEGORY.NOT_FOUND.UZ)
		}

		return createResponse({ data: clientCategory, success: { messages: ['find one success'] } })
	}

	async getMany(query: ClientCategoryGetManyRequest) {
		const clientCategorys = await this.clientCategoryRepository.getMany(query)
		const clientCategorysCount = await this.clientCategoryRepository.countGetMany(query)

		const result = query.pagination
			? {
					pagesCount: Math.ceil(clientCategorysCount / query.pageSize),
					pageSize: clientCategorys.length,
					data: clientCategorys,
				}
			: { data: clientCategorys }

		return createResponse({ data: result, success: { messages: ['get many success'] } })
	}

	async getOne(query: ClientCategoryGetOneRequest) {
		const clientCategory = await this.clientCategoryRepository.getOne(query)

		if (!clientCategory) {
			throw new BadRequestException(ERROR_MSG.USER_CATEGORY.NOT_FOUND.UZ)
		}

		return createResponse({ data: clientCategory, success: { messages: ['get one success'] } })
	}

	async createOne(body: ClientCategoryCreateOneRequest) {
		const candidate = await this.clientCategoryRepository.getOne({ name: body.name })
		if (candidate) {
			throw new BadRequestException(ERROR_MSG.USER_CATEGORY.NAME_EXISTS.UZ)
		}

		await this.clientCategoryRepository.createOne({ ...body })

		return createResponse({ data: null, success: { messages: ['create one success'] } })
	}

	async updateOne(query: ClientCategoryGetOneRequest, body: ClientCategoryUpdateOneRequest) {
		await this.getOne(query)

		const candidate = await this.clientCategoryRepository.getOne({ name: body.name })
		if (candidate && candidate.id !== query.id) {
			throw new BadRequestException(ERROR_MSG.USER_CATEGORY.NAME_EXISTS.UZ)
		}

		await this.clientCategoryRepository.updateOne(query, { ...body })

		return createResponse({ data: null, success: { messages: ['update one success'] } })
	}

	async deleteOne(query: ClientCategoryDeleteOneRequest) {
		await this.getOne(query)
		if (query.method === DeleteMethodEnum.hard) {
			await this.clientCategoryRepository.deleteOne(query)
		} else {
			await this.clientCategoryRepository.updateOne(query, { deletedAt: new Date() })
		}
		return createResponse({ data: null, success: { messages: ['delete one success'] } })
	}
}
