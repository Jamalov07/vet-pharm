import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ClientCategoryService } from './client-category.service'
import { AuthOptions, CheckPermissionGuard } from '@common'
import {
	ClientCategoryFindManyRequestDto,
	ClientCategoryCreateOneRequestDto,
	ClientCategoryUpdateOneRequestDto,
	ClientCategoryFindOneRequestDto,
	ClientCategoryFindManyResponseDto,
	ClientCategoryFindOneResponseDto,
	ClientCategoryModifyResponseDto,
} from './dtos'

@ApiTags('Client Category')
@Controller('client-category')
@UseGuards(CheckPermissionGuard)
export class ClientCategoryController {
	constructor(private readonly clientCategoryService: ClientCategoryService) {}

	@Get('many')
	@ApiOkResponse({ type: ClientCategoryFindManyResponseDto })
	@ApiOperation({ summary: 'get all clientCategorys' })
	@AuthOptions(false, false)
	async findMany(@Query() query: ClientCategoryFindManyRequestDto): Promise<ClientCategoryFindManyResponseDto> {
		return this.clientCategoryService.findMany(query)
	}

	@Get('one')
	@ApiOperation({ summary: 'find one clientCategory' })
	@ApiOkResponse({ type: ClientCategoryFindOneResponseDto })
	async getOne(@Query() query: ClientCategoryFindOneRequestDto): Promise<ClientCategoryFindOneResponseDto> {
		return this.clientCategoryService.findOne(query)
	}

	@Post('one')
	@ApiOperation({ summary: 'add one clientCategory' })
	@ApiOkResponse({ type: ClientCategoryModifyResponseDto })
	async createOne(@Body() body: ClientCategoryCreateOneRequestDto): Promise<ClientCategoryModifyResponseDto> {
		return this.clientCategoryService.createOne(body)
	}

	@Patch('one')
	@ApiOperation({ summary: 'update one clientCategory' })
	@ApiOkResponse({ type: ClientCategoryModifyResponseDto })
	async updateOne(@Query() query: ClientCategoryFindOneRequestDto, @Body() body: ClientCategoryUpdateOneRequestDto): Promise<ClientCategoryModifyResponseDto> {
		return this.clientCategoryService.updateOne(query, body)
	}

	@Delete('one')
	@ApiOperation({ summary: 'update one clientCategory' })
	@ApiOkResponse({ type: ClientCategoryModifyResponseDto })
	async deleteOne(@Query() query: ClientCategoryFindOneRequestDto): Promise<ClientCategoryModifyResponseDto> {
		return this.clientCategoryService.deleteOne(query)
	}
}
