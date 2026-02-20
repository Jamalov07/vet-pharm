import { Body, Controller, Delete, Get, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ExpenseService } from './expense.service'
import { AuthOptions, CheckPermissionGuard, CRequest } from '@common'
import {
	ExpenseFindManyRequestDto,
	ExpenseCreateOneRequestDto,
	ExpenseUpdateOneRequestDto,
	ExpenseFindOneRequestDto,
	ExpenseFindManyResponseDto,
	ExpenseFindOneResponseDto,
	ExpenseModifyResponseDto,
} from './dtos'

@ApiBearerAuth('bearer')
@ApiTags('Expense')
@Controller('expense')
@UseGuards(CheckPermissionGuard)
export class ExpenseController {
	constructor(private readonly expenseService: ExpenseService) {}

	@Get('many')
	@ApiOkResponse({ type: ExpenseFindManyResponseDto })
	@ApiOperation({ summary: 'get all expenses' })
	@AuthOptions(false, false)
	async findMany(@Query() query: ExpenseFindManyRequestDto): Promise<ExpenseFindManyResponseDto> {
		return this.expenseService.findMany(query)
	}

	@Get('one')
	@ApiOperation({ summary: 'find one expense' })
	@ApiOkResponse({ type: ExpenseFindOneResponseDto })
	async getOne(@Query() query: ExpenseFindOneRequestDto): Promise<ExpenseFindOneResponseDto> {
		return this.expenseService.findOne(query)
	}

	@Post('one')
	@AuthOptions(true, true)
	@ApiOperation({ summary: 'add one expense' })
	@ApiOkResponse({ type: ExpenseModifyResponseDto })
	async createOne(@Req() request: CRequest, @Body() body: ExpenseCreateOneRequestDto): Promise<ExpenseModifyResponseDto> {
		return this.expenseService.createOne(body)
	}

	@Patch('one')
	@AuthOptions(true, true)
	@ApiOperation({ summary: 'update one expense' })
	@ApiOkResponse({ type: ExpenseModifyResponseDto })
	async updateOne(@Query() query: ExpenseFindOneRequestDto, @Body() body: ExpenseUpdateOneRequestDto): Promise<ExpenseModifyResponseDto> {
		return this.expenseService.updateOne(query, body)
	}

	@Delete('one')
	@ApiOperation({ summary: 'update one expense' })
	@ApiOkResponse({ type: ExpenseModifyResponseDto })
	async deleteOne(@Query() query: ExpenseFindOneRequestDto): Promise<ExpenseModifyResponseDto> {
		return this.expenseService.deleteOne(query)
	}
}
