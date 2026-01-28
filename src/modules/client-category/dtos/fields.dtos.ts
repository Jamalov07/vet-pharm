import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DefaultOptionalFieldsDto, DefaultRequiredFieldsDto } from '../../../common'
import { ClientCategoryOptional, ClientCategoryRequired } from '../interfaces'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class ClientCategoryRequiredDto extends DefaultRequiredFieldsDto implements ClientCategoryRequired {
	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	name: string

	@ApiProperty({ type: Number })
	@IsNotEmpty()
	@IsNumber()
	percent: number
}

export class ClientCategoryOptionalDto extends DefaultOptionalFieldsDto implements ClientCategoryOptional {
	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	name?: string

	@ApiPropertyOptional({ type: Number })
	@IsOptional()
	@IsNumber()
	percent?: number
}
