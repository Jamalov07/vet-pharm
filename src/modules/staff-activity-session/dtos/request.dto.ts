import { PickType, IntersectionType, ApiProperty } from '@nestjs/swagger'
import { SASCreateOneRequest, SASFindManyRequest } from '../interfaces'
import { PaginationRequestDto, RequestOtherFieldsDto } from '@common'
import { SASOptionalDto, SASRequiredDto } from './fields.dto'
import { SASCreateMethodEnum } from '../enums'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class SASFindManyRequestDto
	extends IntersectionType(PickType(SASOptionalDto, ['userId']), PaginationRequestDto, PickType(RequestOtherFieldsDto, ['startDate', 'endDate']))
	implements SASFindManyRequest {}

export class SASCreateOneRequestDto extends IntersectionType(PickType(SASRequiredDto, ['userId'])) implements SASCreateOneRequest {
	@ApiProperty({ enum: SASCreateMethodEnum })
	@IsNotEmpty()
	@IsEnum(SASCreateMethodEnum)
	action: SASCreateMethodEnum
}
