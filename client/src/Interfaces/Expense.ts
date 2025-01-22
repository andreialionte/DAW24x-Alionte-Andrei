import { User } from './User';
import { Category } from './Category';
import { Budget } from './Budget';

export interface Expense {
  id: string; // Assuming BaseEntity has an ID
//   createdAt?: Date; // Assuming BaseEntity has timestamps
//   updatedAt?: Date; // Assuming BaseEntity has timestamps
  userId: string;
  user: User;
  title: string;
  amount: number;
  date: Date;
  categoryId: string;
  category: Category;
  notes?: string;
  // attachmentUrl?: string;
  budgetId: string;
  budget: Budget;
}
