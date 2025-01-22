import { User } from './User';
import { Expense } from './Expense';
import { RecurringExpense } from './RecurringExpense';

export interface Category {
  id: string; // Assuming BaseEntity has an ID
//   createdAt?: Date; // Assuming BaseEntity has timestamps
//   updatedAt?: Date; // Assuming BaseEntity has timestamps
  name: string;
  description: string;
  userId: string;
  user: User;
  expenses: Expense[];
  recurringExpenses: RecurringExpense[];
}
