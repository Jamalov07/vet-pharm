import { Module } from '@nestjs/common'
import { PrismaModule } from '../shared'
import { ExpenseController } from './expense.controller'
import { ExpenseService } from './expense.service'
import { ExpenseRepository } from './expense.repository'

@Module({
	imports: [PrismaModule],
	controllers: [ExpenseController],
	providers: [ExpenseService, ExpenseRepository],
	exports: [ExpenseService, ExpenseRepository],
})
export class ExpenseModule {}
