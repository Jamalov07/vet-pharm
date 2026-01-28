import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger'
import { SASFindManyData, SASFindManyResponse, SASFindOneData, SASModifyResponse, StaffActivityTotal } from '../interfaces'
import { GlobalModifyResponseDto, GlobalResponseDto, PaginationResponseDto } from '@common'
import { SASRequiredDto } from './fields.dto'

export class StaffActivityTotalDto implements StaffActivityTotal {
	@ApiProperty({ type: Number })
	totalDurationMs: number

	@ApiProperty({ type: Number })
	totalHours: number

	@ApiProperty({ type: Number })
	totalMinutes: number

	@ApiProperty({ type: Number })
	totalSeconds: number

	@ApiProperty({ type: Number })
	totalDurationInText: string
}

export class SASFindOneDataDto extends PickType(SASRequiredDto, ['id', 'date', 'createdAt', 'durationMs', 'reason', 'startAt', 'endAt', 'userId']) implements SASFindOneData {}

export class SASFindManyDataDto extends PaginationResponseDto implements SASFindManyData {
	@ApiProperty({ type: SASFindOneDataDto, isArray: true })
	data: SASFindOneData[]

	@ApiProperty({ type: StaffActivityTotalDto })
	total: StaffActivityTotal
}

export class SASFindManyResponseDto extends GlobalResponseDto implements SASFindManyResponse {
	@ApiProperty({ type: SASFindManyDataDto })
	data: SASFindManyData
}

export class SASModifyResponseDto extends IntersectionType(GlobalResponseDto, GlobalModifyResponseDto) implements SASModifyResponse {}
