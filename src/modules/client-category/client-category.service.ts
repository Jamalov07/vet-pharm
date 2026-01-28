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
	constructor(private readonly ClientCategoryRepository: ClientCategoryRepository) {}

	async findMany(query: ClientCategoryFindManyRequest) {
		const ClientCategorys = await this.ClientCategoryRepository.findMany(query)
		const ClientCategorysCount = await this.ClientCategoryRepository.countFindMany(query)

		const result = query.pagination
			? {
					totalCount: ClientCategorysCount,
					pagesCount: Math.ceil(ClientCategorysCount / query.pageSize),
					pageSize: ClientCategorys.length,
					data: ClientCategorys,
				}
			: { data: ClientCategorys }

		return createResponse({ data: result, success: { messages: ['find many success'] } })
	}

	async findOne(query: ClientCategoryFindOneRequest) {
		const ClientCategory = await this.ClientCategoryRepository.findOne(query)

		if (!ClientCategory) {
			throw new BadRequestException(ERROR_MSG.USER_CATEGORY.NOT_FOUND.UZ)
		}

		return createResponse({ data: ClientCategory, success: { messages: ['find one success'] } })
	}

	async getMany(query: ClientCategoryGetManyRequest) {
		const ClientCategorys = await this.ClientCategoryRepository.getMany(query)
		const ClientCategorysCount = await this.ClientCategoryRepository.countGetMany(query)

		const result = query.pagination
			? {
					pagesCount: Math.ceil(ClientCategorysCount / query.pageSize),
					pageSize: ClientCategorys.length,
					data: ClientCategorys,
				}
			: { data: ClientCategorys }

		return createResponse({ data: result, success: { messages: ['get many success'] } })
	}

	async getOne(query: ClientCategoryGetOneRequest) {
		const ClientCategory = await this.ClientCategoryRepository.getOne(query)

		if (!ClientCategory) {
			throw new BadRequestException(ERROR_MSG.USER_CATEGORY.NOT_FOUND.UZ)
		}

		return createResponse({ data: ClientCategory, success: { messages: ['get one success'] } })
	}

	async createOne(body: ClientCategoryCreateOneRequest) {
		const candidate = await this.ClientCategoryRepository.getOne({ name: body.name })
		if (candidate) {
			throw new BadRequestException(ERROR_MSG.USER_CATEGORY.NAME_EXISTS.UZ)
		}

		await this.ClientCategoryRepository.createOne({ ...body })

		return createResponse({ data: null, success: { messages: ['create one success'] } })
	}

	async updateOne(query: ClientCategoryGetOneRequest, body: ClientCategoryUpdateOneRequest) {
		await this.getOne(query)

		const candidate = await this.ClientCategoryRepository.getOne({ name: body.name })
		if (candidate && candidate.id !== query.id) {
			throw new BadRequestException(ERROR_MSG.USER_CATEGORY.NAME_EXISTS.UZ)
		}

		await this.ClientCategoryRepository.updateOne(query, { ...body })

		return createResponse({ data: null, success: { messages: ['update one success'] } })
	}

	async deleteOne(query: ClientCategoryDeleteOneRequest) {
		await this.getOne(query)
		if (query.method === DeleteMethodEnum.hard) {
			await this.ClientCategoryRepository.deleteOne(query)
		} else {
			await this.ClientCategoryRepository.updateOne(query, { deletedAt: new Date() })
		}
		return createResponse({ data: null, success: { messages: ['delete one success'] } })
	}
}
