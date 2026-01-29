import { PaginationRequest, RequestOtherFields } from '../../../common'
import { SASCreateMethodEnum } from '../enums'
import { SASOptional, SASRequired } from './fields.interface'

export declare interface SASFindManyRequest extends Partial<SASOptional>, PaginationRequest, Pick<RequestOtherFields, 'startDate' | 'endDate'> {}

export declare interface SASFindOneRequest extends Partial<SASOptional> {}

export declare interface SASCreateOneRequest extends Pick<SASRequired, 'userId'> {
	// action?: SASCreateMethodEnum
}

export declare interface SASUpdateOneRequest extends Pick<SASOptional, 'userId' | 'date' | 'durationMs' | 'endAt' | 'reason' | 'startAt'> {
	action?: SASCreateMethodEnum
}
