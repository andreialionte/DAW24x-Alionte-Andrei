import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader } from 'lucide-react';
import { Expense } from "../../Interfaces/Expense";
import { Category } from "../../Interfaces/Category";
import { Budget } from "../../Interfaces/Budget";
import { User } from "../../Interfaces/User";
import { DecodeJWT } from '../../utils/DecodeJWT';
import { GetUserAPI } from '../../services/UserService';
import { GetCategories, GetCategoryById } from '../../services/CategoryService';
import { GetBudgetsAPI, GetBudgetAPI } from '../../services/BudgetService';
import { CreateExpense } from '../../services/ExpenseService';
import { useForm, Controller } from 'react-hook-form';

// Card Components
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`rounded-lg shadow-lg ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-700">
    {children}
  </div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <h2 className={`text-lg font-semibold ${className}`}>
    {children}
  </h2>
);

const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-6">
    {children}
  </div>
);

const getTokenLocalStorage = localStorage.getItem("Token");
const userIdFromJwt = DecodeJWT(getTokenLocalStorage!);

const AddExpense: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<Expense>({
    defaultValues: {
      userId: userIdFromJwt.userId,
      title: '',
      amount: 0,
      date: new Date(),
      categoryId: '',
      notes: '',
      budgetId: '',
    }
  });

  // Watch for changes in categoryId and budgetId
  const selectedCategoryId = watch('categoryId');
  const selectedBudgetId = watch('budgetId');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [user, userCategories, userBudgets] = await Promise.all([
          GetUserAPI(userIdFromJwt.userId),
          GetCategories(userIdFromJwt.userId),
          GetBudgetsAPI(userIdFromJwt.userId)
        ]);
        
        setUserData(user);
        setCategories(userCategories);
        setBudgets(userBudgets);

        // Set user in form
        if (user) {
          setValue('user', user);
          setValue('userId', user.id);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setValue]);

  // Update category object when ID changes
  useEffect(() => {
    const updateCategory = async () => {
      if (selectedCategoryId) {
        try {
          const category = await GetCategoryById(selectedCategoryId);
          setValue('category', category);
        } catch (err) {
          console.error('Error fetching category:', err);
          setError('Failed to fetch category details. Please try again.');
        }
      }
    };
    updateCategory();
  }, [selectedCategoryId, setValue]);

  // Update budget object when ID changes
  useEffect(() => {
    const updateBudget = async () => {
      if (selectedBudgetId) {
        try {
          const budget = await GetBudgetAPI(selectedBudgetId);
          setValue('budget', budget);
        } catch (err) {
          console.error('Error fetching budget:', err);
          setError('Failed to fetch budget details. Please try again.');
        }
      }
    };
    updateBudget();
  }, [selectedBudgetId, setValue]);

  const onSubmit = async (data: Expense) => {
    if (!userData || !data.category || !data.budget) {
      setError('Missing required data. Please ensure all fields are filled.');
      return;
    }

    const expenseToSubmit: Expense = {
      ...data,
      user: userData,
      userId: userData.id,
      notes: data.notes || 'No description provided',
      category: data.category,
      categoryId: data.categoryId,
      budget: data.budget,
      budgetId: data.budgetId,
      date: new Date(data.date)
    };

    try {
      await CreateExpense(expenseToSubmit, userIdFromJwt.userId);
      window.history.back();
    } catch (error) {
      setError('Failed to create expense. Please try again.');
      console.error('Error submitting expense:', error);
    }
  };

  const inputStyles = "w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500";
  const labelStyles = "block text-sm font-medium text-gray-200 mb-2";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-400">
            {error}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-gray-400 hover:text-white mb-6"
          type="button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">
              Add New Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className={labelStyles}>
                  Title
                </label>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <input
                      id="title"
                      type="text"
                      {...field}
                      className={inputStyles}
                      placeholder="Enter expense title"
                    />
                  )}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-400">Title is required</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className={labelStyles}>
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    $
                  </span>
                  <Controller
                    name="amount"
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                      <input
                        id="amount"
                        type="number"
                        {...field}
                        className={`${inputStyles} pl-8`}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    )}
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-400">Valid amount is required</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className={labelStyles}>
                  Date
                </label>
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <input
                      id="date"
                      type="date"
                      value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                      onChange={e => field.onChange(new Date(e.target.value))}
                      className={inputStyles}
                    />
                  )}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-400">Date is required</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="categoryId" className={labelStyles}>
                  Category
                </label>
                <Controller
                  name="categoryId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <select
                      id="categoryId"
                      {...field}
                      className={inputStyles}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-400">Category is required</p>
                )}
                {categories.length === 0 && (
                  <p className="mt-2 text-sm text-yellow-400">
                    No categories found. Please create a category first.
                  </p>
                )}
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budgetId" className={labelStyles}>
                  Budget
                </label>
                <Controller
                  name="budgetId"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <select
                      id="budgetId"
                      {...field}
                      className={inputStyles}
                    >
                      <option value="">Select a budget</option>
                      {budgets.filter(budget => budget.isActive).map(budget => (
                        <option key={budget.id} value={budget.id}>
                          {budget.name} (${budget.remainingAmount?.toFixed(2)} remaining)
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.budgetId && (
                  <p className="mt-1 text-sm text-red-400">Budget is required</p>
                )}
                {budgets.length === 0 && (
                  <p className="mt-2 text-sm text-yellow-400">
                    No active budgets found. Please create a budget first.
                  </p>
                )}
              </div>

              {/* Notes/Description */}
              <div>
                <label htmlFor="notes" className={labelStyles}>
                  Notes/Description
                </label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      id="notes"
                      {...field}
                      className={inputStyles}
                      rows={3}
                      placeholder="Add any additional notes..."
                    />
                  )}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  disabled={categories.length === 0 || budgets.length === 0}
                >
                  Add Expense
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddExpense;