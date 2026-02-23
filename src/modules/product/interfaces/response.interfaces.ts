import { GlobalResponse, PaginationResponse } from '@common'
import { ProductOptional, ProductRequired } from './fields.interfaces'
import { Decimal } from '@prisma/client/runtime/library'
import { ProductPrices } from './request.interfaces'

export declare interface ProductFindManyData extends PaginationResponse<ProductFindOneData> {}

export declare interface ProductFindOneData extends Pick<ProductRequired, 'id' | 'name' | 'createdAt' | 'unit'>, Pick<ProductOptional, 'price' | 'count' | 'cost'> {
	lastSellingDate?: Date
	totalCost?: Decimal
	prices?: ProductPrices
}

export declare interface ProductFindManyResponse extends GlobalResponse {
	data: ProductFindManyData
}

export declare interface ProductFindOneResponse extends GlobalResponse {
	data: ProductFindOneData
}

export declare interface ProductModifyResponse extends GlobalResponse {
	data: null
}
