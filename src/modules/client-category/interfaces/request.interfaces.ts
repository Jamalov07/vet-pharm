import { PaginationRequest, RequestOtherFields } from '@common'
import { ClientCategoryOptional, ClientCategoryRequired } from './fields.interfaces'

export declare interface ClientCategoryFindManyRequest extends Pick<ClientCategoryOptional, 'name'>, PaginationRequest {}

export declare interface ClientCategoryFindOneRequest extends Pick<ClientCategoryRequired, 'id'> {}

export declare interface ClientCategoryGetManyRequest extends ClientCategoryOptional, PaginationRequest, Pick<RequestOtherFields, 'ids'> {}

export declare interface ClientCategoryGetOneRequest extends ClientCategoryOptional {}

export declare interface ClientCategoryCreateOneRequest extends Pick<ClientCategoryRequired, 'name' | 'percent' | 'minPercent'> {}

export declare interface ClientCategoryUpdateOneRequest extends Pick<ClientCategoryOptional, 'name' | 'percent' | 'minPercent' | 'deletedAt'> {}

export declare interface ClientCategoryDeleteOneRequest extends Pick<ClientCategoryOptional, 'id'>, Pick<RequestOtherFields, 'method'> {}
