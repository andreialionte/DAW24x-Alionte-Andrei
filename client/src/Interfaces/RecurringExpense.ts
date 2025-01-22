import { User } from './User';
import { Category } from './Category';
import { Period } from './Dtos/enums/Period';

export interface RecurringExpense {
    //i think  i need budget here
  id: string; 
  userId: string;
  user: User;
  description: string;
  amount: number;
  frequency: Period;
  startDate: Date;
  endDate?: Date;
  categoryId: string;
  category: Category;
  lastProcessedDate: Date;
  nextProcessingDate: Date;
  isActive: boolean;
}
