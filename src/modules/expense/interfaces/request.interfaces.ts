import { PaginationRequest, RequestOtherFields } from '@common'
import { ExpenseOptional, ExpenseRequired } from './fields.interfaces'

export declare interface ExpenseFindManyRequest extends Pick<ExpenseOptional, 'description' | 'staffId'>, PaginationRequest, Pick<RequestOtherFields, 'startDate' | 'endDate'> {}

export declare interface ExpenseFindOneRequest extends Pick<ExpenseRequired, 'id'> {}

export declare interface ExpenseGetManyRequest extends ExpenseOptional, PaginationRequest, Pick<RequestOtherFields, 'ids'> {}

export declare interface ExpenseGetOneRequest extends ExpenseOptional {}

export declare interface ExpenseCreateOneRequest extends Pick<ExpenseRequired, 'description' | 'price' | 'staffId'> {}

export declare interface ExpenseUpdateOneRequest extends Pick<ExpenseOptional, 'description' | 'price' | 'staffId' | 'deletedAt'> {}

export declare interface ExpenseDeleteOneRequest extends Pick<ExpenseOptional, 'id'>, Pick<RequestOtherFields, 'method'> {}
