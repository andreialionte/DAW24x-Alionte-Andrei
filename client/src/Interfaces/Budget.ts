import { User } from './User';
import { Expense } from './Expense';

export interface Budget {
  id: string; // Assuming BaseEntity has an ID
//   createdAt?: Date; // Assuming BaseEntity has timestamps
//   updatedAt?: Date; // Assuming BaseEntity has timestamps
  userId: string;
  user: User;
  name: string;
  description?: string;
  totalAmount: number;
  spentAmount: number;
  remainingAmount: number;
  startDate: Date;
  endDate: Date;
  lastProcessedDate: Date;
  nextProcessingDate: Date;
  isActive: boolean;
  expenses: Expense[];
}
