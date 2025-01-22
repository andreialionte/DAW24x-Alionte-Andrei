import { Expense } from './Expense';
import { Category } from './Category';
import { Budget } from './Budget';
import { RecurringExpense } from './RecurringExpense';

export interface User {
  id: string; // Assuming BaseEntity has an ID
//   createdAt?: Date; // Assuming BaseEntity has timestamps
//   updatedAt?: Date; // Assuming BaseEntity has timestamps
  firstName: string;
  lastName: string;
  email: string;
  expenses: Expense[];
  categories: Category[];
  recurringExpenses: RecurringExpense[];
  budgets: Budget[];
}
