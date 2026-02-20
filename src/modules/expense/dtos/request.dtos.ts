import { PickType, IntersectionType } from '@nestjs/swagger'
import { ExpenseCreateOneRequest, ExpenseDeleteOneRequest, ExpenseFindManyRequest, ExpenseFindOneRequest, ExpenseUpdateOneRequest } from '../interfaces'
import { PaginationRequestDto, RequestOtherFieldsDto } from '@common'
import { ExpenseOptionalDto, ExpenseRequiredDto } from './fields.dtos'

export class ExpenseFindManyRequestDto
	extends IntersectionType(PickType(ExpenseOptionalDto, ['description', 'staffId']), PaginationRequestDto, PickType(RequestOtherFieldsDto, ['startDate', 'endDate']))
	implements ExpenseFindManyRequest {}

export class ExpenseFindOneRequestDto extends IntersectionType(PickType(ExpenseRequiredDto, ['id'])) implements ExpenseFindOneRequest {}

export class ExpenseCreateOneRequestDto extends IntersectionType(PickType(ExpenseRequiredDto, ['description', 'price', 'staffId'])) implements ExpenseCreateOneRequest {}

export class ExpenseUpdateOneRequestDto extends IntersectionType(PickType(ExpenseOptionalDto, ['description', 'price', 'staffId'])) implements ExpenseUpdateOneRequest {}

export class ExpenseDeleteOneRequestDto extends IntersectionType(PickType(ExpenseRequiredDto, ['id'])) implements ExpenseDeleteOneRequest {}
