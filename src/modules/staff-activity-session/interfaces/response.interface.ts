import { GlobalResponse, PaginationResponse } from '@common'
import { SASRequired } from './fields.interface'

export declare interface StaffActivityTotal {
	totalDurationMs: number
	totalDurationInText: string
	totalSeconds: number
	totalMinutes: number
	totalHours: number
}

export declare interface SASFindManyData extends PaginationResponse<SASFindOneData> {
	total: StaffActivityTotal
}

export declare interface SASFindOneData extends Pick<SASRequired, 'id' | 'createdAt' | 'date' | 'durationMs' | 'endAt' | 'reason' | 'startAt' | 'userId'> {
	durationMs: any
}

export declare interface SASFindManyResponse extends GlobalResponse {
	data: SASFindManyData
}

export declare interface SASFindOneResponse extends GlobalResponse {
	data: SASFindOneData
}

export declare interface SASCreateOneResponse extends GlobalResponse {
	data: SASFindOneData
}

export declare interface SASModifyResponse extends GlobalResponse {
	data: null
}
