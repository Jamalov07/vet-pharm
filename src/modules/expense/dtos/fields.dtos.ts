import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DefaultOptionalFieldsDto, DefaultRequiredFieldsDto } from '../../../common'
import { ExpenseOptional, ExpenseRequired } from '../interfaces'
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'

export class ExpenseRequiredDto extends DefaultRequiredFieldsDto implements ExpenseRequired {
	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	description: string

	@ApiProperty({ type: Number })
	@IsNotEmpty()
	@IsNumber()
	price: number

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsUUID('4')
	staffId: string
}

export class ExpenseOptionalDto extends DefaultOptionalFieldsDto implements ExpenseOptional {
	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	description?: string

	@ApiPropertyOptional({ type: Number })
	@IsOptional()
	@IsNumber()
	price?: number

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsUUID('4')
	staffId?: string
}
