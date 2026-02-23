import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DefaultOptionalFieldsDto, DefaultRequiredFieldsDto } from '../../../common'
import { ClientOptional, ClientRequired } from '../interfaces'
import { IsEnum, IsJWT, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator'
import { $Enums, ClientCategoryEnum, UserTypeEnum } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export class ClientRequiredDto extends DefaultRequiredFieldsDto implements ClientRequired {
	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	fullname: string

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	password: string

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsPhoneNumber('UZ')
	phone: string

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsJWT()
	token: string

	@ApiProperty({ enum: UserTypeEnum })
	@IsNotEmpty()
	@IsEnum(UserTypeEnum)
	type: $Enums.UserTypeEnum

	@ApiProperty({ type: Decimal })
	balance: Decimal

	@ApiProperty({ enum: ClientCategoryEnum })
	@IsNotEmpty()
	@IsEnum(ClientCategoryEnum)
	category: ClientCategoryEnum

	@ApiProperty({ type: String, isArray: true })
	pages: $Enums.PageEnum[]

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsString()
	address: string
}

export class ClientOptionalDto extends DefaultOptionalFieldsDto implements ClientOptional {
	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	fullname?: string

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	address?: string

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsString()
	password?: string

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsPhoneNumber('UZ')
	phone?: string

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsJWT()
	token?: string

	@ApiPropertyOptional({ enum: UserTypeEnum })
	@IsOptional()
	@IsEnum(UserTypeEnum)
	type?: $Enums.UserTypeEnum

	@ApiPropertyOptional({ type: Decimal })
	balance?: Decimal

	@ApiPropertyOptional({ enum: ClientCategoryEnum })
	@IsOptional()
	@IsEnum(ClientCategoryEnum)
	category?: ClientCategoryEnum
}
