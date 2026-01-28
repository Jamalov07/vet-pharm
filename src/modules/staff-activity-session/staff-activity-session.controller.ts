import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthOptions, CheckPermissionGuard } from '../../common'
import { SASService } from './staff-activity-session.service'
import { SASCreateOneRequestDto, SASFindManyRequestDto, SASFindManyResponseDto, SASModifyResponseDto } from './dtos'

@ApiTags('Staff Activity Session')
@Controller('staff-activity-session')
@UseGuards(CheckPermissionGuard)
export class SASController {
	constructor(private readonly sasService: SASService) {}

	@Get('many')
	@ApiOkResponse({ type: SASFindManyResponseDto })
	@ApiOperation({ summary: 'get all sas' })
	@AuthOptions(false, false)
	async findMany(@Query() query: SASFindManyRequestDto): Promise<SASFindManyResponseDto> {
		return this.sasService.findMany(query)
	}

	@Get('report')
	@ApiOperation({ summary: 'staff work report' })
	getReport(@Query() query: SASFindManyRequestDto) {
		return this.sasService.getStaffWorkReport(query)
	}

	@Post('one')
	@ApiOperation({ summary: 'create one sas' })
	@ApiOkResponse({ type: SASModifyResponseDto })
	create(@Body() body: SASCreateOneRequestDto): Promise<SASModifyResponseDto> {
		return this.sasService.createOne(body)
	}
}
