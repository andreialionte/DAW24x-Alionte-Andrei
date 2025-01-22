import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  AlertCircle,
  ArrowLeft,
  Save,
  DollarSign,
  FileText,
  Tag
} from 'lucide-react';
import { CreateExpenseAPI } from '../../services/BudgetService';
import { DecodeJWT } from '../../utils/DecodeJWT';

interface BudgetFormData {
  userId: string;
  name: string;
  description: string;
  totalAmount: number;
  startDate: string;
  isActive: boolean;
}

function AddBudget() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get userId from token
  const token = localStorage.getItem('Token') || '';
  const userId = DecodeJWT(token).userId;

  const [formData, setFormData] = useState<BudgetFormData>({
    userId: userId,
    name: '',
    description: '',
    totalAmount: 0,
    startDate: new Date().toISOString().split('T')[0], // Today as default
    isActive: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create the budget object according to the backend model
      const budgetData = {
        ...formData,
        totalAmount: Number(formData.totalAmount),
        startDate: new Date(formData.startDate),
        // Backend will set these values
        // endDate will be startDate + 1 month
        // spentAmount will be set to 0
        // remainingAmount will be set to totalAmount
        // nextProcessingDate will be set to endDate + 1 day
      };

      await CreateExpenseAPI(budgetData);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('A budget with this name already exists. Please choose a different name.');
      } else {
        setError('Failed to create budget. Please try again.');
      }
      console.error('Error creating budget:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
          <h1 className="text-xl font-bold text-green-400">Create New Budget</h1>
          <div className="w-32"></div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Description Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-300">
                  <Tag className="w-4 h-4" />
                  <span>Budget Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Monthly Budget"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-300">
                  <FileText className="w-4 h-4" />
                  <span>Description (Optional)</span>
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Budget description"
                />
              </div>
            </div>

            {/* Amount Section */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-300">
                <DollarSign className="w-4 h-4" />
                <span>Total Budget Amount</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount || ''}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full bg-gray-700 text-white rounded-lg pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Start Date Section */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>Start Date</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Info Section */}
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-gray-300 font-medium">Budget Duration</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Your budget will automatically be set for one month from the start date.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-gray-300 font-medium">Budget Processing</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    The system will automatically track your expenses and update remaining amounts.
                    Processing occurs daily, with the next processing date set to the day after the end date.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 
                         transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Creating Budget...' : 'Create Budget'}
              </button>
            </div>
          </form>
        </div>

        {/* Budget Tips */}
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Budget Planning Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-green-400 font-medium">Setting Realistic Goals</h4>
              <p className="text-gray-400 text-sm">
                Start with your income and essential expenses. Aim to save at least 20% of your income
                while allocating the rest to necessities and discretionary spending.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-green-400 font-medium">Track Your Progress</h4>
              <p className="text-gray-400 text-sm">
                Regularly monitor your spending against your budget. This helps you identify areas
                where you can adjust your spending habits to meet your financial goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddBudget;