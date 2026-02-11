import { PaginationRequest, RequestOtherFields } from '@common'
import { ExpenseOptional, ExpenseRequired } from './fields.interfaces'

export declare interface ExpenseFindManyRequest extends Pick<ExpenseOptional, 'description'>, PaginationRequest {}

export declare interface ExpenseFindOneRequest extends Pick<ExpenseRequired, 'id'> {}

export declare interface ExpenseGetManyRequest extends ExpenseOptional, PaginationRequest, Pick<RequestOtherFields, 'ids'> {}

export declare interface ExpenseGetOneRequest extends ExpenseOptional {}

export declare interface ExpenseCreateOneRequest extends Pick<ExpenseRequired, 'description' | 'price'> {}

export declare interface ExpenseUpdateOneRequest extends Pick<ExpenseOptional, 'description' | 'price' | 'deletedAt'> {}

export declare interface ExpenseDeleteOneRequest extends Pick<ExpenseOptional, 'id'>, Pick<RequestOtherFields, 'method'> {}
