import { Module } from '@nestjs/common'
import { PrismaModule } from '../shared'
import { ClientCategoryController } from './client-category.controller'
import { ClientCategoryService } from './client-category.service'
import { ClientCategoryRepository } from './client-category.repository'

@Module({
	imports: [PrismaModule],
	controllers: [ClientCategoryController],
	providers: [ClientCategoryService, ClientCategoryRepository],
	exports: [ClientCategoryService, ClientCategoryRepository],
})
export class ClientCategoryModule {}
