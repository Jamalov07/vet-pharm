import { GlobalResponse, PaginationResponse } from '@common'
import { ClientCategoryRequired } from './fields.interfaces'

export declare interface ClientCategoryFindManyData extends PaginationResponse<ClientCategoryFindOneData> {}

export declare interface ClientCategoryFindOneData extends Pick<ClientCategoryRequired, 'id' | 'name' | 'percent' | 'createdAt'> {}

export declare interface ClientCategoryFindManyResponse extends GlobalResponse {
	data: ClientCategoryFindManyData
}

export declare interface ClientCategoryFindOneResponse extends GlobalResponse {
	data: ClientCategoryFindOneData
}

export declare interface ClientCategoryModifyResponse extends GlobalResponse {
	data: null
}
