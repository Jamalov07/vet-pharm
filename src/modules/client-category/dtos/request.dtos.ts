import { PickType, IntersectionType } from '@nestjs/swagger'
import {
	ClientCategoryCreateOneRequest,
	ClientCategoryDeleteOneRequest,
	ClientCategoryFindManyRequest,
	ClientCategoryFindOneRequest,
	ClientCategoryUpdateOneRequest,
} from '../interfaces'
import { PaginationRequestDto } from '@common'
import { ClientCategoryOptionalDto, ClientCategoryRequiredDto } from './fields.dtos'

export class ClientCategoryFindManyRequestDto
	extends IntersectionType(PickType(ClientCategoryOptionalDto, ['name']), PaginationRequestDto)
	implements ClientCategoryFindManyRequest {}

export class ClientCategoryFindOneRequestDto extends IntersectionType(PickType(ClientCategoryRequiredDto, ['id'])) implements ClientCategoryFindOneRequest {}

export class ClientCategoryCreateOneRequestDto extends IntersectionType(PickType(ClientCategoryRequiredDto, ['name', 'percent'])) implements ClientCategoryCreateOneRequest {}

export class ClientCategoryUpdateOneRequestDto extends IntersectionType(PickType(ClientCategoryOptionalDto, ['name', 'percent'])) implements ClientCategoryUpdateOneRequest {}

export class ClientCategoryDeleteOneRequestDto extends IntersectionType(PickType(ClientCategoryRequiredDto, ['id'])) implements ClientCategoryDeleteOneRequest {}
