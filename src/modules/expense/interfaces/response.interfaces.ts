import { GlobalResponse, PaginationResponse } from '@common'
import { ExpenseRequired } from './fields.interfaces'

export declare interface ExpenseFindManyData extends PaginationResponse<ExpenseFindOneData> {}

export declare interface ExpenseFindOneData extends Pick<ExpenseRequired, 'id' | 'description' | 'price' | 'createdAt'> {}

export declare interface ExpenseFindManyResponse extends GlobalResponse {
	data: ExpenseFindManyData
}

export declare interface ExpenseFindOneResponse extends GlobalResponse {
	data: ExpenseFindOneData
}

export declare interface ExpenseModifyResponse extends GlobalResponse {
	data: null
}
