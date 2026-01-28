import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DefaultOptionalFieldsDto, DefaultRequiredFieldsDto } from '../../../common'
import { SASOptional, SASRequired } from '../interfaces'
import { $Enums, ActivityStopReasonEnum } from '@prisma/client'
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator'

export class SASRequiredDto extends DefaultRequiredFieldsDto implements SASRequired {
	@ApiProperty({ type: Date })
	date: Date

	@ApiProperty({ type: BigInt })
	durationMs: bigint

	@ApiProperty({ type: Date })
	endAt: Date

	@ApiProperty({ enum: ActivityStopReasonEnum })
	reason: $Enums.ActivityStopReasonEnum

	@ApiProperty({ type: Date })
	startAt: Date

	@ApiProperty({ type: String })
	@IsNotEmpty()
	@IsUUID('4')
	userId: string
}

export class SASOptionalDto extends DefaultOptionalFieldsDto implements SASOptional {
	@ApiPropertyOptional({ type: Date })
	date?: Date

	@ApiPropertyOptional({ enum: ActivityStopReasonEnum })
	reason?: $Enums.ActivityStopReasonEnum

	@ApiPropertyOptional({ type: BigInt })
	durationMs?: bigint

	@ApiPropertyOptional({ type: Date })
	endAt?: Date

	@ApiPropertyOptional({ type: Date })
	startAt?: Date

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@IsUUID('4')
	userId?: string
}
