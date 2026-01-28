import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger'
import { ClientCategoryFindManyData, ClientCategoryFindManyResponse, ClientCategoryFindOneData, ClientCategoryFindOneResponse, ClientCategoryModifyResponse } from '../interfaces'
import { GlobalModifyResponseDto, GlobalResponseDto, PaginationResponseDto } from '@common'
import { ClientCategoryRequiredDto } from './fields.dtos'

export class ClientCategoryFindOneDataDto extends PickType(ClientCategoryRequiredDto, ['id', 'name', 'percent', 'createdAt']) implements ClientCategoryFindOneData {}

export class ClientCategoryFindManyDataDto extends PaginationResponseDto implements ClientCategoryFindManyData {
	@ApiProperty({ type: ClientCategoryFindOneDataDto, isArray: true })
	data: ClientCategoryFindOneData[]
}

export class ClientCategoryFindManyResponseDto extends GlobalResponseDto implements ClientCategoryFindManyResponse {
	@ApiProperty({ type: ClientCategoryFindManyDataDto })
	data: ClientCategoryFindManyData
}

export class ClientCategoryFindOneResponseDto extends GlobalResponseDto implements ClientCategoryFindOneResponse {
	@ApiProperty({ type: ClientCategoryFindOneDataDto })
	data: ClientCategoryFindOneData
}

export class ClientCategoryModifyResponseDto extends IntersectionType(GlobalResponseDto, GlobalModifyResponseDto) implements ClientCategoryModifyResponse {}
