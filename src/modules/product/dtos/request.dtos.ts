import { PickType, IntersectionType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ProductCreateOneRequest, ProductDeleteOneRequest, ProductFindManyRequest, ProductFindOneRequest, ProductPrices, ProductUpdateOneRequest } from '../interfaces'
import { IsDecimalIntOrBigInt, PaginationRequestDto, RequestOtherFieldsDto } from '@common'
import { ProductOptionalDto, ProductRequiredDto } from './fields.dtos'
import { Decimal } from '@prisma/client/runtime/library'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class ProductFindManyRequestDto
	extends IntersectionType(PickType(ProductOptionalDto, ['name', 'unit']), PaginationRequestDto, PickType(RequestOtherFieldsDto, ['isDeleted', 'search']))
	implements ProductFindManyRequest {}

export class ProductFindOneRequestDto extends IntersectionType(PickType(ProductRequiredDto, ['id'])) implements ProductFindOneRequest {}

export class ProductPricesRequiredDto implements ProductPrices {
	@ApiProperty({ type: Number })
	@IsNotEmpty()
	@IsDecimalIntOrBigInt()
	client: Decimal

	@ApiProperty({ type: Number })
	@IsNotEmpty()
	@IsDecimalIntOrBigInt()
	doctor: Decimal

	@ApiProperty({ type: Number })
	@IsNotEmpty()
	@IsDecimalIntOrBigInt()
	farmer: Decimal
}

export class ProductCreateOneRequestDto
	extends IntersectionType(PickType(ProductRequiredDto, ['name', 'cost', 'count', 'minAmount', 'price', 'unit']))
	implements ProductCreateOneRequest
{
	@ApiProperty({ type: ProductPricesRequiredDto })
	@IsNotEmpty()
	prices: ProductPrices
}

export class ProductPricesOptionalDto implements Partial<ProductPrices> {
	@ApiPropertyOptional({ type: Number })
	@IsOptional()
	@IsDecimalIntOrBigInt()
	client?: Decimal

	@ApiPropertyOptional({ type: Number })
	@IsOptional()
	@IsDecimalIntOrBigInt()
	doctor?: Decimal

	@ApiPropertyOptional({ type: Number })
	@IsOptional()
	@IsDecimalIntOrBigInt()
	farmer?: Decimal
}

export class ProductUpdateOneRequestDto
	extends IntersectionType(PickType(ProductOptionalDto, ['name', 'deletedAt', 'cost', 'count', 'minAmount', 'price', 'unit']))
	implements ProductUpdateOneRequest
{
	@ApiPropertyOptional({ type: ProductPricesOptionalDto })
	@IsOptional()
	prices?: Partial<ProductPrices>
}

export class ProductDeleteOneRequestDto
	extends IntersectionType(PickType(ProductRequiredDto, ['id']), PickType(RequestOtherFieldsDto, ['method']))
	implements ProductDeleteOneRequest {}
