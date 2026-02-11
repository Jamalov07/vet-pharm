import { PickType, IntersectionType } from '@nestjs/swagger'
import { ExpenseCreateOneRequest, ExpenseDeleteOneRequest, ExpenseFindManyRequest, ExpenseFindOneRequest, ExpenseUpdateOneRequest } from '../interfaces'
import { PaginationRequestDto } from '@common'
import { ExpenseOptionalDto, ExpenseRequiredDto } from './fields.dtos'

export class ExpenseFindManyRequestDto extends IntersectionType(PickType(ExpenseOptionalDto, ['description']), PaginationRequestDto) implements ExpenseFindManyRequest {}

export class ExpenseFindOneRequestDto extends IntersectionType(PickType(ExpenseRequiredDto, ['id'])) implements ExpenseFindOneRequest {}

export class ExpenseCreateOneRequestDto extends IntersectionType(PickType(ExpenseRequiredDto, ['description', 'price'])) implements ExpenseCreateOneRequest {}

export class ExpenseUpdateOneRequestDto extends IntersectionType(PickType(ExpenseOptionalDto, ['description', 'price'])) implements ExpenseUpdateOneRequest {}

export class ExpenseDeleteOneRequestDto extends IntersectionType(PickType(ExpenseRequiredDto, ['id'])) implements ExpenseDeleteOneRequest {}
