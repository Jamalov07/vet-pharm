import { ExpenseModel } from '@prisma/client'

export declare interface ExpenseRequired extends Required<ExpenseModel> {}

export declare interface ExpenseOptional extends Partial<ExpenseModel> {}
