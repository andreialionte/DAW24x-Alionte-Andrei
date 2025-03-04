import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Wallet, TrendingUp, TrendingDown, DollarSign,
  CreditCard, ShoppingBag, Home, Utensils, Car,
  Bell, Search, Settings, ChevronDown, AlertCircle,
  PlusCircle, Tag, Layers, List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GetExpensesByMonth, GetLastFiveExpenses, GetExpensesByCategory, DeleteExpense } from '../../services/ExpenseService';
import { GetBudgetsAPI } from '../../services/BudgetService';
import { DecodeJWT } from '../../utils/DecodeJWT';
import { GetCategories } from '../../services/CategoryService';
import { GetUserAPI } from '../../services/UserService';
import { User } from 'lucide-react';

const Dashboard = () => {
  // State management
  const [categoryData, setCategoryData] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({
    monthly: false,
    transactions: false,
    categories: false,
    budgets: false,
    monthlyIs404: false,
    transactionsIs404: false,
    categoriesIs404: false,
    budgetsIs404: false
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('Token') || '';
  const userId = DecodeJWT(token).userId; 

  const EmptyState = ({ message, primaryAction, secondaryAction }) => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-gray-400">
      <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
      <p className="text-center mb-4">{message}</p>
      <div className="flex gap-3">
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            {primaryAction.label}
          </button>
        )}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchDashboardData = async () => {
      setLoading(true);
      
      // try {
      //   const monthlyData = await Promise.all(
      //     months.map(month => GetExpensesByMonth(month))
      //   );

      //   const formattedMonthlyExpenses = monthlyData.map((expenses, index) => ({
      //     month: months[index],
      //     expenses: expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0,
      //     budget: 2500
      //   }));

      //   setMonthlyExpenses(formattedMonthlyExpenses);
      // } catch (err) {
      //   console.error('Error fetching monthly data:', err);
      //   const is404 = err.response?.status === 404;
      //   setErrors(prev => ({ ...prev, monthly: true, monthlyIs404: is404 }));
      //   setMonthlyExpenses([]);
      // }

      try {
        const lastFiveExpenses = await GetLastFiveExpenses(userId);
        setRecentTransactions(lastFiveExpenses || []);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        const is404 = err.response?.status === 404;
        setErrors(prev => ({ ...prev, transactions: true, transactionsIs404: is404 }));
        setRecentTransactions([]);
      }

      try{
        const user = await GetUserAPI(userId);
        setUser(user)
      } catch(err){
        console.error(err);
        const is404 = err.response?.status === 404;
        setErrors(prev => ({ ...prev, transactions: true, transactionsIs404: is404 }));
        setUser(null);
      }

      try {
        const categories = await GetCategories(userId);
        setAllCategories(categories || []);
        
        // Fetch expenses for each category using GetExpensesByCategory
        const categoryExpensesPromises = categories.map(async (category) => {
          try {
            const expenses = await GetExpensesByCategory(userId);
            return expenses;
          } catch (error) {
            console.error(`Error fetching expenses for category ${category.name}:`, error);
            return {
              categoryName: category.name,
              expenses: []
            };
          }
        });

        const categoryExpenses = await Promise.all(categoryExpensesPromises);

        // Process category data with the new structure
        const formattedCategoryData = categories.map((category, index) => {
          const categoryExpenseData = categoryExpenses.find(ce => ce.categoryName === category.name);
          const totalValue = categoryExpenseData?.expenses.reduce((sum, exp) => sum + exp.amount, 0) || 0;

          return {
            id: category.id,
            name: category.name,
            description: category.description,
            value: totalValue,
            expenses: categoryExpenseData?.expenses || [],
            color: ['#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'][index % 5]
          };
        });

        // Filter out categories with no expenses
        setCategoryData(formattedCategoryData.filter(cat => cat.value > 0));
      } catch (err) {
        console.error('Error fetching category data:', err);
        const is404 = err.response?.status === 404;
        setErrors(prev => ({ ...prev, categories: true, categoriesIs404: is404 }));
        setCategoryData([]);
        setAllCategories([]);
      } finally {
        setLoadingCategories(false);
      }

      try {
        const budgets = await GetBudgetsAPI(userId);
        if (budgets && Array.isArray(budgets) && budgets.length > 0) {
          const transformedBudget = {
            categoryBudgets: {
              'Total Budget': budgets[0].totalAmount,
              'Remaining': budgets[0].remainingAmount,
              'Spent': budgets[0].spentAmount
            },
            savingGoal: budgets[0].totalAmount,
            name: budgets[0].name,
            description: budgets[0].description,
            startDate: budgets[0].startDate,
            endDate: budgets[0].endDate
          };
          setBudgetData(transformedBudget);
        } else {
          setBudgetData({
            categoryBudgets: {},
            savingGoal: 5000
          });
        }
      } catch (err) {
        console.error('Error fetching budget data:', err);
        const is404 = err.response?.status === 404;
        setErrors(prev => ({ ...prev, budgets: true, budgetsIs404: is404 }));
        setBudgetData({
          categoryBudgets: {},
          savingGoal: 5000
        });
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [userId]);

  const handleAddTransaction = () => navigate('/addexpense');
  const handleAddBudget = () => navigate('/addbudget');
  const handleViewAllTransactions = () => navigate('/allexpenses');
  const handleEditTransaction = (id) => navigate(`/editexpense/${id}`);

  const handleDeleteTransaction = async (id) => {
    try {
      await DeleteExpense(id, userId);
      // Refresh the transactions list after successful deletion
      const updatedTransactions = await GetLastFiveExpenses(userId);
      setRecentTransactions(updatedTransactions || []);

      // Also refresh the categories data since expenses have changed
      const categories = await GetCategories(userId);
      setAllCategories(categories || []);
      
      const categoryExpensesPromises = categories.map(async (category) => {
        try {
          const expenses = await GetExpensesByCategory(userId);
          return expenses;
        } catch (error) {
          console.error(`Error fetching expenses for category ${category.name}:`, error);
          return {
            categoryName: category.name,
            expenses: []
          };
        }
      });

      const categoryExpenses = await Promise.all(categoryExpensesPromises);
      const formattedCategoryData = categories.map((category, index) => {
        const categoryExpenseData = categoryExpenses.find(ce => ce.categoryName === category.name);
        const totalValue = categoryExpenseData?.expenses.reduce((sum, exp) => sum + exp.amount, 0) || 0;

        return {
          id: category.id,
          name: category.name,
          description: category.description,
          value: totalValue,
          expenses: categoryExpenseData?.expenses || [],
          color: ['#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'][index % 5]
        };
      });

      setCategoryData(formattedCategoryData.filter(cat => cat.value > 0));

      // Refresh budget data as well
      const budgets = await GetBudgetsAPI(userId);
      if (budgets && Array.isArray(budgets) && budgets.length > 0) {
        setBudgetData({
          categoryBudgets: {
            'Total Budget': budgets[0].totalAmount,
            'Remaining': budgets[0].remainingAmount,
            'Spent': budgets[0].spentAmount
          },
          savingGoal: budgets[0].totalAmount,
          name: budgets[0].name,
          description: budgets[0].description,
          startDate: budgets[0].startDate,
          endDate: budgets[0].endDate
        });
      }
    } catch (err) {
      console.error('Error deleting transaction:', err);
      // You might want to add some error handling UI here
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Housing': return <Home className="w-4 h-4" />;
      case 'Food': return <Utensils className="w-4 h-4" />;
      case 'Transport': return <Car className="w-4 h-4" />;
      case 'Shopping': return <ShoppingBag className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const renderExpensesChart = () => {
    if (errors.monthly) {
      return (
        <EmptyState 
          message="No expenses recorded yet. Start tracking your spending!"
          primaryAction={{
            label: "Add First Expense",
            onClick: handleAddTransaction
          }}
        />
      );
    }
    
    if (monthlyExpenses.length === 0) {
      return (
        <EmptyState 
          message="No expense data available for this period."
          primaryAction={{
            label: "Add New Expense",
            onClick: handleAddTransaction
          }}
        />
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyExpenses}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            itemStyle={{ color: '#fff' }}
          />
          <Bar dataKey="expenses" fill="#10B981" />
          <Bar dataKey="budget" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderTransactions = () => {
    if (errors.transactions) {
      return (
        <EmptyState 
          message="No transactions recorded yet. Start tracking your expenses!"
          primaryAction={{
            label: "Add First Transaction",
            onClick: handleAddTransaction
          }}
          secondaryAction={{
            label: "View All Transactions",
            onClick: handleViewAllTransactions
          }}
        />
      );
    }

    if (recentTransactions.length === 0) {
      return (
        <EmptyState 
          message="No recent transactions to display."
          primaryAction={{
            label: "Add New Transaction",
            onClick: handleAddTransaction
          }}
          secondaryAction={{
            label: "View All Transactions",
            onClick: handleViewAllTransactions
          }}
        />
      );
    }

    return (
      <div className="space-y-4">
        {recentTransactions.map(transaction => (
          <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-600 rounded-full">
                {getCategoryIcon(transaction.category)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">{transaction.title}</p>
                  <span className="text-sm text-gray-400">{transaction.category}</span>
                </div>
                <p className="text-sm text-gray-400">
  {new Date(transaction.date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Ensures 24-hour format
  })}
</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="group-hover:flex hidden space-x-2 text-gray-400">
                <button
                  className="hover:text-yellow-400"
                  onClick={() => handleEditTransaction(transaction.id)}
                >
                  Edit
                </button>
                <button
                  className="hover:text-red-400"
                  onClick={() => handleDeleteTransaction(transaction.id)}
                >
                  Delete
                </button>
              </div>
              <span className={`font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCategoryBreakdown = () => {
    if (errors.categories) {
      return (
        <EmptyState 
          message="No category data available. Add some expenses to see your spending breakdown!"
          primaryAction={{
            label: "Add First Expense",
            onClick: handleAddTransaction
          }}
        />
      );
    }

    if (categoryData.length === 0) {
      return (
        <EmptyState 
          message="No spending categories to display."
          primaryAction={{
            label: "Add New Expense",
            onClick: handleAddTransaction
          }}
        />
      );
    }

    const totalSpending = categoryData.reduce((sum, category) => sum + category.value, 0);
    
    // Calculate average transaction amount per category
    const categoryStats = categoryData.map(category => ({
      ...category,
      avgTransaction: category.expenses.length > 0 
        ? category.value / category.expenses.length 
        : 0,
      transactionCount: category.expenses.length
    }));

    return (
      <>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value) => `$${Number(value).toFixed(2)}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-6 space-y-4">
          {categoryStats.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                <div>
                  <span className="text-gray-200">{category.name}</span>
                  <div className="text-xs text-gray-400">{((category.value / totalSpending) * 100).toFixed(1)}%</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-medium text-white">${category.value.toFixed(2)}</span>
                <div className="text-xs text-gray-400">
                  {category.transactionCount} transactions
                  {category.avgTransaction > 0 && ` • Avg: ${category.avgTransaction.toFixed(2)}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderBudgetOverview = () => {
    if (budgetData && budgetData.categoryBudgets && Object.keys(budgetData.categoryBudgets).length > 0) {
      return (
        <div className="space-y-4">
          <div className="mb-4">
            <h4 className="text-white text-sm font-medium mb-2">{budgetData.name}</h4>
            <p className="text-gray-400 text-sm">{budgetData.description}</p>
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>{new Date(budgetData.startDate).toLocaleDateString()}</span>
              <span>to</span>
              <span>{new Date(budgetData.endDate).toLocaleDateString()}</span>
            </div>
          </div>
          {Object.entries(budgetData.categoryBudgets).map(([category, budget]) => (
            <div key={category} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-600 rounded-full">
                  {category === 'Total Budget' ? <Wallet className="w-4 h-4" /> :
                   category === 'Remaining' ? <TrendingUp className="w-4 h-4" /> :
                   category === 'Spent' ? <TrendingDown className="w-4 h-4" /> :
                   getCategoryIcon(category)}
                </div>
                <span className="text-gray-200">{category}</span>
              </div>
              <div className="text-right">
                <span className="font-medium text-white">
                  ${typeof budget === 'number' ? budget.toFixed(2) : '0.00'}
                </span>
                <div className="text-sm text-gray-400">
                  {category === 'Total Budget' ? 'Budget Limit' :
                   category === 'Remaining' ? 'Available' :
                   category === 'Spent' ? 'Used' : 'Amount'}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <EmptyState 
        message="No budget set up yet. Create your first budget to start tracking!"
        primaryAction={{
          label: "Create First Budget",
          onClick: handleAddBudget
        }}
      />
    );
  };

  const renderCategoriesWidget = () => {
    if (loadingCategories) {
      return (
        <div className="flex justify-center items-center h-40">
          <div className="text-gray-400">Loading categories...</div>
        </div>
      );
    }

    if (errors.categories) {
      return (
        <EmptyState
          message="Unable to load categories. Please try again."
          primaryAction={{
            label: "Refresh",
            onClick: () => window.location.reload()
          }}
        />
      );
    }

    if (allCategories.length === 0) {
      return (
        <EmptyState
          message="No categories found. Create categories to organize your expenses!"
          primaryAction={{
            label: "Create First Category",
            onClick: () => navigate('/addcategory')
          }}
        />
      );
    }

    const getCategoryColor = (index) => {
      const colors = ['#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
      return colors[index % colors.length];
    };

    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-400">Your Categories</p>
        </div>
        
        {allCategories.slice(0, 5).map((category, index) => (
          <div 
            key={category.id}
            className="p-3 bg-gray-700/50 rounded-lg flex justify-between items-center hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => navigate('/categories')}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: getCategoryColor(index) }}
              >
                <Tag className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{category.name}</p>
                <p className="text-gray-400 text-xs">
                  {category.expenses?.length || 0} expenses
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-400 flex items-center">
              {category.description ? (
                <span className="max-w-[100px] truncate">{category.description}</span>
              ) : (
                <span>No description</span>
              )}
            </div>
          </div>
        ))}
        
        {allCategories.length > 5 && (
          <div className="text-center mt-2">
            <button
              onClick={() => navigate('/categories')}
              className="text-sm text-gray-400 hover:text-white flex items-center justify-center w-full"
            >
              <Layers className="w-3 h-3 mr-1" />
              {allCategories.length - 5} more categories
            </button>
          </div>
        )}
        
        <button
          onClick={() => navigate('/addcategory')}
          className="w-full mt-3 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm flex items-center justify-center transition-colors"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Category
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading dashboard data...</div>
      </div>
    );
  }

  const totalExpenses = monthlyExpenses.reduce((acc, month) => acc + month.expenses, 0);
  
  const totalBudget = budgetData?.categoryBudgets?.['Total Budget'] || 5000;
  const spentAmount = budgetData?.categoryBudgets?.['Spent'] || 0;
  const remainingAmount = budgetData?.categoryBudgets?.['Remaining'] || totalBudget;
  const savingsProgress = ((totalBudget - spentAmount) / totalBudget) * 100;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-green-400">ExpenseFlow</h1>
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div> */}
          </div>
          <div className="flex items-center space-x-6">
            {/* <button className="text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </button> */}
            <div className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate(`/profile/${userId}`)}>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="font-medium text-white">{user?.firstName?.charAt(0) || 'U'}</span>
              </div>
              <span className="text-gray-200">{user?.firstName || "User"}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-8 space-y-6">
            {/* Balance Cards */}
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                <p className="text-sm opacity-80">Total Balance</p>
                <h3 className="text-2xl font-bold mt-1">${remainingAmount.toFixed(2)}</h3>
                <div className="flex items-center mt-4 text-sm opacity-80">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>Updated today</span>
                </div>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <p className="text-sm opacity-80">Monthly Income</p>
                <h3 className="text-2xl font-bold mt-1">${totalBudget .toFixed(2)}</h3>
                <div className="flex items-center mt-4 text-sm opacity-80">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>Regular income</span>
                </div>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
                <p className="text-sm opacity-80">Monthly Expenses</p>
                <h3 className="text-2xl font-bold mt-1">${spentAmount.toFixed(2)}</h3>
                <div className="flex items-center mt-4 text-sm opacity-80">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  <span>This month</span>
                </div>
              </div>
            </div>

            {/* Expenses Chart */}
            {/* <div className="p-6 rounded-lg bg-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">Expenses Overview</h3>
              <div className="h-80">
                {renderExpensesChart()}
              </div>
            </div> */}

            {/* Recent Transactions */}
            <div className="p-6 rounded-lg bg-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                <div className="flex space-x-4">
                  <button 
                    onClick={handleViewAllTransactions}
                    className="text-green-400 hover:text-green-300 text-sm"
                  >
                    View All
                  </button>
                  <button 
                    onClick={handleAddTransaction}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Add Expense
                  </button>
                </div>
              </div>
              {renderTransactions()}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-6">
            {/* Categories Widget */}
            <div className="p-6 rounded-lg bg-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
              {renderCategoriesWidget()}
            </div>

            {/* Budget Progress Card */}
            <div className="p-6 rounded-lg bg-gray-800 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Budget Progress</p>
                  <h3 className="text-2xl font-bold mt-1">${totalBudget.toFixed(2)}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-80">Remaining</p>
                  <h3 className="text-xl font-bold mt-1 text-green-400">${remainingAmount.toFixed(2)}</h3>
                </div>
              </div>
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-sm text-white opacity-70">Budget Usage</span>
                    <span className="text-sm text-white opacity-70">
                      ${spentAmount.toFixed(2)} spent
                    </span>
                  </div>
                  <div className="flex mb-2">
                    <div className="w-full bg-gray-600 rounded-full">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          savingsProgress > 75 ? 'bg-green-500' :
                          savingsProgress > 50 ? 'bg-yellow-500' :
                          savingsProgress > 25 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${100 - Math.min(savingsProgress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-white opacity-50">
                    <span>{savingsProgress.toFixed(1)}% remaining</span>
                    <span>{(100 - savingsProgress).toFixed(1)}% used</span>
                  </div>
                </div>
                {budgetData?.startDate && budgetData?.endDate && (
                  <div className="mt-4 text-xs text-gray-400">
                    Budget period: {new Date(budgetData.startDate).toLocaleDateString()} - {new Date(budgetData.endDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            {/* Budget Overview */}
            <div className="p-6 rounded-lg bg-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">Budget Overview</h3>
              {renderBudgetOverview()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;