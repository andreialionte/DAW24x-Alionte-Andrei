import React, { useEffect, useState } from 'react';
import {
  Search, ChevronDown, Bell, Settings,
  Filter, SortAsc, SortDesc, Edit2, Trash2,
  CreditCard, ShoppingBag, Home, Utensils, Car,
  AlertCircle, PlusCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GetExpenses } from '../../services/ExpenseService';
import { DecodeJWT } from '../../utils/DecodeJWT';
import { JSX } from 'react/jsx-runtime';
import { GetUserAPI } from '../../services/UserService';
import { User } from '../../Interfaces/User';

interface Expense {
  userId: string;
  title: string;
  amount: number;
  date: string;
  categoryId: string;
  notes: string;
  budgetId: string;
  id: string;
}

const AllExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc' as 'asc' | 'desc'
  });
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('Token') || '';
  const userId = DecodeJWT(token).userId;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await GetUserAPI(userId);
        setUser(user);
      } catch (error) {
        console.error(error);
      }
    };


    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const data = await GetExpenses(userId);
        setExpenses(data.map(expense => ({
          ...expense,
          date: expense.date.toString(),
          notes: expense.notes || ''
        })));
        setError(null);
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setError('Failed to load expenses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
    fetchUser();
  }, [userId]);

  const handleSort = (key: keyof Expense) => {
    setSortConfig({
      key,
      direction: 
        sortConfig.key === key && sortConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc'
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (id: string) => {
    navigate(`/editexpense/${id}`);
  };

  const handleDelete = async (id: string) => {
    // Implement delete functionality
    // Should make API call to delete expense
    try {
      // await DeleteExpense(id);
      setExpenses(expenses.filter(expense => expense.id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    // This should be mapped to your actual categories
    const categoryMap: { [key: string]: JSX.Element } = {
      'housing': <Home className="w-4 h-4" />,
      'food': <Utensils className="w-4 h-4" />,
      'transport': <Car className="w-4 h-4" />,
      'shopping': <ShoppingBag className="w-4 h-4" />,
    };
    return categoryMap[categoryId] || <CreditCard className="w-4 h-4" />;
  };

  const filteredAndSortedExpenses = expenses
    .filter(expense => {
      const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.notes.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || expense.categoryId === selectedCategory;
      const matchesDateRange = (!dateRange.start || new Date(expense.date) >= new Date(dateRange.start)) &&
                              (!dateRange.end || new Date(expense.date) <= new Date(dateRange.end));
      
      return matchesSearch && matchesCategory && matchesDateRange;
    })
    .sort((a, b) => {
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' 
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key].localeCompare(b[sortConfig.key])
        : b[sortConfig.key].localeCompare(a[sortConfig.key]);
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading expenses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <div className="text-white">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-green-400">ExpenseFlow</h1>
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-white">
              <Settings className="w-5 h-5" />
            </button>
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
        {/* Header and Controls */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">All Expenses</h2>
            <button
              onClick={() => navigate('/addexpense')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add New Expense
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-3 gap-4 mb-6">


            {/* Sort Controls */}
            <div className="flex items-center gap-4">
              <div
                onClick={() => handleSort('amount')}
                className="cursor-pointer text-gray-400 hover:text-white"
              >
                <span className="mr-2">Amount</span>
                {sortConfig.key === 'amount' && (
                  sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                )}
              </div>
              <div
                onClick={() => handleSort('date')}
                className="cursor-pointer text-gray-400 hover:text-white"
              >
                <span className="mr-2">Date</span>
                {sortConfig.key === 'date' && (
                  sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="space-y-4">
          {filteredAndSortedExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                {getCategoryIcon(expense.categoryId)}
                <div>
                  <div className="text-white font-semibold">{expense.title}</div>
                  <div className="text-sm text-gray-400">
  {new Date(expense.date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Ensures 24-hour format
  })}
</div>


                </div>
              </div>
              <div className="text-white font-semibold">{expense.amount}</div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(expense.id)} className="text-gray-400 hover:text-white">
                  <Edit2 className="w-5 h-5" />
                </button>
                <button onClick={() => handleDelete(expense.id)} className="text-gray-400 hover:text-white">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllExpenses;
