import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger'
import { ExpenseFindManyData, ExpenseFindManyResponse, ExpenseFindOneData, ExpenseFindOneResponse, ExpenseModifyResponse } from '../interfaces'
import { GlobalModifyResponseDto, GlobalResponseDto, PaginationResponseDto } from '@common'
import { ExpenseRequiredDto } from './fields.dtos'

export class ExpenseFindOneDataDto extends PickType(ExpenseRequiredDto, ['id', 'description', 'price', 'createdAt']) implements ExpenseFindOneData {}

export class ExpenseFindManyDataDto extends PaginationResponseDto implements ExpenseFindManyData {
	@ApiProperty({ type: ExpenseFindOneDataDto, isArray: true })
	data: ExpenseFindOneData[]
}

export class ExpenseFindManyResponseDto extends GlobalResponseDto implements ExpenseFindManyResponse {
	@ApiProperty({ type: ExpenseFindManyDataDto })
	data: ExpenseFindManyData
}

export class ExpenseFindOneResponseDto extends GlobalResponseDto implements ExpenseFindOneResponse {
	@ApiProperty({ type: ExpenseFindOneDataDto })
	data: ExpenseFindOneData
}

export class ExpenseModifyResponseDto extends IntersectionType(GlobalResponseDto, GlobalModifyResponseDto) implements ExpenseModifyResponse {}
